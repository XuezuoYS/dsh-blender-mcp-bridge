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
import { Config, defaultSettings, pickKnown, unwrapConfig } from './lib/config.js'
import { listHelpers } from './lib/helperCatalog.js'
import { createHelperEnv, defaultDshHome } from './lib/helperEnv.js'
import { createHelperEnvHandlers, HELPER_ENV_PATH } from './lib/helperEnvRoutes.js'
import { handshake } from './lib/handshake.js'
import { sendExecute } from './lib/protocol.js'
import { createRenderStats } from './lib/renderStats.js'
import { createSendGate } from './lib/sendGate.js'
import { createSettingsHandlers, SETTINGS_PATH } from './lib/settingsRoutes.js'
import { createSettingsStore } from './lib/settingsStore.js'
import { createSnapshotTracker } from './lib/snapshotPolicy.js'
import { makeTools } from './lib/tools.js'

/** Plugin name; must match `package.json`. */
export const name = 'dsh-blender-mcp-bridge'

/** Services this plugin needs before it can activate. */
export const inject = ['tools', 'systemPrompt']

/**
 * Extra attempts after a refused connect. `ECONNREFUSED` means the socket never
 * opened, so retrying cannot run anything twice. The delays total ~1.4 s, which
 * covers the add-on's listen queue staying full through one idle poll tick.
 */
const CONNECT_RETRIES = 3

/** The plugin's schema, re-exported for the DSH loader and tests. */
export { Config }

/** Model-facing safety rules; English on purpose (the model reads it). */
export const SYSTEM_PROMPT = `You can work in the user's currently open Blender session through the blender_mcp_* tools. These tools talk to the official MCP add-on inside the running Blender process.

Ground rules:
1. The session is live and may contain unsaved work. Never save the .blend, never open another file, never quit Blender, never change preferences. The plugin blocks the obvious calls; the guard is a mistake guard, not a sandbox.
2. blender_mcp_exec has two modes. Write code uses the default mode: before the call the plugin may write a snapshot (snapshot policy: the first write of a turn, every N writes, and delete-like calls; configurable), then pushes one undo step; use batch to group several snippets into one snapshot/undo step. Inspection code uses readOnly: true: no snapshot, no object diff, no undo step — the plugin still pushes one undo step if the call actually changed the scene. Code that pushes its own undo steps can add more. Tell the user they can press Ctrl+Z to step back; to go back further the user opens a snapshot in Blender — the plugin never restores one by itself.
3. Write files only under the task directory (.dsh-blender-<task> next to the .blend). OS temp files are allowed for scratch work. Writes outside it are refused with a suggested path; do not retry the same out-of-bounds path. Operator-level file writes are checked; C-level data methods such as image.save_render are not intercepted.
4. Inspect before editing: call blender_mcp_status / blender_mcp_inspect first; inspect takes scope, name/type/collection filters, include, limit and offset, so one call covers a 3,000-object scene. Use blender_mcp_exec with readOnly: true only for queries the inspect scopes do not cover.
5. Do not change render settings on your own. When the user asks for a preview render, use their explicit width/height/samples. blender_mcp_render restores the settings and accepts timeoutMs (1 s to 30 min); for a long production render pass a larger timeoutMs or background: true. If a render returns status timeout or running, Blender keeps rendering: do not start another render (other Blender tools will time out too) — call blender_mcp_render_status with the jobId until it reports done or failed, then read the image.
6. If something looks wrong — a write was blocked unexpectedly, the .blend changed on disk, a tool timed out, the guard self-check failed, the scene looks broken — stop, tell the user exactly what happened with the snapshot path, and end the turn. Never try to roll back or repair the damage yourself; rollback is the user's decision (Ctrl+Z or opening a snapshot).
7. When unsure about a Blender API, read the English manual linked from status.docs.manualEn with web_fetch.
8. The blender_* tools from dsh-blender work on background copies of .blend files; use them for batch work and analysis, not for the live session.
9. Helper Python environment: blender_mcp_helpers reports one managed environment at DSH_HOME/dsh-blender-mcp-bridge/python/venv. The plugin never installs it for you: when it is missing or incomplete, tell the user to open Settings → Blender MCP → Python helper environment (or run the setup command printed in the helper result) and never run pip install yourself. Dependency-free helpers may run on Blender's own Python; helpers with dependencies need the managed venv.`

/**
 * Register tools and the system prompt section.
 *
 * @param {any} ctx - cordis context
 * @param {any} config - DSH-loaded config; only used for the one-time settings migration
 * @returns {void}
 */
export function apply(ctx, config) {
  /** @type {Map<string, number>} session id -> current turn */
  const turns = new Map()
  /**
   * The plugin-owned settings store. It lives under the DSH home and is the
   * only source of truth; the DSH profile values are used once for migration.
   */
  const settingsDefaults = defaultSettings()
  const settings = createSettingsStore({
    dshHome: defaultDshHome(),
    defaults: settingsDefaults,
    legacy: pickKnown(unwrapConfig(config ?? {}), settingsDefaults),
    warn: (message) => ctx.logger.warn(message),
  })
  /** @returns {any} current settings */
  const currentSettings = () => settings.get()
  /**
   * Live snapshot policy: the tracker reads these getters before every write,
   * so a saved cadence change applies to the next call without a remount.
   */
  const snapshotPolicy = {
    get enabled() {
      return currentSettings().snapshot.enabled
    },
    get on() {
      return currentSettings().snapshot.on
    },
    get everyWrites() {
      return currentSettings().snapshot.everyWrites
    },
    get onDestructive() {
      return currentSettings().snapshot.onDestructive
    },
  }
  /** Automatic-snapshot cadence state: session id + task dir -> counters. */
  const snapshotState = createSnapshotTracker(snapshotPolicy)
  /** @type {Map<string, number>} session id -> undo steps pushed by the plugin (estimate) */
  const undoPushes = new Map()
  /** Per-session render-speed samples used for a rough "will this fit?" estimate. */
  const renderStats = createRenderStats()
  /**
   * One concurrency gate for the whole plugin: read tools may run in parallel
   * from DSH's point of view, but the add-on's listen queue tolerates only a
   * few connections at once. The limit is read from settings on every call.
   */
  const sendGate = createSendGate({ limitOf: () => currentSettings().maxConcurrentSends })
  /** @type {Set<string>} session ids with a timing-out call that lost its reply */
  const timeoutNotes = new Set()
  /** @type {Map<string, string>} session id -> last known .blend path */
  const knownFilePaths = new Map()

  const packageRoot = path.dirname(fileURLToPath(import.meta.url))
  let packageVersion = ''
  try {
    packageVersion = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version ?? ''
  } catch {
    packageVersion = ''
  }
  /**
   * The helper environment manager. Construction is cheap: it only reads
   * files when status/install is called and never probes a user-installed
   * Python runtime.
   */
  const helperEnv = createHelperEnv({
    dshHome: defaultDshHome(),
    pluginRoot: packageRoot,
    packageVersion,
    getConfig: () => ({
      basePython: currentSettings().helper.basePython,
      pipIndexUrl: currentSettings().helper.pipIndexUrl,
    }),
    warn: (message) => ctx.logger.warn(message),
  })

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
      snapshotState.startTurn(session.id)
    },
    { global: true },
  )

  ctx.on(
    'session/disposed',
    /**
     * @param {{ id?: string } | undefined} session - disposed session record
     * @returns {void}
     */
    (session) => {
      if (!session || typeof session.id !== 'string') return
      turns.delete(session.id)
      timeoutNotes.delete(session.id)
      knownFilePaths.delete(session.id)
      undoPushes.delete(session.id)
      renderStats.clearSession(session.id)
      snapshotState.clearSession(session.id)
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
    try {
      const header = session && typeof session.requestHeader === 'function' ? session.requestHeader() : undefined
      const routed = header && header.config ? header.config : undefined
      const options = record.agent && record.agent.options ? record.agent.options : undefined
      const provider = typeof routed?.provider === 'string' ? routed.provider : typeof options?.provider === 'string' ? options.provider : ''
      const model = typeof routed?.model === 'string' ? routed.model : typeof options?.model === 'string' ? options.model : ''
      if (provider === '' || model === '') return false
      const signal = record.signal instanceof AbortSignal ? record.signal : undefined
      const info = await llm.resolveModelInfo(provider, model, signal)
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

  /**
   * Tool options. Configuration fields are getters: the settings page writes
   * the plugin's JSON files, and every call reads the current value.
   *
   * @type {import('./lib/tools.js').BridgeOptions}
   */
  const options = {
    get host() {
      return currentSettings().host
    },
    get port() {
      return currentSettings().port
    },
    get connectTimeoutMs() {
      return currentSettings().connectTimeoutMs
    },
    get responseTimeoutMs() {
      return currentSettings().responseTimeoutMs
    },
    get captureTimeoutMs() {
      return currentSettings().captureTimeoutMs
    },
    get renderTimeoutMs() {
      return currentSettings().renderTimeoutMs
    },
    get maxResponseChars() {
      return currentSettings().maxResponseChars
    },
    helpersDir: path.join(packageRoot, 'helpers'),
    helperEnv,
    get helperTimeoutMs() {
      return currentSettings().helper.timeoutMs
    },
    get helperMaxOutputChars() {
      return currentSettings().helper.maxOutputChars
    },
    get enableMaintenanceHelpers() {
      return currentSettings().helper.enableMaintenanceHelpers
    },
    get snapshot() {
      const snapshot = currentSettings().snapshot
      return {
        enabled: snapshot.enabled,
        generations: snapshot.generations,
        on: snapshot.on,
        everyWrites: snapshot.everyWrites,
        onDestructive: snapshot.onDestructive,
        compress: snapshot.compress,
        timeoutMs: snapshot.timeoutMs,
      }
    },
    get guard() {
      return { enabled: currentSettings().guard.enabled }
    },
    get audit() {
      const audit = currentSettings().audit
      return {
        enabled: audit.enabled,
        storeCode: audit.storeCode,
      }
    },
    get taskRoot() {
      return currentSettings().taskRoot
    },
    get taskRootMode() {
      return currentSettings().taskRootMode
    },
    send: (code, overrides = {}) => {
      const settings = currentSettings()
      return sendExecute({
        host: settings.host,
        port: settings.port,
        code,
        connectTimeoutMs: settings.connectTimeoutMs,
        responseTimeoutMs: overrides.responseTimeoutMs ?? settings.responseTimeoutMs,
        maxResponseChars: settings.maxResponseChars,
        connectRetries: CONNECT_RETRIES,
        signal: overrides.signal,
      })
    },
    withSendSlot: (task, signal) => sendGate.run(task, signal),
    warn: (message) => {
      ctx.logger.warn(message)
    },
    resolveSession,
    imageSupport,
    attachImage,
    knownFilePath: (sessionId) => knownFilePaths.get(sessionId) ?? '',
    noteFilePath: (sessionId, filePath) => {
      if (typeof filePath === 'string' && filePath !== '') knownFilePaths.set(sessionId, filePath)
    },
    timeoutWarning: (sessionId) => timeoutNotes.has(sessionId),
    noteTimeout: (sessionId) => {
      timeoutNotes.add(sessionId)
    },
    clearTimeoutNote: (sessionId) => {
      timeoutNotes.delete(sessionId)
    },
    undoPushCount: (sessionId) => undoPushes.get(sessionId) ?? 0,
    noteUndoPush: (sessionId) => {
      undoPushes.set(sessionId, (undoPushes.get(sessionId) ?? 0) + 1)
    },
    renderStats,
    snapshotState,
    withWriteLock,
  }

  for (const tool of makeTools(options)) {
    ctx.tools.register(tool)
  }

  ctx.effect(
    () => () => helperEnv.dispose(),
    'blender-bridge: helper environment lifecycle',
  )

  // Settings-page channels. They are core connection Fetch routes (the same
  // authenticated mechanism the built-in /api/file route uses); hosts without
  // that service (TUI, minimal SDK profiles) simply skip them and the JSON
  // files remain editable by hand.
  ctx.inject(['connection'], (/** @type {any} */ connectionCtx) => {
    const connection = connectionCtx.get('connection')
    if (!connection || typeof connection.fetch?.register !== 'function') return
    /**
     * @param {AbortSignal} [signal] - request cancellation
     * @returns {Promise<import('./lib/handshake.js').LiveSessionInfo | null>} live facts, when available
     */
    const probeBlenderFacts = async (signal) => {
      const settings = currentSettings()
      if (settings.helper.basePython.trim() !== '') return null
      const info = await handshake({
        host: settings.host,
        port: settings.port,
        connectTimeoutMs: settings.connectTimeoutMs,
        responseTimeoutMs: Math.min(settings.responseTimeoutMs, 15000),
        maxResponseChars: settings.maxResponseChars,
        signal,
      })
      helperEnv.noteBlenderSession(info)
      return info
    }
    const envHandlers = createHelperEnvHandlers({
      env: helperEnv,
      getHelpers: () => listHelpers(currentSettings().helper.enableMaintenanceHelpers),
      probeBlenderFacts,
    })
    const settingsHandlers = createSettingsHandlers({ store: settings })
    connectionCtx.effect(
      () => {
        try {
          return connection.fetch.register({
            path: HELPER_ENV_PATH,
            methods: ['GET', 'POST'],
            requestBody: 'buffered',
            fetch: (/** @type {Request} */ request) =>
              request.method === 'POST' ? envHandlers.install(request) : envHandlers.status(request),
          })
        } catch (error) {
          ctx.logger.warn(`helper environment route registration failed: ${error instanceof Error ? error.message : String(error)}`)
          return () => {}
        }
      },
      'blender-bridge: helper environment route',
    )
    connectionCtx.effect(
      () => {
        try {
          return connection.fetch.register({
            path: SETTINGS_PATH,
            methods: ['GET', 'POST'],
            requestBody: 'buffered',
            fetch: (/** @type {Request} */ request) =>
              request.method === 'POST' ? settingsHandlers.post(request) : settingsHandlers.get(),
          })
        } catch (error) {
          ctx.logger.warn(`settings route registration failed: ${error instanceof Error ? error.message : String(error)}`)
          return () => {}
        }
      },
      'blender-bridge: settings route',
    )
  })

  const skillDir = path.join(packageRoot, 'skills', 'blender-live-session')
  // Wait for the skills service instead of sampling it once during apply:
  // a service mounted later would otherwise leave the skill silently absent.
  ctx.inject(['skills'], (/** @type {any} */ skillsCtx) => {
    const skills = skillsCtx.get('skills')
    if (!skills || typeof skills.register !== 'function') return
    let content = LIVE_SESSION_SKILL_FALLBACK
    try {
      content = readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')
    } catch (error) {
      skillsCtx.logger.warn(`could not read the live-session skill: ${error instanceof Error ? error.message : String(error)}`)
    }
    skillsCtx.effect(
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
  })

  ctx.systemPrompt.section({
    name: 'blender-mcp-bridge',
    order: 2400,
    text: SYSTEM_PROMPT,
  })
}

/** Fallback skill body when SKILL.md cannot be read. */
const LIVE_SESSION_SKILL_FALLBACK = `# Blender Live Session

Work in the user's open Blender session through the blender_mcp_* tools.
Inspect before editing: blender_mcp_inspect takes scope, name/type/collection
filters, include and limit/offset, so a large scene is one small reply; write
only under the task directory, never save the .blend, and send only inspection
code with readOnly: true (it skips the
snapshot and the undo step). Automatic snapshots follow the snapshot policy
(the first write of a turn, every few writes, and delete-like calls); the user
opens a snapshot in Blender to go back. Renders accept a per-call timeoutMs and
a background start; a render that outlives its call keeps running in Blender,
so collect it with blender_mcp_render_status instead of rendering again. If
blender_mcp_helpers reports the managed Python environment missing or
incomplete, point the user at Settings → Blender MCP → Python helper
environment and do not run pip install yourself. Never roll back by yourself:
report the problem and end the turn.`
