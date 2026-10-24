/**
 * The plugin-managed Python environment for the helper chain.
 *
 * There is exactly one runtime: `<DSH_HOME>/dsh-blender-mcp-bridge/python/venv`.
 * It is created from Blender's bundled Python (`sys.executable` reported by the
 * live session) and receives the four pinned analysis packages. Helpers with no
 * third-party dependency may run on Blender's own Python; everything else needs
 * the managed venv. Nothing here searches PATH or any other environment.
 *
 * @module lib/helperEnv
 */

import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { appendFile, mkdir, open, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { clearDependencyCache, probeInterpreter, runProcess } from './pythonRuntime.js'

/** Marker/state schema version. */
const ENV_SCHEMA = 1
/** Interpreter version required by the lock file. */
const MINIMUM_VERSION = [3, 12]
/** Probe cache lifetime. */
const CACHE_MS = 60000
/** venv creation budget. */
const VENV_TIMEOUT_MS = 2 * 60 * 1000
/** pip budget. */
const PIP_TIMEOUT_MS = 30 * 60 * 1000
/** Probe budget. */
const PROBE_TIMEOUT_MS = 15000
/** A lock/state older than this is treated as abandoned. */
const STALE_MS = 30 * 60 * 1000
/** Rough download size for the UI. Kept in sync with the lock file. */
const ESTIMATE_DOWNLOAD_BYTES = 104000000
/** Rough installed size for the UI. */
const ESTIMATE_DISK_BYTES = 350000000
/** Package order used everywhere the four packages are listed. */
export const HELPER_PACKAGES = ['numpy', 'Pillow', 'opencv-python-headless', 'scipy']

/** Probe script: report the venv interpreter and the four package versions. */
const PROBE_VENV_CODE = [
  'import importlib, importlib.metadata as md, json, sys',
  "pairs = [('Pillow', 'PIL'), ('numpy', 'numpy'), ('opencv-python-headless', 'cv2'), ('scipy', 'scipy')]",
  'out = {}',
  'for dist, mod in pairs:',
  '    try:',
  '        importlib.import_module(mod)',
  '        out[dist] = md.version(dist)',
  '    except Exception:',
  '        out[dist] = None',
  "print(json.dumps({'version': '%d.%d.%d' % sys.version_info[:3], 'packages': out}))",
].join('\n')

/** Environment or install failure with a stable kind. */
export class HelperEnvError extends Error {
  /**
   * @param {string} kind - stable reason code
   * @param {string} message - readable explanation
   */
  constructor(kind, message) {
    super(message)
    this.name = 'HelperEnvError'
    this.kind = kind
  }
}

/**
 * @typedef {'missing'|'incomplete'|'broken'|'outdated'|'ready'} HelperEnvState
 * @typedef {'idle'|'running'|'failed'|'interrupted'} InstallState
 * @typedef {{ command: string, args: string[], version: string, source: string }} ResolvedPython
 */

/**
 * @typedef {object} HelperEnvStatus
 * @property {number} schema
 * @property {HelperEnvState} state
 * @property {boolean} usable
 * @property {string} envDir
 * @property {string} venvPath
 * @property {string} venvPython
 * @property {string} venvVersion
 * @property {{ python: string, version: string, source: string, blenderVersion: string, valid: boolean, installedFrom: { python: string, version: string } | null }} base
 * @property {Record<string, string | null>} packages
 * @property {string[]} missing
 * @property {{ hash: string, expected: string, matches: boolean, packages: Record<string, string> }} requirements
 * @property {{ state: InstallState, phase: string, startedAt: number, elapsedMs: number, error: { kind: string, message: string } | null, logTail: string[], logPath: string }} install
 * @property {{ downloadBytes: number, diskBytes: number }} estimates
 * @property {{ installCommand: string, settings: string }} hints
 */

/**
 * Resolve the DSH storage root.
 *
 * @returns {string} absolute harness home
 */
export function defaultDshHome() {
  const fromEnv = typeof process.env.DSH_HOME === 'string' ? process.env.DSH_HOME.trim() : ''
  if (fromEnv !== '') return path.resolve(fromEnv)
  return path.join(os.homedir(), '.dsh')
}

/**
 * @param {string} dshHome - harness home
 * @param {string} pluginRoot - installed package root
 * @returns {{ envDir: string, venvDir: string, venvPython: string, logPath: string }} managed paths
 */
export function helperEnvPaths(dshHome, pluginRoot) {
  const envDir = path.join(dshHome, 'dsh-blender-mcp-bridge', 'python')
  const venvDir = path.join(envDir, 'venv')
  const isWindows = process.platform === 'win32'
  return {
    envDir,
    venvDir,
    venvPython: path.join(venvDir, isWindows ? 'Scripts' : 'bin', isWindows ? 'python.exe' : 'python3'),
    logPath: path.join(envDir, 'install.log'),
  }
}

/**
 * Whether a helper can run with the current status.
 *
 * @param {HelperEnvStatus} status - environment status
 * @param {import('./helperCatalog.js').HelperSpec[]} helpers - visible helpers
 * @returns {{ helpers: { name: string, runtime: string, maintenance: boolean, dependencies: string[], ready: boolean, missing: string[] }[], total: number, ready: number, baseOnly: number }} readiness rows and counts
 */
export function computeReadiness(status, helpers) {
  const missingSet = new Set(status.missing)
  const installing = status.install.state === 'running'
  let ready = 0
  let baseOnly = 0
  const rows = helpers.map((helper) => {
    const missing = helper.dependencies.filter((dependency) => missingSet.has(dependency))
    let canRun = false
    if (helper.runtime === 'blender') {
      canRun = true
    } else if (installing) {
      canRun = false
    } else if (helper.dependencies.length === 0) {
      canRun = status.base.valid || status.usable
      if (canRun && status.base.valid && !status.usable) baseOnly += 1
    } else {
      canRun = status.usable && missing.length === 0
    }
    if (canRun) ready += 1
    return {
      name: helper.name,
      runtime: helper.runtime,
      maintenance: helper.maintenance,
      dependencies: helper.dependencies,
      ready: canRun,
      missing,
    }
  })
  return { helpers: rows, total: rows.length, ready, baseOnly }
}

/**
 * Create the helper-environment manager for one plugin instance.
 *
 * @param {object} options - manager options
 * @param {string} options.dshHome - DSH storage root
 * @param {string} options.pluginRoot - installed package root
 * @param {string} [options.packageVersion] - plugin version recorded in markers
 * @param {() => { basePython: string, pipIndexUrl: string }} options.getConfig - live config getter
 * @param {(message: string) => void} [options.warn] - warning sink
 * @param {typeof runProcess} [options.runProcess] - process runner (tests inject one)
 * @returns {ReturnType<typeof buildManager>} manager
 */
export function createHelperEnv(options) {
  return buildManager(options)
}

/**
 * @param {object} options - manager options
 * @param {string} options.dshHome - DSH storage root
 * @param {string} options.pluginRoot - installed package root
 * @param {string} [options.packageVersion] - plugin version recorded in markers
 * @param {() => { basePython: string, pipIndexUrl: string }} options.getConfig - live config getter
 * @param {(message: string) => void} [options.warn] - warning sink
 * @param {typeof runProcess} [options.runProcess] - process runner (tests inject one)
 */
function buildManager({ dshHome, pluginRoot, packageVersion = '', getConfig, warn = () => {}, runProcess: run = runProcess }) {
  const paths = helperEnvPaths(dshHome, pluginRoot)
  const markerPath = path.join(paths.envDir, 'venv.json')
  const basePath = path.join(paths.envDir, 'base.json')
  const statePath = path.join(paths.envDir, 'install-state.json')
  const lockPath = path.join(paths.envDir, 'install.lock')
  const lockFile = path.join(pluginRoot, 'requirements-analysis.lock.txt')

  /** @type {{ python: string, version: string, blenderVersion: string, source: string } | null} */
  let memoryBase = null
  /** @type {string} */
  let persistedBaseKey = ''
  /** @type {Map<string, { at: number, probe: import('./pythonRuntime.js').InterpreterProbe }>} */
  const baseProbeCache = new Map()
  /** @type {{ at: number, markerMtimeMs: number, venvPython: string, result: Record<string, any> } | null} */
  let venvProbeCache = null
  /** @type {Promise<void> | null} */
  let activeJob = null
  /** @type {AbortController | null} */
  let activeAbort = null
  /** @type {{ phase: string, startedAt: number } | null} */
  let jobProgress = null
  let activeHelpers = 0
  let disposed = false

  /**
   * @param {string} filePath - JSON file
   * @returns {Promise<Record<string, any> | null>} parsed value or null
   */
  const readJson = async (filePath) => {
    try {
      const parsed = JSON.parse(await readFile(filePath, 'utf8'))
      return typeof parsed === 'object' && parsed !== null ? /** @type {Record<string, any>} */ (parsed) : null
    } catch {
      return null
    }
  }

  /**
   * @param {string} filePath - JSON file
   * @param {Record<string, unknown>} value - value
   * @returns {Promise<void>} after the atomic replace
   */
  const writeJson = async (filePath, value) => {
    await mkdir(path.dirname(filePath), { recursive: true })
    const temp = `${filePath}.${process.pid}.${Date.now()}.tmp`
    await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
    try {
      await rename(temp, filePath)
    } catch {
      await rm(filePath, { force: true })
      await rename(temp, filePath)
    }
  }

  /**
   * @returns {string} copy-pasteable CLI command
   */
  const installHint = () => {
    const script = path.join(pluginRoot, 'scripts', 'setupAnalysis.js')
    const base = `node "${script}"`
    return path.resolve(dshHome) === path.resolve(defaultDshHome()) ? base : `${base} --home "${dshHome}"`
  }

  /**
   * @param {string} line - one log line
   * @returns {string} line without inline credentials
   */
  const sanitize = (line) => {
    const shortened = line.length > 1000 ? `${line.slice(0, 1000)}…` : line
    return shortened.replace(/:\/\/[^/\s:@]+:[^/\s@]+@/g, '://***@')
  }

  /**
   * @param {string} line - message to append
   * @returns {Promise<void>} after the append
   */
  const appendLog = async (line) => {
    try {
      await mkdir(paths.envDir, { recursive: true })
      await appendFile(paths.logPath, `${sanitize(line)}\n`, 'utf8')
    } catch (error) {
      warn(`helper env log failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * @default count = 20
   * @param {number} [count] - lines to keep
   * @returns {Promise<string[]>} last log lines
   */
  const readLogTail = async (count = 20) => {
    try {
      const text = await readFile(paths.logPath, 'utf8')
      return text.trimEnd().split(/\r?\n/).slice(-count)
    } catch {
      return []
    }
  }

  /**
   * @param {number} pid - process id
   * @returns {boolean} whether the process is alive
   */
  const pidAlive = (pid) => {
    if (!Number.isInteger(pid) || pid <= 0) return false
    try {
      process.kill(pid, 0)
      return true
    } catch (error) {
      return /** @type {NodeJS.ErrnoException} */ (error).code !== 'ESRCH'
    }
  }

  /**
   * @returns {Promise<boolean>} whether the lock is abandoned
   */
  const lockIsStale = async () => {
    try {
      const record = await readJson(lockPath)
      if (record === null) {
        const info = await stat(lockPath)
        return Date.now() - info.mtimeMs > STALE_MS
      }
      const startedAt = typeof record.startedAt === 'number' ? record.startedAt : 0
      if (Date.now() - startedAt > STALE_MS) return true
      return !pidAlive(Number(record.pid))
    } catch {
      return true
    }
  }

  /**
   * @returns {Promise<() => Promise<void>>} lock release
   */
  const acquireLock = async () => {
    await mkdir(paths.envDir, { recursive: true })
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const handle = await open(lockPath, 'wx')
        await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: Date.now() }), 'utf8')
        await handle.close()
        return async () => {
          await rm(lockPath, { force: true }).catch(() => {})
        }
      } catch (error) {
        if (/** @type {NodeJS.ErrnoException} */ (error).code !== 'EEXIST') {
          throw new HelperEnvError('home-unwritable', `Cannot create the install lock: ${error instanceof Error ? error.message : String(error)}`)
        }
        if (!(await lockIsStale())) {
          throw new HelperEnvError('busy', 'Another install is already running for the helper environment.')
        }
        await rm(lockPath, { force: true }).catch(() => {})
      }
    }
    throw new HelperEnvError('busy', 'Could not acquire the helper environment install lock.')
  }

  /**
   * @param {string} command - interpreter path
   * @returns {Promise<import('./pythonRuntime.js').InterpreterProbe>} cached probe
   */
  const probeBase = async (command) => {
    const now = Date.now()
    const cached = baseProbeCache.get(command)
    if (cached !== undefined && now - cached.at < CACHE_MS) return cached.probe
    const probe = await probeInterpreter(command, { timeoutMs: 10000 })
    baseProbeCache.set(command, { at: now, probe })
    return probe
  }

  /**
   * @param {string} version - `major.minor.patch`
   * @returns {boolean} whether it meets the lock requirement
   */
  const meetsMinimum = (version) => {
    const [major, minor] = version.split('.').map(Number)
    return major > MINIMUM_VERSION[0] || (major === MINIMUM_VERSION[0] && minor >= MINIMUM_VERSION[1])
  }

  /**
   * @returns {Promise<{ python: string, version: string, source: string, blenderVersion: string, installedFrom: { python: string, version: string } | null }>} effective base
   */
  const resolveBase = async () => {
    const config = getConfig()
    const marker = await readJson(markerPath)
    const saved = await readJson(basePath)
    /** @type {{ python: string, source: string, blenderVersion: string }[]} */
    const candidates = []
    if (typeof config.basePython === 'string' && config.basePython.trim() !== '') {
      const raw = config.basePython.trim().replace(/^"(.*)"$/, '$1')
      candidates.push({ python: raw, source: 'config', blenderVersion: '' })
    }
    if (memoryBase !== null) {
      candidates.push({ python: memoryBase.python, source: 'blender', blenderVersion: memoryBase.blenderVersion })
    }
    if (saved !== null && typeof saved.python === 'string') {
      candidates.push({ python: saved.python, source: 'saved', blenderVersion: String(saved.blenderVersion ?? '') })
    }
    if (marker !== null && marker.base && typeof marker.base.python === 'string') {
      candidates.push({ python: marker.base.python, source: 'installed', blenderVersion: String(marker.base.blenderVersion ?? '') })
    }
    const seen = new Set()
    for (const candidate of candidates) {
      const key = path.resolve(candidate.python)
      if (seen.has(key)) continue
      seen.add(key)
      if (!existsSync(candidate.python)) continue
      const probe = await probeBase(candidate.python)
      if (probe.ok && meetsMinimum(probe.version) && probe.venv && probe.ensurepip) {
        return {
          python: candidate.python,
          version: probe.version,
          source: candidate.source,
          blenderVersion: candidate.blenderVersion,
          installedFrom:
            marker !== null && marker.base && typeof marker.base.python === 'string'
              ? { python: marker.base.python, version: String(marker.base.version ?? '') }
              : null,
        }
      }
    }
    const first = candidates[0]
    return {
      python: first === undefined ? '' : first.python,
      version: '',
      source: first === undefined ? 'unknown' : first.source,
      blenderVersion: first === undefined ? '' : first.blenderVersion,
      installedFrom:
        marker !== null && marker.base && typeof marker.base.python === 'string'
          ? { python: marker.base.python, version: String(marker.base.version ?? '') }
          : null,
    }
  }

  /**
   * @param {boolean} force - ignore the cache
   * @returns {Promise<Record<string, any>>} venv probe
   */
  const probeVenv = async (force) => {
    const posixPython = path.join(paths.venvDir, 'bin', 'python')
    const venvPython = existsSync(paths.venvPython)
      ? paths.venvPython
      : existsSync(path.join(paths.venvDir, 'bin', 'python3'))
        ? path.join(paths.venvDir, 'bin', 'python3')
        : existsSync(posixPython)
          ? posixPython
          : paths.venvPython
    if (!existsSync(venvPython)) {
      return { exists: false, ok: false, venvPython, version: '', packages: {}, missing: HELPER_PACKAGES, error: '' }
    }
    let markerMtimeMs = 0
    try {
      markerMtimeMs = (await stat(markerPath)).mtimeMs
    } catch {
      markerMtimeMs = 0
    }
    if (
      !force &&
      venvProbeCache !== null &&
      venvProbeCache.venvPython === venvPython &&
      venvProbeCache.markerMtimeMs === markerMtimeMs &&
      Date.now() - venvProbeCache.at < CACHE_MS
    ) {
      return venvProbeCache.result
    }
    const result = await run(venvPython, ['-c', PROBE_VENV_CODE], { timeoutMs: PROBE_TIMEOUT_MS }).catch((error) => ({
      code: 1,
      signal: null,
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      timedOut: false,
      aborted: false,
    }))
    /** @type {Record<string, any>} */
    let parsed = {}
    try {
      parsed = JSON.parse(result.stdout.trim())
    } catch {
      parsed = {}
    }
    const packageMap = typeof parsed.packages === 'object' && parsed.packages !== null ? parsed.packages : {}
    /** @type {Record<string, string | null>} */
    const packages = {}
    /** @type {string[]} */
    const missing = []
    for (const name of HELPER_PACKAGES) {
      const value = packageMap[name]
      if (typeof value === 'string' && value !== '') packages[name] = value
      else {
        packages[name] = null
        missing.push(name)
      }
    }
    const ok = result.code === 0 && typeof parsed.version === 'string' && missing.length === 0
    const value = {
      exists: true,
      ok,
      venvPython,
      version: typeof parsed.version === 'string' ? parsed.version : '',
      packages,
      missing,
      error: result.code === 0 ? '' : result.stderr.trim().split('\n').slice(-6).join('\n'),
    }
    venvProbeCache = { at: Date.now(), markerMtimeMs, venvPython, result: value }
    return value
  }

  /**
   * @returns {Promise<{ hash: string, expected: string, packages: Record<string, string>, error: string }>} lock info
   */
  const readRequirements = async () => {
    try {
      const text = await readFile(lockFile, 'utf8')
      const hash = `sha256:${createHash('sha256').update(text).digest('hex')}`
      /** @type {Record<string, string>} */
      const packages = {}
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (line === '' || line.startsWith('#')) continue
        const match = /^([A-Za-z0-9_.-]+)==([^\s#]+)/.exec(line)
        if (match !== null) packages[match[1]] = match[2]
      }
      return { hash, expected: hash, packages, error: '' }
    } catch (error) {
      return { hash: '', expected: '', packages: {}, error: error instanceof Error ? error.message : String(error) }
    }
  }

  /**
   * @returns {Promise<{ state: InstallState, phase: string, startedAt: number, error: { kind: string, message: string } | null }>} persisted state or idle
   */
  const readPersistedInstall = async () => {
    const record = await readJson(statePath)
    if (record === null || typeof record.state !== 'string') {
      return { state: 'idle', phase: '', startedAt: 0, error: null }
    }
    const error =
      record.error && typeof record.error === 'object'
        ? { kind: String(record.error.kind ?? 'failed'), message: String(record.error.message ?? '') }
        : null
    return {
      state: /** @type {InstallState} */ (record.state),
      phase: typeof record.phase === 'string' ? record.phase : '',
      startedAt: typeof record.startedAt === 'number' ? record.startedAt : 0,
      error,
    }
  }

  /**
   * @param {{ state: InstallState, phase: string, startedAt: number, error: { kind: string, message: string } | null }} install - install status
   * @returns {Promise<HelperEnvStatus['install']>} status fragment
   */
  const installFragment = async (install) => ({
    state: install.state,
    phase: install.phase,
    startedAt: install.startedAt,
    elapsedMs: install.startedAt === 0 ? 0 : Math.max(0, Date.now() - install.startedAt),
    error: install.error,
    logTail: install.state === 'running' || install.state === 'failed' ? await readLogTail() : [],
    logPath: paths.logPath,
  })

  /**
   * @returns {Promise<{ running: boolean, install: HelperEnvStatus['install'] }>} whether an install is running
   */
  const inspectInstall = async () => {
    if (activeJob !== null && jobProgress !== null) {
      return {
        running: true,
        install: await installFragment({ state: 'running', phase: jobProgress.phase, startedAt: jobProgress.startedAt, error: null }),
      }
    }
    const persisted = await readPersistedInstall()
    if (persisted.state === 'running') {
      const stale = await lockIsStale()
      if (!stale && existsSync(lockPath)) {
        return {
          running: true,
          install: await installFragment({ state: 'running', phase: persisted.phase, startedAt: persisted.startedAt, error: null }),
        }
      }
      return {
        running: false,
        install: await installFragment({ state: 'interrupted', phase: persisted.phase, startedAt: persisted.startedAt, error: null }),
      }
    }
    return { running: false, install: await installFragment(persisted) }
  }

  /**
   * Current environment status. Only the fixed venv is probed.
   *
   * @default refresh = false
   * @param {{ refresh?: boolean }} [options] - refresh bypasses the probe cache
   * @returns {Promise<HelperEnvStatus>} status
   */
  const status = async (options = {}) => {
    const install = await inspectInstall()
    const marker = await readJson(markerPath)
    const requirements = await readRequirements()
    const base = await resolveBase()
    const venv = install.running
      ? { exists: existsSync(paths.venvPython), ok: false, venvPython: paths.venvPython, version: '', packages: {}, missing: HELPER_PACKAGES, error: '' }
      : await probeVenv(options.refresh === true)
    /** @type {Record<string, string | null>} */
    const packages = { ...venv.packages }
    for (const name of HELPER_PACKAGES) {
      if (packages[name] === undefined) packages[name] = marker?.packages?.[name] ?? null
    }
    /** @type {HelperEnvState} */
    let state
    if (!venv.exists && marker === null) state = 'missing'
    else if (!venv.exists) state = 'broken'
    else if (!venv.ok && (venv.error !== '' || venv.version === '')) state = 'broken'
    else if (venv.missing.length > 0) state = 'incomplete'
    else if (marker === null || marker.requirementsHash !== requirements.hash) state = 'outdated'
    else state = 'ready'
    const usable = !install.running && (state === 'ready' || state === 'outdated')
    return {
      schema: ENV_SCHEMA,
      state,
      usable,
      envDir: paths.envDir,
      venvPath: paths.venvDir,
      venvPython: venv.venvPython,
      venvVersion: venv.version,
      base: {
        python: base.python,
        version: base.version,
        source: base.source,
        blenderVersion: base.blenderVersion,
        valid: base.version !== '',
        installedFrom: base.installedFrom,
      },
      packages,
      missing: install.running ? [] : venv.missing,
      requirements: {
        hash: requirements.hash,
        expected: requirements.expected,
        matches: marker !== null && marker.requirementsHash === requirements.hash,
        packages: requirements.packages,
      },
      install: install.install,
      estimates: { downloadBytes: ESTIMATE_DOWNLOAD_BYTES, diskBytes: ESTIMATE_DISK_BYTES },
      hints: { installCommand: installHint(), settings: 'Settings → Blender MCP → Python helper environment' },
    }
  }

  /**
   * Remember the Blender session's Python and persist it for later use.
   *
   * @param {import('./handshake.js').LiveSessionInfo} info - live session facts
   * @returns {void}
   */
  const noteBlenderSession = (info) => {
    const executable =
      typeof info.pythonExecutable === 'string' && info.pythonExecutable.trim() !== ''
        ? info.pythonExecutable
        : typeof info.pythonPrefix === 'string' && info.pythonPrefix.trim() !== ''
          ? path.join(info.pythonPrefix, 'bin', process.platform === 'win32' ? 'python.exe' : 'python3')
          : ''
    if (executable === '') return
    const candidate = {
      python: executable,
      version: typeof info.pythonVersion === 'string' ? info.pythonVersion : '',
      blenderVersion: typeof info.blenderVersion === 'string' ? info.blenderVersion : '',
      source: 'blender',
    }
    memoryBase = candidate
    const key = `${candidate.python}\u0000${candidate.version}\u0000${candidate.blenderVersion}`
    if (key === persistedBaseKey) return
    persistedBaseKey = key
    void writeJson(basePath, {
      schema: ENV_SCHEMA,
      python: candidate.python,
      version: candidate.version,
      blenderVersion: candidate.blenderVersion,
      seenAt: new Date().toISOString(),
    }).catch((error) => warn(`helper env base marker failed: ${error instanceof Error ? error.message : String(error)}`))
  }

  /**
   * Wait for a running install, then read the final status.
   *
   * @returns {Promise<HelperEnvStatus>} current status
   */
  const waitForInstall = async () => {
    if (activeJob !== null) await activeJob
    return await status({ refresh: true })
  }

  /**
   * Run one install to completion and return the resulting status.
   *
   * @default action = 'install'
   * @param {'install'|'rebuild'} [action] - install or rebuild
   * @param {{ onLog?: (line: string) => void }} [logOptions] - line sink
   * @returns {Promise<HelperEnvStatus>} final status
   */
  const install = async (action = 'install', logOptions = {}) => {
    if (action !== 'install' && action !== 'rebuild') {
      throw new HelperEnvError('invalid-action', `Unknown helper environment action "${action}".`)
    }
    if (activeJob !== null) throw new HelperEnvError('busy', 'Another install is already running.')
    if (activeHelpers > 0) {
      throw new HelperEnvError('helpers-running', 'A helper is running; wait for it to finish before installing.')
    }
    const base = await resolveBase()
    if (base.version === '') {
      throw new HelperEnvError(
        'base-unavailable',
        'No Blender Python is available. Open Blender with the MCP add-on running, set helper.basePython, or pass --python to the setup script.',
      )
    }
    const release = await acquireLock()
    try {
      activeAbort = new AbortController()
      jobProgress = { phase: 'checking', startedAt: Date.now() }
      const job = runInstall(action, base, logOptions.onLog)
      activeJob = job
      await job
    } finally {
      activeJob = null
      jobProgress = null
      activeAbort = null
      await release()
    }
    return await status({ refresh: true })
  }

  /**
   * Start an install in the background.
   *
   * @param {'install'|'rebuild'} action - action
   * @returns {Promise<{ state: 'running' }>} accepted
   */
  const startInstall = async (action) => {
    if (action !== 'install' && action !== 'rebuild') {
      throw new HelperEnvError('invalid-action', `Unknown helper environment action "${action}".`)
    }
    if (activeJob !== null) throw new HelperEnvError('busy', 'Another install is already running.')
    if (activeHelpers > 0) {
      throw new HelperEnvError('helpers-running', 'A helper is running; wait for it to finish before installing.')
    }
    const base = await resolveBase()
    if (base.version === '') {
      throw new HelperEnvError(
        'base-unavailable',
        'No Blender Python is available. Open Blender with the MCP add-on running, set helper.basePython, or run the setup script with --python.',
      )
    }
    const release = await acquireLock()
    activeAbort = new AbortController()
    jobProgress = { phase: 'checking', startedAt: Date.now() }
    const job = runInstall(action, base)
    activeJob = job
    void job
      .catch(() => {})
      .finally(async () => {
        activeJob = null
        jobProgress = null
        activeAbort = null
        await release()
      })
    return { state: 'running' }
  }

  /**
   * @param {'install'|'rebuild'} action - action
   * @param {{ python: string, version: string, source: string, blenderVersion: string }} base - validated base
   * @param {(line: string) => void} [onLog] - line sink
   * @returns {Promise<void>} after the state and marker are written
   */
  const runInstall = async (action, base, onLog) => {
    /** @param {string} line @returns {Promise<void>} */
    const emit = async (line) => {
      const text = sanitize(line)
      await appendLog(text)
      if (onLog !== undefined) {
        try {
          onLog(text)
        } catch {
          // A CLI printer must never break the install.
        }
      }
    }
    /** @param {string} phase @returns {Promise<void>} */
    const setPhase = async (phase) => {
      jobProgress = { phase, startedAt: jobProgress?.startedAt ?? Date.now() }
      await writeJson(statePath, {
        schema: ENV_SCHEMA,
        state: 'running',
        phase,
        startedAt: jobProgress.startedAt,
        action,
        updatedAt: Date.now(),
      })
    }
    try {
      await mkdir(paths.envDir, { recursive: true })
      await setPhase('checking')
      await emit(`[env] action=${action} base=${base.python} (${base.version})`)
      const config = getConfig()
      await setPhase('creating')
      if (action === 'rebuild') {
        await rm(paths.venvDir, { recursive: true, force: true })
        await emit('[env] removed the previous venv')
      } else {
        const current = await probeVenv(true)
        if (!current.exists) {
          if (existsSync(paths.venvDir)) {
            await rm(paths.venvDir, { recursive: true, force: true })
            await emit('[env] removed a partial venv')
          }
        } else if (!current.ok && current.version === '' && current.missing.length === HELPER_PACKAGES.length) {
          await rm(paths.venvDir, { recursive: true, force: true })
          await emit('[env] removed an unusable venv')
        }
      }
      if (!existsSync(paths.venvDir)) {
        const created = await run(base.python, ['-m', 'venv', paths.venvDir], {
          timeoutMs: VENV_TIMEOUT_MS,
          signal: activeAbort?.signal,
          onLine: (line) => {
            void emit(`[venv] ${line}`)
          },
        })
        if (created.code !== 0) {
          throw new HelperEnvError('venv-failed', `Could not create the venv: ${created.stderr.trim() || `exit ${String(created.code)}`}`)
        }
      }
      if (!existsSync(paths.venvPython)) {
        throw new HelperEnvError('venv-failed', `The new venv has no interpreter at ${paths.venvPython}.`)
      }
      await setPhase('installing')
      const pipArgs = [
        '-m',
        'pip',
        'install',
        '--disable-pip-version-check',
        '--no-input',
        '--only-binary=:all:',
        '--progress-bar',
        'off',
        '--timeout',
        '60',
        '--retries',
        '3',
      ]
      const indexUrl = typeof config.pipIndexUrl === 'string' ? config.pipIndexUrl.trim() : ''
      if (indexUrl !== '') {
        let parsed
        try {
          parsed = new URL(indexUrl)
        } catch {
          throw new HelperEnvError('pip-failed', `helper.pipIndexUrl is not a valid URL: ${indexUrl}`)
        }
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new HelperEnvError('pip-failed', 'helper.pipIndexUrl must use http:// or https://.')
        }
        pipArgs.push('--index-url', indexUrl)
        if (parsed.protocol === 'http:') pipArgs.push('--trusted-host', parsed.hostname)
      }
      pipArgs.push('-r', lockFile)
      const lockInfo = await readRequirements()
      if (lockInfo.error !== '' || lockInfo.hash === '') {
        throw new HelperEnvError('pip-failed', `Cannot read the locked dependency file: ${lockInfo.error || lockFile}`)
      }
      const installed = await run(paths.venvPython, pipArgs, {
        timeoutMs: PIP_TIMEOUT_MS,
        signal: activeAbort?.signal,
        onLine: (line) => {
          void emit(`[pip] ${line}`)
        },
      })
      if (installed.code !== 0) {
        throw new HelperEnvError('pip-failed', `pip install failed: ${installed.stderr.trim().split('\n').slice(-8).join('\n') || `exit ${String(installed.code)}`}`)
      }
      await setPhase('verifying')
      const verified = await probeVenv(true)
      if (!verified.ok || verified.version === '' || verified.missing.length > 0) {
        throw new HelperEnvError('verify-failed', `The new environment is incomplete (missing: ${verified.missing.join(', ') || 'interpreter'}).`)
      }
      const requirements = await readRequirements()
      await writeJson(markerPath, {
        schema: ENV_SCHEMA,
        venvPython: paths.venvPython,
        base: { python: base.python, version: base.version, source: base.source, blenderVersion: base.blenderVersion },
        packages: verified.packages,
        requirementsHash: requirements.hash,
        installedAt: new Date().toISOString(),
        pluginVersion: packageVersion,
      })
      await writeJson(statePath, {
        schema: ENV_SCHEMA,
        state: 'idle',
        phase: 'done',
        startedAt: jobProgress?.startedAt ?? Date.now(),
        action,
        updatedAt: Date.now(),
      })
      await emit(`[env] ready: ${HELPER_PACKAGES.map((name) => `${name} ${verified.packages[name]}`).join(', ')}`)
      clearDependencyCache()
    } catch (error) {
      const failure = error instanceof HelperEnvError
        ? error
        : new HelperEnvError('install-failed', error instanceof Error ? error.message : String(error))
      await appendLog(`[env] failed: ${failure.kind}: ${failure.message}`)
      await writeJson(statePath, {
        schema: ENV_SCHEMA,
        state: 'failed',
        phase: jobProgress?.phase ?? 'checking',
        startedAt: jobProgress?.startedAt ?? Date.now(),
        action,
        error: { kind: failure.kind, message: failure.message },
        updatedAt: Date.now(),
      }).catch(() => {})
    }
  }

  /**
   * Pick the interpreter a helper should run with.
   *
   * @param {import('./helperCatalog.js').HelperSpec} helper - helper spec
   * @returns {Promise<{ python: ResolvedPython, source: 'venv'|'base' }>} runtime
   */
  const runtimeFor = async (helper) => {
    const current = await status()
    if (current.install.state === 'running') {
      throw new HelperEnvError('helper-env-installing', 'The helper environment is being installed; try again when it finishes.')
    }
    if (helper.dependencies.length === 0) {
      if (current.base.valid) {
        return {
          python: { command: current.base.python, args: [], version: current.base.version, source: current.base.source },
          source: 'base',
        }
      }
      if (current.usable) {
        return {
          python: { command: current.venvPython, args: [], version: current.venvVersion, source: 'venv' },
          source: 'venv',
        }
      }
      throw new HelperEnvError(
        current.state === 'missing' ? 'helper-env-missing' : 'helper-env-base-unavailable',
        `${describeMissing(current)} ${installHint()}`,
      )
    }
    if (!current.usable) {
      throw new HelperEnvError(
        current.state === 'incomplete' ? 'helper-env-incomplete' : 'helper-env-missing',
        `${describeMissing(current)} ${installHint()}`,
      )
    }
    return {
      python: { command: current.venvPython, args: [], version: current.venvVersion, source: 'venv' },
      source: 'venv',
    }
  }

  /**
   * @param {HelperEnvStatus} current - status
   * @returns {string} readable reason
   */
  const describeMissing = (current) => {
    if (current.state === 'incomplete') {
      return `The Python helper environment is incomplete (missing: ${current.missing.join(', ')}). Open Settings → Blender MCP → Python helper environment and repair it, or run:`
    }
    if (current.state === 'broken') {
      return 'The Python helper environment is broken; rebuild it in Settings → Blender MCP → Python helper environment, or run:'
    }
    return 'The Python helper environment is not installed. Open Settings → Blender MCP → Python helper environment, or run:'
  }

  /**
   * @returns {void}
   */
  const beginHelper = () => {
    activeHelpers += 1
  }

  /**
   * @returns {void}
   */
  const endHelper = () => {
    activeHelpers = Math.max(0, activeHelpers - 1)
  }

  /**
   * @returns {Promise<void>} stop the install child and mark the state interrupted
   */
  const dispose = async () => {
    disposed = true
    activeAbort?.abort()
  }

  return {
    paths,
    status,
    noteBlenderSession,
    runtimeFor,
    beginHelper,
    endHelper,
    install,
    startInstall,
    waitForInstall,
    installHint,
    dispose,
    /** @returns {boolean} whether this manager was disposed */
    isDisposed: () => disposed,
  }
}
