// SPDX-License-Identifier: GPL-3.0-or-later
// 任务名 slug 化：纯函数，无副作用、不碰文件系统。
//
// 规则见 ../docs/contract.md#taskdir：保留中英文与数字，剥离路径分隔符与控制字符，
// 避开 Windows 保留名与结尾点号空格，上限 48 字符。

/** 任务名长度上限（../docs/contract.md#taskdir）。 */
export const MAX_TASK_NAME_CHARS = 48

/** 任务名为空时的回退值。 */
export const FALLBACK_TASK_NAME = 'task'

/** Windows 保留设备名（不区分大小写；带扩展名同样被保留）。 */
const WINDOWS_RESERVED = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
])

/**
 * 把任意字符串变成可安全用作任务目录名的 slug。
 *
 * @param {string} raw 原始任务名（可能含中文、空格、路径分隔符）。
 * @returns {string} slug；为空时返回 `task`。
 */
export function slugifyTaskName(raw) {
  const stripped = String(raw ?? '')
    // 路径分隔符与控制字符一律剥掉：它们会让目录逃出任务根（../docs/contract.md#taskdir）
    .replace(/[/\\]/gu, '-')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/gu, '')
    .replace(/[:*?"<>|]/gu, '-')
    .replace(/\s+/gu, '-')
    .replace(/-{2,}/gu, '-')
    .replace(/^[-.]+/u, '')
    .replace(/[-. ]+$/u, '')

  const limited = stripped.slice(0, MAX_TASK_NAME_CHARS).replace(/[-. ]+$/u, '')
  if (limited === '') return FALLBACK_TASK_NAME
  return isWindowsReservedName(limited) ? `${limited}-task` : limited
}

/**
 * 判断名字是否命中 Windows 保留名（含带扩展名的形式，如 `CON.txt`）。
 *
 * @param {string} name 目录名。
 * @returns {boolean} 是否保留名。
 */
export function isWindowsReservedName(name) {
  const stem = name.split('.')[0]?.toUpperCase() ?? ''
  return WINDOWS_RESERVED.has(stem)
}

/**
 * 生成第 n 个候选任务名：`task`、`task-2`、`task-3`…
 *
 * 已存在且**无属主标记**的目录被视为他人数据，必须换名而不是复用（../docs/contract.md#taskdir）。
 *
 * @param {string} base 基础名（应已 slug 化）。
 * @param {number} index 候选序号，从 1 开始。
 * @returns {string} 候选名，仍受长度上限约束。
 */
export function suffixedTaskName(base, index) {
  if (index <= 1) return base
  const suffix = `-${index}`
  const room = MAX_TASK_NAME_CHARS - suffix.length
  const head = base.slice(0, Math.max(1, room)).replace(/[-. ]+$/u, '')
  return `${head === '' ? FALLBACK_TASK_NAME : head}${suffix}`
}
