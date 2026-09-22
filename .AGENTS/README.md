# `.AGENTS/` — 工作记忆与实现状态

> 本目录是**记忆**，不是规范。规范与行为准则在 [`../AGENTS.md`](../AGENTS.md)；
> 仍然生效的契约在 [`../docs/contract.md`](../docs/contract.md)。
>
> 判据：**若一条内容改变会导致实现必须改变，它属于 `docs/contract.md`；否则属于本目录。**
>
> 本文件是整个交付树与工作记忆的**单一入口**（原先根目录的 `STATUS.md` 已并入这里）：
> 交付物做到哪一步、配置接线状态、实测结论、仍未验证的项，都在下面。
> 引用一律用 [`../docs/contract.md`](../docs/contract.md) 的锚点或不变量 ID，不写裸章节号。

---

## 0. 与其它文档的边界

| 位置 | 拥有 | 不拥有 |
|---|---|---|
| [`../docs/contract.md`](../docs/contract.md) | **契约、规则、不变量（I1–I27）** 的唯一权威来源 | 实现进度、历史决策过程、逐条取证 |
| [`../README.md`](../README.md) | 用户可见的说明、安装、配置、排错 | 规则推导过程 |
| [`../AGENTS.md`](../AGENTS.md) | AI 行为准则：基础安全需要、类型安全、注释风格、许可与 SPDX、git 约束 | 项目定位与设计理由 |
| [`../docs/architecture.md`](../docs/architecture.md) | 仓库结构、模块分层、运行路径（导读） | 规则本身 |
| [`../docs/upstream-facts-tools.md`](../docs/upstream-facts-tools.md) | 上游协议 / 工具契约 / 安全面 / 许可的逐条取证 | 本项目自己的规则 |
| [`../docs/upstream-facts-docs.md`](../docs/upstream-facts-docs.md) | 上游文档检索层（RST 解析与索引）的逐条取证 | 同上 |
| [`../docs/blender-5.2-findings.md`](../docs/blender-5.2-findings.md) | Blender 5.2 的实测事实（**G3 规则的直接依据**） | 契约、交付状态 |
| [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) | 上游语料的署名、许可与修改声明 | 设计理由 |
| `../.AGENTS/`（本目录） | **记忆 + 交付状态**：决策史、被证伪结论、事故、门禁、做到哪一步了 | 任何仍然生效的规则 |

## 1. 本目录的文件

| 文件 | 拥有什么 | 不拥有什么 |
|---|---|---|
| **本文件** | 交付物状态、配置接线状态、实测结论、待实测项、门禁结果 | 任何契约 |
| [`red-lines.md`](red-lines.md) | 从旧版 AGENTS.md 迁入的红线：安全措辞、包管理与交付形态、来源标注、标识符稳定、文档职责 | 当前生效的契约 |
| [`history.md`](history.md) | 决策过程、**已被证伪的旧结论**、被推翻的论证、事故复盘 | 任何仍然生效的规则 |
| [`design-review-v0.5.md`](design-review-v0.5.md) | 契约 v0.5 的逐条可执行性核查（**多数结论已被证伪或推翻**） | 同上 |
| [`audit-2026-09-20.md`](audit-2026-09-20.md) | `2026-09-20` 那次逐行审计的 F1–F15 原始记录（**部分结论已被后续实测推翻**） | 同上 |
| [`ver-dev20260922-regression.md`](ver-dev20260922-regression.md) | `20260922` 实机报告的**结论与判据修正**（实测绕过、静态可读性 < 实际强度、异步写窗口事故、产品定位缺口、上游建议、报告裁决） | 同上 |
| [`verification.md`](verification.md) | 门禁怎么跑、哪些是入库测试、哪些是本地探针、怎么注入验证门禁会红 | 测试用例本身（在 [`../test/`](../test/)） |

## 2. 什么时候写进来

出现下面任一条就记一条，**不要只留在对话里**：

1. 一个结论被实测**证伪**（尤其是曾被写进文档、当作设计依据的那种）；
2. 一次**事故**与它的复盘（改坏了什么、判据为什么没抓到）；
3. 一个**有代价的取舍**（选了 A 而不是 B，理由是什么、B 在什么条件下会重新变优）；
4. 判据口径的修正（"用什么证明这件事成立"变了）。

写作要求：**写清时间点与判据**，不要写成结论清单。
"某探针报告成功"不等于"它验证的机制成立"——被高估的结论要连着它当时**怎么被验证的**一起记。

---

## 3. 交付物状态

| 交付物 | 状态 | 备注 |
|---|---|---|
| `index.js`（入口 / Config / apply） | ✅ **可加载** | 注册 6 个工具；版本从 `package.json` 读；`apply()` 里注册运行时技能 |
| `lib/protocol.js` | ✅ 已实现 | 帧编解码、持续 drain、三类超时 |
| `lib/diagnostics.js` | ✅ 已实现 | 指纹握手、扩展清单只读解析、五级诊断、漂移计算 |
| `lib/slug.js` | ✅ 已实现 | 纯函数（保留中文、剥控制字符、避 Windows 保留名） |
| `lib/taskDir.js` | ✅ 已实现 | 属主标记、拒绝复用他人目录、界内判定、同级既有目录列举（`listTaskDirs`，只读） |
| `lib/checkpoint.js` | ✅ 已实现 | n+1 原子轮换、写盘失败硬失败、回滚来源选择、undo 基线、`perTurn` 粒度 |
| `lib/requestPolicy.js`（L1） | ✅ 已实现 | 写路径判定（**全部实参**）+ 文件输出算子 + 三项环境写入口 |
| `lib/writeOps.js` | ✅ 已实现 | 受控算子表的**单一真相源**（L1 与 L2 共用，禁止各写一份） |
| `lib/guardPayload.js`（L2） | ✅ 已实现 | `builtins.open` + `io.open` + os/shutil/pathlib 写删族 + `bpy.ops` / `bpy.data` 代理 + `_op_create_function` 透传 |
| `lib/tools.js` | ✅ 已实现 | 6 个工具的领域逻辑与结果规范化、聚合差分、完成态交接 |
| `lib/settingsGuard.js` | ✅ 已实现 | 会话基线比对（含 EEVEE / 非活动 scene 键） |
| `lib/knowledge.js` | ✅ 已实现 | 读 JSONL 索引；`api` / `search` 两种粒度；类成员可寻址 |
| `blender_mcp_status` | ✅ 已实现并实测 | 握手 + 风险姿态 + 回滚证据 + `existingTaskDirs` + `sessionChecklist`；可选参数 `task` |
| `blender_mcp_inspect` | ✅ 已实现并实测 | 集合 / 数据块计数 / 链接库 / 缺失引用 / 逐对象 |
| `blender_mcp_exec` | ✅ 已实现并实测 | L1 + 检查点 + L2 三层全通；`guard.window` / `guard.jobsRunning` / `handoffHint` / `partial` |
| `blender_mcp_snapshot` | ✅ 已实现并实测 | `copy=True`，会话 filepath 不变 |
| `blender_mcp_capture` | ✅ 已实现并实测 | 三目标如实报告；渲染设置被还原（I15） |
| `blender_mcp_docs` | ✅ 已实现并实测 | 三种 mode 全部可用；`api` 的深 2 类成员可寻址；大版本漂移带 `warnings` |
| `buildKnowledge.js`（根目录） | ✅ 已实现并实测 | `fetch` / `build` / `verify` 三个子命令全部跑通；规则源在这里 |
| `knowledge/`（语料 + 归一化 + 索引） | ✅ 已落盘 | 4,621 文件 / 16,229,930 B 语料；4,139 文件 / 69,122 段索引；`rules.json` 21 条 |
| `skills/blender-mcp-knowledge/` | ✅ 已实现 | `SKILL.md`：检索判定规则 + G3 小抄指向；**由 `apply()` 注册为运行时技能**（`source: 'runtime'`） |
| `test/`（离线门禁） | ✅ 已建立 | `pnpm test`：全语料审计 + 仓库一致性 + `20260922` 报告逐条回归；见 §6 |
| `diagnostics/`（本地探针） | ⚠️ 需复跑 | 整体不入库；本轮字段新增后**尚未在实机复核**，见 §7.3 |
| 死配置接线 | ✅ 已接线 | `portCandidates` / `allowPortScan` / `deferredTimeoutMs` / `maxResponseChars` / `rejectForeignPeer` / `checkpoint.perTurn` 全部有消费者 |
| `inspect` 的用途猜测 | ❌ 未做（**定位外**） | 缺失引用 / 链接库树已做；"用途猜测"要建模语义，属 [`../docs/contract.md#knowledge`](../docs/contract.md#knowledge) 明确不做的建模知识引擎 |
| 知识库的 `literalinclude` 示例通道 | ❌ **未修，已登记**（审计 F13） | 归一化语料有 45 处 `literalinclude:` 指针，但没有任何 mode 能读到被指的 `.py`（`buildKnowledge.js` 注释里的 "`examples[]` 通道" 不存在）。三条候选修法都要先改 [`../docs/contract.md#licensing`](../docs/contract.md#licensing) 的随包主张（I22），**留给用户决策**，不在本轮擅自改 |
| 探针在用户**活动场景**里留残留 | ✅ **已修**（审计 F15） | `probeCapabilities` 的 `SWEEP_PROBE` 与 `probeFindings` 的 `primitive_cube_add` 曾把物体留在未保存的 `.blend` 里。现在**建与删在同一次 exec 内**并回收自己的网格；`probeFindings` 新增全套开闭清单比对（判据用注入泄漏验证过**能失败**） |
| 结构化错误（`kind` / `operator` / `hint`） | ⚠️ 部分 | 已有 `kind` + `hint`（按结构性信号，不匹配本地化串；传输失败也走同一条路）；无 `operator` |
| `changes` 与 `risk_notes` | ✅ 已实现 | 由 L2 收尾时的指纹差分产出（**增/删/改**三向，聚合形状有界） |
| 版本漂移 `drift` 字段 | ✅ 已接线 | `status` 与 `docs` 都用会话实际版本比对语料版本；大版本漂移另带 `warnings` |
| 偏好 / add-on 写入口纳入 L2 | ✅ 已实现并实测 | L1 拦字面量、L2 拦动态构造（三项） |
| deferred 通道 | ✅ 已接线 | 两段读取：`check_is_finished` 存在时用 `deferredTimeoutMs` 等最终结果（**它只是读窗口，不是"能跑长渲染"的许可**）。详见 [`../docs/blender-5.2-findings.md`](../docs/blender-5.2-findings.md) §1 |
| `LICENSE`（GPL-3.0 全文） | ✅ 已完成 | 已与权威副本逐字节校验一致 |
| `THIRD_PARTY_NOTICES.md` | ⚠️ 需更新 | 语料 pin 与逐文件 blob sha 已在 `knowledge/meta.json`；NOTICE 里的规模数字待同步 |
| 全量 SPDX 头（新写的 `.js` 首行） | ✅ 已完成 | `index.js`、`buildKnowledge.js`、`lib/*.js`、`test/*.js`、`diagnostics/*.js` 首行均已带 |

**当前没有阻塞性缺陷**：`index.js` 的全部静态 import 都能解析，插件可加载。

---

## 4. `20260922` 实机报告的修复落地（逐条 + 守卫）

> 输入：那份 `20260922` 外部实机报告（**临时文档，已按用户指示删除**；它的实测事实与判据修正
> 已提炼进 [`ver-dev20260922-regression.md`](ver-dev20260922-regression.md)，以及下面的逐条修复表）；
> 记忆与判据修正：[`ver-dev20260922-regression.md`](ver-dev20260922-regression.md)。
> **判据纪律**：下面每一条都指向一个**能失败的用例**（[`../test/regression.test.js`](../test/regression.test.js)
> 或 [`../test/repo.test.js`](../test/repo.test.js)），不接受"读代码觉得接上了"。注入验证见 §5。

### P0（报告 §7）

| # | 问题 | 修法 | 守卫用例 |
|---|---|---|---|
| P0-1 | `io.open` 未被包裹，越界写**成功** | `_dsh_install()` 把 `builtins.open` 与 `io.open` 指向**同一个**钩子（CPython 里 `io.open is builtins.open`，两个名字分别钩会递归），钩子内部只调首次捕获的原始实现；残留自查与卸载一并纳入 | `P0-1 io.open 字面量越界写被 L1 拒绝`、`P0-1 裸 open 与 io.open 判定一致`、`P0-1 符号模式不被静默放行` |
| P0-2 | rename/replace/move/copyfile **目标实参**不校验 | L2 拆成 `_dsh_make_paths_hook`（**全部路径实参任一越界即拒**）与 `_dsh_make_write_hook`（单目标，例如 `os.open(path, flags)` 的 flags 不能一起判）；L1 的 `DELETE_PATTERN` 改为逐实参判 | `P0-2` 六条（`os.rename` / `os.replace` / `shutil.move` / `copyfile` / `copytree` / `os.truncate`）+ 界内放行一条 |
| P0-3 | `capture(window)` 永久报"非无损 JSON" | 去掉 `payload.restored ?? undefined`（`null ?? undefined` 会产出值为 `undefined` 的**属性**）；三个目标分支都结算 `_restore()` | `P0-3 capture 的代码里不再有 ?? undefined`、`P0-3 三个分支都结算 restore` |
| P0-4 | 文件输出算子不在名单内 | 新建 [`../lib/writeOps.js`](../lib/writeOps.js) 作**单一真相源**（`CONTROLLED_OPS` + `FILE_OUTPUT_OPS`），L1 与 L2 共用；L2 另加 `bpy.data` 层代理盖住 `libraries.write` | `P0-4` 三条 + `L2 载荷从 writeOps.js 取算子表` + `写操作表覆盖报告点名的四条路径` |

### P1（报告 §7）

| # | 问题 | 修法 |
|---|---|---|
| P1-1 | 异步渲染越过护栏窗口写盘 | `exec.guard.window` 如实给出窗口边界；`guard.jobsRunning` 列出仍在跑的后台任务；`risk_notes` 明确"它们的落盘在窗口之外" |
| P1-2 | 一轮只落一份检查点 | 新增 `checkpoint.perTurn: 'turn' \| 'write'`；文件名支持 `turn-{T}-{seq}.blend`；`maxBytes` **真正参与收尾轮换**（超限旧份优先回收）——守卫：`P1-2` 五条 |
| P1-3 | `status` 看不到自定义任务名 / `roundHasCheckpoint` 假 | `status` 新增可选参数 `task`；`roundHasCheckpoint` 改为**内存登记 ∪ 磁盘**（磁盘上有 `turn-{T}*.blend` 就报 true） |
| P1-4 | L3 看不见**就地修改** | `_dsh_snapshot()` 给每个对象/数据块加 `fp`（`sha1(repr)` 前 12 位）；差分新增 `objectsModified` / `dataBlocksModified` 与 `risk_notes` 样例 |
| P1-5 | 漂移键集小于声明 | `TRACKED_SETTINGS` / 采集代码补齐 `colorDepth` / `threadsMode` / `eeveeTaaSamples` / `eeveeUseRaytracing` / `eeveeUseVolumetrics` 与**非活动 scene** 的 `name+engine` |
| P1-6 | 返回体把整批新增对象逐条回显 | `changes` 增/删/改改为聚合形状（`{count, byType, sample≤10}` + `*Truncated`），**字段名不变**（I23） |
| P1-7 | 传输异常直抛 traceback | `sendStructured()` 把传输失败也变成 `{kind:'transport-failed', message, hint}`（与其它失败同一条路） |
| P1-8 | 死 patch 行无告警 | **本仓外**（DSH 加载器 / `plugin_manager` 的行为），只登记为上游建议：[`ver-dev20260922-regression.md`](ver-dev20260922-regression.md) §6 |
| P1-9 | `SKILL.md` 不可发现 | `apply()` 里用 `ctx.skills.register()` 注册为**运行时技能**（`source:'runtime'`，正文仍读 `SKILL.md` 单一真身）；缺 `skills` 服务时只退回文件、不阻断加载——守卫：`R12` |

### P2（报告 §7）

| 项 | 修法 |
|---|---|
| partial-failure 无提示 | 异常结束且差分非空 → `partial: true` + `warnings` 说明"改动已保留、可回滚到检查点" |
| `checkpoint.maxBytes` 只告警 | 见 P1-2（参与收尾轮换） |
| `'during-write'` 是死代码 | 复归其**真实语义**（`writeNext`），并删掉与之重复的私有回收函数；`writeNext` 不再是常量 |
| `os.truncate` / `shutil.copytree` | 见 P0-1 / P0-2 |
| `hintFor()` 注释与实现不符 | 注释改为"`Traceback` 是 Python 自己产生的、语言无关的结构性标记；**不得**用它匹配 Blender 的产品提示串" |
| 每次 exec 5 次 socket 往返 | 合并"指纹 + cwd + 渲染设置"为**一次**执行前读取（`readRuntimeContext`）→ **5 次降到 3 次**（执行前 1 + 执行 1 + 执行后设置 1）；顺带把"基线必须在改动之前取"从注释变成代码结构 |
| `managers` / `turns` 无上限 | 未做（见 §7.2 待办第 15 项）——登记为已知项，不假装已修 |

### 产品定位缺口（报告 §4 / §5）

| 项 | 修法 |
|---|---|
| 命名 / 集合分层 / 布线 / 灯光秩序 **0 句引导** | 新增系统提示词段落 `blender-mcp-bridge-scene-hygiene-policy`（order 895），并把要求写成 **I27**（可自检的判据，不规定美学） |
| **完成态**交接缺失 | `exec.handoffHint`（每次返回都在）+ `status.sessionChecklist`，并写成 **I26**——明确区分"拒绝态的接管话术"与"完成态的交接" |

### 知识库（报告 §8）

`buildKnowledge.js` 的 `buildRules` 新增 9 条（8 条 5.2 契约 + `render-needs-write-still`），
每条都写明"**照旧写法会怎么失败**"。生成物已重建：`rules.json` **21 条**（20 条自有 + 1 条上游原文），
`g3-rules.md` 同步。守卫：`R10`（源里的每条 id 都必须出现在生成物里——加规则忘 `build` 会红）。

`node buildKnowledge.js verify` → **校验通过**（语料 pin `ff54e4d8…`，4,508 个 `.rst` 逐文件 blob 校验）。

---

## 5. 注入验证：门禁真的会红

**绿色本身不是证据**。本轮对两条关键判据做过注入（改完即还原，`git status` 已确认无残留）：

| 注入 | 期望 | 实测 |
|---|---|---|
| 从 `knowledge/rules.json` 删掉 `camera-pitch-sign`（模拟"加了规则忘了 build"） | `R10` 报 FAIL | ✅ `FAIL R10 …` + `✖`，退出码非 0 |
| 把 `capture` 的修复改回 `restored: payload.restored ?? undefined` | `P0-3` 报 FAIL | ✅ `FAIL P0-3 capture 的代码里不再有 ?? undefined` |

同一份判据还暴露了**两个我自己的错误断言**（`during-write` 的回收份数、`?? undefined` 的注释误匹配），
已按"实现正确 → 改断言"的原则修正——见 [`ver-dev20260922-regression.md`](ver-dev20260922-regression.md)。

---

## 6. 配置接线状态

对照 [`../docs/contract.md#config`](../docs/contract.md#config) 的键全集。**I12：不允许死配置。**

| 键 | 状态 | 说明 |
|---|---|---|
| `host` / `port` | ✅ 已接线 | 传输与诊断 |
| `connectTimeoutMs` / `responseTimeoutMs` | ✅ 已接线 | 传输 |
| `requireVersionMin` | ✅ 已接线 | `status` 门控 + `exec` 前置检查 |
| `rejectForeignPeer` | ✅ **已接线** | `status` 与 `exec` 都读它 |
| `maxResponseChars` | ✅ **已接线** | `exec` 的 stdout/stderr 截断 |
| `taskRoot` / `taskRootMode` | ✅ 已接线 | 任务目录根；默认 `blendFile`——产出落在活动 `.blend` 所在目录下（探针 4/4）。显式 `taskRoot` 优先级最高 |
| `checkpoint.enabled` / `.keep` / `.maxBytes` / `.perTurn` | ✅ 已接线 | 检查点（`closeRound` 在 `turn/end` 触发）；`perTurn` = 一轮一份 / 每次写各一份 |
| `intercept.enabled` / `.guardThreadScope` | ✅ 已接线 | 传给 L2 载荷 |
| `knowledge.maxHits` / `.maxCharsPerHit` | ✅ **已接线** | `docs` 三种 mode 都读它 |
| `expose.status` / `.exec` / `.inspect` / `.capture` / `.snapshot` / `.docs` | ✅ 已接线 | 六个注册开关 |
| `portCandidates` | ✅ **已接线** | 仅当 `allowPortScan` 为真时作为候选；**要求握手成功才采纳** |
| `allowPortScan` | ✅ **已接线** | 默认 `false`：静默连到别的服务比连不上更危险 |
| `deferredTimeoutMs` | ✅ **已接线** | 两段读取的第二段窗口（代码出现 `check_is_finished` 时启用） |

**已删除的键**（不再出现在 schema / YAML / README 中）：

| 键 | 删除理由 |
|---|---|
| `knowledge.source` | 知识库是交付事实，不是配置（[`../docs/contract.md#core-decisions`](../docs/contract.md#core-decisions) / I21） |
| `knowledge.cacheDir` | 索引是随包交付的只读资产，不存在"按源指纹分目录的缓存" |
| `knowledge.includeManual` | 手册必定随包（[`../docs/contract.md#knowledge-corpus`](../docs/contract.md#knowledge-corpus)） |

---

## 7. 实测结论与仍未验证的项

契约已定但**尚未在真实环境验证**的项。**未验证前不得在 README 或工具描述里声称可用。**

### 7.1 已实测结论（本机 Blender 5.2.2 LTS，活动 GUI 会话）

| 项 | 实测结果 |
|---|---|
| 上游弱沙箱确实包装 `_op_create_function` | ✅ 确认：其值是 `WeakSandboxForLLM.ops_blocked_store.<locals>._filtered_op_create_function`——这正是禁止包装它的理由 |
| `bpy.ops` 模块级代理可行 | ✅ `type(bpy.ops).__name__ == '_OpsProxy'`，且读写透传 `_op_create_function` 成立 |
| 非名单算子委托 | ✅ `bpy.ops.wm` 可见 121 个算子，非名单算子正常取得（`BPyOpFunction`） |
| **三种截图目标的可用性** | ✅ socket exec 下 `context.area`/`region` 为 `None` → `viewport` 与 `area` **不可用**（如实报 `captured:false` + 原因）；`window` **目标可用、文件确实写出**（306,551 B）。⚠️ 报告发现它的**返回体**曾因 `undefined` 属性报失败——已修（P0-3） |
| 检查点原子轮换 | ✅ `turn-{T}.blend` 落盘；同轮第二次写复用同一份（`perTurn='turn'`） |
| `undo_push` 可用 | ✅ 返回 `undo-push` 通道；基线与 `isDirty` 一起落到 `reports/` |
| **undo 栈是否可观测** | ❌ **实测不成立**：5.2 的 Python API 不暴露 undo 栈——`Scene.undo_history` 与 `WindowManager.history_active` **都不存在**；`bpy.app.memory_usage_undo()` 只对 `ed.undo_push` 跳变（991046 → 1101578），对 `mesh.primitive_cube_add` / `object.delete` / 属性写入**完全不敏感**。已改为如实报告 `measurable: false`（逐项数据见 [`../docs/blender-5.2-findings.md`](../docs/blender-5.2-findings.md) 的"undo 栈对 Python 不可观测"一节，规则在 [`../docs/contract.md#checkpoint-undo`](../docs/contract.md#checkpoint-undo)） |
| 端口扫描找到的对端是否被沿用 | ✅ **实测修复**：原先 `diagnose` 返回 `activePort` 而所有工具仍打配置端口；现在扫描成功的端口进入会话缓存，`status` / `exec` / `inspect` 共用同一端点 |
| `copy=True` 不改会话 filepath | ✅ 实测：保存后 `bpy.data.filepath` 仍是原路径 |
| L1 越界写 | ✅ 拒绝且**代码从未进入 Blender**（目标文件确实不存在） |
| L2 动态构造路径兜底 | ✅ 拦到 `write-outside-scope` |
| L1/L2 环境写入口 | ✅ L1 拦字面量（`environment-change`），L2 拦动态构造 |
| 检查点写盘失败即拒绝 | ⚠️ 尚未构造失败场景（磁盘满 / 权限不足）验证 |
| **渲染通道**（报告 §3） | ✅ `render()` 不带 `write_still` **静默空转**（`FINISHED` / 0×0）；`render('INVOKE_DEFAULT')` **异步**。唯一可靠姿势是 `write_still=True`。详见 [`../docs/blender-5.2-findings.md`](../docs/blender-5.2-findings.md) §1 |

### 7.1a 知识库实测（语料已落盘）

| 项 | 实测结果 |
|---|---|
| 语料规模 | ✅ **4,621 文件 / 16,229,930 字节**（`.rst` 4,508；`examples/*.py` 112 / 184,547 字节） |
| 归一化产物 | ✅ 4,139 文件（排除 369 个导航页 `index.rst`）/ **69,122 段** / 14,725,671 字节 |
| 索引体积 | ✅ 30,799,578 字节 = 归一化的 **2.09×**（验收上限 2.1×）；文件级 token 存**全局词表 id**（67,342 个词）而非字符串 |
| **单次检索耗时** | ✅ `api` 与 `search` 各 **139–164 ms**，显著优于上游无索引时的 0.39–1.22 s；主要开销是**进程内载入索引**，不是查询 |
| **深 2 类成员可寻址** | ✅ **`bpy.types.Scene.frame_current` 返回 `kind: definition`**——上游在同一文件上返回 `partial`，这是它的行为缺口，我们不继承 |
| 通配列举 | ✅ `bpy.types.Scene.*` 返回 188 个候选 |
| **未识别 directive 清单** | ✅ 全语料只剩 **5 类**：`list-table`×527、`todo`×53、`math`×11、`container`×30、`include`×25。**5.2 新增的 `.. details::` 已被显式处理**，不再是缺口 |
| `include` 展开 | ✅ 245 处里 220 处成功展开（`api/bmesh.rst` 归一化后 1,109 → 5,872 字节），25 处登记为未识别 |
| 索引损坏路径（I17） | ✅ 实测：移开 `files.jsonl` → `available:false` + 可执行指引、不报 `isError`；放回后立即恢复 |
| G3 规则条数 | ✅ `rules.json` **21 条** = 20 条自有 + 1 条上游 `prompts.yml` 原文；守卫 `R10` |

### 7.1b 全语料审计（[`../test/corpus.test.js`](../test/corpus.test.js)，**15/15**）

**不再只人工看三个文件**：4,508 个 `.rst` 全部过一遍，逐文件比对产物。审计途中发现并修掉 4 个真缺陷：

| # | 缺陷 | 症状 | 修法 |
|---|---|---|---|
| 1 | 索引的 token 袋**不含段落限定名** | `bpy.ops.object.add` 不会被切成 `object`/`add`，按词检索整片漏 | match surface 加入 `segment.name` / 目录名 |
| 2 | **directive 名与原始签名不进 token 袋** | `toctree` / `staticmethod` / `classmethod` 这些只出现在 directive 标记里的词，全语料 **8,418 个词**不可检索 | 收集 directive 名与原始签名 |
| 3 | **目录名不进 token** | `api/bpy.ops.action/…` 这类目录只以目录形式存在，199 个标识符检索不到 | 把路径各级拼成可分词文本 |
| 4 | token 存字符串导致索引超限 | 33.8 MB = 2.29×（超 2.1× 上限） | 全局词表 + 整数 id，降到 **2.09×** |

覆盖的检查（每条都有可复核的判据）：A1/A2 覆盖一一对应（4,139/4,139）；A3/A4 索引行与段落形状；
A5/A6 token 覆盖与 df 同源（缺 0 个）；A7 词表无重复、id 不越界；B1/B2 无空产物、压缩比中位 **0.847**；
C1 类型级召回均值 **100.00%**（低于 90% 的文件 0/4,139）；C2 按文件定位索引缺口 0 个；
D1/D2/D3 directive 全部归类、未识别 **2.26%**（853/37,799）、登记名真实存在；
E1 归一化字节数与 `meta.json` 逐字节吻合。

### 7.1c 仓库一致性审计（[`../test/repo.test.js`](../test/repo.test.js)，**17/17**）

| 检查 | 结果 |
|---|---|
| R1 `package.json` 的 `files` 每一项都真实存在 | ✅ 10 项 |
| R2a/R2b/R2c schema ↔ `cordis.patch.yml` ↔ README 三方键一致；已删除的键未复活 | ✅ 16 个顶层键三方一致 |
| R3 **每个叶子配置键都有消费者**（I12：无死配置） | ✅ 30 个叶子键。**判据本身被验证过**：注入 `deadTopLevel` / `knowledge.deadLeaf` 后 R3 报 FAIL |
| R4 全仓引用 `../docs/contract.md` 的锚点都能解析 | ✅ 35 个锚点、**0 悬空**；被检文件清单**从磁盘枚举**，不手写 |
| R5 新写的 `.js` 首行都带 SPDX | ✅ 24 个文件 |
| R6a/R6b README 与工具描述无「安全沙箱 / 已保护数据」式措辞 | ✅ |
| R7/R7b/R7c 6 个工具名在注册点 / README / 本文件三处一致；未把未实现说成可用；**根目录不再出现 `STATUS.md`**（状态只有本文件一个入口） | ✅ |
| R8/R9 `knowledge/` 随包产物齐备、`meta.json` 自洽且带 `builderVersion` | ✅ 4,621 条 blob 记录 |
| **R10** `buildKnowledge.js` 里的每条 G3 规则都已重新 build 进生成物 | ✅ 源 20 条逐条命中（**注入验证过会红**） |
| **R11** 报告 §7 的 P0/P1 条目在 `regression.test.js` 里都有具名用例 | ✅ 5 个标签 |
| **R12** 场景整洁段落（I27）/ 完成态交接（I26）/ 运行时技能都在交付面里 | ✅ |

> **R3 为什么必须剥注释、还要排除 schema 声明**（返工中实测，审计 F11 的延伸）：
> 第一版改完"只测叶子键"后依然全绿，因为判据是 `\b<leaf>\b` 全文匹配 ——
> JSDoc 里一句 `@property {number[]} portCandidates` 就算"有消费者"，
> 而 schema 自己的 `maxHits: Schema.number()` 也算。于是**先剥注释与 JSDoc、再把 schema 块挖掉**，
> 才让死键真的暴露。教训：**改完门禁要用注入验证它会失败**，绿色本身不是证据。
> （同族教训在 `regression.test.js` 里又反向出现一次：断言命中了**解释 bug 的注释**，假红。）

### 7.1d 长任务（deferred）实测 → **结论已作废**

> ⚠️ 本节保留的是一份**过时结论**。当时探针报「8/8 通过」，但后续实测证明
> `INVOKE_DEFAULT` 在本通道下**同步阻塞**、deferred 分支从未触发；
> 而 `20260922` 报告又推翻了那条"同步阻塞"本身（见 [`history.md`](history.md) §5.6）。
> 现行结论与全部 Blender 5.2 实测发现已移入
> [`../docs/blender-5.2-findings.md`](../docs/blender-5.2-findings.md)。
>
> 当时的探针 `diagnostics/probeScene.js` 是**场景专用**的（硬编码已删场景的 `TY_` 前缀），
> 且自身会临时改渲染设置，已在发布清理中删除。

当时的观察（**已被推翻，勿据此设计**）：`INVOKE_DEFAULT` 返回 `RUNNING_MODAL` 且 `is_job_running` 为真
（当时判为"同步阻塞期间读到"）；`check_is_finished` 两段读取生效（当时判为生效，实为第一段就已带最终结果）；
长任务产出渲染文件 1,428,804 字节（文件确实产出，但这不证明 deferred 生效）；
B1–B5 场景几何自检（通用结论仍成立，但探针已删，**不可复现**）。

**保留下来的两条真实教训**（仍然有效，已写进 [`../knowledge/g3-rules.md`](../knowledge/g3-rules.md)）：

1. **会话 id 决定 allowRoot**：驱动器与探针一度用了不同 sessionId，第二个会话被分到
   `.dsh-blender-*-2`，于是 L2 护栏把第一个会话的目录判为"越界"并拒绝写入——
   这是 I8 会话隔离在正确工作，但**跨多次调用驱动同一场景时必须固定 sessionId**。
2. **"临时改设置再还原"的还原点必须在改动之前读**：探针在改动后才取快照，把分辨率"还原"成
   960×540 的中间态，最终出图被污染。这条在 §7.1o 被升级成了明确的设置约定。

### 7.1e 已装入当前 profile 并实测可用

插件已通过 `plugin_manager install_bundle` 装入 `web` profile（`installed: true`、`enabled: true`、
行 id `blender-mcp-bridge`），安装过程中修掉了两处真实的加载期缺陷：

| 症状 | 真因 | 修法 |
|---|---|---|
| `YAMLException: end of the stream or a document separator is expected (5:9)` | `cordis.patch.yml` 用了 **`//` 注释**——那是 JS 语法，YAML 只认 `#` | 改为 `#` |
| `ValidationError: $.requireVersionMin expected string but got 5.1` | 未加引号的 `5.1` 被 YAML 解析成**数字**，schema 要字符串 | 写成 `'5.1'` |

> ⚠️ **装载期的一条旧提示已被证实是错的**：曾在别处写过"工具面在会话启动时固定、必须重启 harness"。
> 实测（报告 §1.2）：`patchReload: live` 下 `install_bundle` 返回 `applied` 后**同一轮即可调用**。
> 只有改 profile 的 `bundles` 列表或路径才需要重启。README 的排错表已按此修正。

### 7.1o 渲染/导出设置的软限制

**起因**：为出预览图，本插件改过用户的 `cycles.samples`（钉成 256）、
`frame_start/frame_end`（留成探针值 1–2）、`view_settings.exposure`（固化成 -0.45）、
`render.filepath`（指向任务目录），并且把这些**写进了交付状态**。用户没有要求过。

**实现分两层**：

| 层 | 落点 | 作用 |
|---|---|---|
| 提示词（软限制） | `index.js` 的 `systemPrompt.section('blender-mcp-bridge-settings-policy', order 900)` | 说明默认不动、为什么不该动、要动必须先问清数值 |
| 可见性 | [`../lib/settingsGuard.js`](../lib/settingsGuard.js) + `status.renderSettings/settingsBaseline/settingsDrift` + `exec.settingsDrift` | 会话基线比对，漂移同时进 `warnings` |

**提示词写法上的一次失败与修正（值得记）**：第一版把「三种例外」列在前面，
读起来像**许可清单**——"满足条件就可以改"，约束力反而弱。改后的写法是
**先讲清代价**（改了帧范围会让用户下次只渲染到 2 帧、且他会以为是工程坏了；
以及"用户发现 AI 顺手改出图参数后就不敢让你碰真实项目"），把默认立场说死，
例外放到最后并加上"要先问"的门槛。这是**推测，不是实测**——效果需要真实任务观察。

**探针**（`node diagnostics/probeSettingsGuard.js`，上一轮 **11/11**；本轮未复跑）验证了：
提示词段落真的注册进 `systemPrompt`；故意改 5 项设置会被逐个报出（`[exposure, frameEnd, frameStart, resolutionX, samples]`）；
漂移带 from/to 具体数值并进 `warnings`；改回后漂移重新为空；`status` 报同一组字段。

> **其中两条曾是真实的破坏**（审计 F15 的同族）：两个还原块都写成
> `` `_s.cycles.samples = ${original?.samples ?? 256}` `` 这类插值——
> 一旦开局的 `status` 没读到设置（add-on 抖动、版本门控失败），`original` 是 `undefined`，
> 于是这条"**还原**"会把 256 / 1920 / `frame_end=1` 这样的**编造值盖进用户的真实工程**
> （现场真实值是 samples=2048、帧 1–600）。以还原为名的破坏比不改更糟，
> 因为它看起来是在履行"必须还原"的约定。
> 现在 `restoreCode()` **只还原真的读到的键**，读不到一个都不写，并让用例失败；
> 键清单收进 `RESTORE_KEYS` 单一真相源（原先第一个还原块还**漏了 `resolution_y`**）。

**⚠️ 一处未实现（如实说明）**：会话基线在**第一次 `exec`** 时建立，
所以如果插件在会话第一个 `exec` 之前就已经改过设置，基线会是"已改后"的值。
更可靠的做法是从 `.blend` 里读保存的设置，但**实测不可行**：
`bpy.data.libraries.load(当前文件)` 报 `ValueError: Cannot load from the current blend file.`。
`wm.open_mainfile` 能读检查点，但会丢掉当前未保存的编辑，代价更大。

**⚠️ 一处尚未复跑**：`20260922` 之后新增了 `colorDepth` / `threadsMode` / `eevee*` / 非活动 scene 等
漂移键与 `sessionChecklist` / `guard.window` 等字段。它们是**只增**的，但"没跑过"就是没跑过。

### 7.1n 能力面压测（`node diagnostics/probeCapabilities.js`，上一轮 **16/16**）

把插件的每条路径都真的走一遍，**含故意违规**以验证拦截确实生效：`status` 风险姿态与 drift；
`inspect` 场景快照；`docs` 检索；`snapshot` 受控存盘（会话 filepath 前后一致）；
`capture` 窗口截图；`exec` 只读**不落检查点**、写落检查点且 `guard.verified=true`；
同轮第二次写复用检查点；L1 越界写 / 覆盖保存 / 环境改动三条拒绝且**目标文件确实不存在**；
L2 动态路径兜底；大结构化响应不被截断；Python 异常给结构化 `kind`/`hint`；产物只落任务目录内。

> **压测暴露的一处真实行为**：`exec` 的代码里**没有 `import bpy` 时会返回空 `result`**。
> 这不是缺陷——`bpy` 不在 exec 命名空间的默认绑定里，用户代码必须自己 import；
> **工具描述里已写明**这一点（原待办 §7.2 第 14 项，已闭环）。

### 7.2 仍未实测

| # | 项 | 影响 |
|---|---|---|
| 1 | **交互（GUI timer）模式整体未实测**：协议探针与验收全部走的是活动 GUI 会话的 socket，但活动/空闲间隔的真实生效组合仍未测 | 超时阈值取值 |
| 2 | 空闲后首次请求的延迟特征（旧记录称约 900 ms，在后台实例上**未能复现**） | 该数字仍**存疑**，不得写死 |
| 3 | **30 s 分片写路径**：「客户端停止 drain + 响应大于内核发送缓冲」未复现 | `_SEND_TIMEOUT` 实际行为 |
| 4 | 大响应（> 1 MB）在 Windows 上的 drain 稳定性 | 截断阈值 |
| 5 | 并发连接的串行化行为（backlog = 5） | 多会话并发 |
| 6 | 模态算子运行中发起请求的表现 | 诊断文案 |
| 7 | `bpy.data.*.remove()` 运行时统计的噪声水平 | `risk_notes` 可用性（差分已实现，噪声未评估） |
| 8 | **L2 拦截窗口之外（异步 / 延迟写）的逃逸面** | 现在**可见**（`guard.window` + `guard.jobsRunning`），但**约束不到**——设计边界，不是缺陷 |
| 9 | 多会话并发时检查点文件名的**稳定会话标识**形式（现用 `session-<sanitized id>`，未在多会话下验证） | I8 的落地形式 |
| 10 | 典型场景下检查点耗时与磁盘占用（实测单份 100–280 KB / 数百对象场景，远未到压力场景） | 体积告警默认阈值 |
| 11 | EEVEE 在后台模式下的可用性 | 渲染路径 |
| 12 | `wm.open_mainfile` 的偏好上下文与 `check_existing=False` 实际行为 | 回滚入口 |
| 13 | `save_as_mainfile(copy=True)` 对 `is_dirty` 的影响 | 与 `undo` 前置条件的关系 |
| 14 | **`bpy` 必须由用户代码自己 `import`**（已闭环：工具描述已写明） | ✅ 已接线 |
| 15 | **`managers` / `turns` 两个 Map 无上限**：长会话里每个（会话 × 任务目录）留一个 `CheckpointManager`，`turns` 每会话一条，进程内只增不减 | 内存占用（报告 §7 P2 点名；**未修，如实登记**） |
| 16 | 检查点写盘失败场景（磁盘满 / 权限不足）下"拒绝执行"的实际表现 | I1 的失败路径 |
| 17 | **实机探针按新字段复跑**：`probeEndToEnd` / `probeGuard` / `probeFindings` / `probeSettingsGuard` / `probeCapabilities` 需逐个复核并补断言 | 门禁的实机那一半 |

### 7.3 知识库（数据已落盘，以下为**仍未验证**的项）

| # | 项 | 影响 |
|---|---|---|
| 1 | **G3 小抄是否真的减少试错轮次**：规则条目的效果只能靠真实任务观察 | [`../docs/contract.md#knowledge-granularity`](../docs/contract.md#knowledge-granularity) 的效果验证 |
| 2 | **归一化正文的解析保真度**：只人工抽查了 `bmesh.rst` / `bpy.ops.object.rst` / `bpy.types.Scene.rst`，全语料审计是**机械口径**（词袋召回），不等于语义保真 | 是否有 content 被解析器误吞 |
| 3 | **`data/api/` 的上游 ref 与确切许可** | [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) 的存疑项 |
| 4 | **运行时技能是否真的被技能目录列出**：`ctx.skills.register()` 的接线已实现，但**未在实机会话里确认它出现在技能列表** | P1-9 的效果验证 |

---

## 8. 端到端验收结果

`diagnostics/probeEndToEnd.js` **真的调用 `apply()`、真的注册工具、真的逐个调用**（不是静态检查）。
离线门禁在 [`../test/`](../test/)：`corpus.test.js`（全语料，15/15）、`repo.test.js`（仓库一致性，17/17）、
`regression.test.js`（`20260922` 报告逐条，25/25）——`pnpm test` 即可跑，**共 57/57**，不需要 Blender。
实机套件还有 [`../diagnostics/probeFindings.js`](../diagnostics/probeFindings.js)（**需按新字段重跑**，不入库）。

> ⚠️ **下表是上一轮的实机记录**（当时 30/30）。本轮新增的字段（`guard.window` / `guard.jobsRunning` /
> `handoffHint` / `blockedAll` / `partial` / `sessionChecklist` / `checkpoint.perTurn` / `status.task`）
> **尚未在实机探针里复核**——它们是只增字段，不会让旧用例失败，但**"没跑过"就是没跑过**，
> 所以这里保留旧结论并明确标注待复跑（§7.2 第 17 项）。

| # | 用例 | 结果 |
|---|---|---|
| 1 | 注册 6 个工具（名字与契约一致） | ✅ |
| 2 | 6 个工具定义的结构完整（补类型检查覆盖不到的注册点） | ✅ |
| 3 | 必填参数在 schema 的 `required` 里如实声明 | ✅ |
| 4 | 并发安全声明与工具性质一致（只读可并发、写不可并发） | ✅ |
| 5 | `status` 握手成功且给出风险姿态 | ✅ |
| 6 | `status` 只读工具不创建任务目录（I14） | ✅ |
| 7 | `inspect` 只读快照可用 | ✅ |
| 8 | `exec` 只读：返回结果且**不落检查点** | ✅ |
| 9 | `exec` 写任务目录内：落检查点、`guard.verified=true`、**不被误报为篡改** | ✅ |
| 10 | 检查点文件真的落盘（`turn-*.blend`） | ✅ |
| 11 | 同轮第二次写复用检查点 | ✅ |
| 12 | L1 越界写：拒绝、未执行、带 `suggested_path` + `handoff` | ✅ |
| 13 | L1 拒绝后目标文件确实不存在（代码从未进入 Blender） | ✅ |
| 14 | L1 覆盖保存被拒（`overwrite-save`） | ✅ |
| 15 | L2 兜底：动态构造路径仍被拦（`write-outside-scope`） | ✅ |
| 16 | L2 越界删除被拦（`delete-outside-scope`） | ✅ |
| 17 | 任务目录内删除**放行** | ✅ |
| 18 | L1 环境写入口被拒（`environment-change`） | ✅ |
| 19 | `snapshot` 写入 `exports/` 且会话 filepath 不变 | ✅ |
| 20 | `capture` 三目标如实报告可用性 + 渲染设置被还原（I15） | ✅ |
| 21 | `docs api`：按标识符取到定义（`kind=definition`） | ✅ |
| 22 | `docs api`：**深 2 类成员可寻址**（上游缺口，我们不继承） | ✅ |
| 23 | `docs rules`：整条返回 G3 规则 | ✅ |
| 24 | `docs search`：命中带来源路径与分数 | ✅ |
| 25 | `docs api`：通配符列举语义（`kind=namespace`） | ✅ |
| 26 | `docs` 资产损坏时明确报 `available:false` 且不报 `isError`（I17） | ✅ |
| 27 | `docs` 索引放回后立即恢复可用（证明上一条测的是损坏路径，不是缓存） | ✅ |
| 28 | 诊断分级：端口未监听给出可操作原因（不是裸 `ECONNREFUSED`） | ✅ |

**上一轮实测：30/30 通过**（`node diagnostics/probeEndToEnd.js 9876`）。
⚠️ **本轮未复跑**（新增字段是只增不改，但"没跑过"就是没跑过；复跑后应把本行改成当轮结果）。

`diagnostics/probeGuard.js` 单独覆盖 L2 的机制层，**上一轮 18/18 通过**，其中包含三条只有实测才能确认的项：

- 代理**读写透传** `_op_create_function`，且与真实对象是同一个函数；
- 连续多轮正常 exec **不被误报**为篡改（`tampered` 是按轮结论，不是粘性标志）；
- 用户代码真的换掉 `bpy.ops` 后，**下一轮被如实记为 `tampered`**。

**判据口径**（来自 [`../docs/contract.md#guard-ops-proxy`](../docs/contract.md#guard-ops-proxy) 的教训）：
拦截类用例的通过条件必须是「**被拦的东西确实是我们装的**」，而不是「结果看起来对」。
L1 用例额外要求「**目标文件确实不存在**」——那才证明代码从未进入 Blender。

**类型检查（`pnpm check`）0 诊断**，`index.js` **不再有整文件 `@ts-nocheck`**。
`pnpm typecheck` 是同一条命令的别名。覆盖范围是 `index.js`、`lib/**/*.js`、`buildKnowledge.js`
与 `test/**/*.js`。两条踩过的坑：

- `jsconfig.json` 需要 `maxNodeModuleJsDepth: 0`——否则 TS 会走进 checkout 的依赖树
  （`events` / `punycode` / `string_decoder`），刷出上百行与本事无关的错误（**实测**）。
- 未安装 `typescript` 时可退回 DSH checkout 自带的编译器：
  `node "D:/Programs/.RunOnSource/deepseek-harness/node_modules/typescript/bin/tsc" --noEmit -p jsconfig.json`

工具参数 schema 的字面量类型靠**上下文类型**保留：`toolDefinition()` 的 `parameters` 声明为
`ParameterSchemaSpec`。注册点另有 `probeEndToEnd.js` 的**运行期结构断言**兜底。

---

## 9. 维护纪律

1. **每接线一项即改 §6 的表**（I12）：`docs/contract.md` 的配置表里出现一个键，
   本文件的接线表就要能解释它的状态；**不允许让"看起来已实现"的死配置长期挂着**。
2. **未实测的项留在 §7.2 / §7.3**，不把没跑过的说成已修。
3. 报告/审计条目修完后，**在 `test/regression.test.js` 里留一个具名用例**（`R11` 会检查标签还在不在）。
4. 改了知识库规则必须重新 `node buildKnowledge.js build`（`R10` 会检查）。
