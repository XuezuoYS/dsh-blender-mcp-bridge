// SPDX-License-Identifier: GPL-3.0-or-later
// L1 静态判定：在**发往 add-on 之前**认出字面量路径的越界写/删、覆盖保存、丢弃会话。
//
// **这不是安全边界**（那是 L2，见 ../docs/contract.md#guard）：L1 只认字面量，
// 动态构造一律绕过。命中即**根本不发送**，因此被拒的代码从未进入 Blender；
// 未命中**不等于**安全，只代表"这一层没话说"。

import { isAbsolute, join, resolve } from 'node:path'

import { isInsideTask } from './taskDir.js'
import { FILE_OUTPUT_OPS, isPathArgument } from './writeOps.js'

/** 判定规则名（进返回体的 `reason`，字段名一经发布不改）。 */
export const RULES = {
  overwriteSave: 'overwrite-save',
  discardSession: 'discard-session',
  writeOutsideScope: 'write-outside-scope',
  deleteOutsideScope: 'delete-outside-scope',
  environmentChange: 'environment-change',
}

/**
 * 一条静态命中。
 *
 * @typedef {object} PolicyHit
 * @property {string} rule 规则名。
 * @property {string} evidence 命中的源码片段。
 * @property {number} offset 命中位置（源码字符偏移）。
 * @property {string} [path] 命中的字面量路径（若有）。
 * @property {'literal'|'dynamic'} pathKind 路径是字面量还是表达式。
 * @property {string} explanation 为什么它危险。
 */

/**
 * 扫描结果。
 *
 * @typedef {object} ScanResult
 * @property {boolean} blocked 是否必须拒绝发送。
 * @property {PolicyHit|undefined} hit 导致拒绝的命中（blocked 时必有）。
 * @property {string|undefined} blockedPath 被拒绝的目标路径。
 * @property {string|undefined} reason 规则名（= hit.rule）。
 * @property {string|undefined} suggestedPath 任务目录内的等价落点。
 * @property {string|undefined} handoff 需要用户自己完成的说明。
 * @property {PolicyHit[]} issues 提示性命中（**不代表已拦**）。
 */

/** `bpy.ops.<module>.<name>(...)` 的算子调用。 */
const OP_CALL_PATTERN = /\bbpy\.ops\.([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gu

/** `bpy.data.<collection>.remove(...)`：只在 issues 里提示，靠运行时差分给证据（../docs/contract.md#interception）。 */
const DATA_REMOVE_PATTERN = /\bbpy\.data\.([A-Za-z_]\w*)\.remove\s*\(/gu

/** 写模式的文件打开。 */
const OPEN_PATTERN = /\b(?:(?:io|os)\.)?open\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gu

/** pathlib 写族。 */
const PATHLIB_WRITE_PATTERN = /\.(write_text|write_bytes|touch|unlink|mkdir|rmdir|rename|replace)\s*\(/gu

/** 删除 / 改名族。 */
const DELETE_PATTERN = /\b(?:os\.(?:remove|unlink|rmdir|rename|replace|truncate)|shutil\.(?:rmtree|move|copyfile|copy2|copytree))\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gu

/**
 * **文件输出算子**（报告 P0-4）。
 *
 * 路由依据是与 L2 共用的同一张表（`lib/writeOps.js`），不在这里另写一份——
 * 两张清单必定漂移，届时会出现"L1 拦、L2 放"的静默缺口。
 *
 * 覆盖形态：
 * - `bpy.ops.<module>.<op>(…)` 里 module/op 命中 `FILE_OUTPUT_OPS`；
 * - `bpy.data.libraries.write(…)`（它在 `bpy.data` 上，不是算子）。
 */
const FILE_OP_CALL_PATTERN = /\bbpy\.(?:ops\.([A-Za-z_]\w*)\.([A-Za-z_]\w*)|data\.([A-Za-z_]\w*)\.([A-Za-z_]\w*))\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gu

/**
 * `变量 = "字面量"` 的赋值（用于把 `p = "…"; open(p,'w')` 这类也纳入判定）。
 *
 * ⚠️ **不带 `/g`**：消费方式是 `source.matchAll(pattern)`，而 `matchAll` **要求带 `g`**
 * 且会克隆正则——所以这里不能复用带 `g` 的单例。本仓已有一次同族事故记录
 * （`ENV_WRITE_PATTERNS` 的 `/g` 游标泄漏导致"连扫三次呈 true/false/true"），
 * 首版这里又踩了一次：`ASSIGN_PATTERN` 带 `g` 且被 `matchAll` 直接消费，
 * 于是绑定表**隔次为空**（实测：`p = "D:/other/v.txt"; open(p,'w')` 交错通过/漏判）。
 * 每次调用现造一个带 `g` 的新正则，`lastIndex` 就不会跨调用残留。
 */
const ASSIGN_SOURCE = /^[ \t]*([A-Za-z_]\w*)\s*=\s*(.+)$/u

/**
 * 环境写入口（范围严格限定为三项，见 ../docs/contract.md#interception-env-writes）。
 *
 * **这些正则一律不带 `g`**：消费方式是 `pattern.exec(source)`，而 `/g` 正则的 `lastIndex`
 * 挂在**模块级单例对象**上且从不重置，于是判定结果取决于本进程此前扫过什么——同一段
 * 环境写第二次就不再拦（实测：连扫三次呈 `true/false/true` 交替）。这一族只需要"有没有命中"，
 * 无 `g` 的 `exec` 每次都是从零开始找第一个匹配，正是想要的语义。
 * 同文件其它族用 `matchAll`（内部克隆正则，不推进原对象的 `lastIndex`），所以没有这个问题。
 */
const ENV_WRITE_PATTERNS = [
  { pattern: /\bbpy\.context\.preferences\b\s*\.\s*[A-Za-z_]\w*\s*\.\s*[A-Za-z_]\w*\s*=[^=]/u, what: '写 Blender 偏好（跨会话持久）' },
  { pattern: /\bbpy\.context\.preferences\b\s*=\s*[^=]/u, what: '替换 Blender 偏好对象' },
  { pattern: /\baddon_utils\.(?:enable|disable|module_bl_info)\s*\(/u, what: '改动 add-on 启用状态（跨会话持久）' },
  { pattern: /\buse_scripts_auto_execute\s*=\s*(?:True|False|1|0)/u, what: '改动脚本自动执行开关' },
]

/** `copy=True` / `copy = True` 的显式放行形式。 */
const COPY_TRUE_PATTERN = /(?:^|,)\s*copy\s*=\s*True\s*(?:,|$)/u

/**
 * 扫描一段待执行的 Python。
 *
 * @param {object} options 参数。
 * @param {string} options.code 待执行的源码。
 * @param {string} options.allowRoot 唯一可写范围（任务目录绝对路径）。
 * @param {string} options.blenderCwd Blender 进程 cwd；相对路径按它解析（**实测**在 Program Files 下）。
 * @returns {ScanResult} 扫描结果。
 */
export function scanRequest({ code, allowRoot, blenderCwd }) {
  const source = stripCommentsAndDocstrings(code)
  /** @type {PolicyHit[]} */
  const issues = []
  /**
   * 命中即拒的清单。
   *
   * **为什么是数组而不是"命中就 return"**：报告实测——三个越界载荷写在同一次调用里时
   * 只报**第一个**命中，其余不列出。对"告诉用户你犯了哪些规"够用，
   * 对"审计一次 payload 的全部风险面"不够。因此全部记下来，最后统一处置。
   * @type {PolicyHit[]}
   */
  const blockedHits = []
  /** 已解析的字面量变量绑定（`p = "…"`），用于把 `open(p,'w')` 这类也纳入判定。 */
  const bindings = collectLiteralBindings(source)

  /**
   * 记录一条"拒绝级"命中（不立即返回）。
   *
   * @param {PolicyHit} hit 命中。
   * @returns {void}
   */
  const markBlocked = (hit) => {
    blockedHits.push(hit)
  }

  // ---- 1. 覆盖保存 / 丢弃会话（算子层）----
  for (const match of source.matchAll(OP_CALL_PATTERN)) {
    const [evidence, module, name, rawArgs] = match
    const offset = match.index ?? 0

    if (module === 'wm' && (name === 'save_mainfile' || name === 'read_homefile'
      || name === 'read_factory_settings' || name === 'read_factory_userpref' || name === 'read_userpref')) {
      const isSave = name === 'save_mainfile'
      markBlocked({
        rule: isSave ? RULES.overwriteSave : RULES.discardSession,
        evidence,
        offset,
        pathKind: 'literal',
        explanation: isSave
          ? '`wm.save_mainfile` 等价于 Ctrl+S，会覆盖用户文件；要存盘请走 blender_mcp_snapshot'
          : `\`wm.${name}\` 会丢弃当前会话`,
      })
      continue
    }

    if (module === 'wm' && name === 'save_as_mainfile') {
      const literal = extractLiteralPath(rawArgs, ['filepath', 'file'])
      const copies = COPY_TRUE_PATTERN.test(rawArgs)
      if (!copies) {
        // 不带 copy=True 的 save_as_mainfile = 覆盖保存
        markBlocked({
          rule: RULES.overwriteSave,
          evidence,
          offset,
          path: literal.value,
          pathKind: literal.kind,
          explanation: '`wm.save_as_mainfile` 未带 `copy=True` 会改写会话文件路径并覆盖用户文件；'
            + '检查点机制自己的 `copy=True` 存盘不受此限',
        })
        continue
      }

      // 带 copy=True 也**不等于**可以去任何地方：`copy=True` 只豁免"覆盖保存"这一条，
      // 不豁免可写范围（I5）。此前这一支把 literal 取出来后就丢弃，于是任意用户代码能
      // 用 save_as_mainfile(copy=True) 在任务目录外写出 .blend，两层都不拦（实测）。
      // 检查点与 snapshot 都直连 sendExecute、不经过 L1，且路径由插件派生必在界内，
      // 所以收紧这一支不会影响它们的存盘出口（../docs/contract.md#checkpoint）。
      const target = resolveTargetOrBinding(extractLiteralPath(rawArgs, ['filepath', 'file']).value, blenderCwd, bindings)
      if (target === undefined) {
        issues.push({
          rule: RULES.writeOutsideScope,
          evidence,
          offset,
          pathKind: 'dynamic',
          explanation: '`save_as_mainfile(copy=True)` 的目标不是字面量路径，L1 无法判定；'
            + '由 L2 运行时按 realpath 兜底',
        })
      } else if (!isInsideTask(allowRoot, target)) {
        markBlocked({
          rule: RULES.writeOutsideScope,
          evidence,
          offset,
          path: target,
          pathKind: 'literal',
          explanation: '`copy=True` 只表示不覆盖会话文件，不表示可以写到任务目录之外',
        })
      }
    }
  }

  // ---- 2. 删除 / 改名族（按**写路径**判定，不按算子名）----
  // 报告 P0-2：此前**只取第一个实参**（源），于是 `shutil.move(界内 → 界外)`、`os.rename`、
  // `os.replace` 的目标端在 L1 与 L2 都不判。现在逐个实参判，任一越界即拒。
  for (const match of source.matchAll(DELETE_PATTERN)) {
    const [evidence, rawArgs] = match
    const offset = match.index ?? 0
    const args = splitTopLevelArgs(rawArgs)
    /** @type {string[]} */
    const literalPaths = []
    let sawDynamic = false
    for (const arg of args) {
      const target = resolveTargetOrBinding(arg, blenderCwd, bindings)
      if (target === undefined) {
        sawDynamic = true
        continue
      }
      literalPaths.push(target)
    }
    const outside = literalPaths.find(target => !isInsideTask(allowRoot, target))
    if (outside !== undefined) {
      markBlocked({
        rule: RULES.deleteOutsideScope,
        evidence,
        offset,
        path: outside,
        pathKind: 'literal',
        explanation: '删除/改名族的**某个实参**（源或目标）落在任务目录之外，属于不可逆的越界删除',
      })
      continue
    }
    if (literalPaths.length === 0 && sawDynamic) {
      issues.push({
        rule: RULES.deleteOutsideScope,
        evidence,
        offset,
        pathKind: 'dynamic',
        explanation: '删除/改名族的目标不是字面量路径，L1 无法判定；由 L2 运行时按 realpath 兜底',
      })
    }
  }

  // ---- 3. 写路径族 ----
  for (const match of source.matchAll(OPEN_PATTERN)) {
    const [evidence, rawArgs] = match
    const offset = match.index ?? 0
    const mode = parseOpenMode(rawArgs)
    if (mode.kind === 'read') continue
    if (mode.kind === 'unknown') {
      // `open(p, FLAG)` 这种符号模式的写判定 L1 做不到（`os.O_CREAT|os.O_WRONLY` 不是字面量）。
      // **不得静默放行**：如实登记为"无法判定"，靠 L2 的 os.open/open 钩子兜底。
      issues.push({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        pathKind: 'dynamic',
        explanation: '`open` 的模式不是字面量，L1 无法判定这是读还是写；'
          + '由 L2 运行时按实际 mode 判定（读一律放行）',
      })
      continue
    }
    // 目标就是第一个实参——传**实参原文**给解析器（它能认字面量，也能认变量名绑定）
    const target = resolveTargetOrBinding(splitTopLevelArgs(rawArgs)[0], blenderCwd, bindings)
    if (target === undefined) {
      issues.push({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        pathKind: 'dynamic',
        explanation: '写目标不是字面量路径，L1 无法判定；由 L2 运行时按 realpath 兜底',
      })
      continue
    }
    if (!isInsideTask(allowRoot, target)) {
      markBlocked({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        path: target,
        pathKind: 'literal',
        explanation: '写目标落在任务目录之外；所有产物都必须落在任务目录内',
      })
    }
  }

  for (const match of source.matchAll(PATHLIB_WRITE_PATTERN)) {
    const [evidence] = match
    issues.push({
      rule: RULES.writeOutsideScope,
      evidence,
      offset: match.index ?? 0,
      pathKind: 'dynamic',
      explanation: 'pathlib 写族的目标由对象决定，L1 不解析对象绑定；由 L2 运行时按 realpath 兜底',
    })
  }

  // ---- 3b. **文件输出算子**（报告 P0-4）----
  // 路由依据是与 L2 共用的同一张表（lib/writeOps.js）。判定仍是"落盘实参出界与否"（I6）。
  for (const match of source.matchAll(FILE_OP_CALL_PATTERN)) {
    const [, opsModule, opsName, dataModule, dataName, rawArgs] = match
    const evidence = match[0]
    const offset = match.index ?? 0
    /** @type {string[]|undefined} */
    let explicit
    if (opsModule !== undefined) {
      explicit = FILE_OUTPUT_OPS[opsModule]?.[opsName]
    } else if (dataModule !== undefined) {
      explicit = FILE_OUTPUT_OPS[dataModule]?.[dataName]
    }
    // 不在表里的算子/方法：不是我们的判定对象，交给非名单路径
    if (explicit === undefined) continue

    const args = splitTopLevelArgs(rawArgs)
    /** @type {Map<string, string>} */
    const named = new Map()
    const positional = []
    for (const arg of args) {
      const namedMatch = /^([A-Za-z_]\w*)\s*=\s*(.+)$/su.exec(arg)
      if (namedMatch !== null) {
        named.set(namedMatch[1], namedMatch[2])
        continue
      }
      positional.push(arg)
    }
    // 显式名单为空时（例如 `image.save()`）按后缀兜底找 `filepath` / `path` 结尾的关键字
    const candidates = explicit.length > 0
      ? explicit
      : [...named.keys()].filter(name => isPathLikeKeyword(name))

    /** @type {string[]} */
    const literalPaths = []
    let sawPathArg = false
    let sawDynamicPath = false
    // 位置实参同样要判：`bpy.data.libraries.write('D:/x.blend', set())` 的目标是**第一个位置实参**，
    // 只认关键字实参等于把这类调用整条漏掉（首版实测）。
    for (const expression of positional) {
      sawPathArg = true
      const target = resolveTargetOrBinding(expression, blenderCwd, bindings)
      if (target === undefined) {
        sawDynamicPath = true
        continue
      }
      literalPaths.push(target)
    }
    for (const name of candidates) {
      const expression = named.get(name)
      if (expression === undefined) continue
      sawPathArg = true
      const target = resolveTargetOrBinding(expression, blenderCwd, bindings)
      if (target === undefined) {
        sawDynamicPath = true
        continue
      }
      literalPaths.push(target)
    }

    const outside = literalPaths.find(target => !isInsideTask(allowRoot, target))
    if (outside !== undefined) {
      markBlocked({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        path: outside,
        pathKind: 'literal',
        explanation: `\`${String(opsModule ?? dataModule)}.${String(opsName ?? dataName)}\` 是文件输出算子，`
          + '它的落盘实参落在任务目录之外',
      })
      continue
    }
    if (!sawPathArg) {
      // 该算子**没有**可判定的落盘实参（例如 `image.save()`：目标来自 `image.filepath` 数据块属性）。
      // 如实登记为"无法判定"，不假装覆盖（../docs/contract.md#interception 的诚实边界）。
      issues.push({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        pathKind: 'dynamic',
        explanation: `\`${String(opsModule ?? dataModule)}.${String(opsName ?? dataName)}\` 的落盘目标由数据块属性（如 `
          + '`image.filepath`）决定，没有可判定的实参：L1 与 L2 **都无法判定**它写到哪。'
          + '需要可控落盘请改用带 `filepath` 的算子（如 `image.save_as(filepath=…)`）。',
      })
      continue
    }
    if (sawDynamicPath) {
      issues.push({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        pathKind: 'dynamic',
        explanation: '文件输出算子的落盘实参不是字面量路径，L1 无法判定；由 L2 运行时按 realpath 兜底',
      })
    }
  }

  // ---- 4. 环境写入口（三项，见 ../docs/contract.md#interception-env-writes）----
  for (const { pattern, what } of ENV_WRITE_PATTERNS) {
    const found = pattern.exec(source)
    if (found === null) continue
    markBlocked({
      rule: RULES.environmentChange,
      evidence: found[0],
      offset: found.index,
      pathKind: 'literal',
      explanation: `${what}；这类改动跨会话持久，比丢一个场景更不可逆`,
    })
  }

  // ---- 5. 只在 issues 里提示的高风险操作（不拦，靠运行时差分给证据）----
  for (const match of source.matchAll(DATA_REMOVE_PATTERN)) {
    issues.push({
      rule: 'data-remove',
      evidence: match[0],
      offset: match.index ?? 0,
      pathKind: 'dynamic',
      explanation: '`bpy.data.*.remove()` 不在拦截范围（../docs/contract.md#interception）；'
        + '本插件会在执行后比对数据块指针集合，把差集写进 risk_notes',
    })
  }

  if (blockedHits.length === 0) {
    return { blocked: false, hit: undefined, blockedPath: undefined, reason: undefined, suggestedPath: undefined, handoff: undefined, issues }
  }

  // 既有字段取**第一个**命中：字段名与形状不变（I23）。
  // 全部命中进 `issues`（并由 lib/tools.js 落到 `blocked.blockedAll`），
  // 于是"同一次调用里还犯了哪些规"不再丢失（../docs/contract.md#interception）。
  const primary = /** @type {PolicyHit} */ (blockedHits[0])
  const rejection = reject(primary, { code, allowRoot, blenderCwd })
  /** @type {PolicyHit[]} */
  const allHits = []
  const seen = new Set()
  for (const hit of [...blockedHits, ...issues]) {
    const key = `${hit.rule}\u0000${hit.offset}`
    if (seen.has(key)) continue
    seen.add(key)
    allHits.push(hit)
  }
  return { ...rejection, issues: allHits }
}

/**
 * 生成拒绝结果，并派发任务目录内的等价落点。
 *
 * @param {PolicyHit} hit 命中。
 * @param {{code: string, allowRoot: string, blenderCwd: string}} options 上下文。
 * @returns {ScanResult} 拒绝结果。
 */
function reject(hit, options) {
  const suggested = hit.path === undefined ? undefined : join(options.allowRoot, 'exports', baseName(hit.path))
  return {
    blocked: true,
    hit,
    blockedPath: hit.path,
    reason: hit.rule,
    suggestedPath: suggested,
    handoff: handoffFor(hit, options.allowRoot),
    issues: [hit],
  }
}

/**
 * 生成"接管提示"（../docs/contract.md#handoff）。
 *
 * @param {PolicyHit} hit 命中。
 * @param {string} allowRoot 任务目录。
 * @returns {string} 给用户/agent 的说明。
 */
function handoffFor(hit, allowRoot) {
  switch (hit.rule) {
    case RULES.overwriteSave:
      return '覆盖保存被拒。请改用 blender_mcp_snapshot 把会话存成任务目录内的副本；'
        + '若确实要覆盖用户文件，需要用户自己在 Blender 里保存。'
    case RULES.discardSession:
      return '丢弃会话的算子被拒。若用户确实要重置会话，需要用户自己在 Blender 里操作。'
    case RULES.environmentChange:
      return '改动 Blender 偏好 / add-on 开关 / 脚本自动执行被拒（跨会话持久）。需要用户自己在偏好设置里改。'
    default:
      return `越界写/删被拒：可写范围只有任务目录 ${allowRoot}。`
        + '若确实要在别处落盘，需要用户自己在系统里完成这一步。'
  }
}

/**
 * 取路径的最后一段。
 *
 * @param {string} path 路径。
 * @returns {string} 文件名或原串。
 */
function baseName(path) {
  const parts = path.split(/[\\/]/u)
  return parts[parts.length - 1] === '' ? 'output' : /** @type {string} */ (parts[parts.length - 1])
}

/**
 * 从实参文本里取第一个字面量字符串。
 *
 * @default keywords = []
 * @param {string} rawArgs 实参文本。
 * @param {string[]} [keywords] 优先匹配的关键字实参名。
 * @returns {{value: string|undefined, kind: 'literal'|'dynamic'}} 提取结果。
 */
function extractLiteralPath(rawArgs, keywords = []) {
  for (const keyword of keywords) {
    const named = new RegExp(`${keyword}\\s*=\\s*([^,()]+)`, 'u').exec(rawArgs)
    if (named === null) continue
    const value = literalOf(named[1])
    return value === undefined ? { value: undefined, kind: 'dynamic' } : { value, kind: 'literal' }
  }
  const first = splitTopLevelArgs(rawArgs)[0]
  if (first === undefined) return { value: undefined, kind: 'dynamic' }
  const value = literalOf(first)
  return value === undefined ? { value: undefined, kind: 'dynamic' } : { value, kind: 'literal' }
}

/**
 * 把实参文本按顶层逗号切开（忽略括号内与引号内的逗号）。
 *
 * @param {string} rawArgs 实参文本。
 * @returns {string[]} 各实参。
 */
function splitTopLevelArgs(rawArgs) {
  /** @type {string[]} */
  const parts = []
  let depth = 0
  let quote = ''
  let current = ''
  for (const ch of rawArgs) {
    if (quote !== '') {
      current += ch
      if (ch === quote) quote = ''
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      current += ch
      continue
    }
    if (ch === '(' || ch === '[' || ch === '{') depth += 1
    if (ch === ')' || ch === ']' || ch === '}') depth -= 1
    if (ch === ',' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += ch
  }
  if (current.trim() !== '') parts.push(current)
  return parts.map(part => part.trim())
}

/**
 * 判断一个表达式是否是字面量字符串（支持相邻字符串的隐式拼接）。
 *
 * @param {string} expr 表达式文本。
 * @returns {string|undefined} 字符串值；不是字面量时 undefined。
 */
function literalOf(expr) {
  const trimmed = expr.trim()
  if (trimmed === '') return undefined
  const pieces = trimmed.match(/^([rbfu]{0,2})("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')(\s*[rbfu]{0,2}("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'))*$/u)
  if (pieces === null) return undefined
  /** @type {string[]} */
  const values = []
  for (const match of trimmed.matchAll(/([rbfu]{0,2})("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/gu)) {
    const prefix = match[1].toLowerCase()
    if (prefix.includes('b')) return undefined
    const body = match[2].slice(1, -1)
    values.push(prefix.includes('r') ? body : unescapePythonString(body))
  }
  return values.join('')
}

/**
 * 还原 Python 字符串转义（够用即可：我们只用来比对路径）。
 *
 * @param {string} body 已去掉引号的字符串体。
 * @returns {string} 还原后的字符串。
 */
function unescapePythonString(body) {
  return body.replace(/\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|.)/gu, (_all, escape) => {
    if (escape === 'n') return '\n'
    if (escape === 't') return '\t'
    if (escape === 'r') return '\r'
    if (escape === '\\') return '\\'
    if (escape === "'") return "'"
    if (escape === '"') return '"'
    if (escape.startsWith('x')) return String.fromCharCode(Number.parseInt(escape.slice(1), 16))
    if (escape.startsWith('u')) return String.fromCharCode(Number.parseInt(escape.slice(1), 16))
    return escape
  })
}

/**
 * 把字面量路径解析成绝对路径。
 *
 * 相对路径按 **Blender 进程 cwd** 解析——那才是真正的落点（../docs/contract.md#handoff）。
 *
 * @param {string|undefined} value 字面量路径。
 * @param {string} blenderCwd Blender 进程 cwd。
 * @returns {string|undefined} 绝对路径。
 */
function resolveTarget(value, blenderCwd) {
  if (value === undefined || value === '') return undefined
  const expanded = value.replace(/^~(?=$|[\\/])/u, process.env.USERPROFILE ?? process.env.HOME ?? '~')
  return isAbsolute(expanded) ? resolve(expanded) : resolve(blenderCwd, expanded)
}

/**
 * 判定一个关键字实参名是否属于"落盘目标"（后缀兜底）。
 *
 * 与 `lib/writeOps.js` 的同名判据同源，避免两边各写一份。
 *
 * @param {string} name 关键字实参名。
 * @returns {boolean} 是否为落盘目标。
 */
function isPathLikeKeyword(name) {
  return isPathArgument(name)
}

/**
 * 收集 `变量 = "字面量"` 形式的绑定。
 *
 * **为什么需要它**：报告里 `io.open(OUT+'/b.txt','w')` 这种动态拼接本来就该由 L2 兜底，
 * 但真实代码更常见的是
 * ```
 * p = "D:/out/x.txt"
 * open(p, "w")
 * ```
 * 这条路径的**目标本来是字面量**，只是隔了一个变量。不跟这一层简单的绑定，
 * L1 会对"能静态判定"的越界写集体失明，而这类写法在模型产出里非常普遍。
 *
 * 只跟**单层**绑定、只认纯字面量右值：不做表达式求值的推断——
 * 半套推断比不做更危险（会让"看起来判过了"的东西其实没判）。
 *
 * @param {string} source 已剥注释的源码。
 * @returns {Map<string, string>} 变量名 -> 字面量值。
 */
function collectLiteralBindings(source) {
  /** @type {Map<string, string>} */
  const out = new Map()
  // 现造带 g 的新正则：`matchAll` 的 lastIndex 语义不跨调用残留（见 ASSIGN_SOURCE 的说明）
  const pattern = new RegExp(ASSIGN_SOURCE.source, 'gmu')
  for (const match of source.matchAll(pattern)) {
    const [, name, expression] = match
    if (name === undefined || expression === undefined) continue
    const value = literalOf(expression)
    if (value !== undefined) out.set(name, value)
  }
  return out
}

/**
 * 解析目标路径：**字符串字面量优先，其次单层变量绑定**。
 *
 * ⚠️ 入参是**表达式原文**，不是已经提取过的字面量值。首版把 `extractLiteralPath(...).value`
 * 传进来，而变量名（`p`）从来不是字面量，于是 `value` 恒为 `undefined`、
 * 绑定表以"输入是 undefined"为由被直接跳过——**整张绑定表等于没接线**
 * （实测：`p = 'D:/other/v.txt'; open(p,'w')` 漏判，但若手写成字面量却能判）。
 * 这类"辅助机制看起来接上了、其实输入口径错了"的缺陷，靠读代码发现不了，只能靠用例。
 *
 * @default bindings = new Map()
 * @param {string|undefined} expression 实参原文（可能是 `'D:/x'`，也可能是 `p`）。
 * @param {string} blenderCwd Blender 进程 cwd。
 * @param {Map<string, string>} [bindings] 字面量绑定表。
 * @returns {string|undefined} 绝对路径；无法判定时 undefined。
 */
function resolveTargetOrBinding(expression, blenderCwd, bindings = new Map()) {
  if (expression === undefined) return undefined
  const literal = literalOf(expression)
  if (literal !== undefined) return resolveTarget(literal, blenderCwd)
  const bound = bindings.get(expression.trim())
  return bound === undefined ? undefined : resolveTarget(bound, blenderCwd)
}

/**
 * 解析 `open(...)` 的模式实参。
 *
 * 三态而不是布尔：`read`（确定只读，放行）、`write`（确定写，判定目标）、
 * `unknown`（模式不是字面量，例如 `os.O_CREAT|os.O_WRONLY`）。
 * 布尔形态会把 `unknown` 悄悄归到"放行"——那正是 L1 对符号模式写集体失明的成因。
 *
 * @param {string} rawArgs 实参文本。
 * @returns {{kind: 'read'|'write'|'unknown'}} 模式判定。
 */
function parseOpenMode(rawArgs) {
  const args = splitTopLevelArgs(rawArgs)
  const modeArg = args.find(arg => /^mode\s*=/u.test(arg)) ?? args[1]
  if (modeArg === undefined) return { kind: 'read' }
  const value = literalOf(modeArg.replace(/^mode\s*=/u, ''))
  if (value === undefined) return { kind: 'unknown' }
  return { kind: /[wax+]/u.test(value) ? 'write' : 'read' }
}

/**
 * 粗略剥掉注释与三引号字符串块，降低误报。
 *
 * 只做够用的处理：真正的解析在 L2（../docs/contract.md#guard）。
 *
 * @param {string} code 源码。
 * @returns {string} 剥掉注释后的源码（长度与位置**会变**，因此命中的 offset 只作提示）。
 */
function stripCommentsAndDocstrings(code) {
  return code
    .replace(/"""[\s\S]*?"""/gu, match => ' '.repeat(match.length))
    .replace(/'''[\s\S]*?'''/gu, match => ' '.repeat(match.length))
    .replace(/(^|[^\\])#[^\n]*/gu, (_all, prefix) => prefix)
}
