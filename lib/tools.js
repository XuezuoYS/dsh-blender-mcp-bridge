// SPDX-License-Identifier: GPL-3.0-or-later
// 工具实现层：6 个工具的领域逻辑与结果规范化。
//
// 副作用边界：`inspect` / `docs` 只读；`exec` 经 L1 静态判定 + 检查点 + L2 运行时护栏后才发送；
// `snapshot` / `capture` 只在任务目录内写盘。所有落点由插件派生，不采信调用方给的目录。

import { readFile, readdir, stat } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  CheckpointManager,
  evaluateUndoPrecheck,
  pickRestoreSource,
  restoreCapabilityNotice,
} from './checkpoint.js'
import { compareVersions, computeDrift, diagnose, readExtensionManifest } from './diagnostics.js'
import { buildGuardPayload, wrapWithFinalizer } from './guardPayload.js'
import { pythonLiteral, sendExecute } from './protocol.js'
import { scanRequest } from './requestPolicy.js'
import { diffSettings, readRenderSettings } from './settingsGuard.js'
import { listTaskDirs } from './taskDir.js'

/** 结果里的 `status` 取值。字段名一经发布不改（I23）。 */
export const STATUS = {
  ok: 'ok',
  blocked: 'blocked',
  refused: 'refused',
  error: 'error',
}

/** 检查点机制自己的存盘出口用的相对目录。 */
const EXPORTS_DIR = 'exports'
/** 截图落点。 */
const RENDERS_DIR = 'renders'

/**
 * 工具上下文（由 `index.js` 组装）。
 *
 * @typedef {object} ToolContext
 * @property {import('../index.js').ResolvedConfig} config 生效配置。
 * @property {(exec: unknown) => string} workspaceOf 取会话 workspace。
 * @property {(sessionId: string) => number} turnOf 取会话当前轮次。
 * @property {import('./settingsGuard.js').SettingsBaseline} settingsBaseline 渲染/导出设置的会话基线。
 * @property {(exec: unknown, taskName?: string) => Promise<import('./taskDir.js').TaskDir>} ensureTask 建立/复用任务目录。
 * @property {(exec: unknown, taskName?: string, blendDir?: string) => Promise<import('./taskDir.js').TaskDir | undefined>} findTask 只查找任务目录（`blendDir` = 只读路径已拿到的活动工程目录）。
 * @property {(sessionId: string, task: import('./taskDir.js').TaskDir) => CheckpointManager} checkpointsFor 取检查点管理器。
 * @property {(task: import('./taskDir.js').TaskDir) => Promise<Array<Record<string, unknown>>>} listCheckpoints 列出检查点。
 * @property {(sessionId: string, task: import('./taskDir.js').TaskDir|undefined, turn: number) => Promise<boolean>} roundHasCheckpoint 本轮是否已落检查点（内存登记 ∪ 磁盘）。
 * @property {() => string} pluginVersion 插件版本。
 * @property {() => {blenderVersion?: string}|undefined} knownFingerprint 本进程**最近一次已知**的指纹。
 *   只读缓存：知识库要拿它算漂移，但**不得**为这件事去敲 add-on（I19）。没有就返回 undefined。
 * @property {(fingerprint: {blenderVersion?: string}|undefined) => void} rememberFingerprint 记下已知指纹。
 * @property {() => {host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint
 *   取**实际该用的**端点：配置端口，或端口扫描握手成功后的那个端口（`allowPortScan`）。
 *   所有工具必须走同一个端点，否则扫描找到对端之后，其余工具会打到配置端口上的另一个服务。
 * @property {(port: number|undefined) => void} rememberPort 记下扫描实际握手成功的端口。
 */

/**
 * 从执行上下文取会话 id。
 *
 * `exec.agent.session.id` 是唯一可靠来源；取不到时退化为固定串而不是抛错——
 * 缺 id 只会让归属判定变粗，不该让工具整体失败。
 *
 * @param {unknown} exec 执行上下文。
 * @returns {string} 会话 id。
 */
export function sessionIdOf(exec) {
  const session = /** @type {{agent?: {session?: {id?: unknown}}}} */ (exec)?.agent?.session
  const id = session?.id
  return typeof id === 'string' && id !== '' ? id : 'unknown-session'
}

/**
 * 从执行上下文取会话 workspace。
 *
 * Blender 进程的 cwd 在 `Program Files` 下（**实测**），所以相对路径落不到 workspace——
 * 任务目录必须由这里派生，不能用相对路径。
 *
 * @param {unknown} exec 执行上下文。
 * @returns {string} 绝对路径；取不到时用 `process.cwd()`。
 */
export function workspaceOf(exec) {
  const session = /** @type {{agent?: {session?: {header?: {cwd?: unknown}}}}} */ (exec)?.agent?.session
  const cwd = session?.header?.cwd
  return typeof cwd === 'string' && cwd !== '' ? cwd : process.cwd()
}

/**
 * 发一段**只读**代码并取回 `result`；失败或非 ok 返回 undefined。
 *
 * 用途是取"当前渲染/导出设置"这类现场事实。只读工具因此**不需要**创建任务目录（I14）。
 *
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint 端点。
 * @param {string} code 源码。
 * @returns {Promise<Record<string, any> | undefined>} 结果或 undefined。
 */
async function sendReadOnly(endpoint, code) {
  // 曾经这里有一份与 sendQuiet 逐字相同的实现（F8）：两份"失败返回 undefined"的副本
  // 一定会漂移（一份加日志、一份不加），所以只留一个真身。
  return await sendQuiet(endpoint, code)
}

/**
 * 采集当前渲染/导出设置（只读）。
 *
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint 端点。
 * @returns {Promise<Record<string, unknown> | undefined>} 设置快照。
 */
async function captureSettings(endpoint) {
  return await readRenderSettings({ send: async (code) => await sendReadOnly(endpoint, code) })
}

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

/**
 * `blender_mcp_status`：只读握手 + 风险姿态。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {(args: unknown, exec: unknown) => Promise<Record<string, unknown>>} 执行函数。
 */
export function makeStatusTool(context) {
  return async (rawArgs, exec) => {
    const args = /** @type {{task?: unknown}} */ (rawArgs ?? {})
    const taskName = typeof args.task === 'string' && args.task !== '' ? args.task : undefined
    const endpoint = context.endpoint()
    const sessionId = sessionIdOf(exec)
    const turn = context.turnOf(sessionId)

    const diagnosis = await diagnose({
      endpoint,
      requireVersionMin: context.config.requireVersionMin,
      rejectForeignPeer: context.config.rejectForeignPeer,
      allowPortScan: context.config.allowPortScan,
      portCandidates: context.config.portCandidates,
    })

    /** @type {Record<string, unknown>} */
    const out = {
      status: diagnosis.kind === 'ok' ? STATUS.ok : STATUS.error,
      diagnosis: {
        kind: diagnosis.kind,
        summary: diagnosis.summary,
        actions: diagnosis.actions,
      },
      pluginVersion: context.pluginVersion(),
      endpoint: {
        host: context.config.host,
        port: diagnosis.activePort ?? context.config.port,
        configuredPort: context.config.port,
        attemptedPorts: diagnosis.attemptedPorts ?? [context.config.port],
      },
      versionGate: { required: context.config.requireVersionMin, manifestMin: diagnosis.manifest?.blenderVersionMin },
    }

    if (diagnosis.fingerprint !== undefined) {
      const knowledge = await readKnowledgeMeta()
      out.fingerprint = diagnosis.fingerprint
      out.extension = diagnosis.manifest
      out.drift = computeDrift(knowledge?.blenderVersion, diagnosis.fingerprint.blenderVersion)
      // 记下"本进程已知哪个版本在跑"：docs 工具算漂移时用得上，而它自己不许敲 add-on（I19）
      context.rememberFingerprint(diagnosis.fingerprint)
      // 扫描找到的端口必须被记住：否则后续工具仍打配置端口（那是另一个服务）
      if (diagnosis.activePort !== undefined) context.rememberPort(diagnosis.activePort)
      out.riskPosture = await readRiskPosture(context, exec, sessionId, turn, taskName)
      // 渲染/导出设置：让"用户原本的设置"与"当前设置"都可核对（软限制的可见性那一半）
      const settings = await captureSettings(context.endpoint())
      if (settings !== undefined) {
        const baseline = context.settingsBaseline.get(sessionId)
        out.renderSettings = settings
        out.settingsBaseline = baseline ?? null
        out.settingsDrift = diffSettings(baseline, settings)
        // 与 exec 侧同义：空 settingsDrift 只有在基线已知时才可解读为"没改"
        out.settingsBaselineKnown = baseline !== undefined
      }
    }

    return out
  }
}

/**
 * 组装风险姿态：文件路径 / 是否脏 / 距今 / 可用检查点 / 场景规模 / 本轮检查点。
 *
 * 只读工具**不创建任务目录**（I14）：找不到既有目录就返回 `taskRoot: null`。
 *
 * @param {ToolContext} context 工具上下文。
 * @param {unknown} exec 执行上下文。
 * @param {string} sessionId 会话 id。
 * @param {number} turn 轮次。
 * @param {string} [taskName] 任务目录名（缺省用会话稳定名）。
 * @returns {Promise<Record<string, unknown>>} 风险姿态。
 */
async function readRiskPosture(context, exec, sessionId, turn, taskName) {
  const summary = await readSceneSummary(context.endpoint())
  // 只读工具**不额外发请求**：活动工程路径就在上面这次只读采集里
  const filepath = typeof summary?.filepath === 'string' && summary.filepath !== '' ? summary.filepath : undefined
  const blendDir = filepath === undefined ? undefined : dirname(filepath)
  const task = await context.findTask(exec, taskName, blendDir)
  const parent = task?.workspace ?? blendDir ?? context.config.taskRoot.trim()

  /** @type {Record<string, unknown>} */
  const posture = {
    path: summary?.filepath ?? null,
    saveStatus: summary?.isDirty === true ? 'dirty' : 'saved',
    ageDays: null,
    taskRoot: task?.root ?? null,
    taskName: task?.name ?? null,
    // 目录清理靠**可见性**：列出同级既有工作目录，模型据此就"要不要删旧的"询问用户；
    // 删除始终由用户自己做（AGENTS.md 基础安全需要第 2 条）。
    existingTaskDirs: parent === ''
      ? { parent: null, dirs: [], note: '无法确定工作目录的父目录：活动工程未保存且未配置 taskRoot' }
      : { parent, dirs: await listTaskDirs(parent) },
    backups: [],
    roundHasCheckpoint: await context.roundHasCheckpoint(sessionId, task, turn),
    scene: {
      objects: summary?.objects ?? null,
      collections: summary?.collections ?? null,
      triangles: summary?.triangles ?? null,
    },
  }

  if (filepath !== undefined) {
    try {
      const info = await stat(filepath)
      posture.fileAgeDays = Number(((Date.now() - info.mtimeMs) / 86_400_000).toFixed(2))
      posture.pathMtimeMs = info.mtimeMs
    } catch {
      posture.fileAgeDays = null
    }
  }

  if (task !== undefined) {
    posture.backups = await context.listCheckpoints(task)
    const latest = await latestCheckpointRecord(context, task)
    let userMtimeMs
    if (filepath !== undefined) {
      try {
        userMtimeMs = (await stat(filepath)).mtimeMs
      } catch {
        userMtimeMs = undefined
      }
    }
    if (latest !== undefined || filepath !== undefined) {
      const pick = pickRestoreSource(
        latest === undefined ? undefined : { path: latest.path, mtimeMs: latest.mtimeMs },
        filepath === undefined || userMtimeMs === undefined
          ? undefined
          : { path: filepath, mtimeMs: userMtimeMs },
      )
      posture.restoreEvidence = {
        checkpointPath: latest?.path ?? null,
        checkpointMtimeMs: latest?.mtimeMs ?? null,
        userFilePath: filepath ?? null,
        userFileMtimeMs: userMtimeMs ?? null,
        choice: pick.source,
        reason: pick.reason,
        capabilityNotice: restoreCapabilityNotice(),
      }
    }
    // undo 前置条件**独立于上面的 if**：它只依赖任务目录里的基线。
    // 挂在 restoreEvidence 里面会让它在"既无检查点也无用户文件"时整个消失，
    // 而"没有用户文件"恰恰是最需要这份证据的情形（工程从未保存过）。
    posture.undoPrecheck = await evaluateUndoPrecheck(task.root, filepath)

    // **完成态交接**（I26）：与"被拒时的 handoff"是两件事。这里把"接下来该由谁做什么"摊开，
    // 免得一次顺利的任务让人以为"AI 已经替我保存了"——本插件从不保存用户的文件。
    const backups = posture.backups
    posture.sessionChecklist = {
      isDirty: summary?.isDirty === true,
      willBeSavedByPlugin: false,
      taskRoot: task.root,
      checkpointCount: Array.isArray(backups) ? backups.length : 0,
      snapshotFiles: await listSnapshotFiles(task.root),
      nextSteps: [
        '本插件**不会**覆盖保存 .blend；改动在用户按 Ctrl+Z 可回退的 undo 历史里',
        '要留档或交付：用 blender_mcp_snapshot 写任务目录副本（或让用户自己保存）',
        '要出图：请用户按 F12（本通道的 exec 有 30 s 上限，高采样请走 Blender 自己的渲染）',
        '任务目录不删除；同级目录过多时**询问用户**是否清理',
      ],
    }
  }

  return posture
}

/**
 * 列出任务目录 `exports/` 下的产物（只读；目录不存在返回空数组）。
 *
 * @param {string} taskRoot 任务目录。
 * @returns {Promise<string[]>} 文件名列表（最多 20 条）。
 */
async function listSnapshotFiles(taskRoot) {
  try {
    return (await readdir(join(taskRoot, EXPORTS_DIR))).sort().slice(0, 20)
  } catch {
    return []
  }
}

/**
 * 取最新一条检查点记录（含 mtime）。
 *
 * 这里刻意**不**用 `checkpointsFor`（那会新建一个登记集合为空的实例）；
 * 直接读磁盘更诚实：报告的是"任务目录里真实存在的最新检查点"。
 *
 * @param {ToolContext} context 工具上下文。
 * @param {import('./taskDir.js').TaskDir} task 任务目录。
 * @returns {Promise<{path: string, mtimeMs: number} | undefined>} 最新检查点。
 */
async function latestCheckpointRecord(context, task) {
  const listed = await context.listCheckpoints(task)
  /** @type {{path: string, mtimeMs: number} | undefined} */
  let latest
  for (const item of listed) {
    const path = typeof item.path === 'string' ? item.path : undefined
    const mtimeMs = typeof item.mtimeMs === 'number' ? item.mtimeMs : undefined
    if (path === undefined || mtimeMs === undefined) continue
    if (latest === undefined || mtimeMs > latest.mtimeMs) latest = { path, mtimeMs }
  }
  return latest
}

/**
 * 只读读取场景摘要（风险姿态用）。
 *
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint 端点。
 * @returns {Promise<Record<string, any> | undefined>} 摘要。
 */
async function readSceneSummary(endpoint) {
  const code = `
import bpy

_scene = getattr(bpy.context, "scene", None)
_triangles = 0
_objects = 0
try:
    for _obj in bpy.data.objects:
        _objects += 1
        _mesh = getattr(_obj, "data", None)
        if _mesh is not None and hasattr(_mesh, "loop_triangles"):
            _mesh.calc_loop_triangles()
            _triangles += len(_mesh.loop_triangles)
except Exception:
    pass

# 5.2 的 Python API 不暴露 undo 栈（实测：Scene.undo_history / WindowManager.history_active
# 均不存在），所以这里**不放**任何"栈深度"字段——放一个恒为 None 的字段只会让调用方误以为
# 能比对。唯一的 undo 可观测量是 memory_usage_undo，但它只对本插件的 undo_push 跳变
# （实测：对 primitive_cube_add / object.delete / 属性写入都不敏感），当不了增长指标。
result = {
    "filepath": bpy.data.filepath or None,
    "isDirty": bool(bpy.data.is_dirty),
    "objects": _objects,
    "triangles": _triangles,
    "collections": len(bpy.data.collections),
    "scene": getattr(_scene, "name", None),
}
`
  const outcome = await sendQuiet(endpoint, code)
  return outcome ?? undefined
}

// ---------------------------------------------------------------------------
// inspect
// ---------------------------------------------------------------------------

/**
 * `blender_mcp_inspect`：只读结构化场景快照。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {(args: unknown, exec: unknown) => Promise<Record<string, unknown>>} 执行函数。
 */
export function makeInspectTool(context) {
  return async (rawArgs, _exec) => {
    const args = /** @type {{objectLimit?: number}} */ (rawArgs ?? {})
    const objectLimit = clampNumber(args.objectLimit, 1, 2000, 200)

    const code = `
import json
import bpy

_SCENE = getattr(bpy.context, "scene", None)
_LIMIT = ${pythonLiteral(objectLimit)}

def _vec(value):
    try:
        return [round(float(x), 4) for x in value]
    except Exception:
        return None

def _object_info(obj):
    info = {"name": obj.name, "type": obj.type}
    try:
        info["pointer"] = obj.as_pointer()
    except Exception:
        pass
    try:
        info["parent"] = obj.parent.name if obj.parent is not None else None
    except Exception:
        info["parent"] = None
    try:
        info["collections"] = [c.name for c in obj.users_collection]
    except Exception:
        info["collections"] = []
    try:
        info["modifiers"] = [{"name": m.name, "type": m.type} for m in obj.modifiers]
    except Exception:
        info["modifiers"] = []
    try:
        info["materials"] = [s.material.name if s.material is not None else None for s in obj.material_slots]
    except Exception:
        info["materials"] = []
    try:
        info["location"] = _vec(obj.location)
    except Exception:
        pass
    try:
        info["hidden"] = bool(obj.hide_viewport or obj.hide_render)
    except Exception:
        pass
    data = getattr(obj, "data", None)
    if data is not None:
        try:
            entry = {"dataName": getattr(data, "name", None)}
            if hasattr(data, "polygons"):
                entry["polygons"] = len(data.polygons)
            if hasattr(data, "vertices"):
                entry["vertices"] = len(data.vertices)
            if hasattr(data, "edges"):
                entry["edges"] = len(data.edges)
            if hasattr(data, "loop_triangles"):
                data.calc_loop_triangles()
                entry["triangles"] = len(data.loop_triangles)
            info["mesh"] = entry
        except Exception:
            pass
    return info

def _counts():
    out = {}
    for key in ("objects", "collections", "meshes", "materials", "lights", "cameras", "images",
                "textures", "armatures", "curves", "actions", "node_groups", "worlds", "scenes"):
        try:
            out[key] = len(list(getattr(bpy.data, key)))
        except Exception:
            out[key] = None
    return out

def _collections():
    out = []
    for coll in bpy.data.collections:
        try:
            out.append({
                "name": coll.name,
                "objects": len(coll.objects),
                "children": [c.name for c in coll.children],
                "linked": coll.library is not None,
            })
        except Exception:
            pass
    return out

def _libraries():
    out = []
    try:
        for lib in bpy.data.libraries:
            out.append({"name": lib.name, "filepath": lib.filepath, "users": lib.users})
    except Exception:
        pass
    return out

def _missing_references():
    missing = []
    try:
        for obj in bpy.data.objects:
            for slot in getattr(obj, "material_slots", []):
                if slot.material is None:
                    missing.append({"object": obj.name, "kind": "material", "slot": slot.name})
        for coll in bpy.data.collections:
            if coll.library is not None and coll.library.filepath and not coll.library.filepath.startswith("//"):
                pass
    except Exception:
        pass
    return missing

_objects = [_object_info(o) for o in list(bpy.data.objects)[:_LIMIT]]
result = {
    "filepath": bpy.data.filepath or None,
    "isDirty": bool(bpy.data.is_dirty),
    "scene": getattr(_SCENE, "name", None),
    "renderEngine": getattr(getattr(_SCENE, "render", None), "engine", None),
    "frame": {"current": getattr(_SCENE, "frame_current", None), "start": getattr(_SCENE, "frame_start", None), "end": getattr(_SCENE, "frame_end", None)},
    "counts": _counts(),
    "collections": _collections(),
    "libraries": _libraries(),
    "missingReferences": _missing_references(),
    "objects": _objects,
    "objectsTotal": len(bpy.data.objects),
    "objectsTruncated": len(bpy.data.objects) > _LIMIT,
    "activeObject": getattr(getattr(bpy.context, "active_object", None), "name", None),
    "selectedObjects": [o.name for o in getattr(bpy.context, "selected_objects", [])],
    "mode": getattr(getattr(bpy.context, "mode", None), "__str__", lambda: None)(),
}
`
    const envelope = await sendExecute({ endpoint: context.endpoint(), code })
    const payload = unwrapEnvelope(envelope)
    if (payload === undefined) {
      return {
        status: STATUS.error,
        error: structuredError('inspect-failed', envelope, undefined),
      }
    }
    return { status: STATUS.ok, ...payload }
  }
}

/**
 * 发一次请求；**传输层异常也结构化**（报告 P1-7）。
 *
 * 起因：`sendExecute` 抛错时（socket 断开、对端半死、超时）此前会把 traceback 直抛给模型，
 * 于是模型看到一段 Node 栈而不是"哪一步失败了、下一步做什么"。
 * 传输失败是**预期内**的失败模式（用户会关 Blender），必须走与其它失败同一条路。
 *
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint 端点。
 * @param {string} code 源码。
 * @param {number|undefined} deferredTimeoutMs deferred 读窗口（不传表示不启用）。
 * @returns {Promise<{envelope?: import('./protocol.js').ExecEnvelope, error?: Record<string, unknown>}>} 结果或结构化错误。
 */
async function sendStructured(endpoint, code, deferredTimeoutMs) {
  try {
    const envelope = await sendExecute(deferredTimeoutMs === undefined
      ? { endpoint, code }
      : { endpoint, code, deferredTimeoutMs })
    return { envelope }
  } catch (error) {
    return {
      error: {
        kind: 'transport-failed',
        message: truncate(/** @type {Error} */ (error)?.message ?? String(error), 2000),
        hint: '与 Blender 的 socket 通信失败。用 blender_mcp_status 确认 add-on 还在跑、端口一致；'
          + '场景改动没有被提交（本次请求没有到达 Blender）。',
      },
    }
  }
}

// ---------------------------------------------------------------------------
// exec
// ---------------------------------------------------------------------------

/**
 * `blender_mcp_exec`：唯一执行通道。
 *
 * 顺序（../docs/contract.md#guard / #checkpoint）：
 * 1. L1 静态判定——命中则**根本不发送**；
 * 2. `mutating=true` 时**先落检查点**，写盘失败即拒绝执行（I1）；
 * 3. 拼上 L2 护栏载荷后发送；
 * 4. 从 stderr 哨兵取回 guard / changes / risk_notes。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {(args: unknown, exec: unknown) => Promise<Record<string, unknown>>} 执行函数。
 */
export function makeExecTool(context) {
  return async (rawArgs, exec) => {
    const args = /** @type {{code?: unknown, mutating?: unknown, task?: unknown}} */ (rawArgs ?? {})
    const code = typeof args.code === 'string' ? args.code : ''
    const mutating = args.mutating === true
    const taskName = typeof args.task === 'string' && args.task !== '' ? args.task : undefined

    if (code.trim() === '') {
      return { status: STATUS.refused, reason: 'empty-code', handoff: '把要执行的 Python 放进 code 参数。' }
    }

    // --- 需要 Blender cwd 才能正确解析相对路径；同时把设置基线一次取回 ---
    // **合并往返**：此前这里是"指纹一次 + 设置一次"两次 exec，加上执行本身与执行后的设置，
    // 一次调用要 5 次 socket 往返。指纹与设置都是只读、都在同一侧、都必须在用户代码**之前**读，
    // 合并成一次既省往返，也把"基线必须在改动之前取"这条纪律从注释变成代码结构。
    const pre = await readRuntimeContext(context)
    const fingerprint = pre.fingerprint
    if (fingerprint === undefined) {
      const diagnosis = await diagnose({
        endpoint: context.endpoint(),
        requireVersionMin: context.config.requireVersionMin,
        rejectForeignPeer: context.config.rejectForeignPeer,
        allowPortScan: context.config.allowPortScan,
        portCandidates: context.config.portCandidates,
      })
      if (diagnosis.activePort !== undefined) context.rememberPort(diagnosis.activePort)
      return {
        status: STATUS.error,
        executed: false,
        error: { kind: diagnosis.kind, message: diagnosis.summary, actions: diagnosis.actions },
      }
    }
    if (context.config.rejectForeignPeer
      && compareVersions(context.config.requireVersionMin, fingerprint.blenderVersion) > 0) {
      return {
        status: STATUS.refused,
        executed: false,
        reason: 'version-too-old',
        handoff: `需要 Blender >= ${context.config.requireVersionMin}，当前 ${fingerprint.blenderVersion}。`,
      }
    }

    const task = await context.ensureTask(exec, taskName)
    const sessionId = sessionIdOf(exec)
    const turn = context.turnOf(sessionId)
    // exec 本来就为了取 Blender cwd 读了一次指纹，顺手记下版本（docs 只读它，不再敲 add-on）
    context.rememberFingerprint(fingerprint)

    // --- 1. L1 静态判定（Node 侧，发送之前）---
    const scan = scanRequest({ code, allowRoot: task.root, blenderCwd: fingerprint.cwd })
    if (scan.blocked) {
      /** @type {Record<string, unknown>[]} */
      const allHits = scan.issues.map(hit => ({
        rule: hit.rule,
        offset: hit.offset,
        pathKind: hit.pathKind,
        path: hit.path ?? null,
        evidence: hit.evidence,
        explanation: hit.explanation,
      }))
      return {
        status: STATUS.blocked,
        executed: false,
        guard: { layer: 'L1', verified: true },
        blocked: {
          blocked_path: scan.blockedPath ?? null,
          reason: scan.reason,
          suggested_path: scan.suggestedPath ?? null,
          handoff: scan.handoff,
          evidence: scan.hit?.evidence ?? null,
          explanation: scan.hit?.explanation ?? null,
          // 命中 ≥2 条时才出现：报告实测"三个越界载荷同发只报第一个命中"，
          // 对审计一次 payload 的全部风险面不够（../docs/contract.md#interception）。
          ...allHits.length < 2 ? {} : { blockedAll: allHits },
        },
        issues: scan.issues,
      }
    }

    // --- 2. 写前检查点（硬失败）---
    /** @type {import('./checkpoint.js').CheckpointOutcome | undefined} */
    let checkpoint
    if (mutating) {
      const manager = context.checkpointsFor(sessionId, task)
      try {
        checkpoint = await manager.ensureForTurn(turn)
      } catch (error) {
        return {
          status: STATUS.refused,
          executed: false,
          reason: 'checkpoint-failed',
          error: { kind: 'checkpoint-failed', message: /** @type {Error} */ (error).message },
          handoff: '检查点写盘失败时不执行任何写操作（I1）。请检查磁盘空间与任务目录权限后重试。',
        }
      }
    }

    // --- 3. 执行**之前**把用户的渲染/导出设置记成基线 ---
    // 顺序即正确性：基线若在 exec 之后采，那么"首次 exec 改了什么"永远报不出来，
    // 而且首次改动会被当成用户原本的设置固化进基线（实测：这正是 samples 4096→256 那次事故的形态）。
    // 这里的设置来自上面 `readRuntimeContext` 的那**一次**读取，失败静默——它不该影响执行本身。
    if (pre.settings !== undefined) context.settingsBaseline.remember(sessionId, pre.settings)

    // --- 4. 拼载荷并发送 ---
    const guardPayload = buildGuardPayload({
      allowRoot: task.root,
      threadScope: context.config.intercept.guardThreadScope,
      enabled: context.config.intercept.enabled,
    })
    const wrapped = wrapWithFinalizer(guardPayload, code)

    // 长任务走 deferred：代码里定义了 `check_is_finished` 时 add-on 会先回一个空信封、
    // 之后在同一连接上异步给出最终结果，所以读窗口必须放宽（../docs/contract.md#transport-deferred）。
    // 这不是"猜"：判定依据是用户代码里是否存在该可调用名，宽松只会让等待更久、不会提前放弃。
    const sent = await sendStructured(
      context.endpoint(),
      wrapped,
      usesDeferred(code) ? context.config.deferredTimeoutMs : undefined,
    )
    if (sent.envelope === undefined) {
      return { status: STATUS.error, executed: false, error: sent.error }
    }
    const envelope = sent.envelope
    const meta = extractGuardMeta(envelope)
    const payload = /** @type {Record<string, unknown>} */ (envelope.result ?? {})

    // 执行后只取当前值，**基线来自执行之前**（见上面第 3 步）。
    const settings = await captureSettings(context.endpoint())
    const settingsBaseline = context.settingsBaseline.get(sessionId)
    const settingsDrift = diffSettings(settingsBaseline, settings)

    /** @type {string[]} */
    const warnings = [...(checkpoint?.warnings ?? [])]
    if (meta?.risk_notes !== undefined && meta.risk_notes.length > 0) warnings.push(...meta.risk_notes)
    if (settingsDrift.length > 0) {
      warnings.push(
        `本次会话已改动用户的渲染/导出设置 ${settingsDrift.length} 项：`
        + settingsDrift.map(item => `${item.key} ${JSON.stringify(item.from)}→${JSON.stringify(item.to)}`).join('、')
        + '。若这不是用户要求的，请还原。',
      )
    }
    // "没有基线"与"没有漂移"是两件事，必须分开说：前者是**不知道**，后者才是**没改**。
    // 系统提示教模型"看到 settingsDrift 非空就还原"，若空数组同时代表两种含义，那条指令就失效了。
    if (settingsBaseline === undefined && settings !== undefined) {
      warnings.push('未能取得本会话的渲染/导出设置基线（首次采集失败或 Blender 不可达），'
        + '因此本次的 settingsDrift 为空**不代表**用户设置没被改动。')
    }

    /** @type {Record<string, unknown>} */
    const out = {
      status: envelope.status === 'ok' ? STATUS.ok : STATUS.error,
      executed: true,
      result: payload,
      checkpoint: checkpoint === undefined
        ? { created: false, path: null, note: '本次未标记 mutating，未落检查点' }
        : { created: checkpoint.created, path: checkpoint.path ?? null, bytes: checkpoint.bytes ?? null, turn: checkpoint.turn ?? null },
      undo: checkpoint === undefined
        ? { channel: 'not-applicable' }
        : { pushed: checkpoint.undoPushed, channel: checkpoint.undoChannel },
      guard: {
        layer: 'L2',
        verified: meta?.intact === true,
        opsProxyIntact: meta?.intact === true,
        tampered: meta?.tampered === true,
        reinstalls: meta?.reinstalls ?? null,
        // I16 的**证据**而不是愿望：收尾卸载后当场自查留下的钩子（见 guardPayload 的 residual）
        residualHooks: Array.isArray(meta?.residual) ? meta.residual : null,
        hooksUnloaded: meta !== undefined && meta.residual?.length === 0 && meta.enabledAfter === false,
        // **覆盖窗口的实际边界**（../docs/contract.md#guard）：回到调用方之后钩子就卸了。
        // 报告实测事故：一次 `INVOKE_DEFAULT` 起的渲染在 exec 返回**之后**写出文件，
        // 而 `hooksUnloaded: true` 给人一种"全程覆盖"的错觉。这句话就是给那个错觉的答案。
        window: typeof meta?.window === 'string' ? meta.window : 'exec（主线程同步期间）',
        jobsRunning: Array.isArray(meta?.jobsRunning) ? meta.jobsRunning : null,
      },
      issues: scan.issues,
      warnings,
      // **完成态交接**（I26）：每次返回都在，不只在被拒时。
      // 此前只有"被拒时的接管话术"，一次顺利的建模任务不会提醒模型做任何收尾汇报——
      // 用户很容易以为"AI 已经把结果保存了"，而本插件**从不保存**他的文件。
      handoffHint: handoffHintFor(pre.settings),
    }

    if (settings !== undefined) out.renderSettings = settings
    if (settingsBaseline !== undefined) out.settingsBaseline = settingsBaseline
    // 三态可见：true = 有基线（此时 settingsDrift 为空才真的等于"没改"）；
    // false = 无基线（此时 settingsDrift 为空**不可解读**）。字段缺失同样表示未知。
    out.settingsBaselineKnown = settingsBaseline !== undefined
    if (settingsDrift.length > 0) out.settingsDrift = settingsDrift

    if (meta?.changes !== undefined && meta.changes !== null) {
      out.changes = summarizeChanges(meta.changes)
    }
    // 放行但要记账的调用（L2 的 `noted`）：此前它只在原始 stdout 里，等于看不见——
    // 于是"copy=True 往任务目录外写"这类**被放行**的动作没有任何结构化痕迹（F9）。
    if (Array.isArray(meta?.noted) && meta.noted.length > 0) out.noticed = meta.noted
    if (envelope.stdout !== undefined) out.stdout = truncate(stripGuardSentinels(envelope.stdout), context.config.maxResponseChars)
    if (envelope.stderr !== undefined) out.stderr = truncate(stripGuardSentinels(envelope.stderr), context.config.maxResponseChars)

    if (envelope.status !== 'ok') {
      out.error = structuredError('execution-failed', envelope, meta)
      out.status = STATUS.error
    }

    // **部分生效**：异常结束时，此前的改动**已经留在场景里**（报告实测：40+ 次 exec 里 14 次
    // 以 Python 异常结束，每次都留下半成品，而返回体里没有任何字段提示这件事）。
    const changedCount = countChanges(meta?.changes)
    if (out.status === STATUS.error && changedCount > 0) {
      out.partial = true
      warnings.push(
        `本次执行以异常结束，但其间的 ${changedCount} 项改动**已保留在场景里**；`
        + (checkpoint?.path === undefined || checkpoint.path === null
          ? '本次未落检查点，回滚需要用户自己决定。'
          : `可回滚到检查点 ${checkpoint.path}（整文件级）。`),
      )
    }

    // 护栏被改写 = 本次执行的安全前提不成立：按失败处理并点名（../docs/contract.md#tools-result-fields）
    if (meta !== undefined && meta.intact !== true) {
      out.status = STATUS.error
      out.error = {
        kind: 'guard-not-verified',
        message: '护栏自检未通过：bpy.ops 代理在收尾前已不在位。本次执行的安全前提不成立，请人工复核这次改动的后果。',
      }
    }
    if (meta !== undefined && meta.blocked !== undefined && meta.blocked.length > 0) {
      out.blocked = {
        reason: 'runtime-guard',
        events: meta.blocked,
        handoff: `运行时护栏拦下了 ${meta.blocked.length} 次越界写/删。可写范围只有任务目录 ${task.root}；`
          + '需要在别处落盘时，请让用户自己完成这一步。',
        suggested_path: join(task.root, EXPORTS_DIR),
      }
      if (out.status === STATUS.ok) out.status = STATUS.blocked
    }

    out.taskRoot = task.root
    out.taskName = task.name
    return out
  }
}

// ---------------------------------------------------------------------------
// snapshot
// ---------------------------------------------------------------------------

/**
 * `blender_mcp_snapshot`：把会话存成任务目录内的 `.blend` 副本。
 *
 * `copy=True` 已实测**不改动会话当前文件路径**（../docs/contract.md#checkpoint）。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {(args: unknown, exec: unknown) => Promise<Record<string, unknown>>} 执行函数。
 */
export function makeSnapshotTool(context) {
  return async (rawArgs, exec) => {
    const args = /** @type {{name?: unknown, task?: unknown}} */ (rawArgs ?? {})
    const rawName = typeof args.name === 'string' && args.name !== '' ? args.name : `snapshot-${Date.now()}.blend`
    // 发布描述说"a .blend extension is added when missing"，所以必须真的补：
    // 此前只 sanitize 不补扩展名，于是 `name: "progress"` 落成一个无扩展名的文件（F10）。
    const safeName = ensureExtension(sanitizeFileName(rawName, 'snapshot.blend'), '.blend')
    const taskName = typeof args.task === 'string' && args.task !== '' ? args.task : undefined

    const task = await context.ensureTask(exec, taskName)
    const target = join(task.root, EXPORTS_DIR, safeName)

    // 先在会话里读一次当前 filepath，`copy=True` 之后必须与它完全一致——
    // 这才叫"不改动会话当前文件路径"，而不是只看算子有没有报错。
    const before = await sendQuiet(context.endpoint(), 'import bpy\nresult = {"filepath": bpy.data.filepath or None}\n')
    const filepathBefore = typeof before?.filepath === 'string' ? before.filepath : null

    const code = `
import json
import bpy
result = {"operatorResult": list(bpy.ops.wm.save_as_mainfile(filepath=${JSON.stringify(target)}, copy=True))}
result["filepathAfter"] = bpy.data.filepath or None
result["isDirtyAfter"] = bool(bpy.data.is_dirty)
`
    const sent = await sendStructured(context.endpoint(), code, undefined)
    if (sent.envelope === undefined) {
      return { status: STATUS.error, error: sent.error }
    }
    const envelope = sent.envelope
    if (envelope.status !== 'ok') {
      return { status: STATUS.error, error: structuredError('snapshot-failed', envelope, undefined) }
    }
    const operator = /** @type {Record<string, any>} */ (envelope.result ?? {})
    let bytes
    try {
      bytes = (await stat(target)).size
    } catch {
      bytes = undefined
    }
    const filepathAfter = typeof operator.filepathAfter === 'string' ? operator.filepathAfter : null
    return {
      status: STATUS.ok,
      path: target,
      relativePath: `${EXPORTS_DIR}/${safeName}`,
      bytes,
      filepathBefore,
      filepathAfter,
      sessionFilepathUnchanged: filepathBefore === filepathAfter,
      operatorResult: operator,
    }
  }
}

// ---------------------------------------------------------------------------
// capture
// ---------------------------------------------------------------------------

/**
 * `blender_mcp_capture`：视觉反馈，只落任务目录。
 *
 * **待实测前提**：socket exec 调用时 `context.area` 可能为 `None`（../docs/contract.md#tools）。
 * 因此返回体里如实报告每个目标是否可用，**不假装三种目标都能用**。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {(args: unknown, exec: unknown) => Promise<Record<string, unknown>>} 执行函数。
 */
export function makeCaptureTool(context) {
  return async (rawArgs, exec) => {
    const args = /** @type {{target?: unknown, name?: unknown, task?: unknown}} */ (rawArgs ?? {})
    const target = typeof args.target === 'string' ? args.target : 'viewport'
    if (!['viewport', 'area', 'window'].includes(target)) {
      return { status: STATUS.refused, reason: 'bad-target', handoff: 'target 只能是 viewport / area / window。' }
    }
    const safeName = sanitizeFileName(
      typeof args.name === 'string' && args.name !== '' ? args.name : `capture-${Date.now()}.png`,
      'capture.png',
    )
    const taskName = typeof args.task === 'string' && args.task !== '' ? args.task : undefined
    const task = await context.ensureTask(exec, taskName)
    const path = join(task.root, RENDERS_DIR, safeName)

    const code = `
import os
import bpy

_target = ${JSON.stringify(target)}
_path = ${JSON.stringify(path)}
_result = {"target": _target, "path": _path, "available": False, "restored": None}

_window = getattr(bpy.context, "window", None)
_area = getattr(bpy.context, "area", None)
_region = getattr(bpy.context, "region", None)
_space_type = getattr(_area, "type", None)

# 视口渲染必须还原被临时改动的渲染设置（I15）
_prev = {}
try:
    _scene = getattr(bpy.context, "scene", None)
    _render = getattr(_scene, "render", None)
    if _render is not None:
        _prev["filepath"] = _render.filepath
        _prev["format"] = _render.image_settings.file_format
except Exception:
    _render = None

def _restore():
    restored = True
    try:
        if _render is not None:
            if "filepath" in _prev:
                _render.filepath = _prev["filepath"]
            if "format" in _prev:
                _render.image_settings.file_format = _prev["format"]
    except Exception as exc:
        restored = repr(exc)
    _result["restored"] = restored

try:
    if (target === 'viewport') {
        if (_area is None or _space_type != "VIEW_3D":
            _result["reason"] = ("context.area is None or not a 3D viewport (got " + str(_space_type)
                                 + "): a socket exec has no UI context")
        else:
            _render.image_settings.file_format = "PNG"
            _render.filepath = _path
            _render_result = bpy.ops.render.opengl(write_still=True)
            _restore()
            _result["operatorResult"] = list(_render_result)
            _result["available"] = os.path.exists(_path)
            if not _result["available"]:
                _result["reason"] = "opengl render returned " + repr(list(_render_result)) + " but no file was written"
    elif _target == "area":
        if _area is None or _region is None:
            _result["reason"] = "context.area/region is None: a socket exec has no UI context"
        else:
            _operator_result = bpy.ops.screen.screenshot_area(filepath=_path)
            _restore()
            _result["operatorResult"] = list(_operator_result)
            _result["available"] = os.path.exists(_path)
    else:
        if _window is None:
            _result["reason"] = "context.window is None: a socket exec has no UI context"
        else:
            _operator_result = bpy.ops.screen.screenshot(filepath=_path)
            _restore()
            _result["operatorResult"] = list(_operator_result)
            _result["available"] = os.path.exists(_path)
except Exception as _exc:
    _result["reason"] = repr(_exc)
    _restore()
# 兜底：任何分支走到这里仍没结算 restored 时，补一次（正常路径不会走到）
if _result["restored"] is None:
    _restore()

result = _result
`
    const sent = await sendStructured(context.endpoint(), code, undefined)
    if (sent.envelope === undefined) {
      return { status: STATUS.error, error: sent.error }
    }
    const envelope = sent.envelope
    const payload = unwrapEnvelope(envelope)
    if (payload === undefined) {
      return { status: STATUS.error, error: structuredError('capture-failed', envelope, undefined) }
    }
    let bytes
    try {
      bytes = (await stat(path)).size
    } catch {
      bytes = undefined
    }
    if (payload.available !== true) {
      return {
        status: STATUS.ok,
        captured: false,
        target,
        reason: payload.reason ?? 'unknown',
        note: '被 socket exec 调用时 Blender 没有 UI 上下文，这三种目标可能都不可用；这是已知的待实测前提（../docs/contract.md#tools）。',
      }
    }
    return {
      status: STATUS.ok,
      captured: true,
      target,
      path,
      relativePath: `${RENDERS_DIR}/${safeName}`,
      bytes,
      // **只在真的拿到了才写这个字段**。此前是 `payload.restored ?? undefined`：
      // `null ?? undefined` 得到 `undefined`，于是对象里出现一个值为 `undefined` 的**属性**，
      // DSH 的出参校验判它"不是无损 JSON"，整个工具调用直接失败——而文件其实已经写出来了
      // （2026-09-22 报告 P0-3：唯一在 socket 下可用的目标 `window` 100% 报错）。
      ...payload.restored === undefined ? {} : { restored: payload.restored },
    }
  }
}

// ---------------------------------------------------------------------------
// docs
// ---------------------------------------------------------------------------

/**
 * 统一的"知识库可用"返回前缀。
 *
 * 调用方**必须**把它放在返回对象的第一项：后写的 `available` 会覆盖它，
 * 曾经因此把成功路径误报成 `available` 缺失（实测踩过）。
 *
 * @param {Record<string, unknown>} base 基础字段。
 * @returns {Record<string, unknown>} 带 `available: true` 的字段。
 */
function availableBase(base) {
  return { ...base, available: true }
}

/**
 * `blender_mcp_docs`：内嵌知识库检索。
 *
 * 契约见 ../docs/contract.md#knowledge-retrieval：一个工具三种 mode；
 * `available:false` **只表示内置资产损坏**，不表示"用户没配"（I17 / I21）。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {(args: unknown, exec: unknown) => Promise<Record<string, unknown>>} 执行函数。
 */
export function makeDocsTool(context) {
  return async (rawArgs, _exec) => {
    const args = /** @type {{mode?: unknown, identifier?: unknown, query?: unknown, maxResults?: unknown, context?: unknown, index?: unknown}} */ (rawArgs ?? {})
    const mode = typeof args.mode === 'string' && args.mode !== '' ? args.mode : 'search'

    const loaded = await loadKnowledge(context)
    if (loaded.index === undefined) {
      return {
        status: STATUS.ok,
        available: false,
        mode,
        source: loaded.root,
        reason: loaded.reason,
        handoff: loaded.handoff,
      }
    }
    const index = loaded.index

    const meta = loaded.meta
    // 漂移只用**本进程最近一次已知指纹**（status / exec 采到的），绝不为了算漂移去敲 add-on：
    // 知识库是随包只读资产，检索它本身不得产生任何对 add-on 的请求
    // （../docs/contract.md#knowledge-retrieval / I19）。拿不到就报 unknown，不去探。
    const known = context.knownFingerprint()
    const drift = computeDrift(meta?.blenderVersion, known?.blenderVersion)
    /** @type {Record<string, unknown>} */
    const base = availableBase({
      status: STATUS.ok,
      mode,
      source: loaded.root,
      indexed: { files: index.fileCount, builtAt: meta?.builtAt ?? null },
      drift,
      unparsed: loaded.unparsed,
    })

    if (mode === 'rules') {
      const rules = await readRules(loaded.root)
      return {
        ...base,
        kind: 'definition',
        found: rules.length > 0,
        // 规则条目整条返回：半条规则比没有规则更危险（../docs/contract.md#knowledge-granularity 的 G3）
        hits: rules.map((rule, position) => ({
          path: typeof rule.source === 'string' ? rule.source : 'knowledge/rules.json',
          breadcrumb: typeof rule.title === 'string' ? rule.title : '',
          index: position,
          score: 100,
          text: typeof rule.text === 'string' ? rule.text : '',
          name: typeof rule.id === 'string' ? rule.id : undefined,
          type: 'rule',
        })),
        truncated: false,
      }
    }

    if (mode === 'api') {
      const identifier = typeof args.identifier === 'string' ? args.identifier : ''
      const lookup = index.lookupIdentifier(identifier, { maxCharsPerHit: context.config.knowledge.maxCharsPerHit })
      return {
        ...base,
        kind: lookup.kind,
        found: lookup.hits.length > 0,
        hits: lookup.hits,
        // 注意不要叫 `available`：那会覆盖表示"资产是否可用"的顶层字段（I17），
        // 两者语义完全不同——曾经因为撞名把成功路径误报成不可用（实测踩过）。
        candidates: lookup.available ?? [],
        truncated: false,
      }
    }

    if (mode !== 'search') {
      return { status: STATUS.refused, reason: 'bad-mode', handoff: 'mode 只能是 api / search / rules。' }
    }

    const query = typeof args.query === 'string' ? args.query : ''
    // 缺省条数取配置 knowledge.maxHits（不是硬编码 20）；1–50 与配置 schema 同界。
    const maxResults = clampNumber(args.maxResults, 1, 50, context.config.knowledge.maxHits)
    const windowSize = clampNumber(args.context, 0, 10, 0)
    const hits = index.search(query, {
      maxResults,
      windowSize,
      maxCharsPerHit: context.config.knowledge.maxCharsPerHit,
    })
    return { ...base, kind: hits.length > 0 ? 'exact' : 'missing', found: hits.length > 0, hits, truncated: false }
  }
}

/**
 * 知识库索引的**进程内缓存**（单一槽位：语料随包只读，不需要淘汰策略）。
 *
 * 语料与索引随包交付，同一进程里反复解析 449 KB 的 `meta.json` 与几 MB 的
 * `files.jsonl` 纯属浪费——而 `docs` 是模型写 Blender 代码前每次都要查的工具。
 * @type {{root: string, sizes: string, entry: {index: import('./knowledge.js').KnowledgeIndex, meta: Record<string, any>, unparsed: string[]}}|undefined}
 */
let knowledgeCache

/**
 * 载入知识库索引（资产未变时命中缓存，不重复解析）。
 *
 * 索引与语料是**随包交付的只读资产**，缺失/损坏属于交付缺陷（../docs/contract.md#knowledge-unavailable）。
 * 本函数**只读本地文件**：不联网、不回传、不向 add-on 发任何东西（I19）。
 *
 * 缓存不能把"损坏"藏起来：I17 要求资产读不动时**当次**就报 `available:false`，
 * 所以命中前先用 `stat` 核对四个资产的字节数（4 次 syscall，不是几 MB 解析）。
 * 文件被移走、被改动、被换版本 → 字节数变了 → 作废重来；`load` 失败则照常报损坏。
 *
 * @param {ToolContext} _context 工具上下文（当前不参与：条数是使用侧参数，不烘进索引）。
 * @returns {Promise<{root: string, index?: import('./knowledge.js').KnowledgeIndex, meta?: Record<string, any>, unparsed: string[], reason?: string, handoff?: string}>} 载入结果。
 */
async function loadKnowledge(_context) {
  const root = join(fileDirOfImportMeta(), 'knowledge')
  const assetPaths = [
    join(root, 'meta.json'),
    join(root, 'index', 'files.jsonl'),
    join(root, 'index', 'df.json'),
    join(root, 'index', 'tokens.json'),
  ]
  try {
    const sizes = (await Promise.all(assetPaths.map(async path => (await stat(path)).size))).join(',')
    if (knowledgeCache !== undefined && knowledgeCache.root === root && knowledgeCache.sizes === sizes) {
      return { root, ...knowledgeCache.entry }
    }

    const meta = JSON.parse(await readFile(assetPaths[0], 'utf8'))
    const { KnowledgeIndex } = await import('./knowledge.js')
    const index = await KnowledgeIndex.load(root)
    const unparsed = Array.isArray(meta.unparsedDirectives) ? meta.unparsedDirectives : []
    const entry = { index, meta, unparsed }
    // 只缓存成功结果：失败形状带 reason/handoff，缓存它会把一次瞬时故障冻成长期故障
    knowledgeCache = { root, sizes, entry }
    return { root, ...entry }
  } catch (error) {
    knowledgeCache = undefined
    return {
      root,
      unparsed: [],
      reason: `内置索引缺失或损坏：${/** @type {Error} */ (error).message}`,
      handoff: '这是一处交付缺陷，不是配置问题。请重新安装本插件，或运行 `node buildKnowledge.js build` 重建索引。',
    }
  }
}

/**
 * 读取 G3 规则条目（`knowledge/rules.json`）。
 *
 * @param {string} root 知识库根目录。
 * @returns {Promise<Array<Record<string, unknown>>>} 规则条目。
 */
async function readRules(root) {
  try {
    const parsed = JSON.parse(await readFile(join(root, 'rules.json'), 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * 读取 `knowledge/meta.json`（不可读时返回 undefined）。
 *
 * @returns {Promise<Record<string, any> | undefined>} 元数据。
 */
async function readKnowledgeMeta() {
  try {
    return JSON.parse(await readFile(join(fileDirOfImportMeta(), 'knowledge', 'meta.json'), 'utf8'))
  } catch {
    return undefined
  }
}

// ---------------------------------------------------------------------------
// 共用
// ---------------------------------------------------------------------------

/**
 * 判断用户代码是否走延迟响应（deferred）通道。
 *
 * 依据是 `check_is_finished` 这个可调用名是否出现——add-on 只认这个名字（../docs/contract.md#transport-deferred）。
 *
 * @param {string} code 用户源码。
 * @returns {boolean} 是否可能走 deferred。
 */
function usesDeferred(code) {
  return /check_is_finished/u.test(code)
}

/**
 * 一次读取"执行前必须知道的事实"：指纹 + cwd + 当前渲染/导出设置。
 *
 * **为什么合并**：这三项都是只读、都在 Blender 侧、都**必须在用户代码之前**采（基线顺序即正确性），
 * 此前分成两次 exec，于是单次调用光"取现场"就 2 次 socket 往返（连执行与执行后的设置共 5 次）。
 * 合并成一次既省往返，也让"基线取自改动之前"由代码结构保证，而不是靠注释提醒。
 *
 * 失败路径：指纹取不到 → `fingerprint === undefined`，调用方据此走诊断；
 * 设置取不到 → `settings === undefined`，执行照常（基线不明会在返回体里如实标注）。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {Promise<{fingerprint: import('./diagnostics.js').Fingerprint | undefined, settings: Record<string, unknown> | undefined}>} 现场事实。
 */
async function readRuntimeContext(context) {
  const code = `
import json, os
import bpy
_s = getattr(bpy.context, "scene", None)
_r = getattr(_s, "render", None)
_c = getattr(_s, "cycles", None)
_v = getattr(_s, "view_settings", None)
_img = getattr(_r, "image_settings", None)
def _scenes():
    out = []
    try:
        for _scene in bpy.data.scenes:
            out.append({"name": _scene.name, "engine": getattr(getattr(_scene, "render", None), "engine", None)})
    except Exception:
        pass
    return out
result = {
    "blenderVersion": bpy.app.version_string,
    "cwd": os.getcwd(),
    "pid": os.getpid(),
    "settings": {
        "engine": getattr(_r, "engine", None),
        "resolutionX": getattr(_r, "resolution_x", None),
        "resolutionY": getattr(_r, "resolution_y", None),
        "resolutionPercentage": getattr(_r, "resolution_percentage", None),
        "filmTransparent": bool(getattr(_r, "film_transparent", False)),
        "fileFormat": getattr(_img, "file_format", None),
        "colorMode": getattr(_img, "color_mode", None),
        "colorDepth": getattr(_img, "color_depth", None),
        "outputFilepath": getattr(_r, "filepath", None),
        "samples": getattr(_c, "samples", None),
        "previewSamples": getattr(_c, "preview_samples", None),
        "device": getattr(_c, "device", None),
        "maxBounces": getattr(_c, "max_bounces", None),
        "volumeBounces": getattr(_c, "volume_bounces", None),
        "viewTransform": getattr(_v, "view_transform", None),
        "look": getattr(_v, "look", None),
        "exposure": None if _v is None else round(getattr(_v, "exposure", 0.0), 4),
        "frameStart": getattr(_s, "frame_start", None),
        "frameEnd": getattr(_s, "frame_end", None),
        "frameCurrent": getattr(_s, "frame_current", None),
        "useCompositing": bool(getattr(_r, "use_compositing", False)),
        "threadsMode": getattr(_r, "threads_mode", None),
        "eeveeTaaSamples": getattr(getattr(_s, "eevee", None), "taa_samples", None),
        "eeveeUseRaytracing": None if getattr(_s, "eevee", None) is None else bool(getattr(_s.eevee, "use_raytracing", False)),
        "eeveeUseVolumetrics": None if getattr(_s, "eevee", None) is None else bool(getattr(_s.eevee, "use_volumetrics", False)),
        "otherScenes": _scenes(),
    },
}
`
  const outcome = await sendQuiet(context.endpoint(), code)
  if (outcome === undefined) return { fingerprint: undefined, settings: undefined }
  const settings = outcome.settings
  return {
    fingerprint: /** @type {any} */ (outcome),
    settings: settings === null || typeof settings !== 'object' ? undefined : /** @type {Record<string, unknown>} */ (settings),
  }
}

/**
 * 把 L2 的差分结果**聚合成有界的形状**（报告 P1-6）。
 *
 * 起因：批量建 100 个对象时，返回体里逐条回显每个对象的 name/type/polygons，
 * 单次响应膨胀到 ~1k token，而调用方真正需要的信息是"新增了 100 个对象，其中 MESH 98 个"。
 *
 * **字段名不变**（I23）：`objectsAdded` 保留，只是从数组变成 `{count, byType, sample, truncated}`。
 * 逐条清单只在 ≤10 条时给全——那正是"看得清"与"看不爆"的分界点。
 *
 * @param {Record<string, any>} changes L2 返回的差分。
 * @returns {Record<string, unknown>} 聚合后的改动清单。
 */
function summarizeChanges(changes) {
  /**
   * 聚合一个列表。
   *
   * @param {unknown} list 原始列表。
   * @returns {{count: number, byType: Record<string, number>, sample: string[], truncated: boolean}} 聚合结果。
   */
  const bucket = (list) => {
    const items = Array.isArray(list) ? list : []
    /** @type {Record<string, number>} */
    const byType = {}
    for (const item of items) {
      const kind = typeof item?.type === 'string' ? item.type : (typeof item?.kind === 'string' ? item.kind : 'unknown')
      byType[kind] = (byType[kind] ?? 0) + 1
    }
    return {
      count: items.length,
      byType,
      sample: items.slice(0, 10).map(item => String(item?.name ?? '')),
      truncated: items.length > 10,
    }
  }
  return {
    objectsAdded: bucket(changes.objectsAdded),
    objectsRemoved: bucket(changes.objectsRemoved),
    objectsModified: bucket(changes.objectsModified),
    dataBlocksRemoved: bucket(changes.dataBlocksRemoved),
    dataBlocksModified: bucket(changes.dataBlocksModified),
  }
}

/**
 * 数一下差分里一共有多少项（增/删/改都算），用于判断"改动是否已经部分生效"。
 *
 * @param {Record<string, any> | undefined} changes L2 返回的差分。
 * @returns {number} 条目数。
 */
function countChanges(changes) {
  if (changes === null || changes === undefined || typeof changes !== 'object') return 0
  let total = 0
  for (const key of ['objectsAdded', 'objectsRemoved', 'objectsModified', 'dataBlocksRemoved', 'dataBlocksModified']) {
    const value = changes[key]
    if (Array.isArray(value)) total += value.length
  }
  return total
}

/**
 * 生成**完成态**的交接提示（I26）。
 *
 * 与被拒时的 `handoff` 是两件事：那个说的是"这一步我做不了，请你来"；
 * 这个说的是"我做完了，但**没有保存**你的文件"。
 *
 * @param {Record<string, unknown> | undefined} settings 执行前的设置快照（拿它判断会话是否 dirty 不可靠，
 *   因此这里只讲**恒定成立**的三件事，不提会话状态——状态由 `status.sessionChecklist` 给准）。
 * @returns {string} 交接提示。
 */
function handoffHintFor(settings) {
  void settings
  return '改动没有写进用户的 .blend（本插件从不覆盖保存）：用户可以按 Ctrl+Z 逐步回退，'
    + '要留存就用 blender_mcp_snapshot；要出图请提醒用户按 F12（本通道的 exec 有 30 s 上限）。'
    + '任务目录已保留，不由你代删。'
}

/**
 * 只读取指纹，失败时返回 undefined（不发诊断）。
 *
 * @param {ToolContext} context 工具上下文。
 * @returns {Promise<import('./diagnostics.js').Fingerprint | undefined>} 指纹。
 */
async function readFingerprint(context) {
  const code = `
import json, os
import bpy
result = {"blenderVersion": bpy.app.version_string, "cwd": os.getcwd(), "pid": os.getpid()}
`
  return /** @type {any} */ (await sendQuiet(context.endpoint(), code)) ?? undefined
}

/**
 * 发一段只读代码；失败返回 undefined。
 *
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} endpoint 端点。
 * @param {string} code 源码。
 * @returns {Promise<Record<string, any> | undefined>} 结果。
 */
async function sendQuiet(endpoint, code) {
  try {
    const envelope = await sendExecute({ endpoint, code })
    if (envelope.status !== 'ok') return undefined
    return /** @type {Record<string, any>} */ (envelope.result ?? {})
  } catch {
    return undefined
  }
}

/**
 * 取信封里的 `result`。
 *
 * @param {import('./protocol.js').ExecEnvelope} envelope 信封。
 * @returns {Record<string, any> | undefined} 结果。
 */
function unwrapEnvelope(envelope) {
  if (envelope.status !== 'ok') return undefined
  if (envelope.result === null || typeof envelope.result !== 'object') return undefined
  return /** @type {Record<string, any>} */ (envelope.result)
}

/**
 * 从响应里取回护栏元数据。
 *
 * 放在 **stdout 哨兵行**里，而不是夹进用户 `result`：`result` 是用户代码的领地，
 * 插件不该往里面塞字段。
 *
 * @param {import('./protocol.js').ExecEnvelope} envelope 信封。
 * @returns {Record<string, any> | undefined} 元数据。
 */
function extractGuardMeta(envelope) {
  const text = envelope.stdout
  if (typeof text !== 'string') return undefined
  const line = text.split(/\r?\n/u).find(item => item.startsWith('__DSH_GUARD__'))
  if (line === undefined) return undefined
  try {
    return JSON.parse(line.slice('__DSH_GUARD__'.length))
  } catch {
    return undefined
  }
}

/**
 * 把哨兵从用户可见的 stderr 里去掉。
 *
 * @param {string} text stderr。
 * @returns {string} 清理后的文本。
 */
function stripGuardSentinels(text) {
  return text
    .split(/\r?\n/u)
    .filter(line => !line.startsWith('__DSH_GUARD__') && !line.startsWith('__DSH_GUARD_ERROR__'))
    .join('\n')
}

/**
 * 把失败信封整理成可操作的结构化错误。
 *
 * **不得**靠匹配英文（会被本地化）的错误串判定成因（../docs/contract.md#decision-localized-errors）：
 * 这里只用结构性信号（status / message 前缀 / guard 元数据）。
 *
 * @param {string} kind 错误分类。
 * @param {import('./protocol.js').ExecEnvelope} envelope 信封。
 * @param {Record<string, any> | undefined} meta 护栏元数据。
 * @returns {Record<string, unknown>} 结构化错误。
 */
function structuredError(kind, envelope, meta) {
  const message = envelope.message ?? ''
  const blocked = meta?.blocked !== undefined && meta.blocked.length > 0
  return {
    kind: blocked ? 'blocked-by-guard' : kind,
    message: truncate(message, 4000),
    hint: blocked
      ? '这是护栏拒绝的越界写/删；改用 suggested_path 重试，或让用户自己在 Blender / 系统里完成。'
      : hintFor(message),
  }
}

/**
 * 按结构性信号给一句提示。
 *
 * @param {string} message 上游返回的 message。
 * @returns {string} 提示。
 */
function hintFor(message) {
  if (/Traceback/iu.test(message)) {
    return 'Python 抛异常了。检查 traceback 指出的那一行；如果是 API 记错，用 blender_mcp_docs 查一下契约。'
  }
  if (/poll/iu.test(message)) {
    return '算子 poll 失败通常是上下文不对（模式 / 活动对象 / 选中状态）。用 blender_mcp_inspect 看当前上下文，或用 docs 查该算子的前置条件。'
  }
  return '执行失败。可用 blender_mcp_inspect 确认场景状态，或用 blender_mcp_docs 查 API 契约。'
}

/**
 * 截断长文本并标注。
 *
 * @param {string} text 原文。
 * @param {number} limit 上限字符数。
 * @returns {string} 截断后的文本。
 */
export function truncate(text, limit) {
  if (typeof text !== 'string') return ''
  if (!Number.isFinite(limit) || limit <= 0 || text.length <= limit) return text
  return `${text.slice(0, limit)}\n…（已截断：原文 ${text.length} 字符，上限 ${limit}）`
}

/**
 * 把数字夹到区间内。
 *
 * @param {unknown} value 原值。
 * @param {number} min 下限。
 * @param {number} max 上限。
 * @param {number} fallback 非数字时的回退值。
 * @returns {number} 结果。
 */
function clampNumber(value, min, max, fallback) {
  const number = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.min(max, Math.max(min, number))
}

/**
 * 清洗文件名：只留基名，剥掉路径分隔符与控制字符。
 *
 * @param {string} raw 原始文件名。
 * @param {string} fallback 回退名。
 * @returns {string} 安全文件名。
 */
export function sanitizeFileName(raw, fallback) {
  const base = basename(raw.replace(/[/\\]/gu, '_'))
  // eslint-disable-next-line no-control-regex
  const cleaned = base.replace(/[\u0000-\u001f\u007f]/gu, '').replace(/^[.]+/u, '').trim()
  return cleaned === '' ? fallback : cleaned.slice(0, 120)
}

/**
 * 保证文件名带指定扩展名。
 *
 * @param {string} name 文件名。
 * @param {string} extension 期望扩展名（含点）。
 * @returns {string} 带扩展名的文件名。
 */
export function ensureExtension(name, extension) {
  return extname(name).toLowerCase() === extension ? name : `${name}${extension}`
}

/**
 * 取本模块所在目录（用于解析随包资产 `knowledge/`）。
 *
 * @returns {string} 目录绝对路径。
 */
function fileDirOfImportMeta() {
  return fileURLToPath(new URL('..', import.meta.url))
}
