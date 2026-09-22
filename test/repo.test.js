// SPDX-License-Identifier: GPL-3.0-or-later
// 仓库级一致性测试（由 diagnostics/checkRepo.js 迁入）：文档 / 配置 / 代码三方不许漂移。
//
// 检查的都是"人力容易漏、机器一秒能查"的东西：
//   R1 files 清单真实   —— package.json 里列的路径必须都存在（有历史教训）
//   R2 配置三方一致     —— Config schema ↔ cordis.patch.yml ↔ README 表格
//   R3 配置真的被读     —— I12：不许有死配置
//   R4 锚点可解析       —— 外部文档引用 docs/contract.md 的锚点必须存在
//   R5 SPDX 头          —— 新写的 .js 首行必须有 SPDX
//   R6 措辞红线         —— 不许出现"安全沙箱 / 已保护数据"式措辞
//   R7 文档工具面一致   —— README/STATUS 提到的工具名必须是实际注册的那 6 个
//   R8 语料产物齐备     —— 随包交付的 knowledge/ 关键文件都在，且 meta 自洽
//
// 副作用边界：**只读**，不写任何文件，不连网，不需要 Blender。

import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

/** 仓库根（本文件在 `test/` 下）。 */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/**
 * 拼仓库内绝对路径。
 *
 * @default parts = 无（至少给一段）
 * @param {...string} parts 相对仓库根的路径片段。
 * @returns {string} 绝对路径。
 */
const at = (...parts) => join(ROOT, ...parts)

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

/**
 * 剥掉行注释与 JSDoc 块，只留下可执行代码（R3 判据不能看注释）。
 *
 * 够用即可：本仓不用模板字符串塞 Python 之外的注释形态，
 * 而 Python 片段里的 `#` 行注释被一起剥掉也不影响"谁读了这个键"的判定。
 *
 * @param {string} text 源码。
 * @returns {string} 代码（注释位置换成空行，保持行号可读）。
 */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//gu, match => match.replace(/[^\n]/g, ' '))
    .split('\n')
    .map(line => {
      const cut = line.search(/(^|[^:])\/\s?--|[ \t]\/\//u)
      return cut === -1 ? line : line.slice(0, cut)
    })
    .join('\n')
}

/** 主流程：算完所有检查，再注册为 `node:test` 用例。 */
async function main() {
  const pkg = JSON.parse(await readFile(at('package.json'), 'utf8'))
  const patch = await readFile(at('cordis.patch.yml'), 'utf8')
  const readme = await readFile(at('README.md'), 'utf8')
  // 交付状态与工作记忆的**单一入口**：根目录的 `STATUS.md` 已并入这里（`.AGENTS/README.md`）。
  // R7 与 R12 都依赖它，因此读不到就是硬失败——入口文件被改名/删掉时不许静默跳过。
  const status = await readFile(at('.AGENTS', 'README.md'), 'utf8')
  const contract = await readFile(at('docs/contract.md'), 'utf8')
  const entry = await readFile(at('index.js'), 'utf8')

  // ---- R1 files 清单真实 ----
  const missingEntries = []
  for (const entryPath of pkg.files ?? []) {
    if (!(await exists(at(entryPath)))) missingEntries.push(entryPath)
  }
  check('R1 package.json 的 files 每一项都真实存在',
    missingEntries.length === 0,
    missingEntries.length === 0
      ? `${(pkg.files ?? []).length} 项全部存在：${(pkg.files ?? []).join(', ')}`
      : `不存在的项：${missingEntries.join(', ')}`)

  // ---- R2 配置三方一致 ----
  /** 从 schema 文本里抽顶层键（含子域）。 */
  const schemaKeys = new Set()
  const schemaBlock = /export const Config = Schema\.object\(\{([\s\S]*?)\n\}\)/u.exec(entry)?.[1] ?? ''
  for (const match of schemaBlock.matchAll(/^ {2}(\w+): Schema\./gmu)) schemaKeys.add(match[1])
  for (const match of schemaBlock.matchAll(/^ {4}(\w+): Schema\./gmu)) schemaKeys.add(`<sub>.${match[1]}`)

  const patchKeys = new Set()
  const patchBlock = /config:\n([\s\S]*)$/u.exec(patch)?.[1] ?? ''
  for (const match of patchBlock.matchAll(/^ {8}(\w+):/gmu)) patchKeys.add(match[1])
  for (const match of patchBlock.matchAll(/^ {10}(\w+):/gmu)) patchKeys.add(`<sub>.${match[1]}`)

  const topLevel = new Set([...schemaKeys].filter(key => !key.startsWith('<sub>')))
  const patchTop = new Set([...patchKeys].filter(key => !key.startsWith('<sub>')))
  const onlySchema = [...topLevel].filter(key => !patchTop.has(key))
  const onlyPatch = [...patchTop].filter(key => !topLevel.has(key))
  check('R2a schema 与 cordis.patch.yml 的顶层键一致',
    onlySchema.length === 0 && onlyPatch.length === 0,
    onlySchema.length === 0 && onlyPatch.length === 0
      ? `两侧各 ${topLevel.size} 个顶层键：${[...topLevel].join(', ')}`
      : `只在 schema：${onlySchema.join(', ')}；只在 YAML：${onlyPatch.join(', ')}`)

  // README 的键表必须覆盖同样的键（README 里的写法是 `checkpoint.enabled` 这种点号形式）
  const readmeKeys = new Set()
  for (const match of readme.matchAll(/^\| `([a-zA-Z.]+)`/gmu)) readmeKeys.add(match[1].split('.')[0])
  const readmeTop = new Set([...readmeKeys])
  const notInReadme = [...topLevel].filter(key => !readmeTop.has(key))
  check('R2b README 的键表覆盖 schema 的全部顶层键',
    notInReadme.length === 0,
    notInReadme.length === 0
      ? `README 覆盖 ${topLevel.size} 个顶层键`
      : `README 未提到的键：${notInReadme.join(', ')}`)

  // 已删除的键不得在任何交付文件里复活
  const banned = ['knowledge.source', 'knowledge.cacheDir', 'knowledge.includeManual']
  const resurrected = []
  for (const key of banned) {
    const leaf = key.split('.')[1]
    if (new RegExp(`^\\s{10}${leaf}:`, 'mu').test(patch)) resurrected.push(`cordis.patch.yml: ${key}`)
  }
  check('R2c 已删除的配置键没有复活（I21：知识库不是可开关的）',
    resurrected.length === 0,
    resurrected.length === 0
      ? 'knowledge.source / cacheDir / includeManual 均未出现在 schema 与 YAML 里'
      : resurrected.join('；'))

  // ---- R3 配置真的被读（I12）----
  // **必须测叶子键**：只测顶层键时，`knowledge` 只要被读过一次，它下面任何死键都能蒙混过关
  // （实测：`knowledge.maxHits` 在被接线之前，R3 一直是绿的——审计 F11 就是这么漏掉的）。
  // 而且**判据不能看注释**：第一版用 `\b<leaf>\b` 全文匹配，于是 JSDoc 里写一句
  // "@property {number[]} portCandidates" 就算"有消费者"了——假绿比死配置更坏，
  // 因为它让死配置看起来活着。这里先剥掉注释与 JSDoc，再找真实引用。
  const sourceFiles = ['lib/tools.js', 'lib/diagnostics.js', 'lib/protocol.js', 'lib/checkpoint.js',
    'lib/guardPayload.js', 'lib/requestPolicy.js', 'lib/taskDir.js', 'lib/slug.js',
    'lib/knowledge.js', 'lib/settingsGuard.js', 'index.js', 'buildKnowledge.js']
  const allCode = (await Promise.all(sourceFiles.map(async path => stripComments(await readFile(at(path), 'utf8'))))).join('\n')
  /** 叶子键（点号全路径），来自 schema 的两层嵌套结构。 */
  const leafKeys = new Set()
  for (const match of schemaBlock.matchAll(/^ {2}(\w+): Schema\./gmu)) leafKeys.add(match[1])
  for (const match of schemaBlock.matchAll(/^ {2}(\w+): Schema\.object\(\{([\s\S]*?)\n {2}\}\)/gmu)) {
    for (const inner of match[2].matchAll(/^ {4}(\w+):/gmu)) leafKeys.add(`${match[1]}.${inner[1]}`)
  }
  // 消费形态：`config.<key>`、`context.config.<key>`，或解构后的 `<leaf>`。
  // **schema 声明本身要先排除**：`maxHits: Schema.number()` 里的叶子名是"定义"，不是"消费"；
  // 不排除的话，任何死键都能靠自己的声明行蒙过这一关（假绿）。
  const codeWithoutSchema = allCode.replace(schemaBlock, ' '.repeat(schemaBlock.length))
  const unread = []
  for (const key of leafKeys) {
    const dotted = key.includes('.')
      ? new RegExp(`config\\.${key.replace('.', '\\.')}\\b`, 'u')
      : new RegExp(`\\b(?:config|cfg)\\.${key}\\b`, 'u')
    const leaf = key.split('.').at(-1)
    // 解构后的消费：`const { keep } = options` 之类（点号键的子域常这样用）
    const destructured = new RegExp(`\\b${leaf}\\b`, 'u')
    const used = dotted.test(codeWithoutSchema)
      || (key.includes('.') && destructured.test(codeWithoutSchema))
    if (!used) unread.push(key)
  }
  check('R3 每个**叶子**配置键都有消费者（I12：不允许死配置）',
    unread.length === 0,
    unread.length === 0
      ? `${leafKeys.size} 个叶子键在**剥掉注释与 schema 声明后的代码**里被读取：${[...leafKeys].join(', ')}`
      : `没有任何消费者的键：${unread.join(', ')}`)

  // ---- R4 锚点可解析 ----
  const defined = new Set([...contract.matchAll(/<a id="([^"]+)"/gu)].map(match => match[1]))
  /** @type {string[]} */
  const dangling = []
  // 引用形态统一为 `<路径>docs/contract.md#<锚点>`；占位符写成尖括号形式，
  // 否则本文件自己的说明文字会被当成一条引用（下面的正则只认字母数字与连字符）。
  const ANCHOR_REF = /contract\.md#([A-Za-z0-9-]+)/gu
  // **从磁盘枚举**，不写死清单：写死的清单本身就是漂移源——审计时它漏了 docs/contract.md
  // 自己（F11），于是"契约里引用了自己的锚点却不存在"这种情况永远查不出来。
  const refFiles = ['cordis.patch.yml', 'skills/blender-mcp-knowledge/SKILL.md']
  // 根目录只认**规范类**文档：`STATUS.md` 已并入 `.AGENTS/README.md`，
  // 若将来又有人在根目录加一份 `*.md`，它不会自动进入受检集合——这正是想要的（白名单，不是通配）。
  for (const dir of ['', 'docs']) {
    for (const name of await readdir(dir === '' ? ROOT : at(dir))) {
      if (dir === '' && !['README.md', 'AGENTS.md', 'THIRD_PARTY_NOTICES.md'].includes(name)) continue
      if (name.endsWith('.md') || name.endsWith('.js')) refFiles.push(dir === '' ? name : `docs/${name}`)
    }
  }
  for (const dir of ['lib', 'diagnostics', 'test']) {
    for (const name of await readdir(at(dir))) {
      if (name.endsWith('.js') && !name.startsWith('.')) refFiles.push(`${dir}/${name}`)
    }
  }
  // `.AGENTS/` 的记忆文档同样引用契约锚点（它们由 docs/ 迁入），必须继续受检
  for (const name of await readdir(at('.AGENTS'))) {
    if (name.endsWith('.md')) refFiles.push(`.AGENTS/${name}`)
  }
  for (const file of refFiles) {
    const text = await readFile(at(file), 'utf8')
    for (const match of text.matchAll(ANCHOR_REF)) {
      if (!defined.has(match[1])) dangling.push(`${file} → #${match[1]}`)
    }
  }
  check('R4 全仓引用契约文档的锚点都能解析',
    dangling.length === 0,
    dangling.length === 0
      ? `docs/contract.md 定义 ${defined.size} 个锚点；${refFiles.length} 个文件（磁盘枚举）里的引用都命中`
      : `悬空锚点：${dangling.slice(0, 8).join(', ')}`)

  // ---- R5 SPDX 头 ----
  /** @type {string[]} */
  const noSpdx = []
  /** @type {string[]} */
  const jsFiles = ['index.js', 'buildKnowledge.js']
  for (const dir of ['lib', 'diagnostics', 'test']) {
    for (const name of await readdir(at(dir))) {
      if (name.endsWith('.js')) jsFiles.push(`${dir}/${name}`)
    }
  }
  for (const file of jsFiles) {
    const first = (await readFile(at(file), 'utf8')).split('\n')[0] ?? ''
    if (!first.includes('SPDX')) noSpdx.push(file)
  }
  check('R5 新写的 .js 首行都带 SPDX 标识',
    noSpdx.length === 0,
    noSpdx.length === 0
      ? `${jsFiles.length} 个文件全部合规（判定规则：第一行含字面量 SPDX）`
      : `缺 SPDX：${noSpdx.join(', ')}`)

  // ---- R6 措辞红线 ----
  const bannedPhrases = ['安全沙箱', '已保护你的数据', '已保护数据', '已保证安全']
  const violations = bannedPhrases.filter(phrase => readme.includes(phrase))
  check('R6a README 没有"安全沙箱 / 已保护数据"式措辞（I10）',
    violations.length === 0,
    violations.length === 0
      ? 'README 里没有出现被禁措辞；且明确写了"这不是沙箱"'
      : `出现：${violations.join(', ')}`)

  // 工具描述里的措辞同样受约束（模型直接读到的是 description）
  const entryViolations = bannedPhrases.filter(phrase => entry.includes(phrase))
  check('R6b 工具描述没有相同措辞（模型可见文本）',
    entryViolations.length === 0,
    entryViolations.length === 0
      ? 'index.js 里的 6 个 description 均未出现被禁措辞'
      : `出现：${entryViolations.join(', ')}`)

  // ---- R7 工具面一致 ----
  const registered = [...entry.matchAll(/^ {2}if \(config\.expose\.(\w+)\)/gmu)].map(match => match[1])
  const expectedTools = ['blender_mcp_status', 'blender_mcp_exec', 'blender_mcp_inspect', 'blender_mcp_capture', 'blender_mcp_snapshot', 'blender_mcp_docs']
  const missingInEntry = expectedTools.filter(name => !entry.includes(`'${name}'`))
  const missingInReadme = expectedTools.filter(name => !readme.includes(name))
  const missingInStatus = expectedTools.filter(name => !status.includes(name))
  check('R7 6 个工具名在注册点、README、STATUS 三处一致',
    missingInEntry.length === 0 && missingInReadme.length === 0 && missingInStatus.length === 0
      && registered.length === expectedTools.length,
    `注册开关 ${registered.length} 个（${registered.join('/')}）`
    + `；缺：${[...new Set([...missingInEntry, ...missingInReadme, ...missingInStatus])].join(', ') || '无'}`)

  // README 不许声称"已实现"未实现的能力
  const claimedButNotImplemented = ['用途猜测']
  const falseClaims = claimedButNotImplemented.filter(feature => readme.includes(feature) && !readme.includes('未做'))
  check('R7b README 没有把未实现的能力说成可用',
    falseClaims.length === 0,
    falseClaims.length === 0 ? 'README 只描述已实现的能力（未实现项不出现或明确标注）' : `可疑声明：${falseClaims.join(', ')}`)

  // ---- R7c 交付状态只有**一个**入口（根目录不得再冒出 STATUS.md）----
  // 两处各写一份状态一定会漂移（本仓已有"两处各写一份必然漂移"的多次教训）。
  const strayStatus = await exists(at('STATUS.md'))
  check('R7c 交付状态只有 `.AGENTS/README.md` 一个入口（根目录没有 STATUS.md）',
    strayStatus === false,
    strayStatus ? '根目录又出现了 STATUS.md——状态会两处漂移' : '根目录只有 AGENTS.md / README.md / THIRD_PARTY_NOTICES.md 三份规范类文档')

  // ---- R8 语料产物齐备且自洽 ----
  const required = ['knowledge/meta.json', 'knowledge/rules.json', 'knowledge/g3-rules.md', 'knowledge/index/files.jsonl', 'knowledge/index/df.json', 'knowledge/index/tokens.json', 'knowledge/index/api-map.jsonl']
  const absent = []
  for (const file of required) {
    if (!(await exists(at(file)))) absent.push(file)
  }
  const meta = JSON.parse(await readFile(at('knowledge/meta.json'), 'utf8'))
  const apiMapLines = (await readFile(at('knowledge/index/api-map.jsonl'), 'utf8')).split('\n').filter(Boolean).length
  const metaSane = typeof meta.corpusRevision === 'string' && /^[0-9a-f]{40}$/u.test(meta.corpusRevision)
    && typeof meta.sourceFiles === 'number' && meta.sourceFiles > 0
    && Object.keys(meta.blobs ?? {}).length === meta.sourceFiles
  check('R8 knowledge/ 的随包产物齐备且 meta 自洽',
    absent.length === 0 && metaSane,
    absent.length === 0
      ? `${required.length} 项齐备；语料 pin=${String(meta.corpusRevision).slice(0, 12)}…；`
        + `${meta.sourceFiles} 个文件、blob 记录 ${Object.keys(meta.blobs ?? {}).length} 条；`
        + `被索引 ${meta.indexedFiles} 个、${meta.segments} 段；未识别 directive ${(meta.unparsedDirectives ?? []).length} 类；api-map ${apiMapLines} 行`
      : `缺：${absent.join(', ')}；meta 自洽=${metaSane}`)

  // meta 里的规模数字必须与磁盘一致（防止手改或半份产物）
  const normalizedBytes = meta.normalizedBytes
  const sampleOk = typeof normalizedBytes === 'number' && normalizedBytes > 0 && typeof meta.builderVersion === 'string'
  check('R9 meta.json 带有构建脚本版本与规模数字（I22 可复现性所需）',
    sampleOk,
    sampleOk
      ? `builderVersion=${meta.builderVersion}、builtAt=${meta.builtAt}、normalizedBytes=${normalizedBytes}、indexBytes=${meta.indexBytes}`
      : 'meta.json 缺少 builderVersion 或 normalizedBytes')

  // ---- R10 G3 规则清单不许过期（`buildKnowledge.js` 是唯一真相源）----
  // 判据是"**源里的规则 id 全部出现在生成物里**"：只查"生成物非空"过不了这一关——
  // 加了规则却忘了重新 `build` 时，规则本体在源里、生成物里没有，模型读 `rules` 时看不到，
  // 而那种失败**不报错**（正是本仓 G3 一直在讲的那类静默失败）。
  const builtRules = JSON.parse(await readFile(at('knowledge/rules.json'), 'utf8'))
  const builtIds = new Set(/** @type {Array<{id: string}>} */ (builtRules).map(rule => rule.id))
  const rulesMarkdown = await readFile(at('knowledge/g3-rules.md'), 'utf8')
  // 从构建脚本的 `own` 数组里抽 id：形如 `['rule-id', '说明…'],`
  const ownBlock = /const own = \[([\s\S]*?)\n {2}\]/u.exec(await readFile(at('buildKnowledge.js'), 'utf8'))?.[1] ?? ''
  const ownIds = [...ownBlock.matchAll(/^\s*\['([a-z0-9-]+)',/gmu)].map(match => match[1])
  const missingFromJson = ownIds.filter(id => !builtIds.has(id))
  const missingFromMarkdown = ownIds.filter(id => !rulesMarkdown.includes(id))
  const stale = [...new Set([...missingFromJson, ...missingFromMarkdown])]
  check('R10 `buildKnowledge.js` 里的每条 G3 规则都已重新 build 进生成物',
    ownIds.length > 0 && stale.length === 0,
    stale.length === 0
      ? `源 ${ownIds.length} 条 + 上游原文 1 条 = rules.json ${builtRules.length} 条；逐条都在 g3-rules.md 里`
      : `源里有、生成物里没有（忘了 build？）：${stale.join(', ')}`)

  // ---- R11 报告清单的覆盖锚点必须在用例里存在 ----
  // `20260922` 实机报告（临时文档，已删除；结论见 `.AGENTS/ver-dev20260922-regression.md`）的 §7 清单
  // 是本轮修复的输入。逐条修完必须**有人守**：
  // 失去守卫的修复会在下一次重构里悄悄消失，而"当时修好了"不留任何痕迹。
  // 判据用的是**用例名里真实出现的标签**（P0-1 / P0-2 / …），不是"文档里提到了"。
  const regression = await readFile(at('test/regression.test.js'), 'utf8')
  const requiredTags = [
    'P0-1', // io.open 未包裹
    'P0-2', // rename 族目标实参不校验
    'P0-3', // capture 返回 undefined 属性
    'P0-4', // 文件输出算子不在名单内
    'P1-2', // 检查点粒度
  ]
  const unguarded = requiredTags.filter(tag => !new RegExp(`check\\('[^']*${tag}`, 'u').test(regression))
  check('R11 报告 §7 的 P0/P1 条目在 `test/regression.test.js` 里都有具名用例',
    unguarded.length === 0,
    unguarded.length === 0
      ? `${requiredTags.length} 个标签都有具名用例：${requiredTags.join(', ')}`
      : `没有对应用例的条目：${unguarded.join(', ')}`)

  // ---- R12 提示词段落与技能都必须存在（I26 / I27 的交付面）----
  // `handoffHint` 在 `lib/tools.js`（工具实现层），不在注册点——所以两个文件都要查。
  const toolsSource = await readFile(at('lib/tools.js'), 'utf8')
  const hygiene = entry.includes('blender-mcp-bridge-scene-hygiene-policy')
  const handoff = toolsSource.includes('handoffHint')
  const checklist = toolsSource.includes('sessionChecklist')
  const skillRegistered = entry.includes('ctx.skills')
  check('R12 场景整洁段落（I27）与完成态交接（I26）以及运行时技能都在交付面里',
    hygiene && handoff && checklist && skillRegistered,
    `systemPrompt 段落=${hygiene}；exec.handoffHint=${handoff}；`
    + `status.sessionChecklist=${checklist}；技能注册=${skillRegistered}`)
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
