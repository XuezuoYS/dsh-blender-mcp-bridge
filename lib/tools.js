/**
 * The model-facing tool surface.
 *
 * The write pipeline wires handshake → task directory → snapshot → L1
 * static refusal → guarded exec → audit. `status` and `inspect` stay
 * read-only and never create files.
 *
 * @module lib/tools
 */

import { defineTool } from '@deepseek-ai/dsh-tools'
import path from 'node:path'
import { appendAudit, fileChanged, fileFingerprint } from './audit.js'
import { CaptureError, createCapture } from './capture.js'
import { getHelper, listHelpers, summarizeParams } from './helperCatalog.js'
import { HelperError, runBlenderHelper, runPythonHelper } from './helperRunner.js'
import { classifyTransportError, HandshakeError, handshake } from './handshake.js'
import { wrapWithGuard } from './guardPayload.js'
import { scanRequest } from './policy.js'
import { missingDependencies, PythonRuntimeError, resolvePython } from './pythonRuntime.js'
import { ProtocolError } from './protocol.js'
import { INSPECT_CODE, OBJECT_NAMES_CODE } from './pythonSnippets.js'
import { createRender, RenderError } from './render.js'
import { createSnapshot, SnapshotError } from './snapshot.js'
import { ensureTaskDir, listTaskDirs, resolveTaskRoot } from './taskDir.js'

/** Shown on every `exec` result: the session stays unsaved and undoable. */
export const HANDOFF_HINT =
  'The user session is still unsaved: changes are in the undo history (Ctrl+Z; the plugin pushes one step per tool call, and code can push more), ' +
  'the .blend was not written to disk. If anything looks wrong, stop, tell the user what happened, and end the turn.'

export { INSPECT_CODE, OBJECT_NAMES_CODE } from './pythonSnippets.js'

/**
 * @typedef {object} SessionContext
 * @property {string} sessionId
 * @property {string} workspaceDir
 * @property {number} turn
 */

/**
 * @typedef {object} SnapshotState
 * @property {(sessionId: string, taskDir: string) => boolean} shouldSnapshot
 * @property {(sessionId: string, taskDir: string) => void} markSnapshot
 * @property {(sessionId: string, taskDir: string) => number} nextSeq
 */

/**
 * @typedef {object} BridgeOptions
 * @property {string} host
 * @property {number} port
 * @property {number} connectTimeoutMs
 * @property {number} responseTimeoutMs
 * @property {number} captureTimeoutMs
 * @property {number} renderTimeoutMs
 * @property {number} maxResponseChars
 * @property {{ enabled: boolean, generations: number, on: 'turn'|'write', compress: boolean, timeoutMs: number }} snapshot
 * @property {{ enabled: boolean }} guard
 * @property {{ enabled: boolean, storeCode: boolean }} audit
 * @property {string} taskRoot
 * @property {'blendFile'|'workspace'} taskRootMode
 * @property {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} send
 * @property {(message: string) => void} warn
 * @property {(exec: unknown) => SessionContext} resolveSession
 * @property {SnapshotState} snapshotState
 * @property {<T>(task: () => Promise<T>) => Promise<T>} withWriteLock
 * @property {(exec: unknown) => Promise<boolean>} imageSupport
 * @property {(filePath: string, mediaType: string, name: string) => Promise<unknown | null>} attachImage
 * @property {string} helpersDir
 * @property {{ analysisPython: string, autoDetectPython: boolean }} pythonConfig
 * @property {number} helperTimeoutMs
 * @property {number} helperMaxOutputChars
 * @property {boolean} enableMaintenanceHelpers
 * @property {(sessionId: string) => string} knownFilePath
 * @property {(sessionId: string, filePath: string) => void} noteFilePath
 * @property {(sessionId: string) => boolean} timeoutWarning
 * @property {(sessionId: string) => void} noteTimeout
 * @property {(sessionId: string) => void} clearTimeoutNote
 */

/**
 * Build the tool definitions registered by `apply()`.
 *
 * @param {BridgeOptions} options - connection, storage and locking hooks
 * @returns {unknown[]} registry-ready tool definitions
 */
export function makeTools(options) {
  return [
    defineTool({
      name: 'blender_mcp_status',
      description:
        "Operates on the user's current live Blender session. " +
        'Reports whether the mcp add-on is reachable and returns version, open file, dirty state, ' +
        'object count, mode, undo steps, current render settings and the task directories next to the .blend. ' +
        'Read-only: never creates files. If not connected, the error lists what to check.',
      parameters: {},
      output: {
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            connected: { type: 'boolean', required: true },
            host: { type: 'string', required: true },
            port: { type: 'integer', required: true },
            blenderVersion: { type: 'string' },
            versionMajorMinor: { type: 'string' },
            filePath: { type: 'string' },
            isDirty: { type: 'boolean' },
            background: { type: 'boolean' },
            objectCount: { type: 'integer' },
            activeScene: { type: 'string' },
            mode: { type: 'string' },
            undoStepLimit: { type: 'integer' },
            pythonVersion: { type: 'string' },
            docs: { type: 'json' },
            renderSettings: { type: 'json' },
            taskRoot: { type: 'json' },
            taskRootReason: { type: 'string' },
            taskDirs: { type: 'array', items: { type: 'json' } },
            warnings: { type: 'array', items: { type: 'string' } },
            error: { type: 'json' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: renderStatus(value) }],
      },
      isConcurrencySafe: () => true,
      async execute(_args, exec) {
        return await readStatus(options, exec)
      },
    }),

    defineTool({
      name: 'blender_mcp_inspect',
      description:
        "Operates on the user's current live Blender session. " +
        'Returns a structured scene summary: collections, object counts by type, and per object ' +
        '(up to 200 objects) parent, collections, modifiers, mesh statistics and materials. ' +
        'Read-only: no undo step, no files written. Inspect before editing.',
      parameters: {},
      output: {
        schema: { type: 'json' },
        render: (_args, value) => [{ type: 'text', text: renderInspect(value) }],
      },
      isConcurrencySafe: () => true,
      async execute(_args, exec) {
        return await readInspect(options, exec)
      },
    }),

    defineTool({
      name: 'blender_mcp_exec',
      description:
        "Operates on the user's current live Blender session. " +
        'Runs a short Python snippet inside Blender: before the first write of a turn a snapshot is written (when enabled), ' +
        'the plugin pushes one undo step (Ctrl+Z), writes outside the task directory are refused (operator-level writes; ' +
        'C-level data methods are not intercepted), and the call is appended to the task audit log. ' +
        'Never saves the .blend; never opens another file. Keep code small and quick (under 30 s) and use `result = {...}`. ' +
        'If something fails, report it to the user instead of trying to undo it yourself.',
      parameters: {
        code: { type: 'string', required: true, description: 'Python to run in Blender main thread.' },
        task: {
          type: 'string',
          required: true,
          description: 'Task name; decides the `.dsh-blender-<task>` working directory.',
        },
        description: {
          type: 'string',
          description: 'One sentence on what this change does; stored in the audit log.',
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            status: { type: 'string', required: true },
            task: { type: 'string', required: true },
            result: { type: 'json' },
            undo: { type: 'json' },
            guard: { type: 'json' },
            snapshot: { type: 'json' },
            changes: { type: 'json' },
            blocked: { type: 'array', items: { type: 'json' } },
            suggestedPath: { type: 'string' },
            stdout: { type: 'string' },
            stderr: { type: 'string' },
            warnings: { type: 'array', items: { type: 'string' } },
            handoffHint: { type: 'string' },
            error: { type: 'json' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: renderExec(value) }],
      },
      async execute(args, exec) {
        return await options.withWriteLock(() =>
          runExec(options, /** @type {{ code: string, task: string, description?: string }} */ (args), exec),
        )
      },
    }),

    defineTool({
      name: 'blender_mcp_snapshot',
      description:
        "Operates on the user's current live Blender session. " +
        'Writes one extra snapshot of the live session into the task directory (copy=True; the open file and dirty flag ' +
        'are untouched). Use it before a risky step. Rotation keeps the configured number of generations. ' +
        'Never saves over the user .blend.',
      parameters: {
        task: { type: 'string', required: true, description: 'Task name; decides the task directory.' },
        label: { type: 'string', description: 'Optional label stored in the result and audit log.' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            status: { type: 'string', required: true },
            task: { type: 'string', required: true },
            label: { type: 'string' },
            path: { type: 'string' },
            bytes: { type: 'integer' },
            removed: { type: 'array', items: { type: 'string' } },
            warnings: { type: 'array', items: { type: 'string' } },
            handoffHint: { type: 'string' },
            error: { type: 'json' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: renderSnapshot(value) }],
      },
      async execute(args, exec) {
        return await options.withWriteLock(() =>
          runSnapshot(options, /** @type {{ task: string, label?: string }} */ (args), exec),
        )
      },
    }),

    defineTool({
      name: 'blender_mcp_capture',
      description:
        "Operates on the user's current live Blender session. " +
        'Takes a full-window screenshot (UI included) of the running Blender window and saves it under the task ' +
        'directory captures/ folder. Read-only for the scene: no undo step, no render settings changed. ' +
        'Unavailable in background mode. If the model cannot display images, only the path is returned.',
      parameters: {
        task: { type: 'string', required: true, description: 'Task name; decides the task directory.' },
        label: { type: 'string', description: 'Optional screenshot label; becomes the file name stem.' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            status: { type: 'string', required: true },
            task: { type: 'string', required: true },
            path: { type: 'string' },
            bytes: { type: 'integer' },
            width: { type: 'integer' },
            height: { type: 'integer' },
            tookMs: { type: 'integer' },
            image: { type: 'json' },
            warnings: { type: 'array', items: { type: 'string' } },
            error: { type: 'json' },
          },
        },
        render: (_args, value) => renderAttachment(value, 'Screenshot'),
      },
      async execute(args, exec) {
        return await options.withWriteLock(() =>
          runCapture(options, /** @type {{ task: string, label?: string }} */ (args), exec),
        )
      },
    }),

    defineTool({
      name: 'blender_mcp_render',
      description:
        "Operates on the user's current live Blender session. " +
        'Renders one preview PNG with the width/height/samples the user explicitly gave, then restores every render ' +
        'setting it touched (resolution, filepath, format, engine, samples, camera). ' +
        'No undo step, no .blend saved. First call after starting Blender can take ~20 s to compile shaders.',
      parameters: {
        task: { type: 'string', required: true, description: 'Task name; decides the task directory.' },
        width: { type: 'integer', required: true, description: 'Preview width; use the value the user gave.' },
        height: { type: 'integer', required: true, description: 'Preview height; use the value the user gave.' },
        samples: { type: 'integer', required: true, description: 'Preview samples; use the value the user gave.' },
        engine: {
          type: 'string',
          enum: ['BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT', 'CYCLES'],
          description: 'Optional engine override.',
        },
        resolutionPercentage: { type: 'integer', description: 'Optional resolution scale, default 100.' },
        camera: { type: 'string', description: 'Optional camera object name; the scene camera is used when omitted.' },
        label: { type: 'string', description: 'Optional render label; becomes the file name stem.' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            status: { type: 'string', required: true },
            task: { type: 'string', required: true },
            path: { type: 'string' },
            bytes: { type: 'integer' },
            width: { type: 'integer' },
            height: { type: 'integer' },
            engine: { type: 'string' },
            samples: { type: 'integer' },
            resolutionPercentage: { type: 'integer' },
            tookMs: { type: 'integer' },
            image: { type: 'json' },
            warnings: { type: 'array', items: { type: 'string' } },
            error: { type: 'json' },
          },
        },
        render: (_args, value) => renderAttachment(value, 'Preview render'),
      },
      async execute(args, exec) {
        const renderArgs = /** @type {{ task: string, width: number, height: number, samples: number, engine?: string, resolutionPercentage?: number, camera?: string, label?: string }} */ (args)
        if (!Number.isInteger(renderArgs.width) || renderArgs.width < 1 || renderArgs.width > 8192) {
          throw new Error('width must be an integer between 1 and 8192.')
        }
        if (!Number.isInteger(renderArgs.height) || renderArgs.height < 1 || renderArgs.height > 8192) {
          throw new Error('height must be an integer between 1 and 8192.')
        }
        if (!Number.isInteger(renderArgs.samples) || renderArgs.samples < 1 || renderArgs.samples > 10000) {
          throw new Error('samples must be an integer between 1 and 10000.')
        }
        if (renderArgs.resolutionPercentage !== undefined && (!Number.isInteger(renderArgs.resolutionPercentage) || renderArgs.resolutionPercentage < 1 || renderArgs.resolutionPercentage > 100)) {
          throw new Error('resolutionPercentage must be an integer between 1 and 100.')
        }
        return await options.withWriteLock(() => runRender(options, renderArgs, exec))
      },
    }),

    defineTool({
      name: 'blender_mcp_helpers',
      description:
        'Lists the analysis/validation helpers this plugin can run, with dependencies, readiness and parameter ' +
        'schemas. Read-only: no Blender connection, no files. Maintenance helpers stay hidden unless enabled in config.',
      parameters: {},
      output: {
        schema: { type: 'json' },
        render: (_args, value) => [{ type: 'text', text: renderHelpers(value) }],
      },
      isConcurrencySafe: () => true,
      async execute() {
        return await listHelperCatalog(options)
      },
    }),

    defineTool({
      name: 'blender_mcp_helper',
      description:
        "Operates on the user's current live Blender session when the helper needs it. " +
        'Runs one catalog helper with structured arguments. Python helpers run in their own process; the Blender ' +
        'runtime helper runs read-only in Blender. Inputs must be inside the workspace/.blend directory/task directory; ' +
        'outputs land inside the task directory. Never pass scripts or code, only a helper name and arguments.',
      parameters: {
        name: { type: 'string', required: true, description: 'Helper name from blender_mcp_helpers.' },
        task: { type: 'string', required: true, description: 'Task name; decides the task directory.' },
        args: {
          type: 'object',
          additionalProperties: true,
          required: true,
          description: 'Helper arguments keyed by parameter name.',
        },
        timeoutMs: { type: 'integer', description: 'Optional timeout override in milliseconds (capped at 10 minutes).' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            status: { type: 'string', required: true },
            helper: { type: 'string' },
            runtime: { type: 'string' },
            task: { type: 'string' },
            report: { type: 'json' },
            stdout: { type: 'string' },
            stderr: { type: 'string' },
            outputs: { type: 'array', items: { type: 'json' } },
            durationMs: { type: 'integer' },
            image: { type: 'json' },
            warnings: { type: 'array', items: { type: 'string' } },
            error: { type: 'json' },
          },
        },
        render: (_args, value) => renderHelperResult(value),
      },
      async execute(args, exec) {
        const helperArgs = /** @type {{ name: string, task: string, args: Record<string, unknown>, timeoutMs?: number }} */ (args)
        return await options.withWriteLock(() => runHelperTool(options, helperArgs, exec))
      },
    }),
  ]
}

/**
 * Read live session facts for `status`; connection failures become a value.
 *
 * @param {BridgeOptions} options - connection options
 * @param {unknown} exec - tool execution context
 * @returns {Promise<Record<string, unknown>>} status value
 */
async function readStatus(options, exec) {
  try {
    const info = await handshake({ ...options, signal: signalOf(exec) })
    const session = options.resolveSession(exec)
    options.noteFilePath(session.sessionId, info.filePath)
    const rootInfo = resolveTaskRoot({
      filePath: info.filePath,
      workspaceDir: session.workspaceDir,
      taskRoot: options.taskRoot,
      taskRootMode: options.taskRootMode,
    })
    const taskDirs = await listTaskDirs(rootInfo.root)
    const warnings = info.background
      ? ['Blender is running in background mode: screenshots are unavailable and undo steps do not accumulate.']
      : []
    if (options.timeoutWarning(session.sessionId)) {
      warnings.push('A previous call timed out; the scene may have changed after the reply was lost. Re-inspect before the next write.')
    }
    return {
      connected: true,
      host: options.host,
      port: options.port,
      blenderVersion: info.blenderVersion,
      versionMajorMinor: info.versionMajorMinor,
      filePath: info.filePath,
      isDirty: info.isDirty,
      background: info.background,
      objectCount: info.objectCount,
      activeScene: info.activeScene,
      mode: info.mode,
      undoStepLimit: info.undoStepLimit,
      pythonVersion: info.pythonVersion,
      docs: info.docs,
      renderSettings: info.renderSettings,
      taskRoot: rootInfo.root,
      taskRootReason: rootInfo.reason,
      taskDirs,
      warnings,
    }
  } catch (error) {
    const failure = error instanceof HandshakeError ? error : classifyTransportError(error)
    return {
      connected: false,
      host: options.host,
      port: options.port,
      taskRoot: null,
      taskDirs: [],
      warnings: [],
      error: { kind: failure.kind, message: failure.message, actions: failure.actions },
    }
  }
}

/**
 * Read the scene summary for `inspect`.
 *
 * @param {BridgeOptions} options - connection options
 * @param {unknown} exec - tool execution context
 * @returns {Promise<unknown>} inspect value
 */
async function readInspect(options, exec) {
  try {
    const reply = await options.send(INSPECT_CODE, { signal: signalOf(exec) })
    const envelope = readReplyEnvelope(reply.response)
    if (envelope.status !== 'ok') {
      return { status: 'error', error: { message: envelope.message, traceback: envelope.traceback } }
    }
    return envelope.result
  } catch (error) {
    const failure = classifyTransportError(error)
    options.warn(`inspect failed: ${failure.message}`)
    return { status: 'error', error: { kind: failure.kind, message: failure.message } }
  }
}

/**
 * Read up to 500 object names, best-effort.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {AbortSignal} [signal] - caller cancellation signal
 * @returns {Promise<{ names: string[], total: number } | null>} names or null
 */
async function readObjectNames(options, signal) {
  try {
    const reply = await options.send(OBJECT_NAMES_CODE, {
      responseTimeoutMs: Math.min(options.responseTimeoutMs, 15000),
      signal,
    })
    const envelope = readReplyEnvelope(reply.response)
    if (envelope.status !== 'ok' || !isRecord(envelope.result)) return null
    const names = Array.isArray(envelope.result.names) ? envelope.result.names.map(String) : []
    const total = typeof envelope.result.total === 'number' ? envelope.result.total : names.length
    return { names, total }
  } catch (error) {
    options.warn(`object-name query failed: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * @param {{ names: string[], total: number }} before - before the write
 * @param {{ names: string[], total: number }} after - after the write
 * @returns {{ objectsAdded: string[], objectsRemoved: string[], objectCountBefore: number, objectCountAfter: number, delta: number }} bounded diff
 */
/**
 * Read the caller's abort signal from a tool execution context.
 *
 * @param {unknown} exec - tool execution context
 * @returns {AbortSignal | undefined} signal when the host provided one
 */
function signalOf(exec) {
  const record = typeof exec === 'object' && exec !== null ? /** @type {Record<string, unknown>} */ (exec) : {}
  return record.signal instanceof AbortSignal ? record.signal : undefined
}

/**
 * Classify a setup failure (handshake, task directory, snapshot) without
 * pretending it came from the socket.
 *
 * @param {unknown} error - failure from handshake or the file system
 * @returns {{ kind: string, message: string, actions?: string[] }} classified failure
 */
function classifySetupError(error) {
  if (error instanceof HandshakeError) return error
  if (error instanceof ProtocolError) {
    const failure = classifyTransportError(error)
    return { kind: failure.kind, message: failure.message, actions: failure.actions }
  }
  return {
    kind: 'filesystem-error',
    message: `Could not prepare the task directory: ${error instanceof Error ? error.message : String(error)}`,
  }
}

/**
 * Summarize helper arguments for the audit trail without keeping secrets.
 *
 * @param {Record<string, unknown>} args - model-supplied helper arguments
 * @returns {Record<string, string>} bounded, redacted summary
 */
function summarizeHelperArgs(args) {
  /** @type {Record<string, string>} */
  const summary = {}
  for (const [key, value] of Object.entries(args)) {
    if (/secret|token|password|passwd|api[-_]?key/i.test(key)) {
      summary[key] = '[redacted]'
      continue
    }
    const text = Array.isArray(value)
      ? value.map(String).join(', ')
      : typeof value === 'string'
        ? value
        : (JSON.stringify(value) ?? String(value))
    summary[key] = text.length > 240 ? `${text.slice(0, 240)}...` : text
  }
  return summary
}

/**
 * @param {{ names: string[], total: number }} before - before the write
 * @param {{ names: string[], total: number }} after - after the write
 * @returns {{ objectsAdded: string[], objectsRemoved: string[], objectCountBefore: number, objectCountAfter: number, delta: number }} bounded diff
 */
function diffObjectNames(before, after) {
  const beforeSet = new Set(before.names)
  const afterSet = new Set(after.names)
  return {
    objectsAdded: after.names.filter((name) => !beforeSet.has(name)).slice(0, 50),
    objectsRemoved: before.names.filter((name) => !afterSet.has(name)).slice(0, 50),
    objectCountBefore: before.total,
    objectCountAfter: after.total,
    delta: after.total - before.total,
  }
}

/**
 * Run the full write pipeline for `exec`.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {{ code: string, task: string, description?: string }} args - tool arguments
 * @param {unknown} exec - tool execution context
 * @returns {Promise<Record<string, unknown>>} exec value
 */
async function runExec(options, args, exec) {
  const task = args.task.trim() || 'task'
  const startedAt = Date.now()
  const session = options.resolveSession(exec)
  const signal = signalOf(exec)

  let info
  try {
    info = await handshake({ ...options, signal })
    options.noteFilePath(session.sessionId, info.filePath)
  } catch (error) {
    const failure = error instanceof HandshakeError ? error : classifyTransportError(error)
    return {
      status: 'error',
      task,
      error: { kind: failure.kind, message: failure.message },
      handoffHint: HANDOFF_HINT,
    }
  }

  const rootInfo = resolveTaskRoot({
    filePath: info.filePath,
    workspaceDir: session.workspaceDir,
    taskRoot: options.taskRoot,
    taskRootMode: options.taskRootMode,
  })
  /** @type {Awaited<ReturnType<typeof ensureTaskDir>>} */
  let taskDirInfo
  try {
    taskDirInfo = await ensureTaskDir({ root: rootInfo.root, task, sessionId: session.sessionId })
  } catch (error) {
    return { status: 'error', task, error: classifySetupError(error), handoffHint: HANDOFF_HINT }
  }

  const policy = scanRequest(args.code, taskDirInfo.dir)
  if (policy.blocks.length > 0) {
    /** @type {string[]} */
    const warnings = [...policy.warnings]
    if (options.audit.enabled) {
      try {
        await appendAudit({
          taskDir: taskDirInfo.dir,
          code: args.code,
          storeCode: options.audit.storeCode,
          entry: {
            tool: 'blender_mcp_exec',
            sessionId: session.sessionId,
            turn: session.turn,
            task,
            description: args.description ?? '',
            status: 'blocked',
            blocked: policy.blocks,
            snapshot: '',
            undo: null,
            fileChanged: false,
            durationMs: Date.now() - startedAt,
          },
        })
      } catch (error) {
        warnings.push(`Audit log write failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    return {
      status: 'blocked',
      task,
      blocked: policy.blocks,
      suggestedPath: taskDirInfo.dir,
      warnings,
      handoffHint: HANDOFF_HINT,
    }
  }

  const staleTimeout = options.timeoutWarning(session.sessionId)
  const beforeNames = await readObjectNames(options, signal)

  /** @type {{ path: string, bytes: number, tookMs: number, removed: string[] } | null} */
  let snapshot = null
  if (options.snapshot.enabled && options.snapshotState.shouldSnapshot(session.sessionId, taskDirInfo.dir)) {
    try {
      snapshot = await createSnapshot({
        taskDir: taskDirInfo.dir,
        turn: session.turn,
        seq: options.snapshotState.nextSeq(session.sessionId, taskDirInfo.dir),
        send: options.send,
        compress: options.snapshot.compress,
        generations: options.snapshot.generations,
        timeoutMs: options.snapshot.timeoutMs,
        signal,
      })
      options.snapshotState.markSnapshot(session.sessionId, taskDirInfo.dir)
    } catch (error) {
      const message = error instanceof SnapshotError ? error.message : String(error)
      options.warn(message)
      /** @type {string[]} */
      const warnings = ['No snapshot, no write: the call was refused before touching the scene.']
      if (options.audit.enabled) {
        try {
          await appendAudit({
            taskDir: taskDirInfo.dir,
            code: args.code,
            storeCode: options.audit.storeCode,
            entry: {
              tool: 'blender_mcp_exec',
              sessionId: session.sessionId,
              turn: session.turn,
              task,
              description: args.description ?? '',
              status: 'refused',
              blocked: [],
              snapshot: '',
              undo: null,
              fileChanged: false,
              durationMs: Date.now() - startedAt,
              error: { kind: 'snapshot-failed', message },
            },
          })
        } catch (auditError) {
          warnings.push(`Audit log write failed: ${auditError instanceof Error ? auditError.message : String(auditError)}`)
        }
      }
      return {
        status: 'refused',
        task,
        error: { kind: 'snapshot-failed', message },
        handoffHint: HANDOFF_HINT,
        warnings,
      }
    }
  }

  const before = info.filePath === '' ? null : await fileFingerprint(info.filePath)
  const wrapped = wrapWithGuard(args.code, {
    taskRoot: taskDirInfo.dir,
    undoMessage: `dsh-blender: ${task}`,
    guardEnabled: options.guard.enabled,
  })

  /** @type {Record<string, unknown>} */
  let value
  try {
    const reply = await options.send(wrapped, { responseTimeoutMs: options.responseTimeoutMs, signal })
    const envelope = readReplyEnvelope(reply.response)
    if (envelope.status !== 'ok' || !isRecord(envelope.result)) {
      value = {
        status: 'error',
        task,
        error: { message: envelope.message, traceback: envelope.traceback },
        handoffHint: HANDOFF_HINT,
      }
    } else {
      value = mapExecEnvelope(task, envelope)
    }
  } catch (error) {
    if (error instanceof ProtocolError && error.code === 'response-timeout') {
      value = {
        status: 'timeout',
        task,
        warnings: [
          'The reply timed out. The code may still be running inside Blender; check the scene before the next write.',
        ],
        handoffHint: HANDOFF_HINT,
      }
    } else {
      const failure = classifyTransportError(error)
      value = {
        status: 'error',
        task,
        error: { kind: failure.kind, message: failure.message },
        handoffHint: HANDOFF_HINT,
      }
    }
  }

  if (value.status === 'timeout') options.noteTimeout(session.sessionId)
  else options.clearTimeoutNote(session.sessionId)
  if (value.status === 'ok') {
    const afterNames = await readObjectNames(options, signal)
    if (beforeNames !== null && afterNames !== null) value.changes = diffObjectNames(beforeNames, afterNames)
  }
  if (staleTimeout) {
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      'The previous call timed out; the scene may have changed after the reply was lost.',
    ]
  }

  const after = info.filePath === '' ? null : await fileFingerprint(info.filePath)
  const changed = before !== null && after !== null && fileChanged(before, after)
  if (changed) {
    const warnings = Array.isArray(value.warnings) ? value.warnings : []
    value.warnings = [
      ...warnings,
      'The user .blend changed on disk during this call. Do not save or repair anything: tell the user immediately and end the turn.',
    ]
    value.incident = { fileChanged: true }
  }
  if (snapshot !== null) value.snapshot = snapshot

  const guard = isRecord(value.guard) ? value.guard : null
  if (guard !== null && guard.verified === false) {
    value.status = 'error'
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      'Guard self-check failed: the hooks were not intact at the end of the call.',
    ]
  }
  if (guard !== null && guard.opsIntact === false) {
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      'The bpy.ops proxy could not be verified; operator blocking may have been inactive.',
    ]
  }
  if (guard !== null && Array.isArray(guard.blocked) && guard.blocked.length > 0) {
    value.status = 'blocked'
    value.suggestedPath = taskDirInfo.dir
  }
  if (guard !== null && typeof guard.verifyError === 'string') {
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      `Guard self-check threw: ${guard.verifyError}`,
    ]
  }
  if (guard !== null && typeof guard.installError === 'string') {
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      `Guard install failed; this call ran without full protection: ${guard.installError}`,
    ]
    if (value.status === 'ok') value.status = 'error'
  }
  if (guard !== null && Array.isArray(guard.preferencesChanged) && guard.preferencesChanged.length > 0) {
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      `Preferences changed by this call were restored: ${guard.preferencesChanged.join(', ')}.`,
    ]
  }
  const undo = isRecord(value.undo) ? value.undo : null
  if (undo !== null && undo.pushed !== true) {
    value.warnings = [
      ...(Array.isArray(value.warnings) ? value.warnings : []),
      'The undo step was not pushed; Ctrl+Z may not revert this call.',
      ...(typeof undo.error === 'string' ? [`Undo error: ${undo.error}`] : []),
    ]
    if (value.status === 'ok') value.status = 'error'
  }

  if (options.audit.enabled) {
    try {
      await appendAudit({
        taskDir: taskDirInfo.dir,
        code: args.code,
        storeCode: options.audit.storeCode,
        entry: {
          tool: 'blender_mcp_exec',
          sessionId: session.sessionId,
          turn: session.turn,
          task,
          description: args.description ?? '',
          status: value.status,
          blocked: guard && Array.isArray(guard.blocked) ? guard.blocked : [],
          snapshot: snapshot === null ? '' : snapshot.path,
          undo: value.undo ?? null,
          guard,
          fileChanged: changed,
          durationMs: Date.now() - startedAt,
        },
      })
    } catch (error) {
      const warnings = Array.isArray(value.warnings) ? value.warnings : []
      value.warnings = [...warnings, `Audit log write failed: ${error instanceof Error ? error.message : String(error)}`]
    }
  }

  return value
}

/**
 * Run the explicit snapshot tool.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {{ task: string, label?: string }} args - tool arguments
 * @param {unknown} exec - tool execution context
 * @returns {Promise<Record<string, unknown>>} snapshot value
 */
async function runSnapshot(options, args, exec) {
  const task = args.task.trim() || 'task'
  const session = options.resolveSession(exec)
  const signal = signalOf(exec)
  let info
  try {
    info = await handshake({ ...options, signal })
    options.noteFilePath(session.sessionId, info.filePath)
  } catch (error) {
    const failure = error instanceof HandshakeError ? error : classifyTransportError(error)
    return {
      status: 'error',
      task,
      error: { kind: failure.kind, message: failure.message },
      handoffHint: HANDOFF_HINT,
    }
  }
  const rootInfo = resolveTaskRoot({
    filePath: info.filePath,
    workspaceDir: session.workspaceDir,
    taskRoot: options.taskRoot,
    taskRootMode: options.taskRootMode,
  })
  /** @type {Awaited<ReturnType<typeof ensureTaskDir>>} */
  let taskDirInfo
  try {
    taskDirInfo = await ensureTaskDir({ root: rootInfo.root, task, sessionId: session.sessionId })
  } catch (error) {
    return { status: 'error', task, error: classifySetupError(error), handoffHint: HANDOFF_HINT }
  }
  const before = info.filePath === '' ? null : await fileFingerprint(info.filePath)
  try {
    const result = await createSnapshot({
      taskDir: taskDirInfo.dir,
      turn: session.turn,
      seq: options.snapshotState.nextSeq(session.sessionId, taskDirInfo.dir),
      send: options.send,
      compress: options.snapshot.compress,
      generations: options.snapshot.generations,
      timeoutMs: options.snapshot.timeoutMs,
      signal,
    })
    const after = info.filePath === '' ? null : await fileFingerprint(info.filePath)
    const changed = before !== null && after !== null && fileChanged(before, after)
    /** @type {string[]} */
    const warnings = []
    if (changed) {
      warnings.push('The user .blend changed on disk during this snapshot. Do not save or repair anything: tell the user immediately and end the turn.')
    }
    if (options.audit.enabled) {
      try {
        await appendAudit({
          taskDir: taskDirInfo.dir,
          entry: {
            tool: 'blender_mcp_snapshot',
            sessionId: session.sessionId,
            turn: session.turn,
            task,
            description: args.label ?? 'explicit snapshot',
            status: 'ok',
            snapshot: result.path,
            undo: null,
            fileChanged: changed,
            durationMs: result.tookMs,
          },
        })
      } catch (error) {
        warnings.push(`Audit log write failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    return {
      status: 'ok',
      task,
      ...(args.label === undefined ? {} : { label: args.label }),
      path: result.path,
      bytes: result.bytes,
      removed: result.removed,
      handoffHint: HANDOFF_HINT,
      warnings,
      ...(changed ? { incident: { fileChanged: true } } : {}),
    }
  } catch (error) {
    const message = error instanceof SnapshotError ? error.message : String(error)
    return { status: 'error', task, error: { kind: 'snapshot-failed', message }, handoffHint: HANDOFF_HINT }
  }
}

/**
 * Handshake, then resolve the task directory for a write tool.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {unknown} exec - tool execution context
 * @param {string} task - task name
 * @returns {Promise<{ info: import('./handshake.js').LiveSessionInfo, session: SessionContext, taskDir: string }>} prepared context
 */
async function prepareTask(options, exec, task) {
  const info = await handshake({ ...options, signal: signalOf(exec) })
  const session = options.resolveSession(exec)
  options.noteFilePath(session.sessionId, info.filePath)
  const rootInfo = resolveTaskRoot({
    filePath: info.filePath,
    workspaceDir: session.workspaceDir,
    taskRoot: options.taskRoot,
    taskRootMode: options.taskRootMode,
  })
  const taskDirInfo = await ensureTaskDir({ root: rootInfo.root, task, sessionId: session.sessionId })
  return { info, session, taskDir: taskDirInfo.dir }
}

/**
 * Attach one image when the model can display it.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {unknown} exec - tool execution context
 * @param {string} filePath - image path
 * @param {string} mediaType - image media type
 * @param {string} name - display name
 * @returns {Promise<unknown | null>} attachment reference or null
 */
async function maybeAttach(options, exec, filePath, mediaType, name) {
  try {
    if (!(await options.imageSupport(exec))) return null
    return await options.attachImage(filePath, mediaType, name)
  } catch (error) {
    options.warn(`image attach failed: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Run the screenshot tool.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {{ task: string, label?: string }} args - tool arguments
 * @param {unknown} exec - tool execution context
 * @returns {Promise<Record<string, unknown>>} capture value
 */
async function runCapture(options, args, exec) {
  const task = args.task.trim() || 'task'
  /** @type {{ info: import('./handshake.js').LiveSessionInfo, session: SessionContext, taskDir: string }} */
  let prepared
  try {
    prepared = await prepareTask(options, exec, task)
  } catch (error) {
    const failure = classifySetupError(error)
    return { status: 'error', task, error: { kind: failure.kind, message: failure.message } }
  }
  if (prepared.info.background) {
    return {
      status: 'error',
      task,
      error: {
        kind: 'background-mode',
        message: 'Screenshots need an interactive Blender window; background mode has no window.',
      },
    }
  }
  try {
    const capture = await createCapture({
      taskDir: prepared.taskDir,
      label: args.label,
      send: options.send,
      timeoutMs: options.captureTimeoutMs,
      signal: signalOf(exec),
    })
    const image = await maybeAttach(options, exec, capture.path, 'image/png', path.basename(capture.path))
    if (options.audit.enabled) {
      await appendAudit({
        taskDir: prepared.taskDir,
        entry: {
          tool: 'blender_mcp_capture',
          sessionId: prepared.session.sessionId,
          turn: prepared.session.turn,
          task,
          description: args.label ?? 'window screenshot',
          status: 'ok',
          output: capture.path,
          undo: null,
          snapshot: '',
          fileChanged: false,
          durationMs: capture.tookMs,
        },
      }).catch((error) => options.warn(`audit failed: ${error instanceof Error ? error.message : String(error)}`))
    }
    return {
      status: 'ok',
      task,
      ...capture,
      ...(image === null ? {} : { image }),
      warnings: image === null ? ['Image blocks are unavailable for this model; use the saved path.'] : [],
    }
  } catch (error) {
    const message = error instanceof CaptureError ? error.message : String(error)
    options.warn(message)
    return { status: 'error', task, error: { kind: 'capture-failed', message } }
  }
}

/**
 * Run the preview render tool.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {{ task: string, width: number, height: number, samples: number, engine?: string, resolutionPercentage?: number, camera?: string, label?: string }} args - tool arguments
 * @param {unknown} exec - tool execution context
 * @returns {Promise<Record<string, unknown>>} render value
 */
async function runRender(options, args, exec) {
  const task = args.task.trim() || 'task'
  /** @type {{ info: import('./handshake.js').LiveSessionInfo, session: SessionContext, taskDir: string }} */
  let prepared
  try {
    prepared = await prepareTask(options, exec, task)
  } catch (error) {
    const failure = classifySetupError(error)
    return { status: 'error', task, error: { kind: failure.kind, message: failure.message } }
  }
  try {
    const rendered = await createRender({
      taskDir: prepared.taskDir,
      width: args.width,
      height: args.height,
      samples: args.samples,
      engine: args.engine,
      resolutionPercentage: args.resolutionPercentage,
      camera: args.camera,
      label: args.label,
      send: options.send,
      timeoutMs: options.renderTimeoutMs,
      signal: signalOf(exec),
    })
    const image = await maybeAttach(options, exec, rendered.path, 'image/png', path.basename(rendered.path))
    if (options.audit.enabled) {
      await appendAudit({
        taskDir: prepared.taskDir,
        entry: {
          tool: 'blender_mcp_render',
          sessionId: prepared.session.sessionId,
          turn: prepared.session.turn,
          task,
          description: args.label ?? 'preview render',
          status: 'ok',
          output: rendered.path,
          undo: null,
          snapshot: '',
          fileChanged: false,
          durationMs: rendered.tookMs,
        },
      }).catch((error) => options.warn(`audit failed: ${error instanceof Error ? error.message : String(error)}`))
    }
    return {
      status: 'ok',
      task,
      ...rendered,
      ...(image === null ? {} : { image }),
      warnings: image === null ? ['Image blocks are unavailable for this model; use the saved path.'] : [],
    }
  } catch (error) {
    const message = error instanceof RenderError ? error.message : String(error)
    options.warn(message)
    return { status: 'error', task, error: { kind: 'render-failed', message } }
  }
}

/**
 * List the helper catalog with interpreter and dependency status.
 *
 * @param {BridgeOptions} options - bridge options
 * @returns {Promise<Record<string, unknown>>} catalog value
 */
async function listHelperCatalog(options) {
  const helpers = listHelpers(options.enableMaintenanceHelpers)
  const pythonHelpers = helpers.filter((helper) => helper.runtime === 'python')
  /** @type {{ version: string, source: string, command: string, args: string[] } | null} */
  let python = null
  /** @type {{ kind: string, message: string } | null} */
  let pythonError = null
  const missingPackages = new Set()
  if (pythonHelpers.length > 0) {
    try {
      const runtime = await resolvePython(options.pythonConfig)
      python = { version: runtime.version, source: runtime.source, command: runtime.command, args: runtime.args }
      const dependencies = [...new Set(pythonHelpers.flatMap((helper) => helper.dependencies))]
      for (const missing of await missingDependencies(runtime, dependencies)) missingPackages.add(missing)
    } catch (error) {
      pythonError =
        error instanceof PythonRuntimeError
          ? { kind: error.kind, message: error.message }
          : { kind: 'python-error', message: error instanceof Error ? error.message : String(error) }
    }
  }
  return {
    python,
    ...(pythonError === null ? {} : { pythonError }),
    helpers: helpers.map((helper) => {
      const missing = helper.dependencies.filter((dependency) => missingPackages.has(dependency))
      return {
        name: helper.name,
        runtime: helper.runtime,
        maintenance: helper.maintenance,
        dependencies: helper.dependencies,
        ready: helper.runtime === 'blender' ? true : python !== null && missing.length === 0,
        missing,
        params: summarizeParams(helper),
      }
    }),
  }
}

/**
 * Run one catalog helper with audit and optional image attachment.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {{ name: string, task: string, args: Record<string, unknown>, timeoutMs?: number }} args - tool arguments
 * @param {unknown} exec - tool execution context
 * @returns {Promise<Record<string, unknown>>} helper result
 */
async function runHelperTool(options, args, exec) {
  const task = args.task.trim() || 'task'
  const helper = getHelper(args.name)
  if (helper === undefined) {
    return {
      status: 'error',
      task,
      error: { kind: 'unknown-helper', message: `Unknown helper "${args.name}". Call blender_mcp_helpers first.` },
    }
  }
  if (helper.maintenance && !options.enableMaintenanceHelpers) {
    return {
      status: 'error',
      task,
      error: {
        kind: 'maintenance-disabled',
        message: 'Maintenance helpers are disabled; set helper.enableMaintenanceHelpers=true to use them.',
      },
    }
  }

  /** @type {{ info: import('./handshake.js').LiveSessionInfo | null, session: SessionContext, taskDir: string }} */
  let prepared
  try {
    if (helper.runtime === 'blender') {
      prepared = await prepareTask(options, exec, task)
    } else {
      // Python helpers run in their own process and do not need Blender.
      const session = options.resolveSession(exec)
      const knownFilePath = options.knownFilePath(session.sessionId)
      const rootInfo = resolveTaskRoot({
        filePath: knownFilePath,
        workspaceDir: session.workspaceDir,
        taskRoot: options.taskRoot,
        taskRootMode: options.taskRootMode,
      })
      const taskDirInfo = await ensureTaskDir({ root: rootInfo.root, task, sessionId: session.sessionId })
      prepared = { info: null, session, taskDir: taskDirInfo.dir }
    }
  } catch (error) {
    const failure = classifySetupError(error)
    return { status: 'error', task, error: { kind: failure.kind, message: failure.message } }
  }
  const cachedFilePath = options.knownFilePath(prepared.session.sessionId)
  const roots = {
    workspaceDir: prepared.session.workspaceDir,
    blendDir:
      prepared.info !== null && prepared.info.filePath !== ''
        ? path.dirname(prepared.info.filePath)
        : cachedFilePath === ''
          ? ''
          : path.dirname(cachedFilePath),
    taskDir: prepared.taskDir,
  }
  const timeoutMs = Math.min(args.timeoutMs ?? options.helperTimeoutMs, 600000)

  try {
    const result =
      helper.runtime === 'blender'
        ? await runBlenderHelper({ helper, args: args.args, roots, helpersDir: options.helpersDir, send: options.send, timeoutMs, signal: signalOf(exec) })
        : await runPythonHelper({
            helper,
            args: args.args,
            roots,
            helpersDir: options.helpersDir,
            pythonConfig: options.pythonConfig,
            timeoutMs,
            maxOutputChars: options.helperMaxOutputChars,
            signal: signalOf(exec),
          })
    const image = await firstImageAttachment(options, exec, result.outputs)
    /** @type {string[]} */
    const warnings = Array.isArray(result.warnings) ? [...result.warnings] : []
    if (roots.blendDir !== '' && path.dirname(roots.blendDir) === roots.blendDir) {
      warnings.push('The .blend directory is a drive root; every input path on that drive is allowed.')
    }
    if (helper.maintenance) {
      warnings.push('Maintenance helper: it may rewrite the skill library, not just the scene.')
    }
    const hasImageOutput =
      Array.isArray(result.outputs) &&
      result.outputs.some(
        (output) => isRecord(output) && typeof output.path === 'string' && /\.(png|jpe?g|webp|gif)$/i.test(output.path),
      )
    if (image === null && hasImageOutput) {
      warnings.push('Image blocks are unavailable for this model; use the saved path.')
    }
    if (options.audit.enabled) {
      await appendAudit({
        taskDir: prepared.taskDir,
        entry: {
          tool: 'blender_mcp_helper',
          sessionId: prepared.session.sessionId,
          turn: prepared.session.turn,
          task,
          description: `helper: ${helper.name}`,
          args: summarizeHelperArgs(args.args),
          status: result.status,
          outputs: result.outputs,
          undo: null,
          snapshot: '',
          fileChanged: false,
          durationMs: result.durationMs,
        },
      }).catch((error) => options.warn(`audit failed: ${error instanceof Error ? error.message : String(error)}`))
    }
    return {
      ...result,
      task,
      ...(image === null ? {} : { image }),
      warnings,
    }
  } catch (error) {
    const kind = error instanceof HelperError ? error.kind : 'helper-failed'
    const message = error instanceof Error ? error.message : String(error)
    options.warn(message)
    return { status: 'error', task, helper: helper.name, error: { kind, message } }
  }
}

/**
 * Attach the first image output, when the model can display images.
 *
 * @param {BridgeOptions} options - bridge options
 * @param {unknown} exec - tool execution context
 * @param {unknown} outputs - helper output descriptors
 * @returns {Promise<unknown | null>} attachment reference or null
 */
async function firstImageAttachment(options, exec, outputs) {
  if (!Array.isArray(outputs)) return null
  for (const output of outputs) {
    if (!isRecord(output) || typeof output.path !== 'string' || output.missing === true) continue
    const match = /\.(png|jpe?g|webp|gif)$/i.exec(output.path)
    if (match === null) continue
    const extension = match[1].toLowerCase()
    const mediaType = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : extension === 'gif' ? 'image/gif' : 'image/jpeg'
    return await maybeAttach(options, exec, output.path, mediaType, path.basename(output.path))
  }
  return null
}

/**
 * @param {unknown} value - catalog value
 * @returns {string} model-facing summary
 */
function renderHelpers(value) {
  if (!isRecord(value) || !Array.isArray(value.helpers)) return JSON.stringify(value, null, 2)
  const lines = [`Helpers: ${value.helpers.length}`]
  if (isRecord(value.python)) {
    const command = typeof value.python.command === 'string' ? value.python.command : ''
    const args = Array.isArray(value.python.args) ? value.python.args.map(String).join(' ') : ''
    lines.push(`Python: ${String(value.python.version)} (${String(value.python.source)}${command === '' ? '' : `; ${command} ${args}`.trimEnd()})`)
  }
  if (isRecord(value.pythonError)) lines.push(`Python error: ${String(value.pythonError.message)}`)
  for (const helper of value.helpers) {
    if (!isRecord(helper)) continue
    const params = Array.isArray(helper.params) ? helper.params.map((param) => (isRecord(param) ? String(param.name) : '?')).join(', ') : ''
    lines.push(
      `- ${String(helper.name)} [${String(helper.runtime)}]${helper.maintenance === true ? ' (maintenance)' : ''}` +
        ` ready=${String(helper.ready)}${Array.isArray(helper.missing) && helper.missing.length > 0 ? ` missing=${helper.missing.join(',')}` : ''}` +
        ` params: ${params}`,
    )
  }
  return lines.join('\n')
}

/**
 * @param {unknown} value - helper result
 * @returns {import('@deepseek-ai/dsh-tools').ToolContentBlock[]} content blocks
 */
function renderHelperResult(value) {
  if (!isRecord(value)) return [{ type: 'text', text: 'Helper: no result.' }]
  if (value.status !== 'ok') {
    const error = isRecord(value.error) ? value.error : {}
    const lines = [`Helper failed: ${typeof error.message === 'string' ? error.message : 'unknown error'}`]
    const stderr = typeof value.stderr === 'string' ? value.stderr.trim() : ''
    if (stderr !== '') lines.push(`stderr: ${stderr.split('\n').slice(-8).join('\n')}`)
    const stdout = typeof value.stdout === 'string' ? value.stdout.trim() : ''
    if (stdout !== '') lines.push(`stdout: ${stdout.split('\n').slice(-8).join('\n')}`)
    return [{ type: 'text', text: lines.join('\n') }]
  }
  const outputs = Array.isArray(value.outputs)
    ? value.outputs
        .filter(isRecord)
        .map((output) => `${String(output.path)}${output.missing === true ? ' (missing)' : ''}`)
        .join(', ')
    : ''
  /** @type {import('@deepseek-ai/dsh-tools').ToolContentBlock[]} */
  const blocks = [
    {
      type: 'text',
      text: `Helper ${String(value.helper)} (${String(value.runtime)}) finished in ${String(value.durationMs)} ms. Outputs: ${outputs}`,
    },
  ]
  if (value.report !== undefined && value.report !== null) blocks.push({ type: 'text', text: JSON.stringify(value.report) })
  if (value.image !== undefined && value.image !== null) blocks.push({ type: 'image', attachment: value.image })
  const stdout = typeof value.stdout === 'string' ? value.stdout.trim() : ''
  if (stdout !== '') blocks.push({ type: 'text', text: `stdout: ${stdout.split('\n').slice(-8).join('\n')}` })
  const stderr = typeof value.stderr === 'string' ? value.stderr.trim() : ''
  if (stderr !== '') blocks.push({ type: 'text', text: `stderr: ${stderr}` })
  const warnings = Array.isArray(value.warnings) ? value.warnings : []
  if (warnings.length > 0) blocks.push({ type: 'text', text: warnings.map((warning) => `Warning: ${String(warning)}`).join('\n') })
  return blocks
}

/**
 * Render an image-bearing tool value as text plus an optional image block.
 *
 * @param {unknown} value - tool value
 * @param {string} title - result title
 * @returns {import('@deepseek-ai/dsh-tools').ToolContentBlock[]} content blocks
 */
function renderAttachment(value, title) {
  if (!isRecord(value)) return [{ type: 'text', text: `${title}: no result.` }]
  if (value.status !== 'ok') {
    const error = isRecord(value.error) ? value.error : {}
    return [{ type: 'text', text: `${title} failed: ${typeof error.message === 'string' ? error.message : 'unknown error'}` }]
  }
  const blocks = /** @type {import('@deepseek-ai/dsh-tools').ToolContentBlock[]} */ ([
    {
      type: 'text',
      text: `${title}: ${String(value.path)} (${String(value.width)}x${String(value.height)}, ${String(value.bytes)} bytes, ${String(value.tookMs)} ms)`,
    },
  ])
  if (value.image !== undefined && value.image !== null) {
    blocks.push({ type: 'image', attachment: value.image })
  }
  const warnings = Array.isArray(value.warnings) ? value.warnings : []
  if (warnings.length > 0) blocks.push({ type: 'text', text: warnings.map((w) => `Warning: ${String(w)}`).join('\n') })
  return blocks
}

/**
 * Map the guarded payload envelope to the tool value.
 *
 * @param {string} task - task name
 * @param {ReplyEnvelope} envelope - add-on reply envelope
 * @returns {Record<string, unknown>} tool value
 */
function mapExecEnvelope(task, envelope) {
  const inner = /** @type {Record<string, unknown>} */ (envelope.result)
  const blocked = isRecord(inner.guard) && Array.isArray(inner.guard.blocked) ? inner.guard.blocked : []
  return {
    status: inner.status === 'ok' ? 'ok' : blocked.length > 0 ? 'blocked' : 'error',
    task,
    result: inner.result,
    undo: inner.undo,
    guard: inner.guard,
    ...(blocked.length > 0 ? { blocked } : {}),
    warnings: Array.isArray(inner.warnings) ? inner.warnings : [],
    stdout: envelope.stdout,
    stderr: envelope.stderr,
    handoffHint: HANDOFF_HINT,
    ...(inner.status === 'ok' ? {} : { error: inner.error }),
  }
}

/**
 * Wrap user code with result capture, the guard, and a guaranteed undo step.
 *
 * Kept for callers that only need the classic wrapper; the real pipeline uses
 * `wrapWithGuard` from `guardPayload.js`.
 *
 * @param {string} userCode - Python supplied by the model
 * @param {string} task - task name used in the undo message
 * @returns {string} wrapper Python
 */
export function wrapExecCode(userCode, task) {
  return wrapWithGuard(userCode, {
    taskRoot: '',
    undoMessage: `dsh-blender: ${task}`,
    guardEnabled: false,
  })
}

/**
 * @typedef {object} ReplyEnvelope
 * @property {string} status
 * @property {unknown} result
 * @property {string} stdout
 * @property {string} stderr
 * @property {string} message
 * @property {string} traceback
 */

/**
 * Normalize the add-on's reply envelope.
 *
 * @param {unknown} response - parsed add-on reply
 * @returns {ReplyEnvelope} normalized envelope
 */
function readReplyEnvelope(response) {
  if (!isRecord(response)) {
    return { status: 'error', result: undefined, stdout: '', stderr: '', message: 'The peer reply was not an object.', traceback: '' }
  }
  const result = response.result
  const errorRecord = isRecord(result) ? result.error : undefined
  const tracebackText = isRecord(errorRecord) && typeof errorRecord.traceback === 'string' ? errorRecord.traceback : ''
  return {
    status: typeof response.status === 'string' ? response.status : 'error',
    result,
    stdout: typeof response.stdout === 'string' ? response.stdout : '',
    stderr: typeof response.stderr === 'string' ? response.stderr : '',
    message: typeof response.message === 'string' ? response.message : '',
    traceback: tracebackText,
  }
}

/**
 * @param {unknown} value - status result
 * @returns {string} model-facing summary
 */
function renderStatus(value) {
  const status = /** @type {Record<string, unknown>} */ (value)
  if (status.connected !== true) {
    const error = isRecord(status.error) ? status.error : null
    const actions = error && Array.isArray(error.actions) ? error.actions.map((a) => `- ${String(a)}`) : []
    return [
      `Not connected to Blender at ${String(status.host)}:${String(status.port)}.`,
      error ? `Reason (${String(error.kind)}): ${String(error.message)}` : 'Reason unknown.',
      ...(actions.length > 0 ? ['Next steps:', ...actions] : []),
    ].join('\n')
  }
  const lines = [
    `Connected to Blender ${String(status.blenderVersion)} at ${String(status.host)}:${String(status.port)}.`,
    `File: ${status.filePath === '' ? '(unsaved)' : String(status.filePath)}`,
    `Dirty: ${status.isDirty === true ? 'yes' : 'no'}; objects: ${String(status.objectCount)}; scene: ${String(status.activeScene)}; mode: ${String(status.mode)}; undo limit: ${String(status.undoStepLimit)} (preference; not current history).`,
    `Render: ${formatRenderSettings(status.renderSettings)}`,
    `Task root: ${status.taskRoot === null ? '(none)' : String(status.taskRoot)}`,
    ...(isRecord(status.docs) && typeof status.docs.manualEn === 'string' ? [`Docs: ${status.docs.manualEn}`] : []),
  ]
  const taskDirs = Array.isArray(status.taskDirs) ? status.taskDirs : []
  if (taskDirs.length > 0) {
    lines.push('Task directories:')
    for (const item of taskDirs.slice(0, 10)) {
      if (!isRecord(item)) continue
      const newest = typeof item.newestSnapshot === 'string' ? `, newest ${item.newestSnapshot}` : ''
      const modified =
        typeof item.modifiedAt === 'string' && item.modifiedAt !== '' ? `, modified ${item.modifiedAt.slice(0, 19).replace('T', ' ')}` : ''
      lines.push(`- ${String(item.name)} (${String(item.snapshots)} snapshots${newest}${modified})`)
    }
  }
  const warnings = Array.isArray(status.warnings) ? status.warnings : []
  if (warnings.length > 0) lines.push(...warnings.map((w) => `Warning: ${String(w)}`))
  return lines.join('\n')
}

/**
 * @param {unknown} value - inspect result
 * @returns {string} model-facing summary
 */
function renderInspect(value) {
  if (isRecord(value) && value.status === 'error') {
    const error = isRecord(value.error) ? value.error : {}
    return `Inspect failed: ${typeof error.message === 'string' ? error.message : 'unknown error'}`
  }
  return JSON.stringify(value, null, 2)
}

/**
 * @param {unknown} value - exec result
 * @returns {string} model-facing summary
 */
function renderExec(value) {
  if (!isRecord(value)) return 'No result.'
  const lines = [`Status: ${String(value.status)} (task: ${String(value.task)})`]
  if (value.snapshot !== undefined) lines.push(`Snapshot: ${JSON.stringify(value.snapshot)}`)
  if (value.error !== undefined) {
    const error = isRecord(value.error) ? value.error : {}
    lines.push(`Error: ${typeof error.message === 'string' ? error.message : 'unknown error'}`)
    const tracebackText = typeof error.traceback === 'string' ? error.traceback.trim() : ''
    if (tracebackText !== '') {
      const frames = tracebackText.split('\n').slice(-6)
      lines.push('Traceback (tail):', ...frames.map((frame) => `  ${frame}`))
    }
  }
  if (Array.isArray(value.blocked)) {
    const guard = isRecord(value.guard) ? value.guard : {}
    const total = typeof guard.blockedTotal === 'number' ? guard.blockedTotal : null
    const suffix = total !== null && total > value.blocked.length ? ` (showing ${value.blocked.length} of ${total})` : ''
    lines.push(`Blocked: ${JSON.stringify(value.blocked)}${suffix}`)
  }
  if (value.suggestedPath !== undefined) lines.push(`Suggested path: ${String(value.suggestedPath)}`)
  if (value.undo !== undefined) lines.push(`Undo: ${JSON.stringify(value.undo)}`)
  if (value.changes !== undefined) lines.push(`Changes: ${JSON.stringify(value.changes)}`)
  if (value.result !== undefined) lines.push(`Result: ${JSON.stringify(value.result)}`)
  if (value.stdout) lines.push(`stdout: ${String(value.stdout)}`)
  if (value.stderr) lines.push(`stderr: ${String(value.stderr)}`)
  const warnings = Array.isArray(value.warnings) ? value.warnings : []
  if (warnings.length > 0) lines.push(...warnings.map((w) => `Warning: ${String(w)}`))
  if (typeof value.handoffHint === 'string') lines.push(value.handoffHint)
  return lines.join('\n')
}

/**
 * @param {unknown} value - snapshot result
 * @returns {string} model-facing summary
 */
function renderSnapshot(value) {
  if (!isRecord(value)) return 'No result.'
  if (value.status !== 'ok') {
    const error = isRecord(value.error) ? value.error : {}
    return `Snapshot failed: ${typeof error.message === 'string' ? error.message : 'unknown error'}`
  }
  const lines = [`Snapshot written: ${String(value.path)} (${String(value.bytes)} bytes)`]
  const removed = Array.isArray(value.removed) ? value.removed : []
  if (removed.length > 0) lines.push(`Rotated out: ${removed.map(String).join(', ')}`)
  return lines.join('\n')
}

/**
 * @param {unknown} settings - render settings
 * @returns {string} one-line summary
 */
function formatRenderSettings(settings) {
  if (!isRecord(settings)) return '(unknown)'
  return `${String(settings.engine)}, ${String(settings.width)}x${String(settings.height)} @ ${String(settings.resolutionPercentage)}%, ${String(settings.samples)} samples, ${String(settings.fileFormat)}`
}

/**
 * @param {unknown} value - candidate object
 * @returns {value is Record<string, unknown>} whether the value is a plain object
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
