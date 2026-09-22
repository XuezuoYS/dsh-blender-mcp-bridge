# 验证门禁

> 两档门禁：**入库测试**（`test/`，离线可跑）与**本地探针**（`diagnostics/`，需实机 Blender，不入库）。

## 1. 入库测试（`pnpm test`，不需要 Blender）

`test/` 由原 `diagnostics/checkRepo.js` 与 `diagnostics/auditCorpus.js` 迁入，
改用 `node:test`；这三者查的是"完整性 / 一致性 / 报告条目是否有人守"，属于随时可跑的回归门禁。

| 命令 | 覆盖 | 判据 |
|---|---|---|
| `pnpm check` | `tsc --noEmit -p jsconfig.json`：`index.js` + `lib/**` + `buildKnowledge.js` + `test/**` | **0 诊断**；`index.js` 不得再出现整文件 `@ts-nocheck` |
| `pnpm test` | `test/repo.test.js`（R1–R12，17 项）、`test/corpus.test.js`（A–E，15 项）、`test/regression.test.js`（`20260922` 报告逐条，25 项） | **57/57 通过** |

`pnpm typecheck` 是 `pnpm check` 的别名（旧文档/旧习惯仍可用）。

### `test/regression.test.js` 是什么、为什么必须在库内

`20260922` 实机报告（临时文档，已删除；结论在 [`ver-dev20260922-regression.md`](ver-dev20260922-regression.md)）
的 §7 清单是本轮修复的输入。修完必须**有人守**——
失去守卫的修复会在下一次重构里悄悄消失，而"当时修好了"不留任何痕迹。所以每一条 P0/P1
都有一个**具名用例**（标签就是 `P0-1` / `P0-2` / `P0-3` / `P0-4` / `P1-2`），
而 `R11` 反过来检查这些标签还在不在。

判据口径（来自报告 §6.3 的教训）：**这套护栏的静态可读性差于它的实际强度**——
审计以为 `copyfile` 能越界（实测被内部 `open` 拦了），以为 `makedirs` 没人管（实测 L2 拦了）。
所以每条覆盖都要有**能失败的断言**，而不是"读代码觉得接上了"。

**判据纪律**：改完门禁要用**注入验证它会失败**（例：故意加一个死配置键、故意去掉一条 G3 规则的生成物、
故意把 `capture` 的修复改回旧写法）。绿色本身不是证据——"永远绿"的门禁等于没有门禁。
本轮两次注入的记录见 [`README.md`](README.md) §5。

两条**被测出来**的自身错误（值得记住这类失败长什么样）：

1. 第一版 `P0-3` 断言用全文匹配找 `?? undefined`，结果命中的是**解释这个 bug 的注释**——
   假红。修法是先剥注释再断言（与 `R3` 的"注释假绿"同族，方向相反）。
2. 第一版 `P1-2` 断言认为 `during-write` 阶段应当回收旧份。**实现是对的、断言是错的**：
   I8 要求"先写第 n+1 份再回落"，因为写盘失败时先删会把旧历史一起丢掉（`keep=1` 时更会删空）。
   → 按"实现正确就改断言"处理，并把这条理由写进 `planRotation` 的文档注释。

## 2. 本地探针（`diagnostics/`，需要开着 add-on 的 Blender）

`.gitignore` 整体忽略 `diagnostics/`：**它们是设计期/实现期取证脚本，不属于交付物**，
官方仓库不含它们，因此文档里的验证章节只在本地开发时可用。

```sh
node diagnostics/probePreflight.js        # 可用性预检（没有 Blender 时其余探针 SKIP）
node diagnostics/probeEndToEnd.js         # 真的注册工具并逐个调用
node diagnostics/probeFindings.js         # 审计发现的逐条回归（含"探针不留场景残留"）
node diagnostics/probeGuard.js            # L2 机制层（含蓄意篡改）
node diagnostics/probeCapabilities.js     # 工具面压测（含故意越界以验证拦截）
node diagnostics/probeSettingsGuard.js    # 设置漂移检测 + 提示词段落
node diagnostics/probeTransport.js        # 帧格式与超时
node diagnostics/probeTaskRoot.js         # taskRootMode 各分支（活动工程未保存时少一条）
node diagnostics/scanProbe.mjs            # **纯 Node**，不需要 Blender：L1 扫描的 17 条人工核对用例
node diagnostics/linkcheck.mjs            # **纯 Node**：文档里的相对链接是否真的指向存在的文件
```

> **`linkcheck.mjs` 的来历**：把 `STATUS.md` 并进 `.AGENTS/README.md`、把审计记录从 `docs/` 搬进
> `.AGENTS/` 之后，**18 条相对链接静默失效**——而 `R4` 只查契约锚点、不查文件是否存在，门禁全绿。
> 这类"搬文件搬坏了链接"的失败正是本仓反复强调的那类：**没有判据就等于没有保护**。
> 它是纯 Node 的，所以以后可以随时跑（要变成入库门禁的话，写进 `test/` 即可）。

**`20260922` 那一轮改动后，实机探针尚未复跑**（本机那一轮没有把探针全跑一遍）。
新增的返回字段（`guard.window` / `guard.jobsRunning` / `handoffHint` / `blockedAll` / `partial` /
`sessionChecklist` / `checkpoint.perTurn` / `status.task`）都是**只增字段**，不会让旧用例失败，
但复跑时应当把它们逐个补进断言——[`README.md`](README.md) §7.2 第 17 项登记了这件事。

两条**实测须知**（都由本轮 commit 整理时的自查抓出来，值得固定成步骤）：

- **`diagnostics/` 不入库，所以它在任何新克隆里都不存在**。判据枚举目录时必须容忍缺失：
  `test/repo.test.js` 原先无条件 `readdir('diagnostics')`，门禁在别人机器上直接 `ENOENT` 崩掉
  （41 个用例只跑起来 1 个）。**"在我机器上能跑"不等于"仓库的门禁能跑"。**
- **行尾会随 `core.autocrlf` 变**（Git for Windows 默认 `true`）。任何按 `\n` 切分或按字节计数的
  判据都会在 CRLF 检出下失效——而那些判据在 LF 工作区里**永远是绿的**，看不出问题。
  `.gitattributes` 固定 `eol=lf` 只对**重新检出**生效，所以判据本身也必须对行尾不敏感。

验证这两件事的固定做法（不必改全局 git 配置）：

```sh
# 模拟新克隆：没有 diagnostics/，也没有 node_modules
git worktree add --detach --no-checkout /tmp/wt HEAD && cd /tmp/wt && git checkout HEAD -- .
node --test                      # 应全绿；修复前 test/repo.test.js 会 ENOENT 崩掉

# 模拟 CRLF 检出：把仓内文本文件整体转成 CRLF（.gitattributes 已让真检出是 LF，只能自己造）
#   node -e "…把 *.js/*.json/*.yml/*.md/*.jsonl/*.rst 的 \n 换成 \r\n…"
node --test                      # 应全绿；修复前 E1（字节数）与 R2a（/config:\n/）会红
```

> **为什么值得每次都做**：上面第二项当场暴露了**两个"假修复"**——E1 第一版按 `(?<!\r)\n`
> 数展开量（在 CRLF 文件上只匹配段落末尾，严重低估），regression 的剥注释按 `\n` 切行
> （行尾残留 `\r` 导致正则失配）。只看工作区里的绿灯，这两个缺陷会原样进仓库。

两条实测须知：

- **`probeCapabilities` 的"exec 只读"用例要求活动场景至少有一个物体**（断言 `result.n > 0`）。
  空场景下它会误报 FAIL——那是判据依赖场景，不是实现缺陷；用非空场景复跑即为全绿。
- 探针会自动跳过无 Blender 的环境：**环境缺失与被测能力失败是两件事**，
  混在一起会让"探针红了"这句话失去意义。

## 3. 知识库产物（`knowledge/`）

`knowledge/` 是**随包交付的只读资产**，`knowledge/rules.json` 与 `knowledge/g3-rules.md`
由 `node buildKnowledge.js build` 生成，**不得手改**（手改会在下一次 build 时被覆盖，
而且 `R10` 只查"源里的 id 都在生成物里"，查不出手改方向的反向漂移）。

```sh
node buildKnowledge.js build     # 归一化 + 建索引 + 写 meta.json / rules.json / g3-rules.md
node buildKnowledge.js verify    # 只校验指纹，不写任何文件（4,508 个 .rst 逐文件 blob 校验）
```

**加了 G3 规则就必须重新 `build`**：忘了的话规则本体在源里、生成物里没有，
模型调 `docs(mode=rules)` 时看不到——而 `R10` 就是为这个静默失败装的守卫（已用注入验证会红）。

## 4. 验收顺序（改动落盘后）

1. `pnpm check` → 0 诊断；
2. `pnpm test` → 全绿（`# 15/15` + `# 17/17` + `# 25/25`，共 57 项）；
3. 动过文档的路径/链接 → `node diagnostics/linkcheck.mjs` → 失效 0 条；
4. 改了知识库规则或 `buildKnowledge.js` → `node buildKnowledge.js build && node buildKnowledge.js verify`；
5. 有 Blender 时跑上面的探针，并把新字段补进断言；
6. 实机确认行为：一次 `exec(mutating:true)` 的任务目录出现在**活动 `.blend` 同级**，
   且 `status.existingTaskDirs` 能列出同级既有工作目录、**不创建任何目录**；
7. `blender_mcp_status` 的设置漂移为空（探针跑完必须与开局一致）。
