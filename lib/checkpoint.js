// SPDX-License-Identifier: GPL-3.0-or-later
// 检查点：原子轮换、硬失败、体积告警、回滚来源选择。
//
// 副作用边界：**会写盘**，且只写任务目录的 `checkpoints/` 与 `reports/`（用于 undo 基线快照）。
// 写盘失败一律硬失败（I1）——绝不静默降级为"无检查点继续"。
// 轮换删除只作用于本会话登记过的检查点（I8 / I13：保护集合为空则硬中止）。

import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { sendExecute } from './protocol.js'

/** 检查点文件名形态：`turn-{T}.blend`（只看**本插件写的**文件，不碰用户自己的备份）。 */
const CHECKPOINT_PATTERN = /^turn-(\d+)\.blend$/u

/** undo 基线快照的文件名前缀（放 reports/，与 .blend 产物分开）。 */
const UNDO_BASELINE_PREFIX = 'undo-baseline-turn-'

/**
 * 检查点记录。
 *
 * @typedef {object} CheckpointRecord
 * @property {string} name 文件名。
 * @property {string} path 绝对路径。
 * @property {number} turn 轮次号。
 * @property {number} bytes 字节数。
 * @property {number} mtimeMs 修改时间（毫秒）。
 */

/**
 * 轮换计划。
 *
 * @typedef {object} RotationPlan
 * @property {'during-write'|'after-round'} phase 阶段。
 * @property {string[]} remove 计划删除的绝对路径。
 * @property {boolean} writeNext 本阶段是否需要写新检查点。
 * @property {number} keep 配置的保留份数。
 */

/**
 * 一次落检查点的结果。
 *
 * @typedef {object} CheckpointOutcome
 * @property {boolean} created 本轮是否新建了检查点（false = 本轮已有，复用）。
 * @property {string|undefined} path 检查点绝对路径。
 * @property {number|undefined} bytes 字节数。
 * @property {number|undefined} turn 轮次号。
 * @property {boolean} undoPushed 是否执行了 `undo_push`。
 * @property {('undo-push'|'undo-skipped-existing-checkpoint'|'undo-disabled'|'undo-failed')} undoChannel undo 通道状态。
 * @property {string[]} warnings 需要转达给用户的告警（体积超限等）。
 */

/**
 * 检查点管理器：**按（会话 × 任务目录）** 一个实例。
 *
 * 契约摘要：本轮首次写操作**之前**落一份 `.blend` 快照；**写盘失败即硬失败**（I1），
 * 不静默降级为"无检查点继续"。轮换与清理只作用于**本会话登记过的**检查点（I8），
 * 且先写第 n+1 份再回落到 `keep` 份——任何时刻磁盘上都至少有一份完整备份。
 *
 * 常用入口：
 * - ensureForTurn: 本轮首次写前落检查点（含 `undo_push` 与 undo 基线）；同轮第二次调用复用
 * - closeRound: 轮次结束时的收尾轮换
 * - hasCheckpoint: 本轮是否已落过检查点
 */
export class CheckpointManager {
  /**
   * 构造参数的 JSDoc 必须挂在**构造函数本身**上：挂在 `export class` 上时，`checkJs` 不会把它
   * 关联到 `constructor` 的解构参数，字段会全部退化成 `any`（实测）。
   *
   * @param {object} options 参数。
   * @param {string} options.taskRoot 任务目录绝对路径。
   * @param {string} options.sessionId 会话 id（进 undo 基线，用于判断"非本插件的栈增长"）。
   * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} options.endpoint 端点。
   * @param {boolean} options.enabled 是否启用检查点。
   * @param {number} options.keep 保留份数。
   * @param {number} options.maxBytes 单份体积上限（0 = 不限）。
   */
  constructor({ taskRoot, sessionId, endpoint, enabled, keep, maxBytes }) {
    /** @type {string} */
    this.taskRoot = taskRoot
    /** @type {string} */
    this.sessionId = sessionId
    /** @type {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} */
    this.endpoint = endpoint
    /** @type {boolean} */
    this.enabled = enabled
    /** @type {number} */
    this.keep = keep
    /** @type {number} */
    this.maxBytes = maxBytes
    /** @type {Set<number>} 本管理器登记过的轮次（I8：配额只算自己建的） */
    this.registeredTurns = new Set()
    /** @type {Map<number, CheckpointRecord>} 轮次 -> 记录 */
    this.records = new Map()
  }

  /**
   * 列出任务目录里已存在的检查点（只读，不创建目录）。
   *
   * @returns {Promise<CheckpointRecord[]>} 按轮次升序。
   */
  async list() {
    const dir = join(this.taskRoot, 'checkpoints')
    let names
    try {
      names = await readdir(dir)
    } catch {
      return []
    }
    /** @type {CheckpointRecord[]} */
    const records = []
    for (const name of names) {
      const match = CHECKPOINT_PATTERN.exec(name)
      if (match === null) continue
      const path = join(dir, name)
      try {
        const info = await stat(path)
        records.push({ name, path, turn: Number.parseInt(match[1], 10), bytes: info.size, mtimeMs: info.mtimeMs })
      } catch {
        // 读不到就跳过：只读工具不因为单个坏文件失败
      }
    }
    return records.sort((a, b) => a.turn - b.turn)
  }

  /**
   * 本轮是否已有检查点。
   *
   * @param {number} turn 轮次。
   * @returns {boolean} 是否已落。
   */
  hasCheckpoint(turn) {
    return this.registeredTurns.has(turn)
  }

  /**
   * 本轮首次写操作之前落检查点；已有则直接复用。
   *
   * 语义（../docs/contract.md#checkpoint）：
   * 1. 先写第 `keep + 1` 份（此刻磁盘上最多 `keep + 1` 份）；
   * 2. 写盘失败 → **硬失败**，拒绝执行本次写操作；
   * 3. 检查点落盘**之后**执行 `undo_push`，并记录 undo 基线。
   *
   * @param {number} turn 轮次号。
   * @returns {Promise<CheckpointOutcome>} 落盘结果。
   * @throws {Error} 检查点写盘失败时抛出（调用方必须据此拒绝执行写操作）。
   */
  async ensureForTurn(turn) {
    if (!this.enabled) {
      return {
        created: false,
        path: undefined,
        bytes: undefined,
        turn,
        undoPushed: false,
        undoChannel: 'undo-disabled',
        warnings: ['检查点已关闭（checkpoint.enabled=false）：本次写操作没有写前备份'],
      }
    }

    const existing = this.records.get(turn)
    if (existing !== undefined) {
      return {
        created: false,
        path: existing.path,
        bytes: existing.bytes,
        turn,
        undoPushed: false,
        undoChannel: 'undo-skipped-existing-checkpoint',
        warnings: [],
      }
    }

    const checkpointsDir = join(this.taskRoot, 'checkpoints')
    await mkdir(checkpointsDir, { recursive: true })
    const path = join(checkpointsDir, `turn-${turn}.blend`)

    // 路径由插件派生并带引号，避免用户 .blend 名里的字符影响解析。
    // 算子的返回值是 set（如 {'FINISHED'}），必须包成 list 才能安全过 JSON —— 直接 dict() 会抛
    // ValueError: dictionary update sequence element #0 has length 8（实测踩过）。
    const code = `import bpy\nresult = {"operatorResult": list(bpy.ops.wm.save_as_mainfile(filepath=${JSON.stringify(path)}, copy=True))}\n`
    const envelope = await sendExecute({ endpoint: this.endpoint, code })
    if (envelope.status !== 'ok') {
      throw new Error(
        `检查点写盘失败，已拒绝本次写操作（I1：无检查点不执行）：${envelope.message ?? '未知原因'}`,
      )
    }

    /** @type {number} */
    let bytes = 0
    try {
      bytes = (await stat(path)).size
    } catch {
      throw new Error(`检查点报告成功但文件不存在：${path}；已拒绝本次写操作`)
    }

    this.registeredTurns.add(turn)
    this.records.set(turn, { name: `turn-${turn}.blend`, path, turn, bytes, mtimeMs: Date.now() })

    /** @type {string[]} */
    const warnings = []
    if (this.maxBytes > 0 && bytes > this.maxBytes) {
      warnings.push(
        `检查点体积 ${formatBytes(bytes)} 超过上限 ${formatBytes(this.maxBytes)}；`
        + '请转告用户：可以减少 checkpoint.keep 份数，或提高 checkpoint.maxBytes。',
      )
    }

    const undo = await this.#pushUndo(turn)
    return {
      created: true,
      path,
      bytes,
      turn,
      undoPushed: undo.pushed,
      undoChannel: undo.channel,
      warnings,
    }
  }

  /**
   * 轮次结束后的收尾轮换：回落到 `keep` 份。
   *
   * **只删除本管理器登记过、且属于本会话的检查点**（I8）。
   * 若任务目录里有不是本管理器建的检查点（例如上一次 harness 运行留下的），
   * 它们既不计入配额，也不被删除。
   *
   * @param {number} turn 刚结束的轮次。
   * @returns {Promise<string[]>} 真正删除的路径。
   */
  async closeRound(turn) {
    if (!this.enabled) return []
    const mine = [...this.records.values()].sort((a, b) => a.turn - b.turn)
    const plan = planRotation(mine.map(record => record.path), this.keep, 'after-round')
    if (plan.remove.length === 0) return []

    const removable = new Set(plan.remove)
    /** @type {string[]} */
    const removed = []
    for (const record of mine) {
      if (!removable.has(record.path)) continue
      try {
        await rm(record.path, { force: true })
        this.records.delete(record.turn)
        this.registeredTurns.delete(record.turn)
        removed.push(record.path)
      } catch {
        // 删不掉只是没回收磁盘，不影响正确性；下一次收尾再试
      }
    }
    // 顺带清掉同一批被轮换掉的 undo 基线
    for (const record of mine) {
      if (this.records.has(record.turn)) continue
      await rm(join(this.taskRoot, 'reports', `${UNDO_BASELINE_PREFIX}${record.turn}.json`), { force: true })
    }
    return removed
  }

  /**
   * 写前 `undo_push` 并记录基线。
   *
   * undo 失败**不是硬失败**：它只是让回滚少一条快路径，检查点文件仍在（I3）。
   *
   * @param {number} turn 轮次。
   * @returns {Promise<{pushed: boolean, channel: CheckpointOutcome['undoChannel']}>} 结果。
   */
  async #pushUndo(turn) {
    // **实测（Blender 5.2.2）**：Python API 不暴露 undo 栈——`Scene.undo_history` 与
    // `WindowManager.history_active` 都不存在，`bpy.app.memory_usage_undo()` 只在本插件
    // `ed.undo_push` 时跳变（991046 → 1101578），而 `mesh.primitive_cube_add` /
    // `object.delete` / 属性写入都不让它变化。所以"栈深度"无从记录，基线只留**可测量**的字段。
    const code = `
import bpy

pushed = False
_error = None
try:
    pushed = bool(bpy.ops.ed.undo_push(message="dsh-blender-mcp-bridge turn ${turn}"))
except Exception as exc:
    pushed = False
    _error = repr(exc)

# memoryUsageUndo 不是栈深度，只是 undo 内存占用；留它是因为它是 5.2 里
# 唯一能被 Python 观察到的 undo 相关量（实测对上述编辑不敏感，故不能当增长指标）
try:
    _mem = int(bpy.app.memory_usage_undo())
except Exception:
    _mem = None

result = {
    "pushed": pushed,
    "error": _error,
    "memoryUsageUndo": _mem,
    "filepath": bpy.data.filepath or None,
    "isDirty": bool(bpy.data.is_dirty),
}
`
    try {
      const envelope = await sendExecute({ endpoint: this.endpoint, code })
      if (envelope.status !== 'ok' || envelope.result === null || typeof envelope.result !== 'object') {
        return { pushed: false, channel: 'undo-failed' }
      }
      const value = /** @type {Record<string, unknown>} */ (envelope.result)
      await mkdir(join(this.taskRoot, 'reports'), { recursive: true })
      await writeFile(
        join(this.taskRoot, 'reports', `${UNDO_BASELINE_PREFIX}${turn}.json`),
        `${JSON.stringify({ ...value, sessionId: this.sessionId, turn, recordedAt: new Date().toISOString() }, null, 2)}\n`,
        'utf8',
      )
      return { pushed: value.pushed === true, channel: value.pushed === true ? 'undo-push' : 'undo-failed' }
    } catch {
      return { pushed: false, channel: 'undo-failed' }
    }
  }
}

/**
 * 计算轮换计划（纯函数，便于单测）。
 *
 * @param {string[]} registeredPaths **本会话登记过的**检查点路径，按轮次升序。
 * @param {number} keep 保留份数。
 * @param {'during-write'|'after-round'} phase 阶段。
 * @returns {RotationPlan} 计划。
 */
export function planRotation(registeredPaths, keep, phase) {
  if (keep < 1) {
    throw new Error(`keep 必须 >= 1，收到 ${keep}；保护集合为空时不得执行轮换（I13）`)
  }
  const ordered = [...registeredPaths]
  if (phase === 'during-write') {
    // 落第 keep+1 份之前不做任何删除：先保证新快照落地，再回收旧的
    return { phase, remove: [], writeNext: ordered.length >= keep, keep }
  }
  const excess = ordered.length - keep
  return { phase, remove: excess > 0 ? ordered.slice(0, excess) : [], writeNext: false, keep }
}

/**
 * 读取某轮的 undo 基线（回滚前置条件用；../docs/contract.md#checkpoint-undo）。
 *
 * @param {string} taskRoot 任务目录绝对路径。
 * @param {number} turn 轮次。
 * @returns {Promise<Record<string, any> | undefined>} 基线内容或 undefined。
 */
export async function readUndoBaseline(taskRoot, turn) {
  if (!Number.isInteger(turn) || turn < 0) return undefined
  try {
    return JSON.parse(await readFile(join(taskRoot, 'reports', `${UNDO_BASELINE_PREFIX}${turn}.json`), 'utf8'))
  } catch {
    return undefined
  }
}

/**
 * 取任务目录里**轮次最大**的那份 undo 基线（只读；不要求本进程写过它）。
 *
 * 存在的理由：基线过去**只写不读**（审计 F8）——契约把它当成回滚的前置条件，
 * 但没有任何出口把它交出来，于是"回滚前检查用户是否手工编辑过"这条保护
 * 在实现里根本不可用。`blender_mcp_status` 用它把证据摊给调用方。
 *
 * @param {string} taskRoot 任务目录绝对路径。
 * @returns {Promise<{turn: number, baseline: Record<string, any>} | undefined>} 最新基线。
 */
export async function latestUndoBaseline(taskRoot) {
  let names
  try {
    names = await readdir(join(taskRoot, 'reports'))
  } catch {
    return undefined
  }
  /** @type {number|undefined} */
  let best
  for (const name of names) {
    const match = /^undo-baseline-turn-(\d+)\.json$/u.exec(name)
    if (match === null) continue
    const turn = Number.parseInt(match[1], 10)
    if (best === undefined || turn > best) best = turn
  }
  if (best === undefined) return undefined
  const baseline = await readUndoBaseline(taskRoot, best)
  return baseline === undefined ? undefined : { turn: best, baseline }
}

/**
 * 摊出回滚前置条件的证据（../docs/contract.md#checkpoint-undo）。
 *
 * **实测结论（Blender 5.2.2）**：契约原本要求"回滚前检查基线之后是否出现非本插件的
 * undo 栈增长"，但 **Python API 根本不暴露 undo 栈**——`Scene.undo_history` 与
 * `WindowManager.history_active` 都不存在；唯一的 undo 相关量
 * `bpy.app.memory_usage_undo()` 只在本插件 `ed.undo_push` 时跳变（实测 991046 → 1101578），
 * 对 `mesh.primitive_cube_add` / `object.delete` / 属性写入**完全不敏感**。
 * 也就是说"栈增长"这个指标**无从测量**，硬凑一个字段只会让调用方误以为它能用。
 *
 * 因此本函数交出的是一份**诚实的不可判定**报告，外加两个**真的能测**的信号：
 * - `filepathChanged`：基线之后 `bpy.data.filepath` 变了（用户另存/打开了别的文件）；
 * - `dirtyAtBaseline` / 调用方手里的 `isDirty`：能看出"有未保存改动"，看不出是谁改的。
 *
 * 结论必须是**保守**的：既然无法区分用户编辑，插件就**不得**声称可以安全回滚，
 * 而是把"先问用户"作为唯一出路（与 §7.1 的接管原则一致）。
 *
 * @param {string} taskRoot 任务目录绝对路径。
 * @param {string|undefined|null} currentFilepath 当前 `bpy.data.filepath`。
 * @returns {Promise<Record<string, unknown>>} 证据。
 */
export async function evaluateUndoPrecheck(taskRoot, currentFilepath) {
  const latest = await latestUndoBaseline(taskRoot)
  if (latest === undefined) {
    return {
      available: false,
      measurable: false,
      reason: '任务目录里没有 undo 基线（本轮之前没有落过检查点，或检查点已关闭）',
      recommendation: '没有基线可比：只按 mtime 取更近的候选，并在回滚前问用户',
    }
  }
  const baselineFilepath = latest.baseline.filepath ?? null
  const filepathChanged = typeof baselineFilepath === 'string'
    && typeof currentFilepath === 'string'
    && baselineFilepath !== currentFilepath
  return {
    available: true,
    measurable: false,
    turn: latest.turn,
    recordedAt: latest.baseline.recordedAt ?? null,
    pushSucceeded: latest.baseline.pushed === true,
    baselineFilepath,
    currentFilepath: currentFilepath ?? null,
    filepathChanged,
    dirtyAtBaseline: latest.baseline.isDirty === true,
    // 无法判定 ≠ 判定为安全：只要观测不到用户编辑，就必须当作"可能有"。
    // 唯一能反证的是文件路径变了——那说明会话已不是同一个文件，undo 通道更不能用。
    userEditsIndeterminate: true,
    unmeasurableBecause: 'Blender 5.2 的 Python API 不暴露 undo 栈'
      + '（Scene.undo_history / WindowManager.history_active 均不存在；'
      + 'memory_usage_undo 只对本插件的 undo_push 跳变，实测对用户编辑不敏感）',
    reason: filepathChanged
      ? `基线之后文件路径变了（${String(baselineFilepath)} → ${String(currentFilepath)}）：会话已不是同一个文件`
      : '无法观测基线之后是否有用户手工编辑：undo 栈对 Python 不可见',
    recommendation: '不要用 undo 通道回滚：改用检查点文件，并在动手之前把选择权交给用户',
  }
}

/**
 * 选择回滚来源：比较检查点与用户文件的 mtime，取更近者（../docs/contract.md#checkpoint）。
 *
 * @param {{path: string, mtimeMs: number} | undefined} checkpoint 候选检查点。
 * @param {{path: string, mtimeMs: number} | undefined} userFile 用户的 `.blend`。
 * @returns {{source: 'checkpoint'|'user-file'|'none', path: string|undefined, reason: string}} 结论。
 */
export function pickRestoreSource(checkpoint, userFile) {
  if (checkpoint === undefined && userFile === undefined) {
    return { source: 'none', path: undefined, reason: '既没有可用检查点，也没有用户文件路径' }
  }
  if (checkpoint === undefined) {
    return { source: 'user-file', path: userFile?.path, reason: '没有可用检查点' }
  }
  if (userFile === undefined) {
    return { source: 'checkpoint', path: checkpoint.path, reason: '没有用户文件（会话从未保存过）' }
  }
  if (userFile.mtimeMs > checkpoint.mtimeMs) {
    return {
      source: 'user-file',
      path: userFile.path,
      reason: '用户自己的保存比检查点更新：不得用较旧的检查点覆盖它',
    }
  }
  return { source: 'checkpoint', path: checkpoint.path, reason: '检查点不比用户文件旧，取检查点' }
}

/**
 * 回溯说明：无论选哪条来源，回滚都是**整文件级**的。
 *
 * @returns {string} 必须向用户转达的能力边界。
 */
export function restoreCapabilityNotice() {
  return '检查点是整文件级快照：回滚等于整个场景回到该时刻，'
    + '该时刻之后用户自己的手工编辑会一并丢失。这不是细粒度撤销。'
}

/**
 * 人类可读的字节数。
 *
 * @param {number} bytes 字节数。
 * @returns {string} 形如 `1.5 MB`。
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(1)} ${units[unit]}`
}
