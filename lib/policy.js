/**
 * L1: static refusal before the code ever reaches Blender.
 *
 * This layer only catches literal, obvious mistakes: save/open/quit calls,
 * preference writes, `sys.exit`, and absolute paths that point outside the
 * task directory next to an obvious write verb. It is not a parser and not a
 * boundary; the runtime guard in `guardPayload.js` is.
 *
 * @module lib/policy
 */

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
const WRITE_VERBS = /\b(open|write|save|export|render|rename|remove|unlink|rmtree|move|copy|truncate|mkdir)\b/

/** Dynamic features that are visible but not sandboxed. */
const WARNINGS = [
  ['importlib.reload', 'importlib.reload can bypass the runtime guard'],
  ['ctypes', 'ctypes can bypass the runtime guard'],
  ['__import__', 'dynamic imports can bypass the runtime guard'],
  ['eval(', 'eval() can build code that bypasses static checks'],
  ['exec(', 'exec() can build code that bypasses static checks'],
  ['os.system(', 'os.system() is not covered by the file hooks'],
  ['subprocess', 'subprocess is not covered by the runtime guard'],
]

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
 * @default taskDir = ''
 * @param {string} code - Python supplied by the model
 * @param {string} [taskDir] - absolute task directory, empty when unknown
 * @returns {PolicyResult} refusals and warnings
 */
export function scanRequest(code, taskDir = '') {
  /** @type {PolicyBlock[]} */
  const blocks = []
  /** @type {string[]} */
  const warnings = []

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

    if (line.includes('bpy.context.preferences') || line.includes('bpy.ops.wm.preferences')) {
      blocks.push({
        rule: 'preferences',
        message: 'Changing Blender preferences is never allowed in the live session.',
        suggestion: 'Ask the user to change the preference themselves.',
        line: lineNo,
      })
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
      if (!WRITE_VERBS.test(line)) continue
      blocks.push({
        rule: 'write-outside-task',
        message: `Writing to "${literal}" is outside the task directory.`,
        suggestion: taskDir === '' ? 'Write under the task directory only.' : `Write under "${taskDir}" instead.`,
        line: lineNo,
      })
    }

    for (const [pattern, warning] of WARNINGS) {
      if (line.includes(pattern)) warnings.push(`line ${lineNo}: ${warning}`)
    }
  }

  return { blocks, warnings }
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
  const normalize = (value) => (process.platform === 'win32' ? value.toLowerCase() : value)
  const rootPath = normalize(root.replace(/[\\/]+$/, ''))
  const targetPath = normalize(target.replace(/[\\/]+$/, ''))
  return targetPath === rootPath || targetPath.startsWith(`${rootPath}${root.includes('\\') ? '\\' : '/'}`)
}
