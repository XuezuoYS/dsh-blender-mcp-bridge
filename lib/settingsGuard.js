// SPDX-License-Identifier: GPL-3.0-or-later
// 渲染/导出设置的**会话基线**与**漂移报告**。
//
// 职责：记住本会话第一次执行时的渲染与导出设置，之后每次比对并列出差异，
// 让"模型改了用户设置"这件事**看得见**。
//
// 为什么需要它：一次真实事故里，本插件为出预览图把 `cycles.samples` 钉成 256、
// 把 `frame_start/frame_end` 留成探针值、把 `view_settings.exposure` 固化成调色值，
// 用户没有要求过。软限制写在提示词里（见 index.js 的 settings policy），
// 这里负责提供**可核对的事实**。
//
// 边界：**只读**。这个模块不写盘、不改场景、不联网；它只发一段只读代码取当前值。

/** 参与比对、且属于"用户所有权"的设置键。 */
export const TRACKED_SETTINGS = [
  'engine',
  'resolutionX',
  'resolutionY',
  'resolutionPercentage',
  'filmTransparent',
  'fileFormat',
  'colorMode',
  'outputFilepath',
  'samples',
  'previewSamples',
  'device',
  'maxBounces',
  'volumeBounces',
  'viewTransform',
  'look',
  'exposure',
  'frameStart',
  'frameEnd',
  'frameCurrent',
  'useCompositing',
]

/**
 * 读当前渲染/导出设置（只读代码）。
 *
 * @param {{send: (code: string) => Promise<Record<string, any> | undefined>}} io 发送器。
 * @returns {Promise<Record<string, unknown> | undefined>} 设置快照；取不到返回 undefined。
 */
export async function readRenderSettings(io) {
  const code = [
    'import bpy',
    '_s = bpy.context.scene',
    '_r = _s.render',
    '_c = getattr(_s, "cycles", None)',
    '_v = _s.view_settings',
    'result = {',
    '    "engine": _r.engine,',
    '    "resolutionX": _r.resolution_x,',
    '    "resolutionY": _r.resolution_y,',
    '    "resolutionPercentage": _r.resolution_percentage,',
    '    "filmTransparent": bool(_r.film_transparent),',
    '    "fileFormat": _r.image_settings.file_format,',
    '    "colorMode": _r.image_settings.color_mode,',
    '    "outputFilepath": _r.filepath,',
    '    "samples": getattr(_c, "samples", None),',
    '    "previewSamples": getattr(_c, "preview_samples", None),',
    '    "device": getattr(_c, "device", None),',
    '    "maxBounces": getattr(_c, "max_bounces", None),',
    '    "volumeBounces": getattr(_c, "volume_bounces", None),',
    '    "viewTransform": _v.view_transform,',
    '    "look": _v.look,',
    '    "exposure": round(_v.exposure, 4),',
    '    "frameStart": _s.frame_start,',
    '    "frameEnd": _s.frame_end,',
    '    "frameCurrent": _s.frame_current,',
    '    "useCompositing": bool(_r.use_compositing),',
    '}',
    '',
  ].join('\n')
  return await io.send(code)
}

/**
 * 比对两份设置快照，返回差异清单。
 *
 * @param {Record<string, unknown> | undefined} baseline 基线（改动之前）。
 * @param {Record<string, unknown> | undefined} current 当前值。
 * @returns {Array<{key: string, from: unknown, to: unknown}>} 差异项（按键名排序）。
 */
export function diffSettings(baseline, current) {
  if (baseline === undefined || current === undefined) return []
  /** @type {Array<{key: string, from: unknown, to: unknown}>} */
  const out = []
  for (const key of TRACKED_SETTINGS) {
    if (!(key in baseline) || !(key in current)) continue
    const from = baseline[key]
    const to = current[key]
    if (JSON.stringify(from) === JSON.stringify(to)) continue
    out.push({ key, from, to })
  }
  return out
}

/**
 * 会话级设置基线登记表：每个会话**只记第一次**读到的那份设置。
 *
 * 契约摘要：基线在**第一次 exec 之前**采集（顺序即正确性，见 `lib/tools.js`）——
 * 之后再被谁改动，`status` 与 `exec` 都能把漂移报出来。它**不阻断**执行：
 * 阻断是 L1/L2 的事，这里只负责让"AI 改了你的设置"这件事**可见**。
 *
 * 常用入口：
 * - remember: 记下基线（已存在则不覆盖）
 * - get: 取基线，没有则 undefined
 */
export class SettingsBaseline {
  constructor() {
    /** @type {Map<string, Record<string, unknown>>} */
    this.baselines = new Map()
  }

  /**
   * 记录基线（已存在则不覆盖）。
   *
   * @param {string} sessionId 会话 id。
   * @param {Record<string, unknown> | undefined} settings 当前设置。
   * @returns {boolean} 是否这次真的记下了基线。
   */
  remember(sessionId, settings) {
    if (settings === undefined) return false
    if (this.baselines.has(sessionId)) return false
    this.baselines.set(sessionId, settings)
    return true
  }

  /**
   * 取基线。
   *
   * @param {string} sessionId 会话 id。
   * @returns {Record<string, unknown> | undefined} 基线或 undefined。
   */
  get(sessionId) {
    return this.baselines.get(sessionId)
  }
}
