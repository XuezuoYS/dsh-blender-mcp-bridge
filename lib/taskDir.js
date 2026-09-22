// SPDX-License-Identifier: GPL-3.0-or-later
// 任务目录：建立 / 复用、属主标记、界内判定。
//
// 副作用边界：只有 ensureTaskDir 会写盘，且只写任务目录自己的 5 个子目录与属主标记；
// findExistingTaskDir 是纯只读（I14：只读工具不得创建任务目录）。

import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

import { slugifyTaskName, suffixedTaskName } from './slug.js'

/** 任务目录下的固定子目录（../docs/contract.md#taskdir）。 */
export const TASK_SUBDIRS = ['checkpoints', 'renders', 'exports', 'reports', 'logs']

/** 任务目录名前缀：`.dsh-blender-{AI 视情况命名}`（AGENTS.md 基础安全需要第 2 条）。 */
export const TASK_DIR_PREFIX = '.dsh-blender-'

/** 属主标记文件名。 */
export const TASK_MARKER_NAME = '.dsh-blender-task.json'

/** 属主标记的 kind，用来识别"这是本插件建的目录"。 */
const MARKER_KIND = 'dsh-blender-mcp-bridge/task'

/** 候选名上限：连续占用 100 个名字仍未成功则硬失败，避免无界循环。 */
const MAX_NAME_CANDIDATES = 100

/**
 * 任务目录描述。
 *
 * @typedef {object} TaskDir
 * @property {string} workspace 任务根的父目录（会话 workspace 或配置的 taskRoot）。
 * @property {string} name 最终使用的任务名（已 slug 化、可能带 -2/-3 后缀）。
 * @property {string} root 任务目录的绝对路径。
 * @property {string} sessionId 建立它的会话 id。
 */

/**
 * 属主标记内容。
 *
 * @typedef {object} TaskMarker
 * @property {string} kind 固定值，用于判断"是否本插件建的"。
 * @property {string} sessionId 建立它的会话 id。
 * @property {string} task 任务名。
 * @property {string} createdAt ISO 时间戳。
 */

/**
 * 建立或复用一个任务目录。
 *
 * 复用规则（../docs/contract.md#taskdir）：
 * - 目录不存在 → 建目录 + 5 个子目录 + 写属主标记；
 * - 目录存在且标记的 `kind` 与 `sessionId` 都匹配 → 复用；
 * - 目录存在但**无属于本会话的标记** → 视为他人数据，**拒绝复用**，追加 `-2`/`-3` 继续试。
 *
 * @param {object} options 参数。
 * @param {string} options.workspace 任务根的父目录（绝对路径）。
 * @param {string} options.taskName 期望的任务名。
 * @param {string} options.sessionId 会话 id（写进属主标记）。
 * @returns {Promise<TaskDir>} 任务目录描述。
 * @throws {Error} 父目录不可写或候选名耗尽时抛出。
 */
export async function ensureTaskDir({ workspace, taskName, sessionId }) {
  const base = slugifyTaskName(taskName)
  const parent = resolve(workspace)

  await mkdir(parent, { recursive: true })

  for (let index = 1; index <= MAX_NAME_CANDIDATES; index += 1) {
    const name = suffixedTaskName(base, index)
    const root = join(parent, `${TASK_DIR_PREFIX}${name}`)
    const marker = await readMarker(root)

    if (marker !== undefined) {
      if (marker.kind === MARKER_KIND && marker.sessionId === sessionId) {
        await createSubdirs(root)
        return { workspace: parent, name, root, sessionId }
      }
      // 他人数据（别的会话或不是本插件建的）：不复用，换名
      continue
    }

    if (await exists(root)) continue

    await createSubdirs(root)
    await writeMarker(root, { kind: MARKER_KIND, sessionId, task: name, createdAt: new Date().toISOString() })
    return { workspace: parent, name, root, sessionId }
  }

  throw new Error(`任务名 \`${base}\` 的候选目录 ${MAX_NAME_CANDIDATES} 个都不可用；请显式传一个不同的 task 名`)
}

/**
 * 只查找既有任务目录，**绝不创建**（只读工具用；I14）。
 *
 * 与 ensure 的差别：这里只认基础名，不尝试后缀候选——只读工具报告的是"本会话上次用的那个目录"。
 *
 * @param {object} options 参数。
 * @param {string} options.workspace 任务根的父目录（绝对路径）。
 * @param {string} options.taskName 期望的任务名。
 * @returns {Promise<TaskDir | undefined>} 找到则返回，否则 undefined。
 */
export async function findExistingTaskDir({ workspace, taskName }) {
  const parent = resolve(workspace)
  const name = slugifyTaskName(taskName)
  const root = join(parent, `${TASK_DIR_PREFIX}${name}`)
  if (!(await exists(root))) return undefined
  const marker = await readMarker(root)
  return { workspace: parent, name, root, sessionId: marker?.sessionId ?? '' }
}

/**
 * 列出同级的既有工作目录（只读，**绝不创建**任何目录）。
 *
 * 用途：AGENTS.md 基础安全需要第 2 条要求「目录过多时 AI 可询问用户是否删除旧的或无用的」——
 * 插件只负责让既有目录**可见**（名字 + 最后修改时间），删除始终由用户自己做。
 *
 * @param {string} parent 任务目录的父目录（活动 .blend 所在目录，或显式 `taskRoot`）。
 * @returns {Promise<{name: string, root: string, mtimeMs: number}[]>} 按最后修改时间降序；父目录不可读时为空数组。
 */
export async function listTaskDirs(parent) {
  const dir = resolve(parent)
  /** @type {{name: string, root: string, mtimeMs: number}[]} */
  const out = []
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith(TASK_DIR_PREFIX)) continue
      const root = join(dir, entry.name)
      let mtimeMs = 0
      try {
        mtimeMs = (await stat(root)).mtimeMs
      } catch {
        // 拿不到时间不影响"把它列出来"，排序时落到最后即可
      }
      out.push({ name: entry.name.slice(TASK_DIR_PREFIX.length), root, mtimeMs })
    }
  } catch {
    // 父目录不存在或不可读不是错误：只是"还没有工作目录"
    return []
  }
  return out.sort((a, b) => b.mtimeMs - a.mtimeMs)
}

/**
 * 判断一个路径是否落在任务目录内（含目录自身）。
 *
 * 判定用 `realpath` 解析后的真实目标（防符号链接逃逸），Windows 下大小写不敏感。
 *
 * @param {string} taskRoot 任务目录绝对路径。
 * @param {string} target 待判定路径（可为相对路径，此时按 `baseDir` 解析）。
 * @param {string} [baseDir] 相对路径的基准目录；缺省用 `process.cwd()`。
 * @returns {boolean} 是否界内。
 */
export function isInsideTask(taskRoot, target, baseDir) {
  const root = normalizeForCompare(taskRoot)
  const base = baseDir === undefined ? process.cwd() : baseDir
  const absolute = isAbsolute(target) ? target : resolve(base, target)
  const candidate = normalizeForCompare(absolute)
  if (candidate === root) return true
  return candidate.startsWith(root.endsWith(sep) ? root : root + sep)
}

/**
 * 生成给人看的相对路径；不在 `base` 下时原样返回绝对路径。
 *
 * @param {string} base 基准目录。
 * @param {string} target 目标路径。
 * @returns {string} 相对路径或原绝对路径。
 */
export function displayPath(base, target) {
  const rel = relative(resolve(base), resolve(target))
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) return resolve(target)
  return rel.split(sep).join('/')
}

/**
 * 把路径规范化到可比较形式（realpath 的纯字符串等价物：去掉尾部分隔符、Windows 折大小写）。
 *
 * 注意：这是**字符串**规范化，不解析符号链接。符号链接逃逸由护栏在 Blender 侧用
 * `os.path.realpath` 处理（../docs/contract.md#handoff）。
 *
 * @param {string} path 路径。
 * @returns {string} 可在同一平台内比较的形式。
 */
export function normalizeForCompare(path) {
  const absolute = resolve(path)
  const trimmed = absolute.endsWith(sep) && absolute.length > 1 ? absolute.slice(0, -1) : absolute
  return process.platform === 'win32' ? trimmed.toLowerCase() : trimmed
}

/**
 * 建立 5 个固定子目录。
 *
 * @param {string} root 任务目录。
 * @returns {Promise<void>} 建完 resolve。
 */
async function createSubdirs(root) {
  await Promise.all(TASK_SUBDIRS.map(async (name) => await mkdir(join(root, name), { recursive: true })))
}

/**
 * 读取属主标记。
 *
 * @param {string} root 任务目录。
 * @returns {Promise<TaskMarker | undefined>} 标记或 undefined（缺失/损坏都返回 undefined）。
 */
async function readMarker(root) {
  try {
    const text = await readFile(join(root, TASK_MARKER_NAME), 'utf8')
    const parsed = JSON.parse(text)
    if (parsed === null || typeof parsed !== 'object') return undefined
    return /** @type {TaskMarker} */ (parsed)
  } catch {
    return undefined
  }
}

/**
 * 写属主标记。
 *
 * @param {string} root 任务目录。
 * @param {TaskMarker} marker 标记内容。
 * @returns {Promise<void>} 写完 resolve。
 */
async function writeMarker(root, marker) {
  await writeFile(join(root, TASK_MARKER_NAME), `${JSON.stringify(marker, null, 2)}\n`, 'utf8')
}

/**
 * 判断路径是否存在。
 *
 * @param {string} path 路径。
 * @returns {Promise<boolean>} 是否存在。
 */
async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
