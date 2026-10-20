/**
 * Plugin entry: configuration, session tracking, write locking, system prompt
 * and tool registration.
 *
 * The plugin is a host-side bundle that talks to the official Blender `mcp`
 * add-on over its local socket. It never spawns Blender, never runs the
 * upstream MCP server, and never writes the user's `.blend`.
 *
 * @module dsh-blender-mcp-bridge
 */

import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import z from '@deepseek-ai/schemastery'
import { sendExecute } from './lib/protocol.js'
import { makeTools } from './lib/tools.js'

/** Plugin name; must match `package.json`. */
export const name = 'dsh-blender-mcp-bridge'

/** Services this plugin needs before it can activate. */
export const inject = ['tools', 'systemPrompt']

/** Validated plugin configuration. */
export const Config = z.object({
  host: z.string().default('127.0.0.1'),
  port: z.natural().min(1).max(65535).default(9876),
  connectTimeoutMs: z.natural().min(100).default(5000),
  responseTimeoutMs: z.natural().min(1000).default(30000),
  captureTimeoutMs: z.natural().min(1000).default(30000),
  renderTimeoutMs: z.natural().min(1000).default(120000),
  maxResponseChars: z.natural().min(1000).default(200000),
  taskRootMode: z.union(['blendFile', 'workspace']).default('blendFile'),
  taskRoot: z.string().default(''),
  snapshot: z.object({
    enabled: z.boolean().default(true),
    generations: z.natural().min(1).max(20).default(3),
    on: z.union(['turn', 'write']).default('turn'),
    compress: z.boolean().default(true),
    timeoutMs: z.natural().min(1000).default(120000),
  }),
  guard: z.object({
    enabled: z.boolean().default(true),
  }),
  helper: z.object({
    analysisPython: z.string().default(''),
    autoDetectPython: z.boolean().default(true),
    timeoutMs: z.natural().min(1000).default(120000),
    maxOutputChars: z.natural().min(1000).default(200000),
    enableMaintenanceHelpers: z.boolean().default(false),
  }),
  audit: z.object({
    enabled: z.boolean().default(true),
    storeCode: z.boolean().default(true),
  }),
})

/** Model-facing safety rules; English on purpose (the model reads it). */
export const SYSTEM_PROMPT = `You can work in the user's currently open Blender session through the blender_mcp_* tools. These tools talk to the official MCP add-on inside the running Blender process.

Ground rules:
1. The session is live and may contain unsaved work. Never save the .blend, never open another file, never quit Blender, never change preferences. Those operations are blocked.
2. Every blender_mcp_exec call writes a snapshot first (when enabled), then creates exactly one undo step. Tell the user they can press Ctrl+Z to step back.
3. Write files only under the task directory (.dsh-blender-<task> next to the .blend). Writes outside it are refused with a suggested path; do not retry the same out-of-bounds path.
4. Inspect before editing: call blender_mcp_status / blender_mcp_inspect first.
5. Do not change render settings on your own. When the user asks for a preview render, use their explicit width/height/samples.
6. If something looks wrong — a write was blocked unexpectedly, the .blend changed on disk, a tool timed out, the guard self-check failed, the scene looks broken — stop, tell the user exactly what happened with the snapshot path, and end the turn. Never try to roll back or repair the damage yourself; rollback is the user's decision (Ctrl+Z or opening a snapshot).
7. When unsure about a Blender API, read the English manual linked from status.docs.manualEn with web_fetch.
8. The blender_* tools from dsh-blender work on background copies of .blend files; use them for batch work and analysis, not for the live session.`

/**
 * Register tools and the system prompt section.
 *
 * @param {any} ctx - cordis context
 * @param {any} config - validated plugin config
 * @returns {void}
 */
export function apply(ctx, config) {
  /** @type {Map<string, number>} session id -> current turn */
  const turns = new Map()
  /** @type {Map<string, number>} session id + task dir -> snapshot sequence */
  const snapshotSeq = new Map()
  /** @type {Set<string>} session id + task dir -> snapshot already taken this turn */
  const snapshotTaken = new Set()
  /** @type {Set<string>} session ids with a timing-out call that lost its reply */
  const timeoutNotes = new Set()

  /**
   * @param {string} sessionId - session id
   * @param {string} taskDir - absolute task directory
   * @returns {string} cache key
   */
  const stateKey = (sessionId, taskDir) => `${sessionId}\u0000${taskDir}`

  ctx.on(
    'session/event',
    /**
     * @param {{ id?: string } | undefined} session - session record
     * @param {{ type?: string, data?: { turn?: number } } | undefined} event - session event
     * @returns {void}
     */
    (session, event) => {
      if (!session || typeof session.id !== 'string') return
      if (event?.type !== 'turn/start') return
      if (typeof event.data?.turn !== 'number') return
      turns.set(session.id, event.data.turn)
      const prefix = `${session.id}\u0000`
      for (const key of snapshotTaken) if (key.startsWith(prefix)) snapshotTaken.delete(key)
    },
    { global: true },
  )

  /**
   * Resolve the session workspace, preferring the working-directory service.
   *
   * @param {any} session - session record, may be undefined
   * @returns {string} absolute workspace directory
   */
  const workspaceOf = (session) => {
    const service = ctx.get('workingDirectory')
    if (service && typeof service.get === 'function' && session) {
      try {
        return String(service.get(session))
      } catch {
        // fall through to the session header
      }
    }
    if (session && session.header && typeof session.header.cwd === 'string') return session.header.cwd
    return process.cwd()
  }

  /**
   * @param {unknown} exec - tool execution context
   * @returns {import('./lib/tools.js').SessionContext} resolved session facts
   */
  const resolveSession = (exec) => {
    const record = typeof exec === 'object' && exec !== null ? /** @type {Record<string, any>} */ (exec) : {}
    const session = record.agent && record.agent.session ? record.agent.session : undefined
    const sessionId = session && typeof session.id === 'string' ? session.id : 'unknown-session'
    return {
      sessionId,
      workspaceDir: workspaceOf(session),
      turn: turns.get(sessionId) ?? 0,
    }
  }

  /** One write at a time: snapshot → exec → audit must not interleave. */
  let writeChain = Promise.resolve()
  /**
   * @template T
   * @param {() => Promise<T>} task - write task
   * @returns {Promise<T>} task result
   */
  const withWriteLock = (task) => {
    const run = writeChain.then(task, task)
    writeChain = run.then(
      () => {},
      () => {},
    )
    return run
  }

  /**
   * Whether the current model route accepts image input.
   *
   * @param {unknown} exec - tool execution context
   * @returns {Promise<boolean>} true when image blocks may be attached
   */
  const imageSupport = async (exec) => {
    const llm = ctx.get('llm')
    const attachments = ctx.get('attachments')
    if (!llm || typeof llm.resolveModelInfo !== 'function' || !attachments) return false
    const record = typeof exec === 'object' && exec !== null ? /** @type {Record<string, any>} */ (exec) : {}
    const session = record.agent && record.agent.session ? record.agent.session : undefined
    if (!session || typeof session.requestHeader !== 'function') return false
    try {
      const header = session.requestHeader()
      const config = header && header.config ? header.config : undefined
      const provider = config && typeof config.provider === 'string' ? config.provider : ''
      const model = config && typeof config.model === 'string' ? config.model : ''
      if (provider === '' || model === '') return false
      const info = await llm.resolveModelInfo(provider, model)
      return Array.isArray(info?.inputModalities) && info.inputModalities.includes('image')
    } catch {
      return false
    }
  }

  /**
   * Persist one image and return its attachment reference when possible.
   *
   * @param {string} filePath - local image path
   * @param {string} mediaType - image media type
   * @param {string} name - display name
   * @returns {Promise<unknown | null>} attachment reference or null
   */
  const attachImage = async (filePath, mediaType, name) => {
    const attachments = ctx.get('attachments')
    if (!attachments || typeof attachments.saveImage !== 'function') return null
    try {
      const data = await readFile(filePath)
      return await attachments.saveImage({ data, mediaType, name })
    } catch (error) {
      ctx.logger.warn(`attachImage failed: ${error instanceof Error ? error.message : String(error)}`)
      return null
    }
  }

  /** @type {import('./lib/tools.js').BridgeOptions} */
  const options = {
    host: config.host,
    port: config.port,
    connectTimeoutMs: config.connectTimeoutMs,
    responseTimeoutMs: config.responseTimeoutMs,
    captureTimeoutMs: config.captureTimeoutMs,
    renderTimeoutMs: config.renderTimeoutMs,
    maxResponseChars: config.maxResponseChars,
    helpersDir: path.join(path.dirname(fileURLToPath(import.meta.url)), 'helpers'),
    pythonConfig: {
      analysisPython: config.helper.analysisPython,
      autoDetectPython: config.helper.autoDetectPython,
    },
    helperTimeoutMs: config.helper.timeoutMs,
    helperMaxOutputChars: config.helper.maxOutputChars,
    enableMaintenanceHelpers: config.helper.enableMaintenanceHelpers,
    snapshot: {
      enabled: config.snapshot.enabled,
      generations: config.snapshot.generations,
      on: config.snapshot.on,
      compress: config.snapshot.compress,
      timeoutMs: config.snapshot.timeoutMs,
    },
    guard: { enabled: config.guard.enabled },
    audit: { enabled: config.audit.enabled, storeCode: config.audit.storeCode },
    taskRoot: config.taskRoot,
    taskRootMode: config.taskRootMode,
    send: (code, overrides = {}) =>
      sendExecute({
        host: config.host,
        port: config.port,
        code,
        connectTimeoutMs: config.connectTimeoutMs,
        responseTimeoutMs: overrides.responseTimeoutMs ?? config.responseTimeoutMs,
        maxResponseChars: config.maxResponseChars,
        signal: overrides.signal,
      }),
    warn: (message) => {
      ctx.logger.warn(message)
    },
    resolveSession,
    imageSupport,
    attachImage,
    timeoutWarning: (sessionId) => timeoutNotes.has(sessionId),
    noteTimeout: (sessionId) => {
      timeoutNotes.add(sessionId)
    },
    clearTimeoutNote: (sessionId) => {
      timeoutNotes.delete(sessionId)
    },
    snapshotState: {
      shouldSnapshot: (sessionId, taskDir) => {
        if (config.snapshot.on === 'write') return true
        return !snapshotTaken.has(stateKey(sessionId, taskDir))
      },
      markSnapshot: (sessionId, taskDir) => {
        snapshotTaken.add(stateKey(sessionId, taskDir))
      },
      nextSeq: (sessionId, taskDir) => {
        const key = stateKey(sessionId, taskDir)
        const next = (snapshotSeq.get(key) ?? 0) + 1
        snapshotSeq.set(key, next)
        return next
      },
    },
    withWriteLock,
  }

  for (const tool of makeTools(options)) {
    ctx.tools.register(tool)
  }

  const packageRoot = path.dirname(fileURLToPath(import.meta.url))
  const skillDir = path.join(packageRoot, 'skills', 'blender-live-session')
  const skills = ctx.get('skills')
  if (skills && typeof skills.register === 'function') {
    let content = LIVE_SESSION_SKILL_FALLBACK
    try {
      content = readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')
    } catch (error) {
      ctx.logger.warn(`could not read the live-session skill: ${error instanceof Error ? error.message : String(error)}`)
    }
    ctx.effect(
      () =>
        skills.register({
          name: 'blender-live-session',
          description:
            "Work inside the user's currently open Blender session: inspect, model, validate with screenshots/renders, " +
            'and hand off through the blender_mcp_* tools without saving the .blend.',
          whenToUse:
            'Use when the user asks to create, edit, inspect or validate a 3D model in the Blender session they currently ' +
            'have open, especially when unsaved work must be preserved.',
          source: 'dsh-blender-mcp-bridge',
          content,
          resourceBase: { kind: 'directory', path: skillDir },
        }),
      'blender-mcp: live-session skill',
    )
  }

  ctx.systemPrompt.section({
    name: 'blender-mcp-bridge',
    order: 2400,
    text: SYSTEM_PROMPT,
  })
}

/** Fallback skill body when SKILL.md cannot be read. */
const LIVE_SESSION_SKILL_FALLBACK = `# Blender Live Session

Work in the user's open Blender session through the blender_mcp_* tools.
Inspect before editing, write only under the task directory, never save the
.blend, one undo step per exec, and never roll back by yourself: report the
problem and end the turn.`
