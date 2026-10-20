/**
 * Whole-window screenshots.
 *
 * Screenshots use `bpy.ops.screen.screenshot(filepath=<absolute>)`; it works
 * with `bpy.context.area == None` and needs only `bpy.context.window`.
 * Background mode has no window, so it fails loudly.
 *
 * @module lib/capture
 */

import { mkdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { isInsideTask, slugifyTaskName } from './taskDir.js'
import { TRUSTED_CLEANUP } from './trustedExec.js'

/** Capture failure with a readable reason. */
export class CaptureError extends Error {
  /**
   * @param {string} message - readable explanation
   */
  constructor(message) {
    super(message)
    this.name = 'CaptureError'
  }
}

/** @typedef {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} TrustedSend */

/**
 * Python that screenshots the current Blender window.
 *
 * @param {string} filePath - absolute `.png` path
 * @returns {string} Python snippet
 */
export function captureCode(filePath) {
  return `${TRUSTED_CLEANUP}import bpy
import os

_window = bpy.context.window
if _window is None:
    raise RuntimeError('dsh-blender capture: no active window; screenshots need an interactive Blender session')
_path = ${JSON.stringify(filePath)}
bpy.ops.screen.screenshot(filepath=_path)
_size = os.path.getsize(_path) if os.path.exists(_path) else 0
result = {'path': _path, 'bytes': int(_size)}
`
}

/**
 * Build the screenshot file name.
 *
 * @param {string} [label] - optional model-provided label
 * @returns {string} safe `...png` file name
 */
export function captureFileName(label) {
  const stem = label && label.trim() !== '' ? slugifyTaskName(label) : 'window'
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 17)
  return `${stem}-${stamp}.png`
}

/**
 * Read PNG dimensions from the IHDR chunk.
 *
 * @param {string} filePath - `.png` file
 * @returns {Promise<{ width: number, height: number }>} pixel dimensions
 */
export async function readPngSize(filePath) {
  const data = await readFile(filePath)
  if (data.length < 24 || data.toString('latin1', 1, 4) !== 'PNG') {
    throw new CaptureError('Capture file is not a PNG.')
  }
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) }
}

/**
 * Take one whole-window screenshot into `<taskDir>/captures/`.
 *
 * @param {object} options - capture options
 * @param {string} options.taskDir - task directory
 * @param {string} [options.label] - optional label
 * @param {TrustedSend} options.send - trusted transport
 * @param {number} [options.timeoutMs] - reply budget
 * @param {AbortSignal} [options.signal] - caller cancellation signal
 * @returns {Promise<{ path: string, bytes: number, width: number, height: number, tookMs: number }>} capture result
 */
export async function createCapture({ taskDir, label, send, timeoutMs, signal }) {
  const capturesDir = path.join(taskDir, 'captures')
  await mkdir(capturesDir, { recursive: true })
  const filePath = path.join(capturesDir, captureFileName(label))
  if (!isInsideTask(filePath, taskDir)) throw new CaptureError('Capture path escaped the task directory.')

  const startedAt = Date.now()
  /** @type {{ response: unknown }} */
  let reply
  try {
    reply = await send(captureCode(filePath), { responseTimeoutMs: timeoutMs, signal })
  } catch (error) {
    throw new CaptureError(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  const envelope = isRecord(reply.response) ? reply.response : {}
  if (envelope.status !== 'ok') {
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new CaptureError(`Screenshot failed: ${message}`)
  }
  let bytes
  try {
    bytes = (await stat(filePath)).size
  } catch {
    throw new CaptureError('Screenshot reported success, but the file is missing.')
  }
  if (bytes <= 0) throw new CaptureError('Screenshot file is empty; is Blender running in background mode?')
  const size = await readPngSize(filePath)
  return { path: filePath, bytes, width: size.width, height: size.height, tookMs: Date.now() - startedAt }
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
