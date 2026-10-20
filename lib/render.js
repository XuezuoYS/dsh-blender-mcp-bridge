/**
 * Controlled preview renders.
 *
 * Every render parameter comes from the model/user, is applied temporarily,
 * and is restored item by item in `finally` — including `scene.camera`,
 * `scene.render.filepath`, the engine and both sample families. The output
 * format is forced to PNG only for the duration of the call.
 *
 * @module lib/render
 */

import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { readPngSize } from './capture.js'
import { isInsideTask, slugifyTaskName } from './taskDir.js'
import { TRUSTED_CLEANUP } from './trustedExec.js'

/** Render failure with a readable reason. */
export class RenderError extends Error {
  /**
   * @param {string} message - readable explanation
   */
  constructor(message) {
    super(message)
    this.name = 'RenderError'
  }
}

/** @typedef {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} TrustedSend */

/**
 * Python that renders a preview with explicit settings and restores them.
 *
 * @default compress = true
 * @param {object} options - render settings
 * @param {string} options.filePath - absolute `.png` output path
 * @param {number} options.width - preview width
 * @param {number} options.height - preview height
 * @param {number} options.samples - preview samples
 * @param {string} [options.engine] - `BLENDER_EEVEE` or `CYCLES`
 * @param {number} [options.resolutionPercentage] - resolution scale
 * @param {string} [options.camera] - camera object name
 * @returns {string} Python snippet
 */
export function renderCode(options) {
  const pathLiteral = JSON.stringify(options.filePath)
  const engineLiteral = options.engine === undefined ? 'None' : JSON.stringify(options.engine)
  const cameraLiteral = options.camera === undefined ? 'None' : JSON.stringify(options.camera)
  const percentage = options.resolutionPercentage === undefined ? 100 : options.resolutionPercentage
  return `${TRUSTED_CLEANUP}import bpy
import os

scene = bpy.context.scene
render = scene.render
_has_eevee = hasattr(scene, 'eevee')
_has_cycles = hasattr(scene, 'cycles')
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
    bpy.ops.render.render(write_still=True)
    _size = os.path.getsize(${pathLiteral}) if os.path.exists(${pathLiteral}) else 0
    _result = {
        'path': ${pathLiteral},
        'bytes': int(_size),
        'engine': render.engine,
        'samples': int(scene.eevee.taa_render_samples) if render.engine.startswith('BLENDER_EEVEE') and _has_eevee else (int(scene.cycles.samples) if _has_cycles else 0),
        'width': int(render.resolution_x),
        'height': int(render.resolution_y),
        'resolutionPercentage': int(render.resolution_percentage),
    }
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
 * @param {number} [options.timeoutMs] - reply budget
 * @param {AbortSignal} [options.signal] - caller cancellation signal
 * @returns {Promise<{ path: string, bytes: number, width: number, height: number, engine: string, samples: number, resolutionPercentage: number, tookMs: number }>} render result
 */
export async function createRender({ taskDir, width, height, samples, engine, resolutionPercentage, camera, label, send, timeoutMs, signal }) {
  const rendersDir = path.join(taskDir, 'renders')
  await mkdir(rendersDir, { recursive: true })
  const filePath = path.join(rendersDir, renderFileName(label))
  if (!isInsideTask(filePath, taskDir)) throw new RenderError('Render path escaped the task directory.')

  const startedAt = Date.now()
  /** @type {{ response: unknown }} */
  let reply
  try {
    reply = await send(
      renderCode({ filePath, width, height, samples, engine, resolutionPercentage, camera }),
      { responseTimeoutMs: timeoutMs, signal },
    )
  } catch (error) {
    throw new RenderError(`Render failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  const envelope = isRecord(reply.response) ? reply.response : {}
  if (envelope.status !== 'ok' || !isRecord(envelope.result)) {
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new RenderError(`Render failed: ${message}`)
  }
  const inner = envelope.result
  const innerPath = typeof inner.path === 'string' ? inner.path : filePath
  if (!isInsideTask(innerPath, taskDir)) throw new RenderError('Render reported a path outside the task directory.')
  let bytes
  try {
    bytes = (await stat(innerPath)).size
  } catch {
    throw new RenderError('Render reported success, but the file is missing.')
  }
  if (bytes <= 0) throw new RenderError('Render file is empty.')
  const size = await readPngSize(innerPath)
  return {
    path: innerPath,
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
