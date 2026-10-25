/**
 * L1: static refusal before the code ever reaches Blender.
 *
 * This layer only catches literal, obvious mistakes: save/open/quit calls,
 * preference writes, preference reads outside a short diagnostic whitelist,
 * `sys.exit`, and absolute paths that point outside the task directory next to
 * an obvious write verb. It is not a parser and not a boundary; the runtime
 * guard in `guardPayload.js` is.
 *
 * @module lib/policy
 */

import path from 'node:path'

/** Operators that are always refused in user code. */
const BLOCKED_OPERATORS = new Map([
  ['wm.save_mainfile', 'saving the user .blend is never allowed'],
  ['wm.save_as_mainfile', 'saving the user .blend is never allowed'],
  ['wm.save_homefile', 'overwriting the startup file is never allowed'],
  ['wm.save_userpref', 'changing preferences is never allowed'],
  ['wm.open_mainfile', 'opening another file would drop the live session'],
  ['wm.read_homefile', 'resetting the session is never allowed'],
  ['wm.read_factory_settings', 'resetting the session is never allowed'],
  ['wm.read_factory_userpref', 'resetting preferences is never allowed'],
  ['wm.read_userpref', 'reloading preferences is never allowed'],
  ['wm.quit_blender', 'quitting Blender is never allowed'],
])

/** Words that make an out-of-task absolute path literal look like a write. */
const WRITE_VERBS = /\b(write|write_text|write_bytes|save|export|render|rename|remove|unlink|rmtree|move|copy|truncate|mkdir|makedirs)\b/

/** An `open()` call whose mode is a write mode. */
const WRITE_OPEN = /\bopen\s*\([^)]*?(?:,\s*|mode\s*=\s*)(['"])(?:[wax]|r\+|w\+|a\+|x\+)/i

/** A `Path.open()` call whose first argument is a write mode. */
const WRITE_PATH_OPEN = /\.open\s*\(\s*(['"])(?:[wax]|r\+|w\+|a\+|x\+)/i

/** Dynamic features that are visible but not sandboxed. */
const WARNINGS = [
  ['importlib.reload', 'importlib.reload can bypass the runtime guard'],
  ['ctypes', 'ctypes can bypass the runtime guard'],
  ['__import__', 'dynamic imports can bypass the runtime guard'],
  ['eval(', 'eval() can build code that bypasses static checks'],
  ['exec(', 'exec() can build code that bypasses static checks'],
  ['os.system(', 'os.system() is not covered by the file hooks'],
  ['os.fdopen(', 'os.fdopen() writes through an existing descriptor and is not path-checked'],
  ['subprocess', 'subprocess is not covered by the runtime guard'],
  ['.save_render(', 'save_render() writes through Blender C code and bypasses the file hooks'],
]

/**
 * `exec()`/`eval()` of source read from disk: the scanned text is short, the
 * file it reads is a second program this layer never sees.
 */
const FILE_EXEC = /\b(?:exec|eval)\s*\(.*\b(?:open|read|read_text|read_bytes)\s*\(/

/**
 * Preference chains user code may read; writing any of them is still refused.
 *
 * Kept intentionally small: the plugin only needs the undo limits and the
 * Cycles compute device type here. Everything else (samples, denoise, color
 * management, device names) is reported by `blender_mcp_status`, so user code
 * never has to poke around in preferences.
 */
const PREFERENCE_READ_PATHS = [
  /^\.edit\.(?:undo_steps|undo_memory_limit|use_global_undo)\b/,
  /^\.addons\s*\[\s*(['"])cycles\1\s*\]\.preferences\.compute_device_type\b/,
  /^\.addons\s*\.get\(\s*(['"])cycles\1\s*\)\.preferences\.compute_device_type\b/,
]

/** Model-facing summary of {@link PREFERENCE_READ_PATHS}. */
const PREFERENCE_READ_TEXT =
  '`preferences.edit.undo_steps`, `preferences.edit.undo_memory_limit`, ' +
  '`preferences.edit.use_global_undo`, or the Cycles `compute_device_type`'

/** A line that assigns to a `.preferences` field (`=`, `+=`, `==` is ignored). */
const PREFERENCE_WRITE = /\.preferences\b.*?(?<![=!<>])=(?!=)/

/** A line that deletes a preferences value. */
const PREFERENCE_DELETE = /\bdel\s+.*\.preferences\b/

/** An explicit `setattr()` next to a preferences access is a write too. */
const PREFERENCE_SETATTR = /\bsetattr\s*\(/

/** A method call chained onto a whitelisted read; reads stay plain attributes. */
const PREFERENCE_CALL = /^\s*\.\s*[A-Za-z_]\w*\s*\(/

/** How many line numbers one warning message lists before it says "+N more". */
const WARNING_LINES_MAX = 6

/** Appended when a line both runs code and reads that code from a file. */
const FILE_EXEC_WARNING =
  'code read from a file is executed here and is not covered by this static scan; ' +
  'put the script in the task directory and pass scriptPath so the file is scanned and hashed'

/** @typedef {object} PolicyBlock
 * @property {string} rule - stable rule id
 * @property {string} message - what is refused
 * @property {string} [suggestion] - how to rewrite it
 * @property {number} line - 1-based source line
 */

/** @typedef {object} PolicyResult
 * @property {PolicyBlock[]} blocks - hard refusals; empty means safe to send
 * @property {string[]} warnings - visible but allowed patterns
 */

/**
 * Scan user Python before sending it to Blender.
 *
 * Warnings are advisory: they never refuse a call, they mark where the static
 * layer ends. One message lists up to `WARNING_LINES_MAX` line numbers so a
 * long script does not flood the reply.
 *
 * @default taskDir = '', label = ''
 * @param {string} code - Python supplied by the model, or one script file
 * @param {string} [taskDir] - absolute task directory, empty when unknown
 * @param {string} [label] - where the text came from, such as `script make.py`
 * @returns {PolicyResult} refusals and warnings
 */
export function scanRequest(code, taskDir = '', label = '') {
  /** @type {PolicyBlock[]} */
  const blocks = []
  /** @type {Map<string, number[]>} */
  const warningLines = new Map()

  const lines = String(code).split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const lineNo = index + 1

    for (const [operator, reason] of BLOCKED_OPERATORS) {
      if (line.includes(operator)) {
        blocks.push({
          rule: 'blocked-operator',
          message: `\`${operator}\`: ${reason}.`,
          suggestion: 'Use the plugin tools (snapshot / capture / render) for file output; never save or open on your own.',
          line: lineNo,
        })
      }
    }

    if (line.includes('.preferences')) {
      if (PREFERENCE_WRITE.test(line) || PREFERENCE_DELETE.test(line) || PREFERENCE_SETATTR.test(line)) {
        blocks.push({
          rule: 'preferences',
          message: 'Writing Blender preferences is not allowed in the live session.',
          suggestion: "Ask the user to change the preference in Blender's Preferences window.",
          line: lineNo,
        })
      } else if (hasUnlistedPreferenceRead(line)) {
        blocks.push({
          rule: 'preferences-read',
          message: `Blender preferences may only be read through ${PREFERENCE_READ_TEXT}.`,
          suggestion:
            'Use blender_mcp_status for device, sample, denoise and color management facts, ' +
            'or ask the user to change the preference.',
          line: lineNo,
        })
      }
    }

    if (/\bsys\.exit\s*\(/.test(line)) {
      blocks.push({
        rule: 'sys-exit',
        message: 'sys.exit() is not allowed.',
        suggestion: 'Raise an exception or return a result instead.',
        line: lineNo,
      })
    }

    for (const literal of absolutePathLiterals(line)) {
      if (taskDir !== '' && isInside(taskDir, literal)) continue
      if (!WRITE_VERBS.test(line) && !WRITE_OPEN.test(line) && !WRITE_PATH_OPEN.test(line)) continue
      blocks.push({
        rule: 'write-outside-task',
        message: `Writing to "${literal}" is outside the task directory.`,
        suggestion: taskDir === '' ? 'Write under the task directory only.' : `Write under "${taskDir}" instead.`,
        line: lineNo,
      })
    }

    const fileExec = FILE_EXEC.test(line)
    for (const [pattern, warning] of WARNINGS) {
      if (fileExec && (pattern === 'exec(' || pattern === 'eval(')) continue
      if (line.includes(pattern)) noteWarning(warningLines, warning, lineNo)
    }
    if (fileExec) noteWarning(warningLines, FILE_EXEC_WARNING, lineNo)
  }

  return { blocks, warnings: formatWarnings(warningLines, label) }
}

/**
 * Whether one line reads a preferences chain outside the whitelist.
 *
 * Every `.preferences` occurrence must start an allowed read chain. A chain
 * that itself contains a second `.preferences` (the Cycles add-on preferences)
 * is skipped once its outer occurrence matched, and a method call chained onto
 * an allowed path is refused: only plain attribute reads are whitelisted.
 *
 * @param {string} line - source line without a newline
 * @returns {boolean} true when some read is not whitelisted
 */
function hasUnlistedPreferenceRead(line) {
  let consumedUntil = -1
  const occurrence = /\.preferences\b/g
  let match
  while ((match = occurrence.exec(line)) !== null) {
    const chainStart = match.index + match[0].length
    if (chainStart < consumedUntil) continue
    const rest = line.slice(chainStart)
    const allowed = PREFERENCE_READ_PATHS.find((pattern) => pattern.test(rest))
    if (allowed === undefined) return true
    const matched = rest.match(allowed)
    if (matched === null) return true
    if (PREFERENCE_CALL.test(rest.slice(matched[0].length))) return true
    consumedUntil = chainStart + matched[0].length
  }
  return false
}

/**
 * Remember one hit of a warning message.
 *
 * @param {Map<string, number[]>} byMessage - collected hits
 * @param {string} message - warning text
 * @param {number} lineNo - 1-based source line
 * @returns {void}
 */
function noteWarning(byMessage, message, lineNo) {
  const lineNumbers = byMessage.get(message)
  if (lineNumbers === undefined) byMessage.set(message, [lineNo])
  else lineNumbers.push(lineNo)
}

/**
 * Turn collected hits into model-facing warning lines.
 *
 * @param {Map<string, number[]>} byMessage - collected hits, first hit order
 * @param {string} label - source label, empty for inline code
 * @returns {string[]} warning lines
 */
function formatWarnings(byMessage, label) {
  const prefix = label === '' ? '' : `${label} `
  /** @type {string[]} */
  const warnings = []
  for (const [message, lineNumbers] of byMessage) {
    const shown = lineNumbers.slice(0, WARNING_LINES_MAX).join(', ')
    const hidden = lineNumbers.length - WARNING_LINES_MAX
    const more = hidden > 0 ? `, +${hidden} more` : ''
    const plural = lineNumbers.length > 1 ? 's' : ''
    warnings.push(`${prefix}line${plural} ${shown}${more}: ${message}`)
  }
  return warnings
}

/**
 * Extract absolute path literals from one source line.
 *
 * @param {string} line - source line
 * @returns {string[]} literal paths
 */
function absolutePathLiterals(line) {
  /** @type {string[]} */
  const found = []
  const literalPattern = /(["'])((?:\\.|(?!\1).)*)\1/g
  let match
  while ((match = literalPattern.exec(line)) !== null) {
    const value = match[2].replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\'/g, "'")
    if (/^[A-Za-z]:[\\/]/.test(value) || value.startsWith('/') || value.startsWith('\\\\')) found.push(value)
  }
  return found
}

/**
 * Whether one path is inside another; Windows compares case-insensitively.
 *
 * @param {string} root - task directory
 * @param {string} target - candidate path
 * @returns {boolean} containment result
 */
function isInside(root, target) {
  /** @type {(value: string) => string} */
  const normalize = (value) => {
    const resolved = path.resolve(String(value).replace(/\\/g, '/'))
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved
  }
  const rootPath = normalize(root)
  const targetPath = normalize(target)
  if (targetPath === rootPath) return true
  return targetPath.startsWith(rootPath.endsWith(path.sep) ? rootPath : `${rootPath}${path.sep}`)
}
