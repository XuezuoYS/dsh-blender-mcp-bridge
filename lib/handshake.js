/**
 * Handshake and diagnostics for the live Blender session.
 *
 * The mcp add-on has no handshake protocol of its own, so this module sends a
 * small read-only Python snippet and treats the answer as the identity card:
 * Blender version, open file, dirty flag, object count, mode and render
 * settings. Failures are classified into actionable reasons.
 *
 * @module lib/handshake
 */

import { PERFORMANCE_CODE } from './pythonSnippets.js'
import { ProtocolError, sendExecute } from './protocol.js'

/** Minimum Blender version accepted by the mcp add-on (1.0.3). */
const MIN_BLENDER_MAJOR = 5
const MIN_BLENDER_MINOR = 1

/** @typedef {'port-not-listening'|'connect-timeout'|'response-timeout'|'foreign-peer'|'version-too-old'|'exec-failed'|'too-large'|'closed'|'socket-error'|'aborted'} HandshakeErrorKind */

/** Read-only Python that returns the session facts as `result`. */
export const HANDSHAKE_CODE = `import bpy
import sys

scene = bpy.context.scene

def _samples():
    engine = scene.render.engine
    if hasattr(scene, 'eevee') and engine.startswith('BLENDER_EEVEE'):
        return int(scene.eevee.taa_render_samples)
    if hasattr(scene, 'cycles'):
        return int(scene.cycles.samples)
    return 0

${PERFORMANCE_CODE}

result = {
    'blenderVersion': bpy.app.version_string,
    'versionMajorMinor': '{:d}.{:d}'.format(bpy.app.version[0], bpy.app.version[1]),
    'filePath': bpy.data.filepath or '',
    'isDirty': bool(bpy.data.is_dirty),
    'background': bool(bpy.app.background),
    'objectCount': len(bpy.data.objects),
    'activeScene': scene.name if scene is not None else '',
    'mode': bpy.context.mode,
    'undoStepLimit': int(bpy.context.preferences.edit.undo_steps),
    'pythonVersion': sys.version.split()[0],
    'pythonExecutable': sys.executable or '',
    'pythonPrefix': getattr(sys, 'prefix', ''),
    'onlineAccess': bool(bpy.app.online_access) if hasattr(bpy.app, 'online_access') else None,
    'renderSettings': {
        'engine': scene.render.engine,
        'width': int(scene.render.resolution_x),
        'height': int(scene.render.resolution_y),
        'resolutionPercentage': int(scene.render.resolution_percentage),
        'samples': _samples(),
        'fileFormat': scene.render.image_settings.file_format,
    },
    'performance': _dsh_performance(),
}
`

/** Handshake failure with an actionable reason. */
export class HandshakeError extends Error {
  /**
   * @param {HandshakeErrorKind} kind - stable reason code
   * @param {string} message - readable explanation
   * @param {string[]} [actions] - what the user can do next
   */
  constructor(kind, message, actions = []) {
    super(message)
    this.name = 'HandshakeError'
    this.kind = kind
    this.actions = actions
  }
}

/**
 * @typedef {object} RenderSettings
 * @property {string} engine
 * @property {number} width
 * @property {number} height
 * @property {number} resolutionPercentage
 * @property {number} samples
 * @property {string} fileFormat
 */

/**
 * One compute device Cycles knows about; names only, no IDs or paths.
 *
 * @typedef {object} DeviceInfo
 * @property {string} name
 * @property {string} type
 * @property {boolean} use
 */

/**
 * @typedef {object} ThreadSettings
 * @property {string} mode
 * @property {number} count
 */

/**
 * @typedef {object} ColorManagement
 * @property {string} displayDevice
 * @property {string} viewTransform
 * @property {string} look
 * @property {number} exposure
 * @property {number} gamma
 */

/**
 * @typedef {object} CyclesPerformance
 * @property {string} deviceType compute_device_type preference, '' when unknown
 * @property {number} deviceCount how many devices Blender enumerated
 * @property {DeviceInfo[]} devices first few devices, never the whole list
 * @property {boolean} devicesTruncated
 * @property {number} samples
 * @property {number} previewSamples
 * @property {boolean} adaptiveSampling
 * @property {number} adaptiveThreshold
 * @property {boolean} denoising
 * @property {string} denoiser
 */

/**
 * @typedef {object} EeveePerformance
 * @property {number} renderSamples
 * @property {number} viewportSamples
 */

/**
 * Read-only performance facts; every part may be null when unavailable.
 *
 * @typedef {object} RenderPerformance
 * @property {string} engine
 * @property {ThreadSettings} threads
 * @property {ColorManagement | null} colorManagement
 * @property {CyclesPerformance | null} cycles
 * @property {EeveePerformance | null} eevee
 */

/**
 * @typedef {object} LiveSessionInfo
 * @property {string} blenderVersion
 * @property {string} versionMajorMinor
 * @property {string} filePath
 * @property {boolean} isDirty
 * @property {boolean} background
 * @property {number} objectCount
 * @property {string} activeScene
 * @property {string} mode
 * @property {number} undoStepLimit preference limit, not current history depth
 * @property {string} pythonVersion
 * @property {string} pythonExecutable Blender's bundled Python executable
 * @property {string} pythonPrefix Blender's Python sys.prefix
 * @property {boolean | null} onlineAccess
 * @property {RenderSettings} renderSettings
 * @property {RenderPerformance} performance
 * @property {{ manualEn: string }} docs
 * @property {string} stdout
 * @property {string} stderr
 */

/**
 * Connect, identify the peer and read the live session facts.
 *
 * @default connectTimeoutMs = 5000, responseTimeoutMs = 30000, maxResponseChars = 200000
 * @param {object} options - connection options
 * @param {string} options.host - add-on host
 * @param {number} options.port - add-on port
 * @param {number} [options.connectTimeoutMs] - TCP connect budget
 * @param {number} [options.responseTimeoutMs] - reply budget
 * @param {number} [options.maxResponseChars] - reply size cap
 * @param {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} [options.send] - transport override
 * @param {AbortSignal} [options.signal] - cancels the handshake
 * @returns {Promise<LiveSessionInfo>} validated session facts
 */
export async function handshake(options) {
  /** @type {{ response: unknown, text: string, bytes: number }} */
  let reply
  try {
    if (options.send !== undefined) {
      const sent = await options.send(HANDSHAKE_CODE, {
        responseTimeoutMs: options.responseTimeoutMs,
        signal: options.signal,
      })
      reply = { response: sent.response, text: '', bytes: 0 }
    } else {
      reply = await sendExecute({
        host: options.host,
        port: options.port,
        code: HANDSHAKE_CODE,
        connectTimeoutMs: options.connectTimeoutMs,
        responseTimeoutMs: options.responseTimeoutMs,
        maxResponseChars: options.maxResponseChars,
        signal: options.signal,
      })
    }
  } catch (error) {
    throw classifyTransportError(error)
  }

  const envelope = reply.response
  if (!isRecord(envelope)) {
    throw new HandshakeError(
      'foreign-peer',
      'The port answered, but not with a Blender mcp add-on reply.',
      ['Check the port; another program may be using it, then try again.'],
    )
  }
  if (envelope.status === 'error') {
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new HandshakeError('exec-failed', `Blender rejected the handshake code: ${message}`)
  }
  const raw = envelope.result
  if (!isRecord(raw) || typeof raw.versionMajorMinor !== 'string') {
    throw new HandshakeError(
      'foreign-peer',
      'The reply did not look like a Blender mcp add-on handshake.',
      ['Confirm the Blender add-on “MCP” is enabled and the port matches.'],
    )
  }

  const majorMinor = raw.versionMajorMinor
  const parts = majorMinor.split('.')
  const major = Number(parts[0])
  const minor = Number(parts[1])
  if (!Number.isInteger(major) || !Number.isInteger(minor)) {
    throw new HandshakeError('foreign-peer', `Unreadable Blender version "${majorMinor}".`)
  }
  if (major < MIN_BLENDER_MAJOR || (major === MIN_BLENDER_MAJOR && minor < MIN_BLENDER_MINOR)) {
    throw new HandshakeError(
      'version-too-old',
      `Blender ${raw.blenderVersion ?? majorMinor} is older than the mcp add-on requires (5.1+).`,
      ['Upgrade Blender to 5.1 or newer.'],
    )
  }

  return {
    blenderVersion: stringField(raw.blenderVersion),
    versionMajorMinor: majorMinor,
    filePath: stringField(raw.filePath),
    isDirty: booleanField(raw.isDirty),
    background: booleanField(raw.background),
    objectCount: numberField(raw.objectCount),
    activeScene: stringField(raw.activeScene),
    mode: stringField(raw.mode),
    undoStepLimit: numberField(raw.undoStepLimit),
    pythonVersion: stringField(raw.pythonVersion),
    pythonExecutable: stringField(raw.pythonExecutable),
    pythonPrefix: stringField(raw.pythonPrefix),
    onlineAccess: typeof raw.onlineAccess === 'boolean' ? raw.onlineAccess : null,
    renderSettings: normalizeRenderSettings(raw.renderSettings),
    performance: normalizePerformance(raw.performance),
    docs: { manualEn: docsUrlFor(majorMinor) },
    stdout: stringField(envelope.stdout),
    stderr: stringField(envelope.stderr),
  }
}

/**
 * English manual entry for one Blender `major.minor`.
 *
 * @param {string} majorMinor - Blender version such as `5.2`
 * @returns {string} manual root URL
 */
export function docsUrlFor(majorMinor) {
  return `https://docs.blender.org/manual/en/${majorMinor}/`
}

/**
 * Map a low-level transport failure to an actionable handshake error.
 *
 * @param {unknown} error - failure from the transport
 * @returns {HandshakeError} classified error
 */
export function classifyTransportError(error) {
  if (error instanceof HandshakeError) return error
  if (error instanceof ProtocolError) {
    switch (error.code) {
      case 'connect-refused':
        return new HandshakeError(
          'port-not-listening',
          `Nothing is listening on the configured Blender port (${error.message}).`,
          [
            'Open Blender and enable the “MCP” add-on.',
            'Press “Start” in the add-on panel (it listens on 127.0.0.1:9876 by default).',
            'If Blender uses another port, set `port` in the plugin config to match.',
          ],
        )
      case 'connect-timeout':
        return new HandshakeError(
          'connect-timeout',
          error.message,
          ['Check that local TCP connections are allowed, then try again.'],
        )
      case 'aborted':
        return new HandshakeError('aborted', error.message)
      case 'response-timeout':
        return new HandshakeError(
          'response-timeout',
          error.message,
          ['Blender may be busy or frozen; wait and retry. Do not run long code in `blender_mcp_exec`.'],
        )
      case 'malformed':
        return new HandshakeError(
          'foreign-peer',
          error.message,
          ['Another program may be answering on this port; check the port setting.'],
        )
      case 'too-large':
        return new HandshakeError('too-large', error.message)
      case 'closed':
        return new HandshakeError(
          'closed',
          error.message,
          [
            'Blender may have crashed or been closed while the call was running.',
            'Reopen Blender, enable the “MCP” add-on, and press “Start” before retrying.',
          ],
        )
      case 'socket-error':
        return new HandshakeError(
          'socket-error',
          error.message,
          ['Check that the Blender process is still alive and that local TCP connections are allowed.'],
        )
      default:
        return new HandshakeError('foreign-peer', error.message)
    }
  }
  return new HandshakeError(
    'socket-error',
    error instanceof Error ? error.message : String(error),
  )
}

/**
 * @param {unknown} value - candidate render settings
 * @returns {RenderSettings} normalized settings
 */
function normalizeRenderSettings(value) {
  const record = isRecord(value) ? value : {}
  return {
    engine: stringField(record.engine),
    width: numberField(record.width),
    height: numberField(record.height),
    resolutionPercentage: numberField(record.resolutionPercentage),
    samples: numberField(record.samples),
    fileFormat: stringField(record.fileFormat),
  }
}

/** Device rows kept in the reply; a big workstation should not flood it. */
const PERFORMANCE_DEVICES_MAX = 8

/**
 * Normalize the read-only performance block.
 *
 * Missing or malformed parts become empty values instead of throwing, so an
 * older peer or a disabled Cycles add-on still yields a usable status reply.
 *
 * @param {unknown} value - candidate performance block
 * @returns {RenderPerformance} normalized facts
 */
function normalizePerformance(value) {
  const record = isRecord(value) ? value : {}
  const threads = isRecord(record.threads) ? record.threads : {}
  const color = isRecord(record.colorManagement) ? record.colorManagement : null
  const cycles = isRecord(record.cycles) ? record.cycles : null
  const eevee = isRecord(record.eevee) ? record.eevee : null
  return {
    engine: stringField(record.engine),
    threads: { mode: stringField(threads.mode), count: numberField(threads.count) },
    colorManagement:
      color === null
        ? null
        : {
            displayDevice: stringField(color.displayDevice),
            viewTransform: stringField(color.viewTransform),
            look: stringField(color.look),
            exposure: numberField(color.exposure),
            gamma: numberField(color.gamma),
          },
    cycles:
      cycles === null
        ? null
        : {
            deviceType: stringField(cycles.deviceType),
            deviceCount: numberField(cycles.deviceCount),
            devices: normalizeDevices(cycles.devices),
            devicesTruncated: booleanField(cycles.devicesTruncated),
            samples: numberField(cycles.samples),
            previewSamples: numberField(cycles.previewSamples),
            adaptiveSampling: booleanField(cycles.adaptiveSampling),
            adaptiveThreshold: numberField(cycles.adaptiveThreshold),
            denoising: booleanField(cycles.denoising),
            denoiser: stringField(cycles.denoiser),
          },
    eevee:
      eevee === null
        ? null
        : {
            renderSamples: numberField(eevee.renderSamples),
            viewportSamples: numberField(eevee.viewportSamples),
          },
  }
}

/**
 * @param {unknown} value - candidate device list
 * @returns {DeviceInfo[]} at most `PERFORMANCE_DEVICES_MAX` valid rows
 */
function normalizeDevices(value) {
  if (!Array.isArray(value)) return []
  /** @type {DeviceInfo[]} */
  const devices = []
  for (const item of value) {
    if (!isRecord(item)) continue
    devices.push({ name: stringField(item.name), type: stringField(item.type), use: item.use === true })
    if (devices.length >= PERFORMANCE_DEVICES_MAX) break
  }
  return devices
}

/**
 * @param {unknown} value - candidate error
 * @returns {value is Record<string, unknown>} whether the value is a plain object
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * @param {unknown} value - candidate string
 * @returns {string} string value or empty string
 */
function stringField(value) {
  return typeof value === 'string' ? value : ''
}

/**
 * @param {unknown} value - candidate boolean
 * @returns {boolean} boolean value or false
 */
function booleanField(value) {
  return value === true
}

/**
 * @param {unknown} value - candidate number
 * @returns {number} finite number or 0
 */
function numberField(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}
