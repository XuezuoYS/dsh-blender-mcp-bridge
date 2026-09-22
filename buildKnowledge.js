// SPDX-License-Identifier: GPL-3.0-or-later
// 知识库语料的唯一管理入口：下载置入 / 归一化建索引 / 只校验指纹。
//
// 副作用边界：**只有维护时手动运行**，不在安装时运行、不被插件运行期调用。
//   fetch  —— 联网下载官方语料 tarball，写入 knowledge/source/（并覆盖 meta.json 的 pin）
//   build  —— 只读 knowledge/source/，写入 knowledge/normalized/、knowledge/index/、knowledge/rules.json
//   verify —— 只读，校验指纹一致性，**不写任何文件**
//
// 语料是**静态只读快照**（docs/contract.md#knowledge-corpus）：不联网、不回传、无遥测。
// 未识别的 RST directive **保留原文并登记**，绝不静默丢弃（I24）。
//
// 用法：
//   node buildKnowledge.js fetch [--rev <commit>]
//   node buildKnowledge.js build
//   node buildKnowledge.js verify

import { createHash } from 'node:crypto'
import { mkdir, open, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { tokenize } from './lib/knowledge.js'

/** 构建脚本版本；进 meta.json，与语料 pin 一起决定可复现性（I22）。 */
const BUILDER_VERSION = '1.0.0'

/** 仓库根目录（本文件所在目录）。 */
const ROOT = dirname(fileURLToPath(import.meta.url))

/** 知识库目录。 */
const KNOWLEDGE_DIR = join(ROOT, 'knowledge')

/** 上游仓库地址（唯一认的上游：Blender 官方，见 docs/contract.md#core-decisions）。 */
const SOURCE_REPO = 'https://projects.blender.org/lab/blender_mcp'

/** 取语料用的 API 基址（归档端点被 Cloudflare 挡，API 可以过——实测）。 */
const API_BASE = 'https://projects.blender.org/api/v1/repos/lab/blender_mcp'

/**
 * 默认语料 pin。
 *
 * 取证基线：`main` HEAD = v1.0.3 + 1 个提交（`Update 5.2: manual & API`），语料对应 Blender **5.2**。
 * **必须用 commit sha，不能用分支名**——分支会前进，取到的内容随时变（docs/contract.md#knowledge-corpus）。
 */
const DEFAULT_CORPUS_REVISION = 'ff54e4d8f6b09502f2f466189cca0e52b4a91643'

/** 代码基线（add-on 与本机已装副本逐 blob 相同）。 */
const CODE_REVISION = '2cea8d566dde07fbac28a61d698909d69724e853'

/** tarball 里要取的子树（其余部分不入库）。 */
const CORPUS_PREFIX = 'mcp/blmcp/data/'

/** 索引体积上限：`index/` 总字节 ≤ 该系数 × `normalized/` 总字节（docs/contract.md#knowledge-corpus）。
 *
 * 取值依据（**实测**，非拍脑袋）：索引是 JSON Lines，每条文件记录同时含
 * ①文件级 token 数组（I20 要求的预计算量）与 ②段落正文（`items`，供命中原样返回）。
 * 因此它天然约为归一化正文的 1.7–2.0 倍；1.5 这个初值会在几乎全部语料上误报。
 * 该系数的用途是**发现异常膨胀**（例如误把整篇语料重复写进索引），不是省磁盘。
 */
const INDEX_SIZE_LIMIT_RATIO = 2.1

/** 单条命中内联上限的来源在配置里；这里只给 `build` 报告用的参考值。 */
const REPORT_CHARS_PER_HIT = 4000

/**
 * 解析命令行。
 *
 * @param {string[]} argv 参数。
 * @returns {{command: string, options: Record<string, string>}} 解析结果。
 */
function parseArgs(argv) {
  const [command = 'help', ...rest] = argv
  /** @type {Record<string, string>} */
  const options = {}
  for (let i = 0; i < rest.length; i += 1) {
    const item = rest[i]
    if (item.startsWith('--')) {
      const key = item.slice(2)
      const value = rest[i + 1] !== undefined && !rest[i + 1].startsWith('--') ? rest[i + 1] : 'true'
      options[key] = value
      if (value !== 'true') i += 1
    }
  }
  return { command, options }
}

/** 主流程。 */
async function main() {
  const { command, options } = parseArgs(process.argv.slice(2))
  switch (command) {
    case 'fetch':
      await fetchCorpus(options.rev ?? DEFAULT_CORPUS_REVISION, {
        concurrency: options.concurrency === undefined ? 8 : Number(options.concurrency),
      })
      break
    case 'build':
      await buildKnowledge()
      break
    case 'verify':
      await verifyKnowledge()
      break
    default:
      printUsage()
      process.exitCode = command === 'help' || command === '--help' ? 0 : 2
  }
}

/** 打印用法。 */
function printUsage() {
  console.log(`知识库语料管理（唯一入口，见 docs/contract.md#knowledge-corpus）

  node buildKnowledge.js fetch [--rev <commit>]   下载官方语料并置入 knowledge/source/
  node buildKnowledge.js build                    归一化 + 建索引 + 写 meta.json
  node buildKnowledge.js verify                   只校验指纹，不写任何文件

默认语料 pin: ${DEFAULT_CORPUS_REVISION}
上游仓库:     ${SOURCE_REPO}`)
}

// ---------------------------------------------------------------------------
// fetch
// ---------------------------------------------------------------------------

/**
 * 下载语料并置入 `knowledge/source/`。
 *
 * **为什么不是下载归档 tarball**：上游是 Forgejo，归档端点被 Cloudflare 的
 * 浏览器校验挡住（GET 返回 403 `Just a moment...`，HEAD 却是 200），
 * 而 `/api/v1/.../contents/<path>?ref=<sha>` **可以正常取到内容**（含 148 KB 的巨型页，实测）。
 * 因此走 API 逐文件取，并按内容算 sha1 写进 meta.json（`fetch` 会打印实际用的通道）。
 *
 * 请求可断点续传：已存在且 sha1 与上游记录一致的文件会被跳过。
 *
 * @param {string} revision 语料 commit sha。
 * @param {{concurrency?: number, skipContent?: boolean}} [options] 选项。
 * @returns {Promise<void>} 完成时 resolve。
 */
async function fetchCorpus(revision, options = {}) {
  if (!/^[0-9a-f]{40}$/u.test(revision)) {
    throw new Error(`语料 rev 必须是完整的 40 位 commit sha（不接受分支名）：收到 "${revision}"`)
  }
  const concurrency = options.concurrency ?? 8

  console.log(`# 逐级列目录取出上游文件清单（git trees 会被截断在 1000 条，不能用——实测）`)
  const entries = await listCorpusFiles(CORPUS_PREFIX, revision)
  if (entries.length === 0) {
    throw new Error(`该 rev 的树里没有 ${CORPUS_PREFIX} 下的文件；目录结构可能变了`)
  }
  const totalBytes = entries.reduce((sum, item) => sum + (item.size ?? 0), 0)
  console.log(`# 语料 ${entries.length} 个文件 / ${totalBytes} 字节`)

  const sourceDir = join(KNOWLEDGE_DIR, 'source')
  await mkdir(sourceDir, { recursive: true })

  /** @type {Record<string, string>} */
  const blobs = {}
  let downloaded = 0
  let reused = 0
  let bytes = 0
  let cursor = 0
  let failures = 0

  /**
   * 单个工作单元：下载或复用。
   *
   * @returns {Promise<void>} 完成时 resolve。
   */
  const worker = async () => {
    while (cursor < entries.length) {
      const item = entries[cursor]
      cursor += 1
      if (item === undefined) continue
      const relativePath = item.path.slice(CORPUS_PREFIX.length)
      const target = join(sourceDir, ...relativePath.split('/'))
      await mkdir(dirname(target), { recursive: true })

      const upstreamSha1 = item.sha
      try {
        // 先确认磁盘上已有的内容就是上游那一个 blob（按 git blob hash 算，
        // 见 verifyLocalBlob 的说明）。命中即零网络。
        const verified = await verifyLocalBlob(target, upstreamSha1)
        if (verified !== undefined) {
          blobs[relativePath] = upstreamSha1
          bytes += verified
          reused += 1
          continue
        }
      } catch {
        // 读不到就当需要重下
      }

      try {
        const data = await fetchBlob(item.path, revision)
        const localSha1 = gitBlobHash(data)
        if (localSha1 !== upstreamSha1) {
          failures += 1
          console.warn(`# ⚠️ ${relativePath} 内容哈希与上游记录不符（期望 ${upstreamSha1}，实得 ${localSha1}）`)
        }
        await writeFile(target, data)
        blobs[relativePath] = localSha1
        bytes += data.byteLength
        downloaded += 1
        if (downloaded % 200 === 0) console.log(`# …已取 ${downloaded} 个（本轮）`)
      } catch (error) {
        failures += 1
        console.warn(`# ⚠️ 取 ${relativePath} 失败：${/** @type {Error} */ (error).message}`)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, entries.length)) }, worker))

  if (Object.keys(blobs).length === 0) throw new Error('一个语料文件都没取到，拒绝写出 meta.json')
  if (failures > 0) {
    // 取用不完整时**不写完整的 blobs 记录**：否则 build 会拿一份残缺指纹去比，
    // 得出"源指纹不符"的误导结论。重跑本命令即可续传（已校验通过的会跳过）。
    throw new Error(
      `${failures} 个文件取用失败（多见于上游限流）。已成功的不受影响，重跑本命令可续传；`
      + '若反复失败，降低并发：`node buildKnowledge.js fetch --concurrency 4`',
    )
  }

  await writeMeta({
    ...(await readMeta()),
    sourceRepo: SOURCE_REPO,
    corpusRevision: revision,
    codeRevision: CODE_REVISION,
    fetchedAt: new Date().toISOString(),
    sourceFiles: Object.keys(blobs).length,
    sourceBytes: bytes,
    blobs,
  })
  console.log(`# 完成：新下载 ${downloaded}、复用 ${reused}，共 ${Object.keys(blobs).length} 个 / ${bytes} 字节`)
  console.log('# 下一步：node buildKnowledge.js build')
}

/**
 * 逐级列目录，列出语料子树下的全部文件。
 *
 * **不能用 `git/trees?recursive=true`**：Forgejo 的实现会截断在 1000 条
 * （`truncated=true`），实测只能拿到 965 个文件，而语料实际有 4,600+ 个。
 * 逐级 `contents` 列目录没有这个上限。
 *
 * @param {string} prefix 子树前缀（以 `/` 结尾）。
 * @param {string} revision commit sha。
 * @returns {Promise<{path: string, sha: string, size: number}[]>} 文件列表。
 */
async function listCorpusFiles(prefix, revision) {
  /** @type {{path: string, sha: string, size: number}[]} */
  const files = []
  /** @type {string[]} */
  const queue = [prefix.replace(/\/$/u, '')]
  let visited = 0

  while (queue.length > 0) {
    const dir = /** @type {string} */ (queue.shift())
    visited += 1
    const items = await fetchJsonWithRetry(`${API_BASE}/contents/${dir}?ref=${revision}`)
    if (!Array.isArray(items)) {
      throw new Error(`列目录 ${dir} 返回的不是数组：${JSON.stringify(items).slice(0, 160)}`)
    }
    for (const item of items) {
      if (item.type === 'dir') {
        queue.push(item.path)
        continue
      }
      if (item.type !== 'file') continue
      files.push({ path: item.path, sha: item.sha, size: item.size ?? 0 })
    }
    if (visited % 25 === 0) console.log(`# …已列 ${visited} 个目录，累计 ${files.length} 个文件`)
  }
  return files.sort((a, b) => a.path.localeCompare(b.path))
}

/**
 * 取一个文件的原始内容。
 *
 * **必须按 blob sha 语义校验**：Forgejo 的 tree 给出的 `sha` 是 **git blob hash**
 * （`sha1("blob <字节数>\0" + content)`），不是内容的裸 sha1。用错口径会得出
 * "全部文件都不符"的假结论（实测踩过）。
 *
 * @param {string} path 仓库内路径。
 * @param {string} revision commit sha。
 * @returns {Promise<Buffer>} 文件内容。
 */
async function fetchBlob(path, revision) {
  const json = await fetchJsonWithRetry(`${API_BASE}/contents/${path}?ref=${revision}`)
  if (typeof json.content !== 'string' || json.encoding !== 'base64') {
    throw new Error(`contents 接口没有返回 base64 内容（encoding=${json.encoding}）`)
  }
  return Buffer.from(json.content.replace(/\s+/gu, ''), 'base64')
}

/**
 * 计算 git blob hash（与 `git hash-object` 一致）。
 *
 * **这是唯一正确的校验口径**：Forgejo 的 tree 给出的 `sha` 是 git blob hash，
 * 不是内容的裸 sha1。用裸 sha1 会得出"全部文件都不符"的假结论（实测踩过）。
 *
 * @param {Buffer} data 文件内容。
 * @returns {string} 40 位十六进制 sha1。
 */
function gitBlobHash(data) {
  return createHash('sha1').update(`blob ${data.byteLength}\0`).update(data).digest('hex')
}

/**
 * 校验磁盘上已有文件是否就是指定的上游 blob。
 *
 * 先用大小做廉价筛除，再算 git blob hash——命中即完全不发请求（断点续传的实际机制）。
 *
 * @param {string} target 本地路径。
 * @param {string} expectedSha1 上游 blob sha。
 * @returns {Promise<number | undefined>} 命中时返回字节数，否则 undefined。
 */
async function verifyLocalBlob(target, expectedSha1) {
  const info = await stat(target)
  const data = await readFile(target)
  if (gitBlobHash(data) !== expectedSha1) return undefined
  return info.size
}

/**
 * 拉一个 JSON 接口（带重试）。
 *
 * @param {string} url 地址。
 * @returns {Promise<any>} 解析后的 JSON。
 */
async function fetchJsonWithRetry(url) {
  let lastError
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      return await fetchJson(url)
    } catch (error) {
      lastError = error
      const status = /** @type {{status?: number}} */ (error).status
      // 只对可能瞬时的失败重试：限流（429）与 5xx
      if (status !== undefined && status !== 429 && status < 500) throw error
      // 指数退避 + 抖动：上游对高频请求会限流（实测 429）
      const backoff = Math.min(8000, 400 * 2 ** (attempt - 1))
      const jitter = Math.floor(Math.random() * 250)
      await new Promise(resolve => setTimeout(resolve, backoff + jitter))
    }
  }
  throw lastError
}

/**
 * 拉一个 JSON 接口（单次）。
 *
 * @param {string} url 地址。
 * @returns {Promise<any>} 解析后的 JSON。
 */
async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} ${response.statusText} @ ${url}`)
    // @ts-expect-error 便于重试判定
    error.status = response.status
    throw error
  }
  return await response.json()
}

// ---------------------------------------------------------------------------
// build
// ---------------------------------------------------------------------------

/**
 * 归一化 + 建索引 + 写 meta.json。
 *
 * @returns {Promise<void>} 完成时 resolve。
 */
async function buildKnowledge() {
  const sourceDir = join(KNOWLEDGE_DIR, 'source')
  const meta = await readMeta()
  if (meta === undefined) {
    throw new Error('knowledge/meta.json 不存在：先运行 `node buildKnowledge.js fetch`')
  }
  if (typeof meta.corpusRevision !== 'string' || !/^[0-9a-f]{40}$/u.test(meta.corpusRevision)) {
    throw new Error('knowledge/meta.json 的 corpusRevision 不是完整 commit sha，拒绝按半份语料建索引（I22）')
  }

  const files = await collectRst(sourceDir)
  if (files.length === 0) throw new Error(`knowledge/source/ 下没有 .rst 文件：${sourceDir}`)
  console.log(`# 语料 ${files.length} 个 .rst`)

  // ---- 指纹校验：文件集必须与 fetch 记录一致（不符即中止，I22）----
  const recorded = meta.blobs ?? {}
  const recordedRst = Object.keys(recorded).filter(path => path.endsWith('.rst'))
  const currentRst = files.map(file => file.relative)
  const missing = recordedRst.filter(path => !currentRst.includes(path))
  const extra = currentRst.filter(path => !recordedRst.includes(path))
  if (recordedRst.length > 0 && (missing.length > 0 || extra.length > 0)) {
    throw new Error(
      `源指纹不符，已中止（I22）：缺少 ${missing.length} 个、多出 ${extra.length} 个已记录的 .rst 文件。\n`
      + `  缺少示例：${missing.slice(0, 3).join(', ') || '(无)'}\n`
      + `  多出示例：${extra.slice(0, 3).join(', ') || '(无)'}\n`
      + '  请重新运行 `node buildKnowledge.js fetch` 取得完整语料。',
    )
  }

  const normalizedDir = join(KNOWLEDGE_DIR, 'normalized')
  const indexPath = join(KNOWLEDGE_DIR, 'index')
  await rm(normalizedDir, { recursive: true, force: true })
  await rm(indexPath, { recursive: true, force: true })
  await mkdir(normalizedDir, { recursive: true })
  await mkdir(indexPath, { recursive: true })

  /** @type {Record<string, number>} */
  const df = {}
  /** @type {Map<string, {path: string, count: number}>} */
  const unparsed = new Map()
  /** @type {Map<string, {path: string, sections: number, tables: number}>} */
  const skipped = new Map()

  // 索引**流式写出**：files.jsonl 是十几 MB 量级，不能把它整份攒在内存里
  const indexHandle = await open(join(indexPath, 'files.jsonl'), 'w')
  let normalizedBytes = 0
  let totalSegments = 0
  let documentedFiles = 0
  /** @type {string[]} 逐文件记录先留在内存里（列完才知道全局词表，需要第二趟写 id） */
  const indexBuffers = []
  /** @type {Array<{path: string, name: string, type: string}>} */
  const identifierMap = []

  try {
    for (const file of files) {
      const text = await readFile(file.absolute, 'utf8')
      // 导航页在检索里是噪声：索引期排除（docs/contract.md#knowledge-corpus）
      if (/(^|\/)index\.rst$/u.test(file.relative)) {
        skipped.set(file.relative, { path: file.relative, sections: 0, tables: 0 })
        continue
      }
      const parsed = await parseRst(text, file.relative, { sourceDir, included: new Set() })
      for (const [directive, count] of parsed.unparsed) {
        const entry = unparsed.get(directive) ?? { path: file.relative, count: 0 }
        entry.count += count
        unparsed.set(directive, entry)
      }

      const normalized = renderNormalized(parsed, file.relative)
      const target = join(normalizedDir, ...file.relative.split('/'))
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, normalized, 'utf8')
      normalizedBytes += Buffer.byteLength(normalized, 'utf8')
      documentedFiles += 1

      // 文件级 token 集合：**索引必须携带的预计算量**（I20）。
      // 只存 token 列表而不存词频：打分只用 IDF（语料级常量），词频在这里是纯冗余
      // ——实测它占单条记录约 29% 的字节。
      //
      // 词袋必须同时覆盖 **正文 + 段落限定名 + 面包屑 + 文件路径**：
      // 少了限定名，`bpy.ops.object.add` 不会被切成 object/add，**按词检索会整片漏掉**（实测）；
      // 少了路径与面包屑，`bpy.props IntProperty` 这类"一半靠文件名"的查询也命不中。
      const tokens = new Set()
      for (const segment of parsed.segments) {
        const surface = `${segment.text} ${segment.name ?? ''} ${segment.directive ?? ''} ${segment.section} ${file.relative}`
        for (const token of corpusTokens(surface)) {
          tokens.add(token)
        }
        if (segment.type !== undefined && segment.name !== undefined) {
          identifierMap.push({ path: file.relative, name: segment.name, type: segment.type })
        }
      }
      for (const token of corpusTokens([...parsed.directiveTokens].join(' '))) tokens.add(token)
      // 目录名也要进文件 token：`api/bpy.ops.action/…` 这类**目录**只以目录形式存在，
      // 不收集它们的词，`bpy.ops.action` 这种标识符就检索不到（实测：199 个词）
      for (const token of corpusTokens(directoryKeywords(file.relative))) tokens.add(token)
      for (const token of tokens) df[token] = (df[token] ?? 0) + 1

      indexBuffers.push(JSON.stringify({
        path: file.relative,
        scope: file.relative.startsWith('api/') ? 'api' : 'manual',
        bytes: Buffer.byteLength(normalized, 'utf8'),
        segments: parsed.segments.length,
        tokens: [...tokens],
        items: parsed.segments,
      }))
      totalSegments += parsed.segments.length
      if (documentedFiles % 500 === 0) console.log(`# …已归一化 ${documentedFiles} 个文件`)
    }

    if (documentedFiles === 0) throw new Error('所有语料文件都被索引期排除了，拒绝产出空索引')

    // 全局词表：文件记录里存**整数 id** 而不是 token 字符串。
    // 理由（实测）：4,139 行里每个 token 字符串平均重复出现在几十个文件里，
    // 直接存字符串会把索引顶到归一化体积的 2.29×（超过验收上限）；存 id 约省一成多，
    // 同时加载更快、内存更省——而「索引必须携带文件级 token 集合」（I20）不受影响。
    // `df` 是普通对象（token -> 文档频率），词表取它的键排序
    const vocabulary = Object.keys(df).sort()
    const tokenIds = new Map(vocabulary.map((token, index) => [token, index]))
    for (const line of indexBuffers) {
      const record = /** @type {{path: string, tokens: string[]}} */ (JSON.parse(line))
      const ids = record.tokens.map(token => tokenIds.get(token) ?? -1)
      await indexHandle.write(`${JSON.stringify({ ...record, tokens: ids })}\n`)
    }
    await writeFile(
      join(indexPath, 'tokens.json'),
      `${JSON.stringify({ vocabulary, n_files: documentedFiles })}\n`,
      'utf8',
    )
    await writeFile(join(indexPath, 'df.json'), `${JSON.stringify({ n_files: documentedFiles, df })}\n`, 'utf8')
    await writeFile(
      join(indexPath, 'api-map.jsonl'),
      `${identifierMap.map(item => JSON.stringify(item)).join('\n')}\n`,
      'utf8',
    )
  } finally {
    await indexHandle.close()
  }

  // ---- rules.json：G3 小抄（上游 prompts.yml 原文 + 本项目自己的规则，见 docs/contract.md#knowledge-granularity）----
  const rules = await buildRules(sourceDir)
  await writeFile(join(KNOWLEDGE_DIR, 'rules.json'), `${JSON.stringify(rules, null, 2)}\n`, 'utf8')
  // 同一份内容再出一份人类可读的 Markdown：没装插件的用户也要能直接读（技能壳指向它）
  await writeFile(join(KNOWLEDGE_DIR, 'g3-rules.md'), renderRulesMarkdown(rules), 'utf8')

  const examples = await collectExamples(sourceDir)
  const exampleBytes = await sumBytes(examples.map(example => example.absolute))

  const indexBytes = (await dirSize(indexPath)) + Buffer.byteLength(JSON.stringify(rules), 'utf8')
  const limit = Math.round(normalizedBytes * INDEX_SIZE_LIMIT_RATIO)

  await writeMeta({
    ...meta,
    builderVersion: BUILDER_VERSION,
    builtAt: new Date().toISOString(),
    blenderVersion: detectBlenderVersion(await readFile(join(sourceDir, 'api', 'index.rst'), 'utf8').catch(() => '')),
    indexedFiles: documentedFiles,
    segments: totalSegments,
    normalizedBytes,
    indexBytes,
    examplePyFiles: examples.length,
    examplePyBytes: exampleBytes,
    unparsedDirectives: [...unparsed.entries()].map(([directive, info]) => ({
      directive,
      occurrences: info.count,
      firstPath: info.path,
    })),
  })

  console.log(`# 归一化 ${documentedFiles} 个文件 / ${totalSegments} 段 / ${normalizedBytes} 字节`)
  console.log(`# 索引 ${indexBytes} 字节（上限 ${limit} 字节，系数 ${INDEX_SIZE_LIMIT_RATIO}）`)
  console.log(`# 排除导航页 ${skipped.size} 个；示例脚本 ${examples.length} 个`)
  if (indexBytes > limit) {
    console.log(`# ⚠️ 索引体积超过验收上限（${indexBytes} > ${limit}），需要减少每文件的 token 词频或压缩存储`)
  }
  if (unparsed.size > 0) {
    console.log('# 未识别的 RST directive（**保留原文并登记**，I24）：')
    for (const [directive, info] of unparsed) {
      console.log(`#   ${directive} × ${info.count}（如 ${info.path}）`)
    }
  } else {
    console.log('# 未识别的 RST directive：无')
  }
  console.log(`# 参考：单条命中内联上限默认 ${REPORT_CHARS_PER_HIT} 字符（配置 knowledge.maxCharsPerHit）`)
  console.log('# 下一步：node buildKnowledge.js verify')
}

/**
 * 收集 `knowledge/source/` 下的 `.rst` 文件。
 *
 * @param {string} dir 源目录。
 * @returns {Promise<{absolute: string, relative: string}[]>} 文件列表（按路径排序）。
 */
async function collectRst(dir) {
  /** @type {{absolute: string, relative: string}[]} */
  const out = []
  /**
   * 递归遍历。
   *
   * @param {string} current 当前目录。
   * @returns {Promise<void>} 完成时 resolve。
   */
  async function walk(current) {
    let entries
    try {
      entries = await readdir(current, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const absolute = join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
        continue
      }
      if (!entry.name.endsWith('.rst')) continue
      out.push({ absolute, relative: relative(dir, absolute).split(sep).join('/') })
    }
  }
  await walk(dir)
  return out.sort((a, b) => a.relative.localeCompare(b.relative))
}

/**
 * 收集示例脚本（`.py`）。
 *
 * @param {string} dir 源目录。
 * @returns {Promise<{absolute: string, relative: string}[]>} 文件列表。
 */
async function collectExamples(dir) {
  /** @type {{absolute: string, relative: string}[]} */
  const out = []
  /**
   * 递归遍历。
   *
   * @param {string} current 当前目录。
   * @returns {Promise<void>} 完成时 resolve。
   */
  async function walk(current) {
    let entries
    try {
      entries = await readdir(current, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const absolute = join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
        continue
      }
      if (!entry.name.endsWith('.py')) continue
      out.push({ absolute, relative: relative(dir, absolute).split(sep).join('/') })
    }
  }
  await walk(dir)
  return out.sort((a, b) => a.relative.localeCompare(b.relative))
}

/**
 * 行式 RST 解析（不引入 docutils，见 docs/contract.md#knowledge-corpus）。
 *
 * **未识别的 directive 不丢弃**：原文进 `unparsedBlocks`，并登记进未识别清单。
 *
 * @param {string} text RST 原文。
 * @param {string} path 相对路径（用于面包屑与登记）。
 * @param {{sourceDir?: string, included?: Set<string>, initialSections?: string[]}} [context] 上下文（include 展开用）。
 * @returns {Promise<{segments: import('./lib/knowledge.js').Segment[], unparsed: Map<string, number>, unparsedBlocks: string[], directiveTokens: Set<string>}>} 解析结果。
 */
async function parseRst(text, path, context = {}) {
  const sourceDir = context.sourceDir ?? join(KNOWLEDGE_DIR, 'source')
  const included = context.included ?? new Set()
  included.add(path)
  const lines = text.split(/\r?\n/u)
  /** @type {string[]} */
  const titleStack = [...(context.initialSections ?? [])]
  /** @type {string[]} */
  const pending = []
  /** @type {import('./lib/knowledge.js').Segment[]} */
  const segments = []
  /** @type {Map<string, number>} */
  const unparsed = new Map()
  /** @type {string[]} */
  const unparsedBlocks = []
  /** @type {Set<string>} 只出现在 directive 标记里的词（marker 名与原始签名），同样要进索引 */
  const directiveTokens = new Set()
  /**
   * 当前"归属者"（类 / 模块）：`api/` 里的 `.. method::` 与 `.. attribute::` 都是**缩进**在
   * `.. class:: X` 之下，不记归属就没法把它们索引进 `X.method`。
   *
   * @type {Array<{indent: number, name: string}>}
   */
  const owners = []
  /**
   * 本文件的模块前缀（来自 `.. module::` / `.. currentmodule::`）。
   *
   * 少了它，`bpy.ops.object.rst` 里顶层 `.. function:: add` 只会被索引成裸名 `add`，
   * 于是 `bpy.ops.object.add` 查不到、还会撞到别的文件里的同名成员（**实测踩过**）。
   *
   * @type {string}
   */
  let modulePrefix = ''
  let index = 0
  let inCodeBlock = false
  let dropUntilBlank = false

  /**
   * 取当前归属者的限定名。
   *
   * @returns {string} 形如 `BMVert.calc_angle`（无归属者时为空串）。
   */
  const ownerPrefix = () => (owners.length === 0 ? '' : `${owners.map(item => item.name).join('.')}.`)

  /**
   * 收段落。
   *
   * @param {{type?: string, name?: string, directive?: string}} [meta] 数据块元信息。
   */
  const flush = (meta = {}) => {
    const body = pending.join('\n').trim()
    pending.length = 0
    if (body === '') return
    segments.push({
      index: segments.length,
      line: 1,
      section: titleStack.join(' > '),
      text: body,
      ...meta.type === undefined ? {} : { type: meta.type },
      ...meta.name === undefined ? {} : { name: meta.name },
      ...meta.directive === undefined ? {} : { directive: meta.directive },
    })
  }

  while (index < lines.length) {
    const line = lines[index] ?? ''
    const next = lines[index + 1] ?? ''

    // 代码块：缩进块原样保留
    if (inCodeBlock) {
      if (/^\s*$/u.test(line)) {
        index += 1
        if (!/^\s/u.test(lines[index] ?? '')) inCodeBlock = false
        continue
      }
      if (/^\s/u.test(line)) {
        pending.push(line.trim())
        index += 1
        continue
      }
      inCodeBlock = false
    }

    // 标题：下一行是 === / --- / ~~~ 等装饰线
    const underline = /^([=\-~^"'`#*+])\1{2,}\s*$/u.exec(next)
    if (underline !== null && line.trim() !== '' && line.length <= next.trim().length + 2) {
      const level = underlineCharLevel(underline[1])
      titleStack.length = Math.max(0, Math.min(titleStack.length, level - 1))
      titleStack.push(line.trim())
      // 标题不单独占段落：它已进入面包屑，避免返回"只有标题没有内容"的命中
      owners.length = 0
      index += 2
      continue
    }

    // directive：**允许缩进**——api 语料里类成员全是缩进的（这是必须支持的第一类写法）
    const directive = /^(\s*)\.\.\s+([A-Za-z][A-Za-z0-9_-]*)::(.*)$/u.exec(line)
    if (directive !== null) {
      const indent = (directive[1] ?? '').length
      const kind = (directive[2] ?? '').toLowerCase()
      const argument = (directive[3] ?? '').trim()
      // 同级或更浅的 directive 结束更深的归属者
      while (owners.length > 0 && indent <= (owners[owners.length - 1]?.indent ?? -1)) owners.pop()

      // `.. include::` 必须**真的展开**：共 245 处，其中 230 处能解析到目标文件。
      // 只登记不展开等于丢内容（docs/contract.md#knowledge-retrieval 的 I24 精神）。
      if (kind === 'include') {
        const expanded = await expandInclude(argument, { sourceDir, fromRelative: path, included })
        if (expanded === undefined) {
          unparsed.set(kind, (unparsed.get(kind) ?? 0) + 1)
          pending.push(`[unparsed directive: include] ${argument}（上游仓库里的目标文件不存在）`)
          flush()
          index += 1
          continue
        }
        const nested = await parseRst(expanded.text, expanded.relative, {
          sourceDir,
          included,
          initialSections: titleStack,
        })
        for (const segment of nested.segments) segments.push({ ...segment, index: segments.length })
        for (const [name, count] of nested.unparsed) unparsed.set(name, (unparsed.get(name) ?? 0) + count)
        for (const token of nested.directiveTokens) directiveTokens.add(token)
        unparsedBlocks.push(...nested.unparsedBlocks)
        flush()
        index += 1
        continue
      }

      const handled = handleDirective(kind, argument, lines, index)
      if (handled !== undefined) {
        if (handled.text !== undefined && handled.text.trim() !== '') pending.push(handled.text)
        // 名字只在这里**算一次**：先前版本既在 owner 里算、又在 flush 时拼前缀，导致
        // `add.add`、`Scene.frame_current.frame_current` 这种双重拼接（api mode 因此查不到）。
        const rawName = argument.split(/[( ]/u)[0]?.trim() ?? ''
        let qualified = rawName
        if (rawName !== '' && kind !== 'module' && kind !== 'currentmodule') {
          // 归属名里可能已经带模块前缀（`bpy.types.Scene`），先剥掉再拼，
          // 否则会得到 `bpy.types.bpy.types.Scene.frame_current`（实测踩过）
          const owner = ownerPrefix().replace(/\.$/u, '')
          const ownerTail = owner !== '' && modulePrefix !== '' && owner.startsWith(`${modulePrefix}.`)
            ? owner.slice(modulePrefix.length + 1)
            : owner
          qualified = [modulePrefix, ownerTail, rawName].filter(part => part !== '').join('.')
        }
        if ((kind === 'module' || kind === 'currentmodule') && rawName !== '') modulePrefix = rawName
        if (handled.owner === true && qualified !== '') owners.push({ indent, name: qualified })
        if (handled.flush === true) flush({ type: kind, name: qualified, directive: rawName })
        // directive 名与原始签名也要进 token 袋：`toctree` / `staticmethod` / `classmethod`
        // 这些词**只出现在 directive 标记里**，不收集它们会让按词检索整片漏掉（实测：8,418 个词）
        if (kind !== 'module' && kind !== 'currentmodule') {
          directiveTokens.add(kind)
          if (rawName !== '') directiveTokens.add(rawName)
        }
        index += 1 + handled.skip
        continue
      }

      // 未识别 directive：原文照留 + 登记（I24：**不得静默丢弃**）
      unparsed.set(kind, (unparsed.get(kind) ?? 0) + 1)
      pending.push(`[unparsed directive: ${kind}] ${argument}`.trimEnd())
      let cursor = index + 1
      while (cursor < lines.length) {
        const body = lines[cursor] ?? ''
        if (!/^\s+\S/u.test(body)) break
        unparsedBlocks.push(body)
        pending.push(body.trim())
        cursor += 1
      }
      index = cursor
      flush()
      continue
    }

    if (dropUntilBlank) {
      if (/^\s*$/u.test(line)) dropUntilBlank = false
      index += 1
      continue
    }

    if (/^\s*$/u.test(line)) {
      flush()
      index += 1
      continue
    }

    pending.push(line.trim())
    index += 1
  }
  flush()
  return { segments, unparsed, unparsedBlocks, directiveTokens }
}

/**
 * 把装饰线字符映射成层级。
 *
 * @param {string} ch 字符。
 * @returns {number} 层级（1 为最高）。
 */
function underlineCharLevel(ch) {
  const order = ['=', '-', '~', '^', '"', "'", '`', '#', '*', '+']
  const at = order.indexOf(ch)
  return at === -1 ? order.length : at + 1
}

/**
 * 展开 `.. include::` 目标。
 *
 * 目标可能是：相对当前文件的路径、以 `/` 开头的**手册树绝对路径**、或指向 `.rst.frag` 片段。
 * 目标不存在时返回 undefined，由调用方登记为未识别（**不静默丢弃**）。
 *
 * @param {string} argument directive 参数。
 * @param {{sourceDir: string, fromRelative: string, included: Set<string>}} context 上下文。
 * @returns {Promise<{text: string, relative: string} | undefined>} 目标内容与相对路径。
 */
async function expandInclude(argument, context) {
  const raw = argument.split(/\s+/u)[0] ?? ''
  if (raw === '') return undefined
  const fromDir = dirname(join(context.sourceDir, ...context.fromRelative.split('/')))
  let absolute
  if (raw.startsWith('/')) {
    // `/render/...` 这类是相对**手册根**的（source/manual/）
    absolute = join(context.sourceDir, 'manual', ...raw.slice(1).split('/'))
  } else {
    absolute = join(fromDir, ...raw.split('/'))
  }
  const relativePath = relative(context.sourceDir, absolute).split(sep).join('/')
  if (relativePath.startsWith('..')) return undefined
  if (context.included.has(relativePath)) return undefined // 防 include 环
  try {
    return { text: await readFile(absolute, 'utf8'), relative: relativePath }
  } catch {
    return undefined
  }
}

/**
 * 处理已知 directive。
 *
 * `owner: true` 表示该 directive 会成为后续缩进 directive 的归属者（`api/` 的类成员靠它索引）。
 *
 * @param {string} kind directive 名（小写）。
 * @param {string} argument directive 参数。
 * @param {string[]} lines 全部行。
 * @param {number} index 当前行号。
 * @returns {{skip: number, text?: string, flush?: boolean, owner?: boolean} | undefined} 处置；`undefined` 表示未识别。
 */
function handleDirective(kind, argument, lines, index) {
  const contentIndent = (() => {
    let cursor = index + 1
    let body = ''
    while (cursor < lines.length) {
      const line = lines[cursor] ?? ''
      if (/^\s*$/u.test(line)) {
        if (body !== '') body += '\n'
        cursor += 1
        continue
      }
      if (!/^\s/u.test(line)) break
      // 缩进更深的 directive 交给主循环处理，不吞进纯文本（否则类成员会丢）
      if (/^\s*\.\.\s+[A-Za-z][A-Za-z0-9_-]*::/u.test(line)) break
      body += `${line.replace(/^\s{1,6}/u, '')}\n`
      cursor += 1
    }
    return { text: body.trim(), skip: cursor - index - 1 }
  })()

  switch (kind) {
    case 'function':
    case 'class':
    case 'method':
    case 'attribute':
    case 'data':
    case 'exception':
    case 'decorator':
    case 'classmethod':
    case 'staticmethod':
    case 'property':
      return { ...contentIndent, flush: true, owner: true }
    // `module` / `currentmodule` 只建立归属上下文，本身不出段落
    // （否则每个文件都会多出一条"只有模块名、没有内容"的命中）
    case 'module':
    case 'currentmodule':
      return { skip: 0, owner: true }
    case 'describe':
    case 'seealso':
    case 'note':
    case 'warning':
    case 'important':
    case 'tip':
    case 'hint':
    case 'versionadded':
    case 'versionchanged':
    case 'deprecated':
      return { ...contentIndent, text: `${kind}: ${argument}${contentIndent.text === '' ? '' : `\n${contentIndent.text}`}` }
    case 'code-block':
    case 'code':
    case 'sourcecode':
    case 'parsed-literal':
      return { ...contentIndent, text: '```\n' + contentIndent.text + '\n```' }
    case 'literalinclude':
      // 示例脚本的正文由 examples[] 通道提供；这里只留路径线索
      return { ...contentIndent, text: `literalinclude: ${argument}` }
    case 'image':
    case 'figure':
      return { ...contentIndent, text: `${kind}: ${argument}` }
    case 'rubric':
      return { ...contentIndent, text: `#### ${argument}` }
    case 'admonition':
      return { ...contentIndent, text: `${argument}:\n${contentIndent.text}` }
    // details 是官方用来折叠「Special Methods」的 directive。
    // **它必须被显式处理**：上游自己的解析器 stub 表没登记它（5.2 语料新增），
    // 我们不能重复那个缺口——这里把它当纯容器，内容照收、归属关系保持不变（I24）。
    case 'details':
      return { ...contentIndent }
    case 'toctree':
    case 'hlist':
    case 'contents':
    case 'index':
    case 'highlight':
    case 'todolist':
    case 'include':
    case 'reference':
    case 'peertube':
      return { ...contentIndent }
    default:
      return undefined
  }
}

/**
 * 渲染归一化 Markdown。
 *
 * @param {{segments: import('./lib/knowledge.js').Segment[]}} parsed 解析结果。
 * @param {string} path 相对路径。
 * @returns {string} Markdown 正文。
 */
function renderNormalized(parsed, path) {
  const out = [`<!-- source: ${path} -->`, '']
  for (const segment of parsed.segments) {
    if (segment.type === 'section-title') {
      out.push(`## ${segment.text}`, '')
      continue
    }
    if (segment.type !== undefined && segment.name !== undefined) {
      out.push(`### ${segment.type} \`${segment.name}\``, '')
    }
    out.push(segment.text, '')
  }
  return out.join('\n')
}

/**
 * 构造 G3 规则条目：上游 `prompts.yml` 原文 + 本项目自己的规则。
 *
 * @param {string} sourceDir 语料目录。
 * @returns {Promise<Array<Record<string, unknown>>>} 规则条目。
 */
async function buildRules(sourceDir) {
  /** @type {Array<Record<string, unknown>>} */
  const rules = []
  try {
    const text = await readFile(join(sourceDir, 'prompts.yml'), 'utf8')
    rules.push({
      id: 'upstream-initial-instructions',
      source: 'lab/blender_mcp: mcp/blmcp/data/prompts.yml',
      kind: 'upstream',
      title: '官方在连接时注入的「易错点小抄」原文',
      text: text.trim(),
    })
  } catch {
    rules.push({
      id: 'upstream-initial-instructions',
      source: 'lab/blender_mcp: mcp/blmcp/data/prompts.yml',
      kind: 'upstream',
      title: '官方注入提示词缺失',
      text: '（语料里没有 prompts.yml；这是一处交付缺陷）',
    })
  }

  // 本项目自己的规则（docs/contract.md#knowledge-granularity 的 G3 表）
  const own = [
    ['name-is-not-identity', '名字不是身份：中文界面下 primitive_cube_add() 生成的对象名是「立方体」。归属判定必须用连接时记录的 as_pointer()，不要按名字回查（I2）。'],
    ['relative-paths-land-in-blender-cwd', '相对路径会落到 Blender 进程自己的 cwd（实测在 Program Files 下），不是你的 workspace。要落盘就用插件返回的绝对路径。'],
    ['overwrite-save-is-refused', '覆盖保存会被拒（bpy.ops.wm.save_mainfile 与不带 copy=True 的 save_as_mainfile 同等对待）。要存盘请走 blender_mcp_snapshot。'],
    ['out-of-scope-writes-are-refused', '可写范围只有任务目录 .dsh-blender-{task}/。越界写/删会被 L1 或 L2 拒绝，并返回 suggested_path 与 handoff——那一步需要用户自己在 Blender 或系统里完成。'],
    ['checkpoint-before-write', '标记 mutating=true 的调用会先落检查点；检查点写盘失败时**整次调用被拒绝**，不会「无备份继续」。'],
    ['screenshots-land-in-task-dir', '截图落在任务目录 renders/ 下，返回里有路径与字节数。socket exec 下没有 UI 上下文：viewport 与 area 目标通常不可用，window 可用。'],
    ['preferences-writes-are-refused', '改动 Blender 偏好、add-on 开关、脚本自动执行会被拒（跨会话持久，比丢一个场景更不可逆）。需要用户自己在偏好设置里改。'],
    ['guard-is-not-a-sandbox', '这套拦截只防误操作，不是沙箱：动态构造、importlib.reload、ctypes 都可以绕过，而且经此通道执行的代码有与 Blender 同等的网络能力。'],
    ['localized-node-names', '按**显示名**取节点会静默失效：本机界面是中文，`nodes.get("Principled BSDF")` 返回 None，赋值被跳过而脚本不报错，结果是材质全用默认灰。按 `bl_idname == "ShaderNodeBsdfPrincipled"` 取，语言无关。同类问题也适用于 `bpy.ops` 面板与偏好项的显示名。'],
    ['restore-after-probe', '任何"临时改渲染设置再还原"的探测，如果还原点是在改动**之后**读取的，就会留下中间态（例如分辨率停在 960x540）。要么在改动前先取值，要么在收尾时显式钉回目标设置。'],
    ['session-id-decides-scope', '任务目录按会话隔离：调用方换了 sessionId，就会落到 `.dsh-blender-<task>-2`，L2 护栏的 allowRoot 随之改变，之前建的目录反而"越界"。跨多次调用驱动同一场景时，会话 id 必须全程一致。'],
  ]
  for (const [id, text] of own) {
    rules.push({ id, source: 'dsh-blender-mcp-bridge: docs/contract.md', kind: 'project', title: id, text })
  }
  return rules
}

/**
 * 把规则条目渲染成人类可读的 Markdown（`knowledge/g3-rules.md`）。
 *
 * @param {Array<Record<string, unknown>>} rules 规则条目。
 * @returns {string} Markdown 文本。
 */
function renderRulesMarkdown(rules) {
  const lines = [
    '# G3 规则：写 Blender Python 时反复踩的坑',
    '',
    '> 本文件由 `node buildKnowledge.js build` 生成，**不要手改**（改 `buildKnowledge.js` 的 `buildRules`）。',
    '> 内容 = 上游官方注入提示词原文 + 本插件自己的规则（见 docs/contract.md#knowledge-granularity）。',
    '',
  ]
  for (const rule of rules) {
    lines.push(`## ${String(rule.title ?? rule.id)}`, '')
    lines.push(`来源：\`${String(rule.source)}\``, '')
    lines.push(String(rule.text ?? ''), '')
  }
  return `${lines.join('\n')}\n`
}

/**
 * 从 `api/index.rst` 的标题里推断语料对应的 Blender 版本。
 *
 * @param {string} text 文件内容。
 * @returns {string|undefined} 形如 `5.2`；取不到时 undefined。
 */
function detectBlenderVersion(text) {
  const match = /Blender\s+(\d+\.\d+)/u.exec(text)
  return match?.[1]
}

/**
 * 语料分词：与检索侧同源，保证索引与查询口径一致。
 *
 * 语料侧**不去 stop-word**（DF 要覆盖所有 token），只做小写切词。
 *
 * @param {string} text 文本。
 * @returns {string[]} token 列表。
 */
function corpusTokens(text) {
  return tokenize(text)
}

// ---------------------------------------------------------------------------
// verify
// ---------------------------------------------------------------------------

/**
 * 只校验指纹，不写任何文件。
 *
 * @returns {Promise<void>} 完成时 resolve。
 */
async function verifyKnowledge() {
  const meta = await readMeta()
  if (meta === undefined) throw new Error('knowledge/meta.json 不存在：先运行 fetch')

  const sourceDir = join(KNOWLEDGE_DIR, 'source')
  const files = await collectRst(sourceDir)
  const recorded = meta.blobs ?? {}
  const recordedRst = Object.keys(recorded).filter(path => path.endsWith('.rst'))

  /** @type {string[]} */
  const problems = []
  if (recordedRst.length === 0) problems.push('meta.json 里没有记录任何 .rst 指纹')
  if (files.length !== recordedRst.length) {
    problems.push(`文件数不符：磁盘 ${files.length}，记录 ${recordedRst.length}`)
  }

  let byteMismatch = 0
  for (const file of files) {
    const expected = recorded[file.relative]
    if (expected === undefined) {
      problems.push(`多出未记录的文件：${file.relative}`)
      continue
    }
    const actual = gitBlobHash(await readFile(file.absolute))
    if (actual !== expected) byteMismatch += 1
  }
  if (byteMismatch > 0) problems.push(`${byteMismatch} 个文件的内容哈希与记录不符`)

  const indexPath = join(KNOWLEDGE_DIR, 'index')
  const normalizedDir = join(KNOWLEDGE_DIR, 'normalized')
  const indexInfo = await stat(join(indexPath, 'files.jsonl')).catch(() => undefined)
  const normalizedBytes = await dirSize(normalizedDir)
  const indexBytes = await dirSize(indexPath)

  console.log(`# 语料 pin: code=${meta.codeRevision ?? '(未记)'} corpus=${meta.corpusRevision ?? '(未记)'}`)
  console.log(`# 语料对应 Blender: ${meta.blenderVersion ?? '(未记)'}`)
  console.log(`# source: ${files.length} 个 .rst`)
  console.log(`# normalized: ${normalizedBytes} 字节`)
  console.log(`# index: ${indexBytes} 字节（上限 ${Math.round(normalizedBytes * INDEX_SIZE_LIMIT_RATIO)}）`)
  console.log(`# 索引是否已建: ${indexInfo === undefined ? '否' : '是'}`)
  const unparsed = Array.isArray(meta.unparsedDirectives) ? meta.unparsedDirectives : []
  console.log(`# 未识别 directive: ${unparsed.length === 0 ? '无' : unparsed.map(item => `${item.directive}×${item.occurrences}`).join(', ')}`)

  if (problems.length > 0) {
    console.log('# 校验失败：')
    for (const problem of problems.slice(0, 20)) console.log(`#   - ${problem}`)
    process.exitCode = 1
    return
  }
  console.log('# 校验通过')
}

// ---------------------------------------------------------------------------
// 共用
// ---------------------------------------------------------------------------

/**
 * 读 `knowledge/meta.json`。
 *
 * @returns {Promise<Record<string, any> | undefined>} 元数据。
 */
async function readMeta() {
  try {
    return JSON.parse(await readFile(join(KNOWLEDGE_DIR, 'meta.json'), 'utf8'))
  } catch {
    return undefined
  }
}

/**
 * 写 `knowledge/meta.json`。
 *
 * @param {Record<string, unknown>} meta 元数据。
 * @returns {Promise<void>} 完成时 resolve。
 */
async function writeMeta(meta) {
  await mkdir(KNOWLEDGE_DIR, { recursive: true })
  await writeFile(join(KNOWLEDGE_DIR, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
}

/**
 * 把文件的目录路径变成可检索词。
 *
 * `api/bpy.ops.action/add.rst` → `bpy.ops.action`。目录名本身常是标识符
 * （`bpy.ops.action` 是一个模块名），所以它是**可检索内容**，不是噪声。
 *
 * @param {string} relativePath 相对 `knowledge/` 的路径。
 * @returns {string} 供分词用的文本。
 */
function directoryKeywords(relativePath) {
  const parts = relativePath.split('/')
  parts.pop()
  return parts.map((part, index) => parts.slice(0, index + 1).join('.')).join(' ')
}

/**
 * 一组文件的字节数合计。
 *
 * @param {string[]} paths 文件路径。
 * @returns {Promise<number>} 总字节数。
 */
async function sumBytes(paths) {
  let total = 0
  for (const path of paths) {
    try {
      total += (await stat(path)).size
    } catch {
      // 读不到就跳过
    }
  }
  return total
}

/**
 * 目录总字节数（递归；容忍不存在）。
 *
 * @param {string} dir 目录。
 * @returns {Promise<number>} 字节数。
 */
async function dirSize(dir) {
  let total = 0
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return 0
  }
  for (const entry of entries) {
    const absolute = join(dir, entry.name)
    if (entry.isDirectory()) {
      total += await dirSize(absolute)
      continue
    }
    try {
      total += (await stat(absolute)).size
    } catch {
      // 读不到就跳过
    }
  }
  return total
}

await main()
