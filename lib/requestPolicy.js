// SPDX-License-Identifier: GPL-3.0-or-later
// L1 静态判定：在**发往 add-on 之前**认出字面量路径的越界写/删、覆盖保存、丢弃会话。
//
// **这不是安全边界**（那是 L2，见 ../docs/contract.md#guard）：L1 只认字面量，
// 动态构造一律绕过。命中即**根本不发送**，因此被拒的代码从未进入 Blender；
// 未命中**不等于**安全，只代表"这一层没话说"。

import { isAbsolute, join, resolve } from 'node:path'

import { isInsideTask } from './taskDir.js'

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
const DELETE_PATTERN = /\b(?:os\.(?:remove|unlink|rmdir|rename|replace)|shutil\.(?:rmtree|move|copyfile|copy2))\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gu

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

  // ---- 1. 覆盖保存 / 丢弃会话（算子层）----
  for (const match of source.matchAll(OP_CALL_PATTERN)) {
    const [evidence, module, name, rawArgs] = match
    const offset = match.index ?? 0

    if (module === 'wm' && (name === 'save_mainfile' || name === 'read_homefile'
      || name === 'read_factory_settings' || name === 'read_factory_userpref' || name === 'read_userpref')) {
      const isSave = name === 'save_mainfile'
      const rule = isSave ? RULES.overwriteSave : RULES.discardSession
      return reject({
        rule,
        evidence,
        offset,
        pathKind: 'literal',
        explanation: isSave
          ? '`wm.save_mainfile` 等价于 Ctrl+S，会覆盖用户文件；要存盘请走 blender_mcp_snapshot'
          : `\`wm.${name}\` 会丢弃当前会话`,
      }, { code, allowRoot, blenderCwd })
    }

    if (module === 'wm' && name === 'save_as_mainfile') {
      const literal = extractLiteralPath(rawArgs, ['filepath', 'file'])
      const copies = COPY_TRUE_PATTERN.test(rawArgs)
      if (!copies) {
        // 不带 copy=True 的 save_as_mainfile = 覆盖保存
        return reject({
          rule: RULES.overwriteSave,
          evidence,
          offset,
          path: literal.value,
          pathKind: literal.kind,
          explanation: '`wm.save_as_mainfile` 未带 `copy=True` 会改写会话文件路径并覆盖用户文件；'
            + '检查点机制自己的 `copy=True` 存盘不受此限',
        }, { code, allowRoot, blenderCwd })
      }

      // 带 copy=True 也**不等于**可以去任何地方：`copy=True` 只豁免"覆盖保存"这一条，
      // 不豁免可写范围（I5）。此前这一支把 literal 取出来后就丢弃，于是任意用户代码能
      // 用 save_as_mainfile(copy=True) 在任务目录外写出 .blend，两层都不拦（实测）。
      // 检查点与 snapshot 都直连 sendExecute、不经过 L1，且路径由插件派生必在界内，
      // 所以收紧这一支不会影响它们的存盘出口（../docs/contract.md#checkpoint）。
      const target = resolveTarget(literal.value, blenderCwd)
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
        return reject({
          rule: RULES.writeOutsideScope,
          evidence,
          offset,
          path: target,
          pathKind: 'literal',
          explanation: '`copy=True` 只表示不覆盖会话文件，不表示可以写到任务目录之外',
        }, { code, allowRoot, blenderCwd })
      }
    }
  }

  // ---- 2. 删除 / 改名族（按**写路径**判定，不按算子名）----
  for (const match of source.matchAll(DELETE_PATTERN)) {
    const [evidence, rawArgs] = match
    const offset = match.index ?? 0
    const literal = extractLiteralPath(rawArgs)
    const target = resolveTarget(literal.value, blenderCwd)
    if (target === undefined) {
      issues.push({
        rule: RULES.deleteOutsideScope,
        evidence,
        offset,
        pathKind: 'dynamic',
        explanation: '删除/改名族的目标不是字面量路径，L1 无法判定；由 L2 运行时按 realpath 兜底',
      })
      continue
    }
    if (!isInsideTask(allowRoot, target)) {
      return reject({
        rule: RULES.deleteOutsideScope,
        evidence,
        offset,
        path: target,
        pathKind: 'literal',
        explanation: '删除/改名目标落在任务目录之外，属于不可逆的越界删除',
      }, { code, allowRoot, blenderCwd })
    }
  }

  // ---- 3. 写路径族 ----
  for (const match of source.matchAll(OPEN_PATTERN)) {
    const [evidence, rawArgs] = match
    const offset = match.index ?? 0
    if (!isWriteModeOpen(rawArgs)) continue
    const literal = extractLiteralPath(rawArgs)
    const target = resolveTarget(literal.value, blenderCwd)
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
      return reject({
        rule: RULES.writeOutsideScope,
        evidence,
        offset,
        path: target,
        pathKind: 'literal',
        explanation: '写目标落在任务目录之外；所有产物都必须落在任务目录内',
      }, { code, allowRoot, blenderCwd })
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

  // ---- 4. 环境写入口（三项，见 ../docs/contract.md#interception-env-writes）----
  for (const { pattern, what } of ENV_WRITE_PATTERNS) {
    const found = pattern.exec(source)
    if (found === null) continue
    return reject({
      rule: RULES.environmentChange,
      evidence: found[0],
      offset: found.index,
      pathKind: 'literal',
      explanation: `${what}；这类改动跨会话持久，比丢一个场景更不可逆`,
    }, { code, allowRoot, blenderCwd })
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

  return { blocked: false, hit: undefined, blockedPath: undefined, reason: undefined, suggestedPath: undefined, handoff: undefined, issues }
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
 * 判断 `open(...)` 是不是写模式。
 *
 * 只读一律放行：非写模式的 `open` 直接透传（**实测**读操作零影响）。
 *
 * @param {string} rawArgs 实参文本。
 * @returns {boolean} 是否写模式。
 */
function isWriteModeOpen(rawArgs) {
  const args = splitTopLevelArgs(rawArgs)
  const modeArg = args.find(arg => /^mode\s*=/u.test(arg)) ?? args[1]
  if (modeArg === undefined) return false
  const value = literalOf(modeArg.replace(/^mode\s*=/u, ''))
  if (value === undefined) return false
  return /[wax+]/u.test(value)
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
