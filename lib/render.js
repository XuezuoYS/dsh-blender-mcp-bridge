/**
 * Controlled preview renders.
 *
 * Every render parameter comes from the model/user, is applied temporarily,
 * and is restored item by item in `finally` — including `scene.camera`,
 * `scene.render.filepath`, the engine and both sample families. The output
 * format is forced to PNG only for the duration of the call.
 *
 * Each render also writes a small status file next to the PNG. The file says
 * `running` before the render starts, then `done` or `failed` after the
 * settings were restored, so a render that outlives its tool call can be
 * collected later without asking Blender anything.
 *
 * @module lib/render
 */

import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { readPngSize } from './capture.js'
import { ProtocolError } from './protocol.js'
import { readRenderStatusFile, renderJobIdFor, renderStatusPathFor } from './renderStatus.js'
import { isInsideTask, slugifyTaskName } from './taskDir.js'
import { TRUSTED_CLEANUP } from './trustedExec.js'

/** Smallest accepted per-call render budget. */
export const RENDER_TIMEOUT_MIN_MS = 1000

/** Largest accepted per-call render budget: 30 minutes. */
export const RENDER_TIMEOUT_MAX_MS = 1800000

/** How long a `background: true` call waits to confirm the render started. */
export const RENDER_START_TIMEOUT_MS = 3000

/** Reply budget used when a caller omits one; matches the config default. */
export const RENDER_TIMEOUT_FALLBACK_MS = 120000

/**
 * Render failure with a readable reason.
 *
 * `details` carries the job identity when the request may have reached Blender,
 * so the caller can point the model at `blender_mcp_render_status`.
 */
export class RenderError extends Error {
  /**
   * @param {string} message - readable explanation
   * @param {RenderJobDetails | null} [details] - job identity when known
   */
  constructor(message, details = null) {
    super(message)
    this.name = 'RenderError'
    this.details = details
  }
}

/**
 * A render whose reply did not arrive: the render may still be running.
 *
 * The caller decides whether the job already finished (status file says
 * `done`), failed (`failed`), or is still in flight (`running`).
 */
export class RenderTimeoutError extends RenderError {
  /**
   * @param {string} message - readable explanation
   * @param {RenderJobDetails} details - job identity and why the wait ended
   */
  constructor(message, details) {
    super(message, details)
    this.name = 'RenderTimeoutError'
  }
}

/**
 * @typedef {object} RenderJobDetails
 * @property {string} jobId
 * @property {string} path absolute `.png` output path
 * @property {string} statusPath absolute `.render.json` status path
 * @property {number} timeoutMs budget that ended the wait
 * @property {number} elapsedMs wall time spent in the call
 * @property {'deadline'|'cancelled'|'start-timeout'} reason why the wait ended
 * @property {'running'|'done'|'failed'|'missing'|'invalid'|'unknown'} state status file state, if readable
 * @property {boolean} background whether this was a background start
 */

/** @typedef {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} TrustedSend */

/**
 * @typedef {object} RenderCodeOptions
 * @property {string} filePath - absolute `.png` output path
 * @property {string} [statusPath] - absolute `.render.json` status path; defaults next to the PNG
 * @property {string} [jobId] - render job id; defaults to the PNG file stem
 * @property {number} width - preview width
 * @property {number} height - preview height
 * @property {number} samples - preview samples
 * @property {string} [engine] - `BLENDER_EEVEE` or `CYCLES`
 * @property {number} [resolutionPercentage] - resolution scale
 * @property {string} [camera] - camera object name
 * @property {number} [timeoutMs] - foreground budget stored in the status file; 0 for background
 * @property {boolean} [background] - whether this was a background start
 */

/**
 * Python that renders a preview with explicit settings, restores them, and
 * records the job state.
 *
 * @default resolutionPercentage = 100, timeoutMs = 0, background = false
 * @param {RenderCodeOptions} options - render settings
 * @returns {string} Python snippet
 */
export function renderCode(options) {
  const pathLiteral = JSON.stringify(options.filePath)
  const statusPath = options.statusPath ?? renderStatusPathFor(options.filePath)
  const statusLiteral = JSON.stringify(statusPath)
  const jobIdLiteral = JSON.stringify(options.jobId ?? renderJobIdFor(options.filePath))
  const engineLiteral = options.engine === undefined ? 'None' : JSON.stringify(options.engine)
  const cameraLiteral = options.camera === undefined ? 'None' : JSON.stringify(options.camera)
  const percentage = options.resolutionPercentage === undefined ? 100 : options.resolutionPercentage
  const timeoutMs =
    typeof options.timeoutMs === 'number' && Number.isFinite(options.timeoutMs) ? Math.max(0, Math.round(options.timeoutMs)) : 0
  const background = options.background === true ? 'True' : 'False'
  return `${TRUSTED_CLEANUP}import bpy
import json
import os
import time

scene = bpy.context.scene
render = scene.render
_has_eevee = hasattr(scene, 'eevee')
_has_cycles = hasattr(scene, 'cycles')
_output_path = ${pathLiteral}
_status_path = ${statusLiteral}
_job = {
    'version': 1,
    'jobId': ${jobIdLiteral},
    'path': _output_path,
    'state': 'running',
    'startedAtMs': int(time.time() * 1000),
    'finishedAtMs': None,
    'width': ${options.width},
    'height': ${options.height},
    'resolutionPercentage': ${percentage},
    'samples': ${options.samples},
    'engine': '',
    'timeoutMs': ${timeoutMs},
    'background': ${background},
    'bytes': 0,
    'error': None,
}

def _dsh_write_status(payload):
    _text = json.dumps(payload)
    _temporary = _status_path + '.tmp'
    try:
        with open(_temporary, 'w', encoding='utf-8') as _handle:
            _handle.write(_text)
        os.replace(_temporary, _status_path)
        return
    except Exception:
        try:
            os.remove(_temporary)
        except Exception:
            pass
    try:
        with open(_status_path, 'w', encoding='utf-8') as _handle:
            _handle.write(_text)
    except Exception:
        pass

_before = {
    'resolution_x': int(render.resolution_x),
    'resolution_y': int(render.resolution_y),
    'resolution_percentage': int(render.resolution_percentage),
    'filepath': render.filepath,
    'file_format': render.image_settings.file_format,
    'engine': render.engine,
    'camera': scene.camera,
    'eevee_samples': int(scene.eevee.taa_render_samples) if _has_eevee else None,
    'cycles_samples': int(scene.cycles.samples) if _has_cycles else None,
    'cycles_denoise': bool(scene.cycles.use_denoising) if _has_cycles else None,
}
_result = {}
_state = 'failed'
_error = None
try:
    render.resolution_x = ${options.width}
    render.resolution_y = ${options.height}
    render.resolution_percentage = ${percentage}
    render.filepath = ${pathLiteral}
    render.image_settings.file_format = 'PNG'
    if ${engineLiteral} is not None:
        render.engine = ${engineLiteral}
    if ${cameraLiteral} is not None:
        _camera = bpy.data.objects.get(${cameraLiteral})
        if _camera is None or _camera.type != 'CAMERA':
            raise ValueError('dsh-blender render: camera not found: ' + repr(${cameraLiteral}))
        scene.camera = _camera
    if scene.camera is None:
        raise RuntimeError('dsh-blender render: the scene has no active camera; pass camera=<name>')
    if render.engine.startswith('BLENDER_EEVEE') and _has_eevee:
        scene.eevee.taa_render_samples = ${options.samples}
    elif _has_cycles:
        scene.cycles.samples = ${options.samples}
    _job['engine'] = render.engine
    _job['samples'] = int(scene.eevee.taa_render_samples) if render.engine.startswith('BLENDER_EEVEE') and _has_eevee else (int(scene.cycles.samples) if _has_cycles else 0)
    _dsh_write_status(_job)
    bpy.ops.render.render(write_still=True)
    _size = os.path.getsize(_output_path) if os.path.exists(_output_path) else 0
    _result = {
        'path': _output_path,
        'bytes': int(_size),
        'engine': render.engine,
        'samples': int(scene.eevee.taa_render_samples) if render.engine.startswith('BLENDER_EEVEE') and _has_eevee else (int(scene.cycles.samples) if _has_cycles else 0),
        'width': int(render.resolution_x),
        'height': int(render.resolution_y),
        'resolutionPercentage': int(render.resolution_percentage),
    }
    _job['bytes'] = int(_size)
    _state = 'done'
except BaseException as _dsh_render_exc:
    _error = '{}: {}'.format(type(_dsh_render_exc).__name__, _dsh_render_exc)
    raise
finally:
    render.resolution_x = _before['resolution_x']
    render.resolution_y = _before['resolution_y']
    render.resolution_percentage = _before['resolution_percentage']
    render.filepath = _before['filepath']
    render.image_settings.file_format = _before['file_format']
    render.engine = _before['engine']
    scene.camera = _before['camera']
    if _has_eevee:
        scene.eevee.taa_render_samples = _before['eevee_samples']
    if _has_cycles:
        scene.cycles.samples = _before['cycles_samples']
        scene.cycles.use_denoising = _before['cycles_denoise']
    _job['state'] = _state
    _job['finishedAtMs'] = int(time.time() * 1000)
    _job['result'] = _result
    _job['error'] = _error
    _dsh_write_status(_job)

result = _result
`
}

/**
 * Build the render output file name.
 *
 * @param {string} [label] - optional model label
 * @returns {string} safe `.png` file name
 */
export function renderFileName(label) {
  const stem = label && label.trim() !== '' ? slugifyTaskName(label) : 'render'
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 17)
  return `${stem}-${stamp}.png`
}

/**
 * Render one preview into `<taskDir>/renders/`.
 *
 * With `background: true` the call only waits until the render reports that it
 * started (about `startTimeoutMs`), then returns; the PNG is collected later
 * with the status file. Without it, the whole render is awaited for
 * `timeoutMs`; a timeout throws `RenderTimeoutError` and the render keeps
 * running inside Blender.
 *
 * @default background = false, startTimeoutMs = 3000
 * @param {object} options - render options
 * @param {string} options.taskDir - task directory
 * @param {number} options.width - preview width
 * @param {number} options.height - preview height
 * @param {number} options.samples - preview samples
 * @param {string} [options.engine] - render engine override
 * @param {number} [options.resolutionPercentage] - resolution scale
 * @param {string} [options.camera] - camera object name
 * @param {string} [options.label] - optional label
 * @param {TrustedSend} options.send - trusted transport
 * @param {number} [options.timeoutMs] - reply budget for a foreground render
 * @param {boolean} [options.background] - return after the render started
 * @param {number} [options.startTimeoutMs] - start-confirmation budget
 * @param {AbortSignal} [options.signal] - caller cancellation signal
 * @returns {Promise<{
 *   jobId: string,
 *   path: string,
 *   statusPath: string,
 *   state: 'done',
 *   background: boolean,
 *   bytes: number,
 *   width: number,
 *   height: number,
 *   engine: string,
 *   samples: number,
 *   resolutionPercentage: number,
 *   tookMs: number,
 * }>} render result
 */
export async function createRender({
  taskDir,
  width,
  height,
  samples,
  engine,
  resolutionPercentage,
  camera,
  label,
  send,
  timeoutMs,
  background = false,
  startTimeoutMs = RENDER_START_TIMEOUT_MS,
  signal,
}) {
  const rendersDir = path.join(taskDir, 'renders')
  await mkdir(rendersDir, { recursive: true })
  const filePath = path.join(rendersDir, renderFileName(label))
  const jobId = renderJobIdFor(filePath)
  const statusPath = renderStatusPathFor(filePath)
  if (!isInsideTask(filePath, taskDir) || !isInsideTask(statusPath, taskDir)) {
    throw new RenderError('Render path escaped the task directory.')
  }

  const startedAt = Date.now()
  const effectiveTimeoutMs =
    typeof timeoutMs === 'number' && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : RENDER_TIMEOUT_FALLBACK_MS
  const startBudgetMs =
    typeof startTimeoutMs === 'number' && Number.isFinite(startTimeoutMs) && startTimeoutMs > 0 ? startTimeoutMs : RENDER_START_TIMEOUT_MS
  const budgetMs = background ? startBudgetMs : effectiveTimeoutMs
  /** @type {RenderJobDetails} */
  const baseDetails = {
    jobId,
    path: filePath,
    statusPath,
    timeoutMs: budgetMs,
    elapsedMs: 0,
    reason: background ? 'start-timeout' : 'deadline',
    state: 'missing',
    background,
  }
  /** @type {{ response: unknown }} */
  let reply
  try {
    reply = await send(
      renderCode({
        filePath,
        statusPath,
        jobId,
        width,
        height,
        samples,
        engine,
        resolutionPercentage,
        camera,
        timeoutMs: background ? 0 : effectiveTimeoutMs,
        background,
      }),
      { responseTimeoutMs: budgetMs, signal },
    )
  } catch (error) {
    if (error instanceof ProtocolError && (error.code === 'response-timeout' || error.code === 'aborted')) {
      const status = await readRenderStatusFile(statusPath)
      throw new RenderTimeoutError(
        background
          ? `The render did not confirm that it started within ${budgetMs} ms.`
          : `The render did not answer within ${budgetMs} ms.`,
        {
          ...baseDetails,
          elapsedMs: Date.now() - startedAt,
          reason: error.code === 'aborted' ? 'cancelled' : baseDetails.reason,
          state: status.kind === 'ok' ? status.record.state : status.kind === 'invalid' ? 'invalid' : 'missing',
        },
      )
    }
    throw new RenderError(`Render failed: ${error instanceof Error ? error.message : String(error)}`, {
      ...baseDetails,
      elapsedMs: Date.now() - startedAt,
      state: 'unknown',
    })
  }

  const envelope = isRecord(reply.response) ? reply.response : {}
  if (envelope.status !== 'ok' || !isRecord(envelope.result)) {
    const status = await readRenderStatusFile(statusPath)
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new RenderError(`Render failed: ${message}`, {
      ...baseDetails,
      elapsedMs: Date.now() - startedAt,
      state: status.kind === 'ok' ? status.record.state : 'failed',
    })
  }
  const inner = envelope.result
  const innerPath = typeof inner.path === 'string' ? inner.path : filePath
  if (!isInsideTask(innerPath, taskDir)) {
    throw new RenderError('Render reported a path outside the task directory.', {
      ...baseDetails,
      elapsedMs: Date.now() - startedAt,
      state: 'done',
    })
  }
  let bytes
  try {
    bytes = (await stat(innerPath)).size
  } catch {
    throw new RenderError('Render reported success, but the file is missing.', {
      ...baseDetails,
      elapsedMs: Date.now() - startedAt,
      state: 'done',
    })
  }
  if (bytes <= 0) {
    throw new RenderError('Render file is empty.', { ...baseDetails, elapsedMs: Date.now() - startedAt, state: 'done' })
  }
  let size
  try {
    size = await readPngSize(innerPath)
  } catch {
    throw new RenderError('Render reported success, but the file is not a readable PNG.', {
      ...baseDetails,
      elapsedMs: Date.now() - startedAt,
      state: 'done',
    })
  }
  return {
    jobId,
    path: innerPath,
    statusPath,
    state: 'done',
    background,
    bytes,
    width: size.width,
    height: size.height,
    engine: typeof inner.engine === 'string' ? inner.engine : '',
    samples: typeof inner.samples === 'number' ? inner.samples : samples,
    resolutionPercentage: typeof inner.resolutionPercentage === 'number' ? inner.resolutionPercentage : 100,
    tookMs: Date.now() - startedAt,
  }
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
