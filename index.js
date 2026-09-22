// SPDX-License-Identifier: GPL-3.0-or-later
// @ts-nocheck
// 上面这行 `@ts-nocheck` 是**有意为之**，不是偷懒：`defineTool({...})` 的调用点在 `checkJs` 下必然报错——
// `ParameterPropertySpec` 要求 `type: 'string'` 这类**字面量类型**，而纯 JS 对象字面量会被放宽成
// `string`，唯一解法 `as const` 是 TS 语法（docs/contract.md#packaging 记录了这条已知局限）。
// 因此类型检查聚焦 `lib/**` 与 `buildKnowledge.js`，工具注册点靠**运行期验证**：
// `diagnostics/probeEndToEnd.js` 会真的注册工具、逐个调用，并断言 6 个定义的结构完整。
// 注意 SPDX 必须是**第一行**（判定规则是"第一行含字面量 SPDX"，见 docs/contract.md#licensing）。

// 插件入口：profile bundle 的 name / inject / Config / apply。
// 副作用边界：注册 6 个工具；工具调用期间才会向 add-on 发请求、在 workspace 下建任务目录、
// 以及在 Blender 进程内装运行时护栏。除任务目录外不写任何位置。

import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'

import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

import { CheckpointManager } from './lib/checkpoint.js'
import { HITS_DEFAULT, HITS_MAX, HITS_MIN } from './lib/knowledge.js'
import { endpointOf as buildEndpoint, sendExecute } from './lib/protocol.js'
import { SettingsBaseline } from './lib/settingsGuard.js'
import { displayPath, ensureTaskDir, findExistingTaskDir } from './lib/taskDir.js'
import {
  makeCaptureTool,
  makeDocsTool,
  makeExecTool,
  makeInspectTool,
  makeSnapshotTool,
  makeStatusTool,
  sanitizeFileName,
  sessionIdOf,
  workspaceOf,
} from './lib/tools.js'

/** 插件名（与 cordis.patch.yml 的 id 对齐）。 */
export const name = 'blender-mcp-bridge'

/** 依赖的工具注册表服务。 */
export const inject = ['tools', 'systemPrompt']

/**
 * 插件版本，用于 status 自报。
 *
 * 从 package.json 读取而不是硬编码：两处各写一份一定会漂移（docs/contract.md#packaging）。
 */
const PLUGIN_VERSION = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
).version

/**
 * 配置 schema。
 *
 * 每个字段都对应一个「不同部署可能取不同值」的量（**规范**：不得硬编码可调参数）。
 * 补丁层按行整体替换 config、不做深合并，因此 cordis.patch.yml 里列出了全集。
 */
export const Config = Schema.object({
  // ---- 端点发现 ----
  host: Schema.string().default('127.0.0.1'),
  port: Schema.number().default(9876),
  /** 额外候选端口；仅当 allowPortScan 为真时使用。 */
  portCandidates: Schema.array(Schema.number()).default([]),
  /** 是否允许在候选端口上扫描。默认关：静默连到别的服务比连不上更危险。 */
  allowPortScan: Schema.boolean().default(false),
  connectTimeoutMs: Schema.number().default(10_000),
  responseTimeoutMs: Schema.number().default(30_000),
  /** 延迟响应（deferred）上限；与 add-on 的 3600 s 对齐。 */
  deferredTimeoutMs: Schema.number().default(3_600_000),
  /** 单次 exec 返回里 stdout/stderr 的字符上限。 */
  maxResponseChars: Schema.number().default(200_000),
  /** 指纹不符时是否拒绝继续（诊断第 3 级，见 docs/contract.md#discovery-diagnostics）。 */
  rejectForeignPeer: Schema.boolean().default(true),
  /** 最低 Blender 版本。 */
  requireVersionMin: Schema.string().default('5.1'),

  // ---- 任务目录 ----
  /**
   * 任务目录的父目录；留空表示按 `taskRootMode` 决定。
   *
   * 显式给了绝对路径时以本项为准（最高优先级）。
   */
  taskRoot: Schema.string().default(''),
  /**
   * `taskRoot` 留空时，任务目录放哪：
   * - `workspace`（默认）：会话 workspace，`<workspace>/.dsh-blender-<task>/`
   * - `blendFile`：**活动 .blend 文件所在目录旁边**，`<blendDir>/.dsh-blender-<task>/`
   *
   * ⚠️ `blendFile` 会**改变护栏的 allowRoot**：它与 I5「可写范围只有任务目录」仍然一致
   * （可写范围依旧只是那一个任务目录），但**任务目录的位置跟着工程文件走**，
   * 因此等于允许写工程文件所在目录下的一个子目录。
   * 这是有意的取舍：产出就在工程旁边。不接受这个取舍就用默认的 `workspace`。
   */
  taskRootMode: Schema.union(['workspace', 'blendFile']).default('workspace'),

  // ---- 检查点 ----
  checkpoint: Schema.object({
    enabled: Schema.boolean().default(true),
    keep: Schema.number().min(1).max(20).default(3),
    /** 单份体积上限（字节）；0 表示不限。超限只告警，不硬失败（docs/contract.md#checkpoint）。 */
    maxBytes: Schema.number().min(0).default(0),
  }).default({ enabled: true, keep: 3, maxBytes: 0 }),

  // ---- 拦截层 ----
  intercept: Schema.object({
    enabled: Schema.boolean().default(true),
    /** 运行时护栏的线程范围：`main` 只检主线程（默认），`all` 检所有线程。 */
    guardThreadScope: Schema.union(['main', 'all']).default('main'),
  }).default({ enabled: true, guardThreadScope: 'main' }),

  // ---- 官方知识库（语料与索引随包内置，无可开关；见 docs/contract.md#core-decisions）----
  knowledge: Schema.object({
    /** 单次检索最多返回多少条命中（缺省值；入参 maxResults 可在同区间内逐次覆盖）。 */
    maxHits: Schema.number().min(HITS_MIN).max(HITS_MAX).default(HITS_DEFAULT),
    /** 单条命中最多返回多少字符；「超限降级为定义清单」的触发点与该值同源（docs/contract.md#knowledge-retrieval）。 */
    maxCharsPerHit: Schema.number().min(200).max(20000).default(4000),
  }).default({ maxHits: HITS_DEFAULT, maxCharsPerHit: 4000 }),

  // ---- 工具面 ----
  expose: Schema.object({
    status: Schema.boolean().default(true),
    exec: Schema.boolean().default(true),
    inspect: Schema.boolean().default(true),
    /** 视觉反馈（docs/contract.md#tools）；实现前保持关闭状态也不会报错。 */
    capture: Schema.boolean().default(true),
    snapshot: Schema.boolean().default(true),
    /**
     * 知识库检索工具的注册开关。
     * 它**不**开关知识库本身——语料与索引必定随包内置（I21），见 docs/contract.md#core-decisions。
     */
    docs: Schema.boolean().default(true),
  }).default({ status: true, exec: true, inspect: true, capture: true, snapshot: true, docs: true }),
})

/**
 * 生效配置（已由 schema 填好默认值）。
 *
 * 用 `@typedef` 声明，使 `lib/` 可以通过 `import('./index.js').ResolvedConfig` 引用它，
 * 而不必在两边各写一份配置类型（那会漂移）。
 *
 * @typedef {object} ResolvedConfig
 * @property {string} host
 * @property {number} port
 * @property {number[]} portCandidates
 * @property {boolean} allowPortScan
 * @property {number} connectTimeoutMs
 * @property {number} responseTimeoutMs
 * @property {number} deferredTimeoutMs
 * @property {number} maxResponseChars
 * @property {boolean} rejectForeignPeer
 * @property {string} requireVersionMin
 * @property {string} taskRoot
 * @property {{enabled: boolean, keep: number, maxBytes: number}} checkpoint
 * @property {{enabled: boolean, guardThreadScope: 'main'|'all'}} intercept
 * @property {{maxHits: number, maxCharsPerHit: number}} knowledge
 * @property {{status: boolean, exec: boolean, inspect: boolean, capture: boolean, snapshot: boolean, docs: boolean}} expose
 */

/**
 * 注册工具。
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx 插件上下文。
 * @param {ResolvedConfig} config 生效配置。
 */
export function apply(ctx, config) {
  /** @type {Map<string, number>} 会话 -> 当前轮次（docs/contract.md#checkpoint：一次用户请求 == 一个 turn） */
  const turns = new Map()
  /** @type {Map<string, CheckpointManager>} `${sessionId}\0${taskRoot}` -> 检查点管理器 */
  const managers = new Map()
  /** 渲染/导出设置的会话基线：让"改了用户设置"这件事可核对（见 lib/settingsGuard.js） */
  const settingsBaseline = new SettingsBaseline()
  /**
   * 本进程**最近一次已知**的活会话指纹（只读缓存）。
   *
   * 存在的唯一理由：`blender_mcp_docs` 要报语料与实际版本的漂移，而知识库检索本身
   * **不得产生任何对 add-on 的请求**（docs/contract.md#knowledge-retrieval / I19）。
   * 于是版本信息由 status / exec 这些本来就要敲 add-on 的路径顺手记下，docs 只读不探。
   * @type {{blenderVersion?: string}|undefined}
   */
  let knownFingerprint

  /**
   * 端口扫描**实际握手成功**的端口（未扫过 / 没找到时为 undefined，即用配置端口）。
   *
   * 存在的理由：`allowPortScan` 打开后，找到的对端可能不在 `config.port` 上。
   * 若只有 `status` 用它、其余工具仍打配置端口，那其余工具会打到**另一个服务**上
   * （实测：`diagnose` 返回 `activePort`，而 `endpointOf(config)` 从不读它）。
   * @type {number|undefined}
   */
  let discoveredPort

  /**
   * 由配置构造传输端点参数。
   *
   * 真身在 `lib/protocol.js`（此处只转发，并附上扫描发现的端口）：
   * 集中一处，避免每个构造点各写一遍 host/port/超时——那正是漂移的来源。
   *
   * @param {ResolvedConfig} cfg 生效配置。
   * @returns {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} 端点。
   */
  const endpointOf = (cfg) => buildEndpoint(cfg, { discoveredPort })

  /**
   * 提示词段落：**默认不要改用户的渲染与导出设置**。
   *
   * 起因是一次真实事故：为了出预览图，本插件把 `cycles.samples` 钉成 256、
   * 把 `frame_start/frame_end` 留成探针值（1–2）、把 `view_settings.exposure` 固化成 -0.45、
   * 把 `render.filepath` 指向了自己的任务目录，并且**写进了交付状态**——用户没有要求过这些。
   *
   * 写法上的取舍（实测过一版失败的）：**不要写成"许可清单"**。第一版把三种例外列在前面，
   * 读起来像"满足条件就可以改"，约束力反而弱。有效的写法是**先讲清代价、把默认立场说死**，
   * 例外放到最后且加上"要先问"的门槛。
   *
   * 这是**软限制**：约束模型行为，不阻断执行。配套的 `status.renderSettings` 与
   * `exec.settingsDrift` 负责让越界**可见**；真正的写盘拦截在 L1/L2，那是另一层。
   */
  const SETTINGS_POLICY = [
    '## Blender 渲染与导出设置：默认不动，而且你没有理由动',
    '',
    '用户打开的 `.blend` 是**他的工作文件**。渲染引擎、分辨率、采样、色彩管理、帧范围、',
    '输出路径与格式、合成节点组，都是他长期调好的工作状态；你看到的是**结果**，不是空位。',
    '',
    '**你没有能力替用户做这个判断。** 你不知道他的帧范围要覆盖多长的动画、',
    '不知道那些采样是他按显卡算过的、不知道输出路径后面接着什么流程。',
    '改动这些设置属于"破坏用户上下文"，而且**改坏了你也不会知道**——',
    '最坏的情况是你把 `frame_start/frame_end` 设成探针用的 1–2 之后忘了还原：',
    '用户下次按 F12 或渲染动画，只会得到 2 帧，而他会以为是自己的工程坏了。',
    '',
    '还有一层更实际的：一旦用户发现 AI 会**顺手改他的出图参数**，他就不敢再让你碰真实项目了。',
    '',
    '### 所以：默认不写这些属性',
    '',
    '```',
    'scene.render.engine / resolution_x / resolution_y / resolution_percentage',
    'scene.render.film_transparent / filepath / use_compositing',
    'scene.render.image_settings.*',
    'scene.cycles.samples / preview_samples / device / max_bounces / volume_bounces',
    'scene.view_settings.view_transform / look / exposure',
    'scene.frame_start / frame_end / frame_current',
    'scene.compositing_node_group 的既有内容',
    '```',
    '',
    '**需要预览图怎么办**：在**一次执行里**临时改、渲染、立刻还原。还原点必须在改动**之前**读取，',
    '并逐项还原（`frame_current` 最容易漏）。或者干脆让用户自己按 F12——那本来就是他的权利。',
    '更好的做法是把预览写进任务目录，而不是替换 `scene.render.filepath`。',
    '',
    '### 唯一可以改的情况',
    '',
    '**用户明确要求**，并且你**已经问清具体数值**。',
    '他说"切换到 Cycles"就只改引擎；他说"采样提到 512"就只改采样。',
    '改之前说明你要改哪些键、改成什么；改之后**只报告你实际改过的**，不要顺手多改。',
    '他如果说"你看着办"，那是授权你**提议并等他确认**，不是授权你直接固化。',
    '',
    '### 关于还原',
    '',
    '做完任何临时改动后检查一次：',
    '',
    '```',
    'result = {',
    '    "samples": bpy.context.scene.cycles.samples,',
    '    "frames": [bpy.context.scene.frame_start, bpy.context.scene.frame_end, bpy.context.scene.frame_current],',
    '    "engine": bpy.context.scene.render.engine,',
    '    "filepath": bpy.context.scene.render.filepath,',
    '}',
    '```',
    '',
    '`blender_mcp_status` 里有 `renderSettings`（当前值）与 `settingsBaseline`（本会话开始时值）；',
    '`blender_mcp_exec` 在检测到设置漂移时会返回 `settingsDrift` 并写入 `warnings`。',
    '**看到 `settingsDrift` 非空就还原，再继续干活。**',
  ].join('\n')

  const disposers = []
  if (typeof ctx.systemPrompt?.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
      name: 'blender-mcp-bridge-settings-policy',
      order: 900,
      text: SETTINGS_POLICY,
    }))
  }

  // 轮次边界订阅：turn/start 只标记本轮开始，不立刻产生检查点（docs/contract.md#checkpoint）。
  // 第一个参数是 Session 对象（`session.id`），不是 id 字符串。
  ctx.on('session/event', (session, event) => {
    if (event.type === 'turn/start') {
      const id = typeof session?.id === 'string' ? session.id : 'unknown-session'
      turns.set(id, event.data.turn)
    }
    if (event.type === 'turn/end') {
      const id = typeof session?.id === 'string' ? session.id : 'unknown-session'
      const turn = event.data.turn
      for (const manager of checkpointManagersOf(id, turn)) {
        void manager.closeRound(turn).catch(() => {
          // 收尾轮换失败只意味着没回收磁盘，不影响正确性
        })
      }
    }
  })

  if (disposers.length > 0) {
    ctx.on('dispose', () => {
      for (const dispose of disposers) dispose()
    })
  }

  /**
   * 取本会话在某个轮次上用过的检查点管理器（收尾轮换用）。
   *
   * 只处理**本会话登记过的**检查点（I8）：不得跨会话清理。
   *
   * @param {string} sessionId 会话 id。
   * @param {number} turn 轮次。
   * @returns {CheckpointManager[]} 相关管理器。
   */
  const checkpointManagersOf = (sessionId, turn) => {
    /** @type {CheckpointManager[]} */
    const out = []
    for (const [key, manager] of managers) {
      if (!key.startsWith(`${sessionId}\0`)) continue
      if (!manager.hasCheckpoint(turn)) continue
      out.push(manager)
    }
    return out
  }

  /**
   * 取会话当前轮次；订阅尚未收到事件时退化为 0，仍能落检查点（不会因为缺编号而不保护）。
   *
   * @param {string} sessionId 会话 id。
   * @returns {number} 轮次号。
   */
  const turnOf = (sessionId) => turns.get(sessionId) ?? 0

  /**
   * 解析任务根目录。
   *
   * 优先级：显式 `taskRoot` > `taskRootMode` 决定的位置（docs/contract.md#taskdir）。
   * `blendFile` 模式需要向 Blender 问一次 `bpy.data.filepath`（只读），
   * 问不到（会话未保存/无会话）时**回退到 workspace 并在返回里说明**，
   * 不静默把产出写到意外的位置。
   *
   * @param {unknown} exec 执行上下文。
   * @returns {Promise<{root: string, source: 'config'|'workspace'|'blendFile'|'blendFile-fallback', detail?: string}>} 任务根解析结果。
   */
  const resolveTaskRoot = async (exec) => {
    const configured = config.taskRoot.trim()
    if (configured !== '') return { root: configured, source: 'config' }
    if (config.taskRootMode !== 'blendFile') {
      return { root: workspaceOf(exec), source: 'workspace' }
    }
    const probe = await sendQuiet(endpointOf(config), 'import bpy\nresult = {"filepath": bpy.data.filepath or None}\n')
    const filepath = typeof probe?.filepath === 'string' ? probe.filepath : undefined
    if (filepath === undefined || filepath === '') {
      return {
        root: workspaceOf(exec),
        source: 'blendFile-fallback',
        detail: '活动工程没有文件路径（尚未保存过），已回退到会话 workspace',
      }
    }
    return { root: dirname(filepath), source: 'blendFile' }
  }

  /**
   * 解析任务根目录（同步形态，供只读查询用；取不到 .blend 目录时回退 workspace）。
   *
   * @param {unknown} exec 执行上下文。
   * @returns {string} 绝对路径。
   */
  const taskRootOf = (exec) => (config.taskRoot.trim() === '' ? workspaceOf(exec) : config.taskRoot)

  /**
   * 发一段**只读**代码并取回 `result`；失败返回 undefined。
   *
   * 与 `lib/tools.js` 里的同名助手职责相同：这里的用途只是问一次活动工程路径。
   *
   * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint 端点。
   * @param {string} code 源码。
   * @returns {Promise<Record<string, any> | undefined>} 结果。
   */
  const sendQuiet = async (endpoint, code) => {
    try {
      const envelope = await sendExecute({ endpoint, code })
      if (envelope.status !== 'ok') return undefined
      return /** @type {Record<string, any>} */ (envelope.result ?? {})
    } catch {
      return undefined
    }
  }

  /**
   * 建立/复用任务目录。
   *
   * @param {unknown} exec 执行上下文。
   * @param {string} [taskName] 任务名。
   * @returns {Promise<import('./lib/taskDir.js').TaskDir>} 任务目录。
   */
  const ensureTask = async (exec, taskName) => {
    const resolved = await resolveTaskRoot(exec)
    if (resolved.source === 'blendFile-fallback') {
      console.warn(`[blender-mcp-bridge] ${resolved.detail}`)
    }
    return await ensureTaskDir({
      workspace: resolved.root,
      taskName: taskName ?? defaultTaskName(exec),
      sessionId: sessionIdOf(exec),
    })
  }

  /**
   * 只查找任务目录，不创建（status 是只读工具）。
   *
   * 只读工具**不得**为解析路径而额外发请求，因此统一用 workspace 形态解析；
   * `blendFile` 模式下两者的父目录不同，此时只读工具会返回 `taskRoot: null`
   * ——这是**有意的**：只读工具不该为了"看起来一致"而多打一次 add-on。
   *
   * @param {unknown} exec 执行上下文。
   * @param {string} [taskName] 任务名。
   * @returns {Promise<import('./lib/taskDir.js').TaskDir | undefined>} 任务目录或 undefined。
   */
  const findTask = async (exec, taskName) => await findExistingTaskDir({
    workspace: taskRootOf(exec),
    taskName: taskName ?? defaultTaskName(exec),
  })

  /**
   * 取检查点管理器（按「会话 + 任务目录」缓存）。
   *
   * 缓存键里带会话 id 是 I8 的落点：登记集合与轮换只作用于本会话建立的检查点，
   * 并发会话不会互相清理对方的备份。
   *
   * @param {string} sessionId 会话 id。
   * @param {import('./lib/taskDir.js').TaskDir} task 任务目录。
   * @returns {CheckpointManager} 管理器。
   */
  const checkpointsFor = (sessionId, task) => {
    const key = `${sessionId}\0${task.root}`
    let manager = managers.get(key)
    if (manager === undefined) {
      manager = new CheckpointManager({
        taskRoot: task.root,
        sessionId,
        endpoint: endpointOf(config),
        enabled: config.checkpoint.enabled,
        keep: config.checkpoint.keep,
        maxBytes: config.checkpoint.maxBytes,
      })
      managers.set(key, manager)
    }
    return manager
  }

  /**
   * 列出检查点（只读）。
   *
   * @param {import('./lib/taskDir.js').TaskDir} task 任务目录。
   * @returns {Promise<Array<Record<string, unknown>>>} 检查点描述。
   */
  const listCheckpoints = async (task) => {
    const manager = new CheckpointManager({
      taskRoot: task.root,
      sessionId: task.sessionId,
      endpoint: endpointOf(config),
      enabled: config.checkpoint.enabled,
      keep: config.checkpoint.keep,
      maxBytes: config.checkpoint.maxBytes,
    })
    return (await manager.list()).map(record => ({
      name: record.name,
      path: record.path,
      relative: displayPath(task.workspace, record.path),
      bytes: record.bytes,
      mtimeMs: record.mtimeMs,
      ageDays: Number(((Date.now() - record.mtimeMs) / 86_400_000).toFixed(2)),
    }))
  }

  /**
   * 本轮是否已落检查点。
   *
   * @param {string} sessionId 会话 id。
   * @param {import('./lib/taskDir.js').TaskDir | undefined} task 任务目录。
   * @param {number} turn 轮次。
   * @returns {boolean} 是否已落。
   */
  const roundHasCheckpoint = (sessionId, task, turn) => {
    if (task === undefined) return false
    const manager = managers.get(`${sessionId}\0${task.root}`)
    return manager === undefined ? false : manager.hasCheckpoint(turn)
  }

  /** @type {import('./lib/tools.js').ToolContext} */
  const context = {
    config,
    workspaceOf,
    turnOf,
    settingsBaseline,
    ensureTask,
    findTask,
    checkpointsFor,
    listCheckpoints,
    roundHasCheckpoint,
    pluginVersion: () => PLUGIN_VERSION,
    knownFingerprint: () => knownFingerprint,
    endpoint: () => endpointOf(config),
    rememberPort: (port) => {
      if (Number.isInteger(port) && port > 0 && port <= 65_535) discoveredPort = port
    },
    rememberFingerprint: (fingerprint) => {
      if (fingerprint !== undefined && fingerprint !== null) knownFingerprint = fingerprint
    },
  }

  if (config.expose.status) ctx.tools.register(defineTool(makeStatusDefinition(context)))
  if (config.expose.inspect) ctx.tools.register(defineTool(makeInspectDefinition(context)))
  if (config.expose.exec) ctx.tools.register(defineTool(makeExecDefinition(context)))
  if (config.expose.capture) ctx.tools.register(defineTool(makeCaptureDefinition(context)))
  if (config.expose.snapshot) ctx.tools.register(defineTool(makeSnapshotDefinition(context)))
  if (config.expose.docs) ctx.tools.register(defineTool(makeDocsDefinition(context)))
}

/**
 * 默认任务名：用会话 id 的短前缀，保证同一会话稳定复用同一个任务目录。
 *
 * 显式命名由 `blender_mcp_exec` / `blender_mcp_snapshot` / `blender_mcp_capture` 的 `task` 参数提供。
 *
 * @param {unknown} exec 执行上下文。
 * @returns {string} 任务名。
 */
function defaultTaskName(exec) {
  const id = sessionIdOf(exec)
  // 保留完整可读 id（只剥掉不适合做目录名的字符）；截断交给 slug 的长度上限处理
  const short = id.replace(/[^A-Za-z0-9_-]/gu, '').slice(0, 40)
  return short === '' ? 'task' : `session-${short}`
}

/**
 * 统一的工具输出声明：把领域结果原样序列化成一段文本。
 *
 * 字段名与结构由各工具自己保证，注册层不做二次改写——
 * 这样「返回字段名一经发布不改」（I23）只有一个来源。
 *
 * @returns {{schema: object, render: (args: unknown, value: unknown) => Array<{type: string, text: string}>}} 输出声明。
 */
function jsonOutput() {
  return {
    schema: { type: 'object', additionalProperties: true },
    render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  }
}

/**
 * 把工具实现包装成 `defineTool` 需要的定义。
 *
 * @param {string} name 工具名。
 * @param {string} description 工具描述（模型可见，必须如实写明边界）。
 * @param {Record<string, object>} parameters 参数 schema。
 * @param {(args: unknown, exec: unknown) => Promise<unknown>} execute 实现。
 * @param {boolean} concurrencySafe 是否声明并发安全。
 * @returns {object} 工具定义。
 */
function toolDefinition(name, description, parameters, execute, concurrencySafe) {
  return {
    name,
    description,
    parameters,
    isConcurrencySafe: () => concurrencySafe,
    output: jsonOutput(),
    async execute(args, exec) {
      return await execute(args, exec)
    },
  }
}

/**
 * `blender_mcp_status` 定义。
 *
 * @param {import('./lib/tools.js').ToolContext} context 工具上下文。
 * @returns {object} 工具定义。
 */
function makeStatusDefinition(context) {
  return toolDefinition(
    'blender_mcp_status',
    'Read-only handshake with the Blender MCP add-on: connection diagnostics, version gate, and the risk posture of the open scene '
      + '(file path, save status, age, available checkpoints, scene size, whether this round already has a checkpoint, and the evidence for choosing a rollback source). '
      + 'Call this before any write so you know how much is at stake. Never creates a task directory.',
    {},
    makeStatusTool(context),
    true,
  )
}

/**
 * `blender_mcp_inspect` 定义。
 *
 * @param {import('./lib/tools.js').ToolContext} context 工具上下文。
 * @returns {object} 工具定义。
 */
function makeInspectDefinition(context) {
  return toolDefinition(
    'blender_mcp_inspect',
    'Read-only structured snapshot of the connected Blender scene: file path, save status, render engine, frame range, collections, data-block counts, '
      + 'linked libraries, missing references, and per-object type/parent/collections/modifiers/mesh counts/materials. '
      + 'Does not modify the scene and does not write files.',
    {
      objectLimit: { type: 'number', description: 'Maximum objects to list (default 200).' },
    },
    makeInspectTool(context),
    true,
  )
}

/**
 * `blender_mcp_exec` 定义。
 *
 * @param {import('./lib/tools.js').ToolContext} context 工具上下文。
 * @returns {object} 工具定义。
 */
function makeExecDefinition(context) {
  return toolDefinition(
    'blender_mcp_exec',
    'Execute Python inside the connected Blender session — the only write channel. '
      + 'Set mutating=true before changing the scene so a checkpoint is written first; a failed checkpoint refuses the call. '
      + 'Leave mutating=false for read-only probes (no checkpoint, no files). '
      + 'Writes are limited to the task directory: out-of-scope writes and deletes are refused at two layers and come back with a suggested path, '
      + 'and the step that needs to happen outside must be performed by the user. '
      + 'Overwrite-saving the user file (bpy.ops.wm.save_mainfile / save_as_mainfile without copy=True) and changing preferences / add-on state are refused; '
      + 'use blender_mcp_snapshot to save. '
      + 'This is not a sandbox: dynamic tricks can bypass the checks, and executed code has the same network access as Blender itself.',
    {
      code: { type: 'string', required: true, description: 'Python source to run in Blender. Assign the JSON-serializable payload to `result`. NOTE: `bpy` is NOT pre-bound in the execution namespace — write `import bpy` yourself, otherwise the call silently returns an empty result.' },
      mutating: { type: 'boolean', description: 'True when this call changes the scene; a checkpoint is written first and a failure to write it refuses the call.' },
      task: { type: 'string', description: 'Optional task directory name (defaults to a stable per-session name). Outputs land in <workspace>/.dsh-blender-<task>/.' },
    },
    makeExecTool(context),
    false,
  )
}

/**
 * `blender_mcp_capture` 定义。
 *
 * @param {import('./lib/tools.js').ToolContext} context 工具上下文。
 * @returns {object} 工具定义。
 */
function makeCaptureDefinition(context) {
  return toolDefinition(
    'blender_mcp_capture',
    'Visual feedback: save a screenshot of the viewport, an area, or the whole window into the task directory (renders/). '
      + 'When called over the socket there may be no UI context, in which case each target is reported as unavailable with a reason instead of pretending to work. '
      + 'Only writes inside the task directory.',
    {
      target: { type: 'string', description: 'One of viewport / area / window (default viewport).' },
      name: { type: 'string', description: 'File name for the PNG (defaults to a timestamped name).' },
      task: { type: 'string', description: 'Optional task directory name (defaults to a stable per-session name).' },
    },
    makeCaptureTool(context),
    false,
  )
}

/**
 * `blender_mcp_snapshot` 定义。
 *
 * @param {import('./lib/tools.js').ToolContext} context 工具上下文。
 * @returns {object} 工具定义。
 */
function makeSnapshotDefinition(context) {
  return toolDefinition(
    'blender_mcp_snapshot',
    'Save the current Blender session as a .blend copy inside the task directory (exports/). '
      + 'This is the controlled alternative to overwrite-saving the user file: it never changes the session file path. '
      + 'Use it to preserve progress or to hand a checkpoint to the user.',
    {
      name: { type: 'string', required: true, description: 'File name for the copy; a .blend extension is added when missing.' },
      task: { type: 'string', description: 'Optional task directory name (defaults to a stable per-session name).' },
    },
    makeSnapshotTool(context),
    false,
  )
}

/**
 * `blender_mcp_docs` 定义。
 *
 * @param {import('./lib/tools.js').ToolContext} context 工具上下文。
 * @returns {object} 工具定义。
 */
function makeDocsDefinition(context) {
  return toolDefinition(
    'blender_mcp_docs',
    'Offline knowledge base over the embedded Blender Python API reference, the user manual, and the official curation rules. Read-only, no network. '
      + 'Use mode=api with an identifier (bpy.ops.object.add, bpy.types.Scene.*) for exact contracts, '
      + 'mode=search for full-text lookup, mode=rules for the recurring pitfalls when writing Blender Python. '
      + 'Consult it before writing operator calls: most errors come from misremembered API signatures, enum values, and preconditions. '
      + 'If it reports available=false the embedded index is missing or damaged — that is a packaging defect, not a configuration problem.',
    {
      mode: { type: 'string', description: 'api / search / rules (default search).' },
      identifier: { type: 'string', description: 'mode=api: identifier to look up; supports `*` and `X.*` enumeration.' },
      query: { type: 'string', description: 'mode=search: full-text query.' },
      maxResults: { type: 'number', description: 'mode=search: maximum hits (1–50; defaults to the knowledge.maxHits setting, 8 unless configured).' },
      context: { type: 'number', description: 'mode=search: symmetric context window (default 0).' },
      index: { type: 'number', description: 'mode=search: hit index to drill into.' },
    },
    makeDocsTool(context),
    true,
  )
}