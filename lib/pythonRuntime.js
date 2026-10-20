/**
 * Python interpreter discovery and dependency checks for the helper chain.
 *
 * Discovery order: explicit `helper.analysisPython`, then `python`,
 * `python3`, `py -3`. A configured interpreter that does not work is an error,
 * never a silent fallback. Results are cached for 60 seconds.
 *
 * @module lib/pythonRuntime
 */

import { spawn } from 'node:child_process'

/** Minimum Python version for the helper scripts. */
const MINIMUM_VERSION = [3, 10]

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
 * @property {string} version - `major.minor`
 * @property {string} source - where it came from
 */

/** @type {{ key: string, at: number, python: PythonRuntime } | null} */
let cachedRuntime = null
/** @type {Map<string, { at: number, available: Set<string>, missing: Set<string> }>} */
const moduleCache = new Map()

/**
 * Resolve a working Python 3.10+ interpreter.
 *
 * @default analysisPython = '', autoDetectPython = true
 * @param {{ analysisPython?: string, autoDetectPython?: boolean }} options - config values
 * @returns {Promise<PythonRuntime>} interpreter
 */
export async function resolvePython({ analysisPython = '', autoDetectPython = true } = {}) {
  const key = `${analysisPython}\u0000${autoDetectPython}`
  if (cachedRuntime !== null && cachedRuntime.key === key && Date.now() - cachedRuntime.at < 60000) {
    return cachedRuntime.python
  }

  /** @type {{ command: string, args: string[], source: string }[]} */
  const candidates = []
  if (analysisPython.trim() !== '') {
    candidates.push({ command: analysisPython.trim(), args: [], source: 'helper.analysisPython' })
  } else if (autoDetectPython) {
    candidates.push({ command: 'python', args: [], source: 'auto' })
    candidates.push({ command: 'python3', args: [], source: 'auto' })
    candidates.push({ command: 'py', args: ['-3'], source: 'auto' })
  }

  for (const candidate of candidates) {
    const version = await probeVersion(candidate)
    if (version !== null && meetsMinimum(version)) {
      const python = { ...candidate, version: version.join('.') }
      cachedRuntime = { key, at: Date.now(), python }
      return python
    }
  }

  if (analysisPython.trim() !== '') {
    throw new PythonRuntimeError(
      'configured-python-unavailable',
      `helper.analysisPython is set to "${analysisPython}" but it is not a working Python ${MINIMUM_VERSION.join('.')}+ interpreter.`,
    )
  }
  throw new PythonRuntimeError(
    'no-python',
    `No Python ${MINIMUM_VERSION.join('.')}+ interpreter found (tried python, python3, py -3).`,
  )
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
  if (cache === undefined || Date.now() - cache.at >= 60000) {
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
 * Run one child process with a timeout and output caps.
 *
 * @default timeoutMs = 120000, maxOutputChars = 200000
 * @param {string} command - executable
 * @param {string[]} args - arguments
 * @param {{ timeoutMs?: number, maxOutputChars?: number, cwd?: string, signal?: AbortSignal }} [options] - limits
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
    })
    child.stderr?.on('data', (chunk) => {
      if (stderr.length < maxOutputChars) stderr += String(chunk)
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
 * Probe one interpreter's `major.minor`.
 *
 * @param {{ command: string, args: string[] }} candidate - interpreter
 * @returns {Promise<number[] | null>} version or null
 */
async function probeVersion(candidate) {
  try {
    const result = await runProcess(
      candidate.command,
      [...candidate.args, '-c', "import sys; print('%d.%d' % sys.version_info[:2])"],
      { timeoutMs: 5000 },
    )
    if (result.code !== 0) return null
    const match = /^(\d+)\.(\d+)$/.exec(result.stdout.trim())
    if (match === null) return null
    return [Number(match[1]), Number(match[2])]
  } catch {
    return null
  }
}

/**
 * @param {number[]} version - `major.minor`
 * @returns {boolean} whether the version meets the minimum
 */
function meetsMinimum(version) {
  return version[0] > MINIMUM_VERSION[0] || (version[0] === MINIMUM_VERSION[0] && version[1] >= MINIMUM_VERSION[1])
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
