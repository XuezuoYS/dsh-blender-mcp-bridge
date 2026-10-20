/**
 * Helper execution: trusted catalog entries only.
 *
 * Python helpers run in their own process without a shell; the one Blender
 * runtime helper runs through the plugin's trusted exec channel. Inputs are
 * limited to the workspace, the .blend directory and the task directory;
 * outputs must stay inside the task directory.
 *
 * @module lib/helperRunner
 */

import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { buildHelperCommand, HelperArgsError } from './helperCatalog.js'
import { missingDependencies, PythonRuntimeError, resolvePython, runProcess } from './pythonRuntime.js'
import { isInsideTask } from './taskDir.js'
import { TRUSTED_CLEANUP } from './trustedExec.js'

/** Helper failure with a stable kind. */
export class HelperError extends Error {
  /**
   * @param {string} kind - stable reason code
   * @param {string} message - readable explanation
   */
  constructor(kind, message) {
    super(message)
    this.name = 'HelperError'
    this.kind = kind
  }
}

/**
 * @typedef {object} HelperRoots
 * @property {string} workspaceDir - session workspace
 * @property {string} blendDir - open .blend directory (may be empty)
 * @property {string} taskDir - task directory
 */

/**
 * Run one Python helper.
 *
 * @param {object} options - run options
 * @param {import('./helperCatalog.js').HelperSpec} options.helper - helper spec
 * @param {Record<string, unknown>} options.args - model arguments
 * @param {HelperRoots} options.roots - allowed roots
 * @param {string} options.helpersDir - directory with the helper scripts
 * @param {{ analysisPython: string, autoDetectPython: boolean }} options.pythonConfig - interpreter config
 * @param {number} options.timeoutMs - process timeout
 * @param {number} options.maxOutputChars - output cap
 * @param {AbortSignal} [options.signal] - caller cancellation signal
 * @returns {Promise<Record<string, unknown>>} helper result
 */
export async function runPythonHelper({ helper, args, roots, helpersDir, pythonConfig, timeoutMs, maxOutputChars, signal }) {
  const resolvedArgs = resolveInputArgs(helper, args, roots)
  const { argv, outputs } = await buildHelperCommand(helper, resolvedArgs, roots.taskDir)
  const scriptPath = path.join(helpersDir, helper.script)
  if (!existsSync(scriptPath)) throw new HelperError('missing-script', `Helper script is missing: ${scriptPath}`)

  let python
  try {
    python = await resolvePython(pythonConfig)
  } catch (error) {
    if (error instanceof PythonRuntimeError) throw new HelperError(error.kind, error.message)
    throw error
  }
  let missing = []
  try {
    missing = await missingDependencies(python, helper.dependencies)
  } catch (error) {
    if (error instanceof PythonRuntimeError) throw new HelperError(error.kind, error.message)
    throw error
  }
  if (missing.length > 0) {
    throw new HelperError(
      'missing-dependencies',
      `Missing Python packages for "${helper.name}": ${missing.join(', ')}. Install with: node scripts/setupAnalysis.js`,
    )
  }

  const startedAt = Date.now()
  let result
  try {
    result = await runProcess(python.command, [...python.args, scriptPath, ...argv], {
      timeoutMs,
      maxOutputChars,
      cwd: helpersDir,
      signal,
    })
  } catch (error) {
    throw new HelperError('spawn-failed', `Could not start the helper process: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (result.aborted) {
    throw new HelperError('cancelled', `Helper "${helper.name}" was cancelled.`)
  }
  if (result.timedOut) {
    throw new HelperError('timeout', `Helper "${helper.name}" exceeded ${timeoutMs} ms and was stopped.`)
  }

  const report = parseJson(result.stdout)
  const stderrTail = result.stderr.trim().split('\n').slice(-8).join('\n')
  const files = []
  for (const output of outputs) {
    files.push(await describeOutput(output.path, output.kind))
  }
  return {
    status: result.code === 0 ? 'ok' : 'error',
    runtime: 'python',
    helper: helper.name,
    exitCode: result.code,
    stdout: result.stdout,
    stderr: result.stderr,
    report,
    outputs: files,
    durationMs: Date.now() - startedAt,
    ...(result.code === 0
      ? {}
      : {
          error: {
            kind: 'helper-failed',
            message: stderrTail || `Helper exited with code ${String(result.code)}.`,
          },
        }),
  }
}

/**
 * Run the one Blender-runtime helper through the trusted exec channel.
 *
 * @param {object} options - run options
 * @param {import('./helperCatalog.js').HelperSpec} options.helper - helper spec
 * @param {Record<string, unknown>} options.args - model arguments
 * @param {HelperRoots} options.roots - allowed roots
 * @param {string} options.helpersDir - directory with the helper scripts
 * @param {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} options.send - trusted transport
 * @param {number} options.timeoutMs - reply budget
 * @param {AbortSignal} [options.signal] - caller cancellation signal
 * @returns {Promise<Record<string, unknown>>} helper result
 */
export async function runBlenderHelper({ helper, args, roots, helpersDir, send, timeoutMs, signal }) {
  let resolvedArgs = resolveInputArgs(helper, args, roots)
  // The upstream script defaults to a project-specific object prefix. In a
  // live session that filter is wrong, so default to every mesh in the scene.
  if (helper.name === 'surface-texture-coverage-audit' && resolvedArgs.objects === undefined) {
    const names = await readMeshNames(send, timeoutMs, signal)
    if (names.length > 0) resolvedArgs = { ...resolvedArgs, objects: names }
  }
  const { argv, outputs } = await buildHelperCommand(helper, resolvedArgs, roots.taskDir)
  const scriptPath = path.join(helpersDir, helper.script)
  if (!existsSync(scriptPath)) throw new HelperError('missing-script', `Helper script is missing: ${scriptPath}`)
  const script = await readFile(scriptPath, 'utf8')
  const startedAt = Date.now()

  const payload = `${TRUSTED_CLEANUP}import contextlib
import io
import sys
import traceback

_script = ${JSON.stringify(script)}
_argv = ${JSON.stringify(argv)}
_old_argv = sys.argv
sys.argv = ['helper'] + _argv
_out = ''
try:
    _buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(_buf):
            exec(compile(_script, '<helper-script>', 'exec'), {'__name__': '__main__'})
    finally:
        _out = _buf.getvalue()
    result = {'ok': True, 'stdout': _out}
except SystemExit as _exc:
    result = {'ok': _exc.code in (0, None), 'stdout': _out, 'exit': _exc.code}
except BaseException as _exc:
    result = {'ok': False, 'stdout': _out, 'error': '%s: %s' % (type(_exc).__name__, _exc), 'traceback': traceback.format_exc()}
finally:
    sys.argv = _old_argv
`

  /** @type {{ response: unknown }} */
  let reply
  try {
    reply = await send(payload, { responseTimeoutMs: timeoutMs, signal })
  } catch (error) {
    if (error instanceof Error && 'code' in error && /** @type {{ code?: string }} */ (error).code === 'aborted') {
      throw new HelperError('cancelled', `Helper "${helper.name}" was cancelled.`)
    }
    throw new HelperError('transport-failed', `Helper transport failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  const envelope = isRecord(reply.response) ? reply.response : {}
  if (envelope.status !== 'ok' || !isRecord(envelope.result)) {
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new HelperError('blender-error', `Blender rejected the helper: ${message}`)
  }
  const inner = envelope.result
  const stdout = typeof inner.stdout === 'string' ? inner.stdout : ''
  const files = []
  for (const output of outputs) files.push(await describeOutput(output.path, output.kind))
  return {
    status: inner.ok === true ? 'ok' : 'error',
    runtime: 'blender',
    helper: helper.name,
    exitCode: typeof inner.exit === 'number' ? inner.exit : null,
    stdout,
    stderr: typeof envelope.stderr === 'string' ? envelope.stderr : '',
    report: parseJson(stdout) ?? (await readFirstJson(files)),
    outputs: files,
    ...(inner.ok === true ? {} : { error: typeof inner.error === 'string' ? inner.error : 'helper failed' }),
    durationMs: Date.now() - startedAt,
  }
}

/**
 * Resolve input paths against the workspace and enforce allowed roots.
 *
 * @param {import('./helperCatalog.js').HelperSpec} helper - helper spec
 * @param {Record<string, unknown>} args - model arguments
 * @param {HelperRoots} roots - allowed roots
 * @returns {Record<string, unknown>} args with absolute input paths
 */
function resolveInputArgs(helper, args, roots) {
  if (typeof args !== 'object' || args === null || Array.isArray(args)) {
    throw new HelperArgsError('args must be an object keyed by helper parameter name.')
  }
  /** @type {Record<string, unknown>} */
  const resolved = { ...args }
  for (const param of helper.params) {
    if (param.path !== 'in' && param.path !== 'in-dir') continue
    const value = resolved[param.name]
    if (value === undefined) continue
    const values = Array.isArray(value) ? value : [value]
    const resolvedValues = values.map((entry) => {
      if (typeof entry !== 'string') throw new HelperArgsError(`Input "${param.name}" must be a string path.`)
      const absolute = path.isAbsolute(entry) ? entry : path.join(roots.workspaceDir, entry)
      if (!isAllowedInput(absolute, roots)) {
        const allowed =
          roots.blendDir === ''
            ? 'the workspace and the task directory'
            : 'the workspace, the .blend directory and the task directory'
        throw new HelperError(
          'input-outside',
          `Input "${entry}" is outside ${allowed}.` +
            (roots.blendDir === '' ? ' Blender is not connected, so only workspace/task inputs are readable.' : ''),
        )
      }
      return absolute
    })
    resolved[param.name] = Array.isArray(value) ? resolvedValues : resolvedValues[0]
  }
  return resolved
}

/**
 * @param {string} target - absolute path
 * @param {HelperRoots} roots - allowed roots
 * @returns {boolean} whether the path may be read
 */
function isAllowedInput(target, roots) {
  return [roots.workspaceDir, roots.blendDir, roots.taskDir].some(
    (root) => root !== '' && (isInsideTask(target, root) || target === path.resolve(root)),
  )
}

/**
 * @param {string} filePath - output path
 * @param {string} kind - `out` or `out-dir`
 * @returns {Promise<Record<string, unknown>>} output descriptor
 */
async function describeOutput(filePath, kind) {
  try {
    const info = await stat(filePath)
    return { path: filePath, kind, bytes: info.isDirectory() ? 0 : info.size }
  } catch {
    return { path: filePath, kind, bytes: 0, missing: true }
  }
}

/**
 * @param {string} text - candidate JSON text
 * @returns {unknown | null} parsed value or null
 */
function parseJson(text) {
  const trimmed = text.trim()
  if (trimmed === '') return null
  try {
    return JSON.parse(trimmed)
  } catch {
    return null
  }
}

/**
 * Read the first JSON output file for the Blender-runtime report fallback.
 *
 * @param {{ path?: unknown, kind?: unknown }[]} files - output descriptors
 * @returns {Promise<unknown | null>} parsed report or null
 */
async function readFirstJson(files) {
  for (const file of files) {
    if (typeof file.path !== 'string' || file.kind !== 'out') continue
    try {
      return JSON.parse(await readFile(file.path, 'utf8'))
    } catch {
      // try the next one
    }
  }
  return null
}

/**
 * Read every mesh object name from the live session.
 *
 * @param {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} send - trusted transport
 * @param {number} timeoutMs - reply budget
 * @param {AbortSignal} [signal] - caller cancellation signal
 * @returns {Promise<string[]>} mesh object names
 */
async function readMeshNames(send, timeoutMs, signal) {
  try {
    const reply = await send(
      `import bpy
result = {'names': [obj.name for obj in bpy.data.objects if obj.type == 'MESH']}
`,
      { responseTimeoutMs: Math.min(timeoutMs, 15000), signal },
    )
    const envelope = isRecord(reply.response) ? reply.response : {}
    if (envelope.status !== 'ok' || !isRecord(envelope.result)) return []
    const names = envelope.result.names
    return Array.isArray(names) ? names.map(String) : []
  } catch {
    return []
  }
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
