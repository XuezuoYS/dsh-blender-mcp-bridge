/**
 * Python process helpers for the managed helper environment.
 *
 * The plugin no longer discovers interpreters: the only interpreter is the
 * plugin's managed venv (or Blender's bundled Python for dependency-free
 * helpers). This module owns process limits, interpreter probing and the
 * dependency probe used before a helper runs.
 *
 * @module lib/pythonRuntime
 */

import { spawn } from 'node:child_process'

/** Package name -> importable module.
 * @type {Record<string, string>}
 */
export const MODULE_BY_PACKAGE = {
  Pillow: 'PIL',
  'opencv-python-headless': 'cv2',
  numpy: 'numpy',
  scipy: 'scipy',
}

/** Interpreter or dependency failure. */
export class PythonRuntimeError extends Error {
  /**
   * @param {string} kind - stable reason code
   * @param {string} message - readable explanation
   */
  constructor(kind, message) {
    super(message)
    this.name = 'PythonRuntimeError'
    this.kind = kind
  }
}

/**
 * @typedef {object} PythonRuntime
 * @property {string} command - executable
 * @property {string[]} args - fixed leading arguments
 * @property {string} version - `major.minor.patch`
 * @property {string} source - `venv`, `blender`, `config` or `saved`
 */

/** @typedef {{ ok: boolean, version: string, venv: boolean, ensurepip: boolean, error: string }} InterpreterProbe */

/** @type {Map<string, { at: number, available: Set<string>, missing: Set<string> }>} */
const moduleCache = new Map()

/** Probe script: print one JSON object, never fail on a missing module. */
const PROBE_INTERPRETER_CODE = [
  'import importlib.util, json, sys',
  "print(json.dumps({'version': '%d.%d.%d' % sys.version_info[:3], 'venv': importlib.util.find_spec('venv') is not None, 'ensurepip': importlib.util.find_spec('ensurepip') is not None}))",
].join('\n')

/**
 * Probe one interpreter for version, venv and ensurepip support.
 *
 * @default timeoutMs = 10000
 * @param {string} command - interpreter executable
 * @param {{ timeoutMs?: number, args?: string[] }} [options] - probe options
 * @returns {Promise<InterpreterProbe>} probe result
 */
export async function probeInterpreter(command, options = {}) {
  try {
    const result = await runProcess(command, [...(options.args ?? []), '-c', PROBE_INTERPRETER_CODE], {
      timeoutMs: options.timeoutMs ?? 10000,
    })
    if (result.code !== 0) {
      return {
        ok: false,
        version: '',
        venv: false,
        ensurepip: false,
        error: result.stderr.trim() || `exit ${String(result.code)}`,
      }
    }
    /** @type {unknown} */
    let parsed
    try {
      parsed = JSON.parse(result.stdout.trim())
    } catch {
      return { ok: false, version: '', venv: false, ensurepip: false, error: 'probe returned non-JSON output' }
    }
    const record = typeof parsed === 'object' && parsed !== null ? /** @type {Record<string, unknown>} */ (parsed) : {}
    return {
      ok: typeof record.version === 'string' && record.version !== '',
      version: typeof record.version === 'string' ? record.version : '',
      venv: record.venv === true,
      ensurepip: record.ensurepip === true,
      error: '',
    }
  } catch (error) {
    return {
      ok: false,
      version: '',
      venv: false,
      ensurepip: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Check which helper dependencies are missing for one interpreter.
 *
 * @param {PythonRuntime} python - resolved interpreter
 * @param {string[]} dependencies - package names from the catalog
 * @returns {Promise<string[]>} missing package names
 */
export async function missingDependencies(python, dependencies) {
  if (dependencies.length === 0) return []
  const modules = [...new Set(dependencies.map((name) => MODULE_BY_PACKAGE[name] ?? name))]
  const key = `${python.command}\u0000${python.args.join('\u0000')}`
  let cache = moduleCache.get(key)
  if (cache === undefined) {
    cache = { at: Date.now(), available: new Set(), missing: new Set() }
    moduleCache.set(key, cache)
  }
  const unprobed = modules.filter((name) => !cache.available.has(name) && !cache.missing.has(name))
  if (unprobed.length > 0) {
    const script = [
      'import importlib.util, json, sys',
      'mods = json.loads(sys.argv[1])',
      'print(json.dumps([m for m in mods if importlib.util.find_spec(m) is None]))',
    ].join('\n')
    const result = await runProcess(python.command, [...python.args, '-c', script, JSON.stringify(unprobed)], {
      timeoutMs: 10000,
    })
    if (result.code !== 0) {
      throw new PythonRuntimeError(
        'dependency-probe-failed',
        `Could not inspect Python packages: ${result.stderr.trim() || `exit ${String(result.code)}`}`,
      )
    }
    /** @type {string[]} */
    let missingModules = []
    try {
      const parsed = JSON.parse(result.stdout.trim())
      if (Array.isArray(parsed)) missingModules = parsed.map(String)
    } catch {
      throw new PythonRuntimeError('dependency-probe-failed', 'Python package probe returned non-JSON output.')
    }
    for (const name of unprobed) {
      if (missingModules.includes(name)) cache.missing.add(name)
      else cache.available.add(name)
    }
    cache.at = Date.now()
  }
  return dependencies.filter((name) => cache.missing.has(MODULE_BY_PACKAGE[name] ?? name))
}

/**
 * Forget dependency-probe results, so an install is visible to the next run.
 *
 * @returns {void}
 */
export function clearDependencyCache() {
  moduleCache.clear()
}

/**
 * Run one child process with a timeout and output caps.
 *
 * @default timeoutMs = 120000, maxOutputChars = 200000
 * @param {string} command - executable
 * @param {string[]} args - arguments
 * @param {{ timeoutMs?: number, maxOutputChars?: number, cwd?: string, signal?: AbortSignal, onLine?: (line: string, stream: 'stdout'|'stderr') => void }} [options] - limits
 * @returns {Promise<{ code: number | null, signal: string | null, stdout: string, stderr: string, timedOut: boolean, aborted: boolean }>} process result
 */
export function runProcess(command, args, options = {}) {
  const timeoutMs = options.timeoutMs ?? 120000
  const maxOutputChars = options.maxOutputChars ?? 200000
  return new Promise((resolve, reject) => {
    /** @type {import('node:child_process').ChildProcess} */
    let child
    try {
      child = spawn(command, args, {
        cwd: options.cwd,
        env: cleanEnv(),
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      reject(error)
      return
    }
    let stdout = ''
    let stderr = ''
    let stdoutPartial = ''
    let stderrPartial = ''
    let timedOut = false
    let aborted = false
    let settled = false
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timer
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let killFallback

    /**
     * Resolve once, even if a grandchild keeps the stdout pipe open.
     *
     * @param {number | null} code - exit code
     * @param {NodeJS.Signals | null} signal - exit signal
     * @returns {void}
     */
    const settle = (code, signal) => {
      if (settled) return
      settled = true
      if (timer !== undefined) clearTimeout(timer)
      if (killFallback !== undefined) clearTimeout(killFallback)
      if (options.signal !== undefined) options.signal.removeEventListener('abort', cancel)
      resolve({
        code,
        signal,
        stdout: truncate(stdout, maxOutputChars),
        stderr: truncate(stderr, maxOutputChars),
        timedOut,
        aborted,
      })
    }

    /**
     * Kill the direct child and, on Windows, its process tree. Destroying the
     * pipes plus the fallback timer guarantees the caller is not held hostage
     * by a surviving grandchild.
     *
     * @returns {void}
     */
    const stop = () => {
      try {
        if (process.platform === 'win32' && child.pid !== undefined) {
          const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
            windowsHide: true,
            stdio: 'ignore',
          })
          killer.on('error', () => {})
          killer.unref()
        } else {
          child.kill('SIGKILL')
        }
      } catch {
        // The process may already be gone.
      }
      try {
        child.stdout?.destroy()
        child.stderr?.destroy()
      } catch {
        // Pipe already closed.
      }
      if (killFallback === undefined) {
        killFallback = setTimeout(() => settle(null, null), 1500)
      }
    }

    const cancel = () => {
      if (settled) return
      aborted = true
      stop()
    }
    if (options.signal !== undefined) {
      options.signal.addEventListener('abort', cancel, { once: true })
      if (options.signal.aborted) cancel()
    }
    timer = setTimeout(() => {
      timedOut = true
      stop()
    }, timeoutMs)
    child.stdout?.on('data', (chunk) => {
      if (stdout.length < maxOutputChars) stdout += String(chunk)
      if (options.onLine !== undefined) {
        stdoutPartial = emitLines(String(chunk), stdoutPartial, 'stdout', options.onLine)
      }
    })
    child.stderr?.on('data', (chunk) => {
      if (stderr.length < maxOutputChars) stderr += String(chunk)
      if (options.onLine !== undefined) {
        stderrPartial = emitLines(String(chunk), stderrPartial, 'stderr', options.onLine)
      }
    })
    child.on('error', (error) => {
      if (settled) return
      settled = true
      if (timer !== undefined) clearTimeout(timer)
      if (killFallback !== undefined) clearTimeout(killFallback)
      if (options.signal !== undefined) options.signal.removeEventListener('abort', cancel)
      reject(error)
    })
    child.on('close', (code, signal) => settle(code, signal))
  })
}

/**
 * Split a chunk into complete lines and hand them to the callback.
 *
 * @param {string} chunk - new text
 * @param {string} partial - pending text from earlier chunks
 * @param {'stdout'|'stderr'} stream - stream name
 * @param {(line: string, stream: 'stdout'|'stderr') => void} onLine - line callback
 * @returns {string} the new pending text
 */
function emitLines(chunk, partial, stream, onLine) {
  const text = partial + chunk
  const lines = text.split(/\r?\n/)
  const pending = lines.pop() ?? ''
  for (const line of lines) {
    try {
      onLine(line, stream)
    } catch {
      // A logging callback must never break the child process.
    }
  }
  return pending
}

/**
 * Child environment: only what Python needs, never credentials.
 *
 * @returns {Record<string, string>} sanitized environment that still lets Python find per-user packages
 */
function cleanEnv() {
  /** @type {Record<string, string>} */
  const env = {}
  for (const key of ['PATH', 'SYSTEMROOT', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'APPDATA', 'LOCALAPPDATA']) {
    const value = process.env[key]
    if (value !== undefined) env[key] = value
  }
  env.PYTHONIOENCODING = 'utf-8'
  env.PYTHONUTF8 = '1'
  env.PYTHONNOUSERSITE = '1'
  return env
}

/**
 * @param {string} value - text
 * @param {number} limit - character cap
 * @returns {string} truncated text
 */
function truncate(value, limit) {
  return value.length <= limit ? value : `${value.slice(0, limit)}\n[truncated]`
}
