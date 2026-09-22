// SPDX-License-Identifier: GPL-3.0-or-later
// 知识库检索：读随包交付的只读索引，按 G1 契约 / G2 语义两种粒度回答。
//
// **纯只读**：不联网、不回传、不写任何位置、不产生任何对 add-on 的请求（I19 / I20）。
// 索引必须携带语料级预计算量（DF / IDF / 文件级 token 集合），查询**不得**重扫全语料。
// 返回的是**有界摘录**，不是整份数据。

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** 查询侧 stop-word 表（沿用上游做法：只作用于查询侧）。 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'how', 'in', 'is', 'it',
  'its', 'of', 'on', 'or', 'that', 'the', 'their', 'then', 'there', 'these', 'this', 'to', 'was', 'were',
  'what', 'when', 'where', 'which', 'who', 'will', 'with',
])

/** 单次返回条数的下界 / 上界 / 缺省值。 */
export const HITS_MIN = 1
export const HITS_MAX = 50
export const HITS_DEFAULT = 8

/**
 * 把"要几条"收敛进合法区间。
 *
 * 缺省值取 {@link HITS_DEFAULT}，而 `index.js` 的配置 schema 也用同一组常量做默认值——
 * 两处各写一个数字时它们**必然漂移**（实测：配置发布 `knowledge.maxHits: 8`，生效路径上却是
 * `?? 20`，于是那个配置键既没人当默认、也没人当上限）。
 *
 * @param {number|undefined} requested 调用方要的条数。
 * @returns {number} 生效条数（HITS_MIN–HITS_MAX）。
 */
function clampHits(requested) {
  const value = typeof requested === 'number' && Number.isFinite(requested)
    ? Math.floor(requested)
    : HITS_DEFAULT
  return Math.max(HITS_MIN, Math.min(value, HITS_MAX))
}

/**
 * 一个段落。
 *
 * @typedef {object} Segment
 * @property {number} index 段内序号（钻取用）。
 * @property {number} line 起始行。
 * @property {string} section 标题栈（`" > "` 连接；无 section 时为空串）。
 * @property {string} text 正文（归一化后）。
 * @property {string} [type] 段落类型（数据块段落才有）。
 * @property {string} [name] 数据块限定名（数据块段落才有）。
 * @property {string} [directive] directive 的原始签名（如 `add(*, radius=1.0)`），进 token 袋用。
 */

/**
 * 一个文件记录。
 *
 * @typedef {object} FileRecord
 * @property {string} path 相对 `knowledge/` 的路径（正斜杠）。
 * @property {'api'|'manual'} scope 语料分区。
 * @property {number} bytes 归一化正文字节数。
 * @property {number} segments 段落数。
 * @property {number[]} tokens 文件级 token 的**全局词表 id**（**预计算量**；只存存在性，不存词频）。
 * @property {Segment[]} items 段落。
 */

/**
 * 命中。
 *
 * @typedef {object} Hit
 * @property {string} path 沿用上游字段名。
 * @property {string} breadcrumb 沿用上游字段名（`" > "` 连接）。
 * @property {number} index 沿用上游字段名（钻取用）。
 * @property {number} score 沿用上游字段名（整数）。
 * @property {string} text 正文摘录。
 * @property {string} [type] 数据块类型（`api` mode）。
 * @property {string} [name] 数据块名（`api` mode）。
 */

/**
 * 知识库索引。
 *
 * 载入时一次性把索引读进内存：索引带预计算量，查询只做「读索引 + 打分」。
 *
 * token 在盘上是**全局词表 id**（见 `buildKnowledge.js`）：比存字符串小、加载更快。
 * 载入时把每个文件的 id 收成 `Set`——查询判定命中就变成整数集合查找。
 */
export class KnowledgeIndex {
  /**
   * @param {object} options 参数。
   * @param {FileRecord[]} options.files 文件记录。
   * @param {Record<string, number>} options.df token -> 文档频率。
   * @param {string[]} options.vocabulary 全局词表（id = 下标）。
   * @param {number} options.fileCount 语料文件总数。
   */
  constructor({ files, df, vocabulary, fileCount }) {
    /** @type {FileRecord[]} */
    this.files = files
    /** @type {Map<string, number>} */
    this.df = new Map(Object.entries(df))
    /** @type {string[]} */
    this.vocabulary = vocabulary
    /** @type {Map<string, number>} */
    this.tokenIds = new Map(vocabulary.map((token, index) => [token, index]))
    /** @type {number} */
    this.fileCount = fileCount
    /** @type {Map<string, FileRecord>} */
    this.byName = new Map()
    /** @type {Map<FileRecord, Set<number>>} */
    this.fileTokenIds = new Map()
    for (const file of files) {
      file.tokens = Array.isArray(file.tokens) ? file.tokens : []
      this.fileTokenIds.set(file, new Set(file.tokens))
      for (const item of file.items) {
        if (item.name === undefined || item.type === undefined) continue
        this.byName.set(item.name, file)
      }
    }
  }

  /**
   * 从 `knowledge/` 根目录载入索引。
   *
   * **不接受配置参数**：索引是纯资产，随包只读，可被进程内缓存复用；
   * "返回几条"是使用侧的参数（`knowledge.maxHits` / 入参 `maxResults`），
   * 烘进实例会让缓存与配置互相牵制（换了配置就得作废缓存，那是自找的耦合）。
   *
   * @param {string} root 知识库根目录。
   * @returns {Promise<KnowledgeIndex>} 索引。
   * @throws {Error} 索引文件缺失或损坏（调用方据此报 `available:false`，见 I17）。
   */
  static async load(root) {
    const indexPath = join(root, 'index', 'files.jsonl')
    const dfPath = join(root, 'index', 'df.json')
    const tokensPath = join(root, 'index', 'tokens.json')
    const [rawIndex, rawDf, rawTokens] = await Promise.all([
      readFile(indexPath, 'utf8'),
      readFile(dfPath, 'utf8'),
      readFile(tokensPath, 'utf8'),
    ])

    /** @type {FileRecord[]} */
    const files = []
    for (const line of rawIndex.split('\n')) {
      if (line.trim() === '') continue
      const record = JSON.parse(line)
      if (record === null || typeof record !== 'object' || typeof record.path !== 'string') {
        throw new Error(`索引行不合法（缺 path）：${line.slice(0, 120)}`)
      }
      files.push(/** @type {FileRecord} */ (record))
    }
    if (files.length === 0) throw new Error('索引为空：files.jsonl 里没有任何文件记录')

    const parsed = JSON.parse(rawDf)
    const vocabulary = JSON.parse(rawTokens)
    if (!Array.isArray(vocabulary.vocabulary)) {
      throw new Error('词表缺失：index/tokens.json 里没有 vocabulary 数组')
    }

    return new KnowledgeIndex({
      files,
      df: parsed.df ?? {},
      vocabulary: vocabulary.vocabulary,
      fileCount: parsed.n_files ?? files.length,
    })
  }

  /**
   * 全文检索（G2 为主）。
   *
   * 两层过滤（沿用上游做法，是它 0.4 s 跑完的直接原因）：
   * 文件级 AND 预筛 → 段落级 AND 打分。索引侧预计算量让这一步不读语料。
   *
   * @param {string} query 查询串。
   * @param {{maxResults?: number, windowSize?: number, maxCharsPerHit?: number}} [options] 选项。
   * @returns {Hit[]} 命中，按分数降序。
   */
  search(query, options = {}) {
    const maxResults = clampHits(options.maxResults)
    const maxChars = options.maxCharsPerHit ?? 4000
    const terms = tokenize(query)
    if (terms.length === 0) return []

    // 查询 token 先映射成词表 id：文件级预筛就变成整数集合查找
    const termIds = terms.map(term => this.tokenIds.get(term)).filter(id => id !== undefined)
    if (termIds.length === 0) return []

    // 文件级 AND 预筛：只保留同时含全部查询 token 的文件
    const candidates = this.files.filter(file => termIds.every(id => this.fileTokenIds.get(file)?.has(id)))
    const pool = candidates.length > 0
      ? candidates
      : this.files.filter(file => termIds.some(id => this.fileTokenIds.get(file)?.has(id)))

    /** @type {Hit[]} */
    const hits = []
    for (const file of pool) {
      for (const item of file.items) {
        const score = scoreSegment(item, file, terms, this.df, this.fileCount)
        if (score <= 0) continue
        hits.push({
          path: file.path,
          breadcrumb: item.section,
          index: item.index,
          score,
          text: excerpt(item.text, terms, maxChars),
          ...item.type === undefined ? {} : { type: item.type },
          ...item.name === undefined ? {} : { name: item.name },
        })
      }
    }
    hits.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path) || a.index - b.index)
    return hits.slice(0, maxResults)
  }

  /**
   * 按标识符取契约（G1：精确匹配优先）。
   *
   * 支持上游的 `*` / `X.*` 列举语义；**深 2 类成员必须可寻址**——
   * 上游对 `bpy.types.Scene.frame_current` 这类成员返回 `partial`，那是它的行为缺口，
   * 我们不继承（../docs/contract.md#knowledge-retrieval）。
   *
   * @param {string} identifier 标识符，如 `bpy.ops.object.add`、`bpy.types.Scene.*`。
   * @param {{maxCharsPerHit?: number}} [options] 选项。
   * @returns {{kind: 'definition'|'namespace'|'partial'|'suggestions'|'missing', hits: Hit[], available?: string[]}} 查找结果。
   */
  lookupIdentifier(identifier, options = {}) {
    const maxChars = options.maxCharsPerHit ?? 4000
    const target = identifier.trim()
    if (target === '') return { kind: 'missing', hits: [] }

    if (target.endsWith('.*') || target === '*') {
      const prefix = target === '*' ? '' : target.slice(0, -2)
      const names = [...this.byName.keys()]
        .filter(name => prefix === '' || name.startsWith(prefix))
        .sort()
      return { kind: 'namespace', hits: [], available: [...new Set(names)].slice(0, 200) }
    }

    // 1) 精确命中（限定名，例如 `bpy.ops.object.add`、`Scene.frame_current`）
    const exact = this.lookupByExactName(target, maxChars)
    if (exact !== undefined) return { kind: 'definition', hits: [exact] }

    // 2) 短名命中（例如 `frame_current` 或 `Scene`）：
    //    语料里的名字有的带模块前缀（`bpy.ops.object.add`）、有的不带（`Scene.frame_current`），
    //    两种写法都要能用——这是上游在"深 2 类成员"上留缺口的地方，我们不继承。
    const suffix = `.${target}`
    const candidates = [...this.byName.keys()].filter(name => name.endsWith(suffix))
    if (candidates.length === 1) {
      const hit = this.lookupByExactName(/** @type {string} */ (candidates[0]), maxChars)
      if (hit !== undefined) return { kind: 'definition', hits: [hit] }
    }
    if (candidates.length > 1) {
      return { kind: 'namespace', hits: [], available: candidates.sort().slice(0, 200) }
    }

    // 3) 类成员（深 2）：`bpy.types.Scene.frame_current` —— 用父类段落 + 成员名做线索
    const memberMatch = /^(.*)\.([A-Za-z_]\w*)$/u.exec(target)
    if (memberMatch !== null) {
      const [, parent, member] = memberMatch
      const parentHit = this.lookupByExactName(parent, maxChars) ?? this.lookupByExactName(member, maxChars)
      if (parentHit !== undefined) {
        const hit = {
          ...parentHit,
          score: 90,
          text: `（按 \`${target}\` 定位到 \`${parentHit.name ?? parent}\`）\n\n${parentHit.text}`,
        }
        return { kind: 'partial', hits: [hit] }
      }
    }

    // 4) 模糊候选：给建议而不是干瘪的 notFound
    const suggestions = this.search(target, { maxResults: 5, maxCharsPerHit: 500 })
    if (suggestions.length > 0) return { kind: 'suggestions', hits: suggestions }
    return { kind: 'missing', hits: [] }
  }

  /**
   * 按限定名精确取一个段落。
   *
   * @param {string} name 限定名。
   * @param {number} maxChars 单条摘录上限。
   * @returns {Hit | undefined} 命中或 undefined。
   */
  lookupByExactName(name, maxChars) {
    for (const file of this.files) {
      for (const item of file.items) {
        if (item.name !== name) continue
        return {
          path: file.path,
          breadcrumb: item.section,
          index: item.index,
          score: 100,
          text: excerpt(item.text, tokenize(name), maxChars),
          ...item.type === undefined ? {} : { type: item.type },
          name: item.name,
        }
      }
    }
    return undefined
  }
}

/**
 * 分词：小写、切词、去 stop-word、按标识符边界加 `\b` 语义（沿用上游做法）。
 *
 * @param {string} text 输入。
 * @returns {string[]} token 列表。
 */
export function tokenize(text) {
  const raw = String(text ?? '').toLowerCase().match(/[a-z_][a-z0-9_.]*|\d+/gu) ?? []
  /** @type {string[]} */
  const out = []
  for (const token of raw) {
    const cleaned = token.replace(/^\.+|\.+$/gu, '')
    if (cleaned === '' || cleaned.length < 2) continue
    if (STOP_WORDS.has(cleaned)) continue
    out.push(cleaned)
  }
  return [...new Set(out)]
}

/**
 * 给一个段落打分（BM25 风格，用落盘的 DF/IDF）。
 *
 * @param {Segment} item 段落。
 * @param {FileRecord} file 所属文件。
 * @param {string[]} terms 查询 token。
 * @param {Map<string, number>} df 语料级文档频率。
 * @param {number} fileCount 语料文件数。
 * @returns {number} 分数；0 表示不命中。
 */
function scoreSegment(item, file, terms, df, fileCount) {
  const haystack = `${item.text} ${file.path} ${item.section}`.toLowerCase()
  let score = 0
  for (const term of terms) {
    if (!haystack.includes(term)) return 0
    const documentFrequency = df.get(term) ?? 1
    score += Math.log(1 + fileCount / Math.max(1, documentFrequency))
    if (item.name !== undefined && item.name.toLowerCase() === term) score += 5
    if (item.name !== undefined && item.name.toLowerCase().includes(term)) score += 2
  }
  return Math.max(1, Math.round(score * 10))
}

/**
 * 取有界摘录：命中词附近开窗，超出上限即截断。
 *
 * @param {string} text 段落正文。
 * @param {string[]} terms 查询 token。
 * @param {number} maxChars 字符上限。
 * @returns {string} 摘录。
 */
function excerpt(text, terms, maxChars) {
  const body = text.trim()
  if (body.length <= maxChars) return body
  const lower = body.toLowerCase()
  const firstHit = terms.reduce((best, term) => {
    const at = lower.indexOf(term)
    if (at === -1) return best
    return best === -1 ? at : Math.min(best, at)
  }, -1)
  const center = firstHit === -1 ? 0 : firstHit
  const half = Math.floor(maxChars / 2)
  const start = Math.max(0, center - half)
  const end = Math.min(body.length, start + maxChars)
  const head = start > 0 ? '…' : ''
  const tail = end < body.length ? '…' : ''
  return `${head}${body.slice(start, end)}${tail}`
}

/**
 * RST directive 的处置分类（**单一真相**）。
 *
 * `buildKnowledge.js` 的解析器与 `diagnostics/auditCorpus.js` 的审计都读这一份，
 * 不再各处维护名字副本——副本一定会漂移（**实测**：审计里的硬编码名单漏了
 * `reference` / `peertube`，于是把"已处理"误报成"未分类"）。
 *
 * - `handled`：解析器有明确处置（收正文 / 建归属 / 展开 / 有意跳过）。
 * - `unparsed`：**不丢弃**，原文保留并登记进 `meta.json` 的 `unparsedDirectives`（I24）。
 */
export const DIRECTIVE_HANDLING = {
  handled: [
    // 数据块（收正文 + 建归属 + 进 identifier 映射）
    'function', 'class', 'method', 'attribute', 'data', 'exception', 'decorator',
    'classmethod', 'staticmethod', 'property', 'module', 'currentmodule',
    // 提示块（收正文）
    'describe', 'seealso', 'note', 'warning', 'important', 'tip', 'hint',
    'versionadded', 'versionchanged', 'deprecated', 'admonition', 'rubric',
    // 代码块
    'code-block', 'code', 'sourcecode', 'parsed-literal', 'literalinclude',
    // 媒体与容器
    'image', 'figure', 'details',
    // 展开或有意跳过
    'include', 'toctree', 'hlist', 'contents', 'index', 'highlight', 'todolist',
    'reference', 'peertube', 'glossary', 'only',
  ],
  unparsed: ['list-table', 'todo', 'math', 'container'],
}
