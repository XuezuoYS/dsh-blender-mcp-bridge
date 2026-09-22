// SPDX-License-Identifier: GPL-3.0-or-later
// 全语料解析审计（由 diagnostics/auditCorpus.js 迁入）：**不只是人工看过的三个文件**。
//
// 检查四件事，每一件都不依赖"看起来对"：
//   A. 覆盖率      —— 每个 source/*.rst 是否都有对应归一化产物；索引是否与之相符
//   B. 结构损失    —— 归一化行数是否相对原文异常收缩（按压缩比排序看长尾）
//   C. 内容损失    —— 用检索侧的同一套分词做**词袋召回率**，找出被吞掉正文的文件
//   D. directive 账 —— 已处理清单里哪些在语料中**从未出现**（死代码），未识别的是否全被登记
//
// 副作用边界：**纯只读**，只读 `knowledge/`，不写任何文件、不连网、不需要 Blender。

import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { DIRECTIVE_HANDLING, tokenize } from '../lib/knowledge.js'

/** 仓库根（本文件在 `test/` 下）。 */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const KNOWLEDGE = join(ROOT, 'knowledge')
const SOURCE = join(KNOWLEDGE, 'source')
const NORMALIZED = join(KNOWLEDGE, 'normalized')

/** @type {{name: string, ok: boolean, detail: string}[]} */
const results = []

/**
 * 记录一条检查（与旧探针同样的输出形态，便于人工对照）。
 *
 * @param {string} name 检查名。
 * @param {boolean} ok 是否通过。
 * @param {string} detail 细节。
 */
function check(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}`)
}

/**
 * 递归列出文件。
 *
 * 用 `path.relative` 而不是字符串前缀替换：后者在 Windows 的混合分隔符下会静默失效
 * （本次审计脚本自己踩过一次——返回了 0 个文件）。
 *
 * @param {string} dir 目录。
 * @param {(name: string) => boolean} keep 过滤。
 * @returns {Promise<string[]>} 相对路径（正斜杠）。
 */
async function walk(dir, keep) {
  /** @type {string[]} */
  const out = []
  /**
   * @param {string} current 当前目录。
   * @returns {Promise<void>} 完成时 resolve。
   */
  const inner = async (current) => {
    let entries
    try {
      entries = await readdir(current, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const absolute = join(current, entry.name)
      if (entry.isDirectory()) {
        await inner(absolute)
        continue
      }
      if (!keep(entry.name)) continue
      out.push(relative(dir, absolute).split(sep).join('/'))
    }
  }
  await inner(dir)
  return out.sort()
}

/**
 * 词袋多重集。
 *
 * @param {string} text 文本。
 * @returns {Map<string, number>} token -> 次数。
 */
function bag(text) {
  const out = new Map()
  for (const token of tokenize(text)) out.set(token, (out.get(token) ?? 0) + 1)
  return out
}

/** 主流程：算完所有检查，再注册为 `node:test` 用例。 */
async function main() {
  const sources = await walk(SOURCE, name => name.endsWith('.rst'))
  const normalized = new Set(await walk(NORMALIZED, name => name.endsWith('.rst')))

  console.log(`# 全语料抽查：source ${sources.length} 个 .rst，normalized ${normalized.size} 个（保留 .rst 后缀）\n`)

  // ---- A. 覆盖率 ----
  const navPages = sources.filter(name => /(^|\/)index\.rst$/u.test(name))
  const documented = sources.filter(name => !/(^|\/)index\.rst$/u.test(name))
  // 归一化产物**沿用上游相对路径**（含 `.rst` 后缀）而不是改写成 `.md`：
  // 这样每个产物与原文一一对应、可直接回查（../docs/contract.md#knowledge-corpus）。
  const missingNormalized = documented.filter(name => !normalized.has(name))
  check('A1 每个非导航页 .rst 都有归一化产物',
    missingNormalized.length === 0,
    `文档页 ${documented.length} 个，缺 ${missingNormalized.length} 个`
    + (missingNormalized.length === 0 ? '' : `：${missingNormalized.slice(0, 5).join(', ')}`))

  const orphanNormalized = [...normalized].filter(name => !sources.includes(name))
  check('A2 没有无源头的归一化产物（孤儿文件）',
    orphanNormalized.length === 0,
    orphanNormalized.length === 0 ? '归一化目录与语料一一对应' : `${orphanNormalized.length} 个孤儿：${orphanNormalized.slice(0, 5).join(', ')}`)

  // 索引行 = 文档页数
  const indexLines = (await readFile(join(KNOWLEDGE, 'index', 'files.jsonl'), 'utf8')).split('\n').filter(line => line !== '')
  check('A3 索引行数与归一化文档页数一致',
    indexLines.length === documented.length,
    `索引 ${indexLines.length} 行；归一化文档页 ${documented.length} 个；导航页排除 ${navPages.length} 个`)

  // 全局词表：索引里的 token 是整数 id，审计要先把它们映回字符串
  const vocabularyFile = JSON.parse(await readFile(join(KNOWLEDGE, 'index', 'tokens.json'), 'utf8'))
  const vocabulary = /** @type {string[]} */ (vocabularyFile.vocabulary)
  check('A7 词表与索引同源（每个 id 都能映回一个词，无越界）',
    Array.isArray(vocabulary) && vocabulary.length > 0 && new Set(vocabulary).size === vocabulary.length,
    `词表 ${vocabulary.length} 个词，无重复；索引存的是 id（省体积）`)

  // ---- 结构检查：逐行 shape ----
  /** @type {{path: string, segments: number, tokenCount: number, tokens: string[], items: any[]}[]} */
  const records = []
  /** @type {string[]} */
  const malformed = []
  /** @type {Map<string, number>} */
  const df = new Map(Object.entries(JSON.parse(await readFile(join(KNOWLEDGE, 'index', 'df.json'), 'utf8')).df))
  /** @type {Set<string>} */
  const seenTokens = new Set()
  for (const line of indexLines) {
    let record
    try {
      record = JSON.parse(line)
    } catch {
      malformed.push(`JSON 解析失败：${line.slice(0, 60)}`)
      continue
    }
    if (typeof record.path !== 'string' || !Array.isArray(record.items) || !Array.isArray(record.tokens)) {
      malformed.push(`字段不完整：${String(record.path).slice(0, 60)}`)
      continue
    }
    for (const item of record.items) {
      if (typeof item.text !== 'string' || typeof item.index !== 'number' || typeof item.section !== 'string') {
        malformed.push(`${record.path} 的段落 ${item.index} 形状不对`)
      }
    }
    /** 索引里的 token 是整数 id（见 buildKnowledge.js 的全局词表）。 */
    const tokenIds = /** @type {number[]} */ (record.tokens)
    const outOfRange = tokenIds.filter(id => !Number.isInteger(id) || id < 0 || id >= vocabulary.length)
    if (outOfRange.length > 0) malformed.push(`${record.path} 有 ${outOfRange.length} 个 token id 越界`)
    for (const id of tokenIds) seenTokens.add(vocabulary[id])
    records.push({
      path: record.path,
      segments: record.items.length,
      tokenCount: tokenIds.length,
      tokens: tokenIds.map(id => vocabulary[id]),
      items: record.items,
    })
  }
  check('A4 索引每一行的形状完整（path/items/tokens，段落含 text/index/section）',
    malformed.length === 0,
    malformed.length === 0
      ? `${records.length} 行全部通过；段落合计 ${records.reduce((sum, r) => sum + r.segments, 0)} 段`
      : `${malformed.length} 处问题：${malformed.slice(0, 5).join('；')}`)

  // 与 build 同源的 match surface：正文 + 段落限定名 + 面包屑 + 文件路径。
  // 少了限定名，`bpy.ops.object.add` 不会被切成 object/add，按词检索会整片漏掉（实测踩过）。
  const documentedTokens = new Set()
  for (const name of documented) {
    const text = await readFile(join(SOURCE, ...name.split('/')), 'utf8')
    const normalizedText = await readFile(join(NORMALIZED, ...name.split('/')), 'utf8').catch(() => '')
    for (const token of tokenize(`${text} ${normalizedText} ${name}`)) documentedTokens.add(token)
  }
  // 导航页独有的词：它们被**有意排除**在索引外，不能算作"索引漏词"
  /** @type {Set<string>} */
  const navOnlyTokens = new Set()
  for (const name of navPages) {
    const text = await readFile(join(SOURCE, ...name.split('/')), 'utf8')
    for (const token of tokenize(text)) navOnlyTokens.add(token)
  }

  // 原 `.. _label:` 与 directive 选项行按设计不进正文，拿它们当分母是错的
  // （实测：那会虚报 199 个"缺词"，而 C2 的逐文件检查显示真实缺口为 0）。
  /** @type {Set<string>} */
  const normalizedTokens = new Set()
  for (const name of documented) {
    const text = await readFile(join(NORMALIZED, ...name.split('/')), 'utf8').catch(() => '')
    for (const token of tokenize(text)) normalizedTokens.add(token)
  }
  const uncovered = [...normalizedTokens].filter(token => !seenTokens.has(token))
  const uncoveredNavOnly = uncovered.filter(token => navOnlyTokens.has(token))
  // 缺口来自哪些文件：用**归一化产物**（模型能读到的正文）对比索引 token，
  // 这样"原文里有但没进正文"的部分（directive 选项、标签行）不会被误报成索引漏词。
  const uncoveredNonNav = uncovered.filter(token => !navOnlyTokens.has(token))
  /** @type {Map<string, string[]>} */
  const gapByFile = new Map()
  if (uncoveredNonNav.length > 0) {
    const gapSet = new Set(uncoveredNonNav)
    for (const name of documented) {
      const text = await readFile(join(NORMALIZED, ...name.split('/')), 'utf8').catch(() => '')
      const missing = [...new Set(tokenize(text))].filter(token => gapSet.has(token))
      if (missing.length > 0) gapByFile.set(name, missing)
    }
  }
  const worstGap = [...gapByFile.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 5)
  check('A5 索引 token 覆盖全部归一化产物里出现的词（按词检索不会漏）',
    uncovered.length === 0,
    `归一化产物里的词 ${normalizedTokens.size} 个，索引覆盖 ${seenTokens.size} 个，缺 ${uncovered.length} 个`
    + `（其中只出现在被排除的导航页里的 ${uncoveredNavOnly.length} 个）`
    + (uncovered.length === 0 ? '' : `；示例：${uncovered.slice(0, 10).join(', ')}`)
    + (worstGap.length === 0 ? '' : `；缺口文件：${worstGap.map(([p, t]) => `${p}(${t.length})`).join(' | ')}`))

  // df 的键必须与文件级 token 并集一致（否则 IDF 会算错）
  const extraDf = [...df.keys()].filter(token => !seenTokens.has(token))
  check('A6 df.json 没有多余词条（IDF 的分母与索引同源）',
    extraDf.length === 0,
    `df 词条 ${df.size} 个；不在任何文件 token 里的 ${extraDf.length} 个`
    + (extraDf.length === 0 ? '' : `：${extraDf.slice(0, 8).join(', ')}`))

  // ---- B/C. 逐文件结构与内容损失（只看最差的长尾） ----
  /** @type {{path: string, srcLines: number, mdLines: number, ratio: number, recall: number, lost: string[]}[]} */
  const rows = []
  for (const name of documented) {
    // 回召率按**类型（distinct token）**算，不按多重集：
    // 多重集会被"限定名在段落里重复几百次"的 API 页严重惩罚（实测均值被压到 60%），
    // 而那问的是"重复次数是否保留"，不是"内容有没有丢"。
    //
    // 分子/分母都取**段落正文**里的词：正文才是模型真正读到的内容；
    // 限定名与面包屑属于 match surface（可检索性），不应当作"正文保真度"来算。
    const record = records.find(item => item.path === name)
    const srcContentTokens = new Set()
    for (const item of record?.items ?? []) {
      for (const token of tokenize(item.text)) srcContentTokens.add(token)
    }
    const md = await readFile(join(NORMALIZED, ...name.split('/')), 'utf8').catch(() => '')
    const mdBag = bag(md)
    const kept = [...srcContentTokens].filter(token => mdBag.has(token)).length
    const lost = [...srcContentTokens].filter(token => !mdBag.has(token))
    const srcLines = (await readFile(join(SOURCE, ...name.split('/')), 'utf8')).split('\n').length
    const mdLines = md.split('\n').length
    rows.push({
      path: name,
      srcLines,
      mdLines,
      ratio: srcLines === 0 ? 1 : mdLines / srcLines,
      recall: srcContentTokens.size === 0 ? 1 : kept / srcContentTokens.size,
      lost: lost.slice(0, 8),
    })
  }

  const emptyOutputs = rows.filter(row => row.mdLines <= 2)
  check('B1 没有归一化后变成空文件的语料',
    emptyOutputs.length === 0,
    emptyOutputs.length === 0
      ? `全部 ${rows.length} 个文件都有正文`
      : `${emptyOutputs.length} 个空产物：${emptyOutputs.slice(0, 5).map(r => r.path).join(', ')}`)

  const shortest = [...rows].sort((a, b) => a.ratio - b.ratio).slice(0, 5)
  const medianRatio = [...rows].map(r => r.ratio).sort((a, b) => a - b)[Math.floor(rows.length / 2)]
  check('B2 归一化行数压缩比在中位数附近，长尾可见',
    medianRatio > 0.5,
    `中位压缩比 ${medianRatio.toFixed(3)}；最低 5 个：`
    + shortest.map(r => `${r.path}(${r.srcLines}→${r.mdLines}, ${(r.ratio * 100).toFixed(0)}%)`).join(' | '))

  const worstRecall = [...rows].sort((a, b) => a.recall - b.recall).slice(0, 8)
  const corpusRecall = rows.reduce((sum, r) => sum + r.recall, 0) / rows.length
  const belowThreshold = rows.filter(row => row.recall < 0.9)
  check('C1 段落正文的词在归一化产物里的类型级召回率',
    corpusRecall > 0.97 && belowThreshold.length < rows.length * 0.02,
    `均值 ${(corpusRecall * 100).toFixed(2)}%；低于 90% 的文件 ${belowThreshold.length}/${rows.length}`
    + `（${((belowThreshold.length / rows.length) * 100).toFixed(2)}%）`)

  console.log('\n# 召回率最低的 8 个文件（逐个人工核查的对象）：')
  for (const row of worstRecall) {
    console.log(`#   ${(row.recall * 100).toFixed(1)}%  ${row.path}  ← 丢失 ${row.lost.join(' ')}`)
  }

  // 索引可检索性：**归一化产物**里的词有多少没进索引。
  // 用同一个 `normalizedTokens` 集合，与 A5 同源——C2 的增量价值是按文件定位缺口。
  const missingFromIndex = [...normalizedTokens].filter(token => !seenTokens.has(token))
  const navOnlyMissing = missingFromIndex.filter(token => navOnlyTokens.has(token))
  const indexMissing = missingFromIndex.filter(token => !navOnlyTokens.has(token))
  /** @type {Map<string, string[]>} */
  const missingByFile = new Map()
  const indexMissingSet = new Set(indexMissing)
  for (const name of documented) {
    const text = await readFile(join(NORMALIZED, ...name.split('/')), 'utf8').catch(() => '')
    const missing = [...new Set(tokenize(text))].filter(token => indexMissingSet.has(token))
    if (missing.length > 0) missingByFile.set(name, missing)
  }
  const worstIndex = [...missingByFile.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 5)
  check('C2 索引覆盖每个文件的段落词（按词检索不会整片漏）',
    indexMissing.length === 0,
    indexMissing.length === 0
      ? `被索引文件的词全部在索引里（导航页独有的 ${navOnlyMissing.length} 个不计）`
      : `缺 ${indexMissing.length} 个：${indexMissing.slice(0, 10).join(', ')}`
        + `；涉及 ${missingByFile.size} 个文件，最差：`
        + worstIndex.map(([path, tokens]) => `${path}(${tokens.length} 个，如 ${tokens.slice(0, 3).join('/')})`).join(' | '))

  // ---- D. directive 账 ----
  /** @type {Map<string, number>} */
  const occurrences = new Map()
  for (const name of sources) {
    const text = await readFile(join(SOURCE, ...name.split('/')), 'utf8')
    for (const match of text.matchAll(/^\s*\.\.\s+([A-Za-z][A-Za-z0-9_-]*)::/gmu)) {
      // directive 名大小写不敏感（语料里真有 `.. Hint::`），归一后再统计
      const kind = match[1].toLowerCase()
      occurrences.set(kind, (occurrences.get(kind) ?? 0) + 1)
    }
  }
  const meta = JSON.parse(await readFile(join(KNOWLEDGE, 'meta.json'), 'utf8'))
  const unparsedEntries = /** @type {{directive: unknown, occurrences: number}[]} */ (meta.unparsedDirectives ?? [])
  const unparsed = new Map(unparsedEntries.map(item => [String(item.directive).toLowerCase(), item.occurrences]))
  const registeredNames = new Set(unparsed.keys())
  // "被登记"是**未识别**那类的处置；其余 directive 由解析器处理，本来就不该出现在登记表里。
  // 名单来自 `buildKnowledge.js` 的导出，避免各处维护副本（副本一定会漂移——实测过）。
  const handledNames = new Set(DIRECTIVE_HANDLING.handled)
  const unclassified = [...occurrences.keys()].filter(name => !handledNames.has(name) && !registeredNames.has(name))

  console.log('\n# 语料里出现的全部 directive（按次数）：')
  for (const [name, count] of [...occurrences.entries()].sort((a, b) => b[1] - a[1])) {
    const state = registeredNames.has(name) ? '未识别（已登记）' : handledNames.has(name) ? '已处理' : '**未分类**'
    console.log(`#   ${String(count).padStart(5)}  ${name.padEnd(18)} ${state}`)
  }
  check('D1 每个 directive 都被归类：解析器处理，或登记为未识别（不存在静默丢弃）',
    unclassified.length === 0,
    unclassified.length === 0
      ? `共 ${occurrences.size} 类：已处理 ${occurrences.size - registeredNames.size} 类、已登记 ${registeredNames.size} 类`
      : `未分类：${unclassified.join(', ')}`)

  const unparsedCounts = [...occurrences.entries()].filter(([name]) => registeredNames.has(name))
  const unparsedTotal = unparsedCounts.reduce((sum, [, count]) => sum + count, 0)
  const totalDirectives = [...occurrences.values()].reduce((sum, count) => sum + count, 0)
  check('D2 未识别 directive 占比处于低位（登记不等于放任）',
    unparsedTotal / totalDirectives < 0.05,
    `未识别 ${unparsedTotal}/${totalDirectives} = ${((unparsedTotal / totalDirectives) * 100).toFixed(2)}%`
    + `；明细：${unparsedCounts.map(([name, count]) => `${name}×${count}`).join(', ')}`)

  // 登记表的**名字**必须都真实存在（防止凭空捏造），次数供参考：
  // 解析器会在 include 展开的内容里再次统计、也会跳过导航页，
  // 因此次数与"全语料逐行实测"本来就不逐字相等——要求相等是错的口径。
  const fabricated = [...registeredNames].filter(name => !occurrences.has(name))
  check('D3 登记表里的 directive 名都真实存在于语料（I24 的清单可信）',
    fabricated.length === 0,
    fabricated.length === 0
      ? `登记 ${registeredNames.size} 类，全部在语料中出现；次数差异（登记 vs 全语料逐行实测）：`
        + unparsedCounts.map(([name, count]) => `${name} ${unparsed.get(name) ?? 0}/${count}`).join(', ')
      : `凭空出现的名字：${fabricated.join(', ')}`)

  // ---- 体积一致性 ----
  const normalizedBytes = (await Promise.all(rows.map(async row => (await stat(join(NORMALIZED, ...row.path.split('/')))).size))).reduce((a, b) => a + b, 0)
  check('E1 归一化字节数与 meta.json 记录一致（产物没被外部改动）',
    normalizedBytes === meta.normalizedBytes,
    `实测 ${normalizedBytes} vs meta ${meta.normalizedBytes}`)

  console.log(`\n# 语料 ${sources.length} 个 source / ${normalized.size} 个归一化产物`)
}

await main()

for (const item of results) {
  test(item.name, () => {
    assert.ok(item.ok, item.detail)
  })
}

const failed = results.filter(item => !item.ok)
console.log(`\n# ${results.length - failed.length}/${results.length} 通过`)
for (const item of failed) console.log(`#   - ${item.name}`)
