# 实现状态

> 本文件只回答"做到哪一步了"。**契约在 [`docs/contract.md`](docs/contract.md)，本文件不定义任何规则。**
> 引用一律用 [`docs/contract.md`](docs/contract.md) 的锚点或不变量 ID，不写裸章节号。
>
> 维护纪律（**不变量 I12**）：`docs/contract.md` 的配置表里出现一个键，本文件的接线表就要能解释它的状态。
> 每接线一项即改本表；**不允许让"看起来已实现"的死配置长期挂着**。

---

## 1. 交付物状态

| 交付物 | 状态 | 备注 |
|---|---|---|
| `index.js`（入口 / Config / apply） | ✅ **可加载** | 注册 6 个工具；版本从 `package.json` 读 |
| `lib/protocol.js` | ✅ 已实现 | 帧编解码、持续 drain、三类超时 |
| `lib/diagnostics.js` | ✅ 已实现 | 指纹握手、扩展清单只读解析、五级诊断、漂移计算 |
| `lib/slug.js` | ✅ 已实现 | 纯函数（保留中文、剥控制字符、避 Windows 保留名） |
| `lib/taskDir.js` | ✅ 已实现 | 属主标记、拒绝复用他人目录、界内判定、同级既有目录列举（`listTaskDirs`，只读） |
| `lib/checkpoint.js` | ✅ 已实现 | n+1 原子轮换、写盘失败硬失败、回滚来源选择、undo 基线 |
| `lib/requestPolicy.js`（L1） | ✅ 已实现 | 写路径判定 + 算子名单 + 三项环境写入口 |
| `lib/guardPayload.js`（L2） | ✅ 已实现 | `bpy.ops` 代理 + `_op_create_function` 透传 + 跨 exec 三坑 |
| `lib/tools.js` | ✅ 已实现 | 6 个工具的领域逻辑与结果规范化 |
| `lib/knowledge.js` | ✅ 已实现 | 读 JSONL 索引；`api` / `search` 两种粒度；类成员可寻址 |
| `blender_mcp_status` | ✅ 已实现并实测 | 握手 + 风险姿态 + 回滚证据 + `existingTaskDirs`（同级既有工作目录，只读列出） |
| `blender_mcp_inspect` | ✅ 已实现并实测 | 集合 / 数据块计数 / 链接库 / 缺失引用 / 逐对象 |
| `blender_mcp_exec` | ✅ 已实现并实测 | L1 + 检查点 + L2 三层全通 |
| `blender_mcp_snapshot` | ✅ 已实现并实测 | `copy=True`，会话 filepath 不变 |
| `blender_mcp_capture` | ✅ 已实现并实测 | 三目标如实报告；渲染设置被还原 |
| `blender_mcp_docs` | ✅ 已实现并实测 | 三种 mode 全部可用；`api` 的深 2 类成员可寻址 |
| `buildKnowledge.js`（根目录） | ✅ 已实现并实测 | `fetch` / `build` / `verify` 三个子命令全部跑通 |
| `knowledge/`（语料 + 归一化 + 索引） | ✅ 已落盘 | 4,621 文件 / 16,229,930 B 语料；4,139 文件 / 69,122 段索引 |
| `skills/blender-mcp-knowledge/` | ✅ 已实现 | `SKILL.md`：检索判定规则 + G3 小抄指向 |
| `.AGENTS/`（工作记忆） | ✅ 已建立 | `README` / `red-lines` / `history`（由 `docs/HISTORY.md` 迁入）/ `design-review-v0.5`（由 `docs/` 迁入）/ `verification` |
| `test/`（离线门禁） | ✅ 已建立 | `pnpm test`：仓库一致性（原 `checkRepo`）+ 全语料审计（原 `auditCorpus`），改用 `node:test`；`diagnostics/` 只留需实机 Blender 的临时探针 |
| 死配置接线 | ✅ 已接线 | `portCandidates` / `allowPortScan` / `deferredTimeoutMs` / `maxResponseChars` / `rejectForeignPeer` 全部有消费者 |
| `inspect` 的用途猜测 | ❌ 未做（**定位外**） | 缺失引用 / 链接库树已做；"用途猜测"要建模语义，属 [`docs/contract.md#knowledge`](docs/contract.md#knowledge) 明确不做的建模知识引擎 |
| 知识库的 `literalinclude` 示例通道 | ❌ **未修，已登记**（审计 F13） | 归一化语料有 45 处 `literalinclude:` 指针，但没有任何 mode 能读到被指的 `.py`（`buildKnowledge.js` 注释里的 "`examples[]` 通道" 不存在）。三条候选修法都要先改 [`docs/contract.md#licensing`](docs/contract.md#licensing) 的随包主张（I22），**留给用户决策**，不在本轮擅自改 |
| 探针在用户**活动场景**里留残留 | ✅ **已修**（审计 F15） | 实测：`probeCapabilities` 的 `SWEEP_PROBE` 与 `probeFindings` 的 `primitive_cube_add` 会把物体留在未保存的 `.blend` 里（重开文件也消不掉），孤立网格同理（删对象后 `users` 归 0 但不自动回收）。现在**建与删在同一次 exec 内**，并回收自己的网格；`probeFindings` 新增**全套开闭清单比对**（`F15`，41/41），判据用注入泄漏验证过**能失败** |
| 结构化错误（`kind` / `operator` / `hint`） | ⚠️ 部分 | 已有 `kind` + `hint`（按结构性信号，不匹配本地化串）；无 `operator` |
| `changes` 与 `risk_notes` | ✅ 已实现 | 由 L2 收尾时的 `as_pointer()` 差分产出 |
| 版本漂移 `drift` 字段 | ✅ 已接线 | `status` 与 `docs` 都用会话实际版本比对语料版本 |
| 偏好 / add-on 写入口纳入 L2 | ✅ 已实现并实测 | L1 拦字面量、L2 拦动态构造（三项） |
| deferred 通道 | ✅ 已接线 | 两段读取：`check_is_finished` 存在时用 `deferredTimeoutMs` 等最终结果（**真 GUI 长任务未复现**） |
| `LICENSE`（GPL-3.0 全文） | ✅ 已完成 | 已与权威副本逐字节校验一致 |
| `THIRD_PARTY_NOTICES.md` | ⚠️ 需更新 | 语料 pin 与逐文件 blob sha 已在 `knowledge/meta.json`；NOTICE 里的规模数字待同步 |
| 全量 SPDX 头（新写的 `.js` 首行） | ✅ 已完成 | `index.js`、`buildKnowledge.js`、`lib/*.js`、`test/*.js`、`diagnostics/*.js` 首行均已带 |

**当前没有阻塞性缺陷**：`index.js` 的全部静态 import 都能解析，插件可加载。

**类型检查（`pnpm check`）已通过：0 错误**，且 `index.js` **不再有整文件 `@ts-nocheck`**。
`pnpm typecheck` 是同一条命令的别名。本仓库可以 `pnpm install`（devDependencies 里有 `typescript`），
所以仓库自带的脚本即可直接跑：

```sh
pnpm check
pnpm test
```

覆盖范围是 `index.js`、`lib/**/*.js`、`buildKnowledge.js` 与 `test/**/*.js`。两条踩过的坑：

- `jsconfig.json` 需要 `maxNodeModuleJsDepth: 0`——否则 TS 会走进 checkout 的依赖树
  （`events` / `punycode` / `string_decoder`），刷出上百行与本事无关的错误（**实测**）。
- 未安装 `typescript` 时可退回 DSH checkout 自带的编译器：
  `node "D:/Programs/.RunOnSource/deepseek-harness/node_modules/typescript/bin/tsc" --noEmit -p jsconfig.json`

`index.js` **已纳入类型检查**（`jsconfig.json` 的 `include` 里有它，首行不再有 `@ts-nocheck`）。
工具参数 schema 的字面量类型靠**上下文类型**保留：`toolDefinition()` 的 `parameters` 声明为
`ParameterSchemaSpec`。注册点另有 `probeEndToEnd.js` 的**运行期结构断言**兜底。

---

## 2. 配置接线状态

对照 [`docs/contract.md#config`](docs/contract.md#config) 的键全集。**I12：不允许死配置。**

| 键 | 状态 | 说明 |
|---|---|---|
| `host` / `port` | ✅ 已接线 | 传输与诊断 |
| `connectTimeoutMs` / `responseTimeoutMs` | ✅ 已接线 | 传输 |
| `requireVersionMin` | ✅ 已接线 | `status` 门控 + `exec` 前置检查 |
| `rejectForeignPeer` | ✅ **已接线** | `status` 与 `exec` 都读它 |
| `maxResponseChars` | ✅ **已接线** | `exec` 的 stdout/stderr 截断 |
| `taskRoot` / `taskRootMode` | ✅ 已接线 | 任务目录根；默认 `blendFile`——产出落在活动 `.blend` 所在目录下（探针 4/4）。显式 `taskRoot` 优先级最高 |
| `checkpoint.enabled` / `.keep` / `.maxBytes` | ✅ 已接线 | 检查点（`closeRound` 在 `turn/end` 触发） |
| `intercept.enabled` / `.guardThreadScope` | ✅ 已接线 | 传给 L2 载荷 |
| `knowledge.maxHits` / `.maxCharsPerHit` | ✅ **已接线** | `docs` 三种 mode 都读它 |
| `expose.status` / `.exec` / `.inspect` / `.capture` / `.snapshot` / `.docs` | ✅ 已接线 | 六个注册开关 |
| `portCandidates` | ✅ **已接线** | 仅当 `allowPortScan` 为真时作为候选；**要求握手成功才采纳** |
| `allowPortScan` | ✅ **已接线** | 默认 `false`：静默连到别的服务比连不上更危险 |
| `deferredTimeoutMs` | ✅ **已接线** | 两段读取的第二段窗口（代码出现 `check_is_finished` 时启用） |

**已删除的键**（不再出现在 schema / YAML / README 中）：

| 键 | 删除理由 |
|---|---|
| `knowledge.source` | 知识库是交付事实，不是配置（[`docs/contract.md#core-decisions`](docs/contract.md#core-decisions) / I21） |
| `knowledge.cacheDir` | 索引是随包交付的只读资产，不存在"按源指纹分目录的缓存" |
| `knowledge.includeManual` | 手册必定随包（[`docs/contract.md#knowledge-corpus`](docs/contract.md#knowledge-corpus)） |

---

## 3. 待实测项

契约已定但**尚未在真实环境验证**的项。**未验证前不得在 README 或工具描述里声称可用。**

### 3.1 已实测结论（本机 Blender 5.2.2 LTS，活动 GUI 会话）

| 项 | 实测结果 |
|---|---|
| 上游弱沙箱确实包装 `_op_create_function` | ✅ 确认：其值是 `WeakSandboxForLLM.ops_blocked_store.<locals>._filtered_op_create_function`——这正是禁止包装它的理由 |
| `bpy.ops` 模块级代理可行 | ✅ `type(bpy.ops).__name__ == '_OpsProxy'`，且读写透传 `_op_create_function` 成立 |
| 非名单算子委托 | ✅ `bpy.ops.wm` 可见 121 个算子，非名单算子正常取得（`BPyOpFunction`） |
| **三种截图目标的可用性**（原待实测 #13） | ✅ **实测**：socket exec 下 `context.area`/`region` 为 `None` → `viewport` 与 `area` **不可用**（如实报 `captured:false` + 原因）；`window` **可用**。三种目标**不能**一概声称可用 |
| 检查点原子轮换 | ✅ `turn-{T}.blend` 落盘；同轮第二次写复用同一份 |
| `undo_push` 可用 | ✅ 返回 `undo-push` 通道；基线与 `isDirty` 一起落到 `reports/` |
| **undo 栈是否可观测（原契约 undo 集成第 3 步的前提）** | ❌ **实测不成立**：5.2 的 Python API 不暴露 undo 栈——`Scene.undo_history` 与 `WindowManager.history_active` **都不存在**；`bpy.app.memory_usage_undo()` 只对 `ed.undo_push` 跳变（991046 → 1101578），对 `mesh.primitive_cube_add` / `object.delete` / 属性写入**完全不敏感**。契约的"检查基线之后是否有非本插件栈增长"因此**无从测量**，已改为如实报告 `measurable: false`（逐项数据见 [`docs/blender-5.2-findings.md`](docs/blender-5.2-findings.md) 的"undo 栈对 Python 不可观测"一节，规则在 [`docs/contract.md#checkpoint-undo`](docs/contract.md#checkpoint-undo)） |
| 端口扫描找到的对端是否被沿用 | ✅ **实测修复**：原先 `diagnose` 返回 `activePort` 而所有工具仍打配置端口；现在扫描成功的端口进入会话缓存，`status` / `exec` / `inspect` 共用同一端点 |
| `copy=True` 不改会话 filepath | ✅ 实测：保存后 `bpy.data.filepath` 仍是原路径 |
| L1 越界写 | ✅ 拒绝且**代码从未进入 Blender**（目标文件确实不存在） |
| L2 动态构造路径兜底 | ✅ 拦到 `write-outside-scope` |
| L1/L2 环境写入口 | ✅ L1 拦字面量（`environment-change`） |
| 检查点写盘失败即拒绝 | ⚠️ 尚未构造失败场景（磁盘满 / 权限不足）验证 |

### 3.1a 知识库实测（语料已落盘）

| 项 | 实测结果 |
|---|---|
| 语料规模（原为待实测 #17 的一部分） | ✅ **4,621 文件 / 16,229,930 字节**（`.rst` 4,508；`examples/*.py` 112 / 184,547 字节） |
| 归一化产物 | ✅ 4,139 文件（排除 369 个导航页 `index.rst`）/ **69,122 段** / 14,725,671 字节 |
| 索引体积 | ✅ 30,785,032 字节 = 归一化的 **2.09×**（验收上限 2.1×）；文件级 token 存**全局词表 id**（67,342 个词）而非字符串 |
| **单次检索耗时（原待实测 #16）** | ✅ `api` 与 `search` 各 **139–164 ms**，显著优于上游无索引时的 0.39–1.22 s；测得的主要开销是**进程内载入索引**，不是查询 |
| **深 2 类成员可寻址（原待实测 #15）** | ✅ **`bpy.types.Scene.frame_current` 返回 `kind: definition`**——上游在同一文件上返回 `partial`，这是它的行为缺口，我们不继承 |
| 通配列举 | ✅ `bpy.types.Scene.*` 返回 188 个候选 |
| **未识别 directive 清单（原待实测 #18）** | ✅ 全语料只剩 **5 类**：`list-table`×491、`todo`×53、`math`×11、`container`×53、`include`×245（上游自己缺失 `_common/masking.rst.frag`）。**5.2 新增的 `.. details::` 已被显式处理**，不再是缺口 |
| `include` 展开 | ✅ 245 处里 220 处成功展开（`api/bmesh.rst` 归一化后 1,109 → 5,872 字节），25 处登记为未识别 |
| 索引损坏路径（I17） | ✅ 实测：移开 `files.jsonl` → `available:false` + 可执行指引、不报 `isError`；放回后立即恢复 |

### 3.1b 全语料审计（`test/corpus.test.js`，`pnpm test`：**15/15**）

**不再只人工看三个文件**：4,508 个 `.rst` 全部过一遍，逐文件比对产物。审计途中发现并修掉 4 个真缺陷：

| # | 缺陷 | 症状 | 修法 |
|---|---|---|---|
| 1 | 索引的 token 袋**不含段落限定名** | `bpy.ops.object.add` 不会被切成 `object`/`add`，按词检索整片漏 | match surface 加入 `segment.name` / 目录名 |
| 2 | **directive 名与原始签名不进 token 袋** | `toctree` / `staticmethod` / `classmethod` 这些只出现在 directive 标记里的词，全语料 **8,418 个词**不可检索 | 收集 directive 名与原始签名 |
| 3 | **目录名不进 token** | `api/bpy.ops.action/…` 这类目录只以目录形式存在，199 个标识符检索不到 | 把路径各级拼成可分词文本 |
| 4 | token 存字符串导致索引超限 | 33.8 MB = 2.29×（超 2.1× 上限） | 全局词表 + 整数 id，降到 **2.09×** |

覆盖的检查（每条都有可复核的判据）：

| 检查 | 结果 |
|---|---|
| A1/A2 语料与归一化产物一一对应（无缺、无孤儿） | ✅ 4,139/4,139 |
| A3/A4 索引行数、每行形状、段落形状 | ✅ 4,139 行 / 69,122 段全部合规 |
| A5/A6 索引 token 覆盖全部归一化词；df 无多余词条 | ✅ 缺 0 个；df 词条 = 词表 = 67,342 |
| A7 词表无重复、id 不越界 | ✅ |
| B1/B2 无空产物；压缩比中位数 | ✅ 中位 **0.847**（最低 `api/change_log.rst` 39%） |
| C1 段落正文的词在归一化产物里的类型级召回 | ✅ 均值 **100.00%**，低于 90% 的文件 **0/4,139** |
| C2 按文件定位索引缺口 | ✅ 0 个文件有缺口 |
| D1/D2/D3 directive 全部归类、未识别占比、登记名真实存在 | ✅ 未识别 853/37,799 = **2.26%** |
| E1 归一化字节数与 `meta.json` 一致 | ✅ 14,725,671 逐字节吻合 |

### 3.1c 仓库一致性审计（`test/repo.test.js`，`pnpm test`：**13/13**）| 检查 | 结果 |
|---|---|
| R1 `package.json` 的 `files` 每一项都真实存在 | ✅ 10 项 |
| R2a/R2b/R2c schema ↔ `cordis.patch.yml` ↔ README 三方键一致；已删除的键未复活 | ✅ 15 个顶层键三方一致 |
| R3 **每个叶子配置键都有消费者**（I12：无死配置） | ✅ 22 个叶子键。**判据本身被验证过**：注入 `deadTopLevel` / `knowledge.deadLeaf` 后 R3 报 FAIL（不是"永远绿"） |
| R4 全仓引用 `docs/contract.md` 的锚点都能解析 | ✅ 35 个锚点、**0 悬空**；被检文件清单**从磁盘枚举**（含 `docs/contract.md` 自身），不再手写 |
| R5 新写的 `.js` 首行都带 SPDX | ✅ 15 个文件 |
| R6a/R6b README 与工具描述无「安全沙箱 / 已保护数据」式措辞 | ✅ |
| R7/R7b 6 个工具名在注册点/README/STATUS 三处一致；README 未把未实现说成可用 | ✅ |
| R8/R9 `knowledge/` 随包产物齐备、`meta.json` 自洽且带 `builderVersion` | ✅ 4,621 条 blob 记录 |

> **R3 为什么必须剥注释、还要排除 schema 声明**（返工中实测，审计 F11 的延伸）：
> 第一版改完"只测叶子键"后依然全绿，因为判据是 `\b<leaf>\b` 全文匹配 ——
> JSDoc 里一句 `@property {number[]} portCandidates` 就算"有消费者"，
> 而 schema 自己的 `maxHits: Schema.number()` 也算。于是**先剥注释与 JSDoc、再把 schema 块挖掉**，
> 才让死键真的暴露。教训：**改完门禁要用注入验证它会失败**，绿色本身不是证据。

### 3.1d 长任务（deferred）实测 → **结论已作废**

> ⚠️ 本节保留的是一份**过时结论**。当时探针报「8/8 通过」，但后续实测证明
> `INVOKE_DEFAULT` 在本通道下**同步阻塞**、deferred 分支从未触发。
> 现行结论与全部 Blender 5.2 实测发现已移入
> [`docs/blender-5.2-findings.md`](docs/blender-5.2-findings.md)。
>
> 当时的探针 `diagnostics/probeScene.js` 是**场景专用**的（硬编码已删场景的 `TY_` 前缀），
> 且自身会临时改渲染设置，已在发布清理中删除。

当时的观察（**已被推翻，勿据此设计**）：

| 当时的检查 | 当时的结论 | 现行事实 |
|---|---|---|
| A1 起后台渲染后 job 真的在跑 | ✅ `INVOKE_DEFAULT` 返回 `RUNNING_MODAL`、`is_job_running` 为真 | ❌ 该"真"是**同步阻塞期间**读到的；返回时 job 已结束 |
| A2 `check_is_finished` 拿到最终结果 | ✅ 两段读取生效 | ❌ 第一段就已带最终结果，deferred 分支**从未触发** |
| A3 长任务产出渲染文件 | ✅ 1,428,804 字节 | ✅ 文件确实产出（但这不证明 deferred 生效） |
| B1–B5 场景几何自检 | ✅ 相机/取景/穿模/沉地 | 通用结论仍成立，但探针已删，**不可复现** |

**保留下来的两条真实教训**（仍然有效，已写进 [`knowledge/g3-rules.md`](knowledge/g3-rules.md)）：

1. **会话 id 决定 allowRoot**：驱动器与探针一度用了不同 sessionId，第二个会话被分到
   `.dsh-blender-*-2`，于是 L2 护栏把第一个会话的目录判为"越界"并拒绝写入——
   这是 I8 会话隔离在正确工作，但**跨多次调用驱动同一场景时必须固定 sessionId**。
2. **"临时改设置再还原"的还原点必须在改动之前读**：探针在改动后才取快照，把分辨率"还原"成
   960×540 的中间态，最终出图被污染。这条在 §3.1o 被升级成了明确的设置约定。

### 3.1e 已装入当前 profile 并实测可用

插件已通过 `plugin_manager install_bundle` 装入 `web` profile（`installed: true`、`enabled: true`、
行 id `blender-mcp-bridge`），安装过程中修掉了两处真实的加载期缺陷：

| 症状 | 真因 | 修法 |
|---|---|---|
| `YAMLException: end of the stream or a document separator is expected (5:9)` | `cordis.patch.yml` 用了 **`//` 注释**——那是 JS 语法，YAML 只认 `#` | 改为 `#` |
| `ValidationError: $.requireVersionMin expected string but got 5.1` | 未加引号的 `5.1` 被 YAML 解析成**数字**，schema 要字符串 | 写成 `'5.1'` |

> ⚠️ **本会话的工具面在会话启动时已固定**，因此 `blender_mcp_*` 没有出现在本会话的可见工具里
> （`cordis_inspect_query` 的 Tool 列表可复核）。要让工具直接可调用，需要**重启 harness**。
> 这不影响插件本体：本轮全部场景工作都是**走插件的工具实现层**完成的
> （当时用 `diagnostics/runScene.js` 调真实的 `apply()`，经过同一套 L1 拦截 + 检查点 + L2 护栏；
> 该驱动器与全部场景脚本已在发布清理中删除，因为它们依赖已删的场景资产）。

### 3.1o 渲染/导出设置的软限制（**实测 11/11**）

**起因**：为出预览图，本插件改了用户的 `cycles.samples`（钉成 256）、
`frame_start/frame_end`（留成探针值 1–2）、`view_settings.exposure`（固化成 -0.45）、
`render.filepath`（指向任务目录），并且把这些**写进了交付状态**。用户没有要求过。

**实现分两层**：

| 层 | 落点 | 作用 |
|---|---|---|
| 提示词（软限制） | `index.js` 的 `systemPrompt.section('blender-mcp-bridge-settings-policy', order 900)` | 说明默认不动、为什么不该动、要动必须先问清数值 |
| 可见性 | `lib/settingsGuard.js` + `status.renderSettings/settingsBaseline/settingsDrift` + `exec.settingsDrift` | 会话基线比对，漂移同时进 `warnings` |

**提示词写法上的一次失败与修正（值得记）**：第一版把「三种例外」列在前面，
读起来像**许可清单**——"满足条件就可以改"，约束力反而弱。改后的写法是
**先讲清代价**（改了帧范围会让用户下次只渲染到 2 帧、且他会以为是工程坏了；
以及"用户发现 AI 顺手改出图参数后就不敢让你碰真实项目"），把默认立场说死，
例外放到最后并加上"要先问"的门槛。这是**推测，不是实测**——效果需要真实任务观察。

**探针**（`node diagnostics/probeSettingsGuard.js`，**11/11**）：

| 检查 | 结果 |
|---|---|
| 提示词段落真的注册到 `systemPrompt`（否则软限制没进上下文） | ✅ 1,579 字符 |
| 提示词明确点名 `frame_start/frame_end/samples/exposure/filepath` | ✅ |
| 首次 `exec` 记下会话基线 | ✅ |
| 未改设置时 `settingsDrift` 为空 | ✅ |
| **故意改 5 项设置后逐个报出** | ✅ `[exposure, frameEnd, frameStart, resolutionX, samples]` |
| 漂移同时进 `warnings`（模型看得到） | ✅ |
| 漂移带 from/to 具体数值 | ✅ `samples 2048→7` |
| 改回后漂移重新为空（是比对，不是永久报警） | ✅ |
| `status` 报同一组字段 | ✅ |
| **还原覆盖每个读得到的键（无兜底编造值）** | ✅ 新增，见下 |
| **收尾复核用户的设置与开局一致** | ✅ 新增，见下 |

> **最后两条是本轮补的，因为它们曾是真实的破坏**（审计 F15 的同族）：
> 两个还原块都写成 `` `_s.cycles.samples = ${original?.samples ?? 256}` `` 这类插值——
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

### 3.1n 能力面压测（`node diagnostics/probeCapabilities.js`，**16/16**）

把插件的每条路径都真的走一遍，**含故意违规**以验证拦截确实生效：

| # | 用例 | 结果 |
|---|---|---|
| 1 | `status` 握手 + 风险姿态 + drift | ✅ 1067 对象场景 |
| 2 | `inspect` 场景快照（含链接库 / 缺失引用 / 逐对象） | ✅ 对象/集合/材质计数与逐对象列表齐全 |
| 3 | `docs` 知识库检索 | ✅ `bpy.ops.render.render` → `api/bpy.ops.render.rst` |
| 4 | `snapshot` 受控存盘 | ✅ 525,930 B；**会话 filepath 前后一致** |
| 5 | `capture` 窗口截图 | ✅ `captured=true`（socket exec 下唯一可用目标，与 §3.1 结论一致） |
| 6 | `exec` 只读：返回结果且**不落检查点** | ✅ `result={"n":1068}`、`checkpoint.created=false` |
| 7 | `exec` 写：落检查点 + `guard.verified=true` | ✅ 检查点 525,914 B |
| 8 | 同轮第二次写复用检查点 | ✅ `created=false` |
| 9–10 | L1 越界写：拒绝 + `suggested_path` + `handoff`，且**目标文件确实不存在** | ✅ |
| 11 | L1 覆盖保存：拒绝（`overwrite-save`） | ✅ |
| 12 | L1 环境改动：拒绝（`environment-change`） | ✅ |
| 13 | L2 兜底：动态构造路径仍被拦（`write-outside-scope`） | ✅ |
| 14 | 大结构化响应（300,000 字符）不被截断 | ✅ 截断只作用于 stdout/stderr |
| 15 | Python 异常 → 结构化 `kind`/`hint`（不匹配本地化文本） | ✅ |
| 16 | 检查点与快照都落在任务目录内 | ✅ |

**压测暴露的一处真实行为**：`exec` 的代码里**没有 `import bpy` 时会返回空 `result`**（本次探针第一条就踩到）。
这不是缺陷——`bpy` 不在 exec 命名空间的默认绑定里，用户代码必须自己 import；
但**工具描述里应当写明**这一点，否则模型会写出"看起来对、结果为空"的调用。已记为待办（§3.2 第 14 项）。

### 3.2 仍未实测

| # | 项 | 影响 |
|---|---|---|
| 1 | **交互（GUI timer）模式整体未实测**：协议探针与本次验收全部走的是活动 GUI 会话的 socket，但活动/空闲间隔的真实生效组合仍未测 | 超时阈值取值 |
| 2 | 空闲后首次请求的延迟特征（旧记录称约 900 ms，在后台实例上**未能复现**） | 该数字仍**存疑**，不得写死 |
| 3 | **30 s 分片写路径**：「客户端停止 drain + 响应大于内核发送缓冲」未复现 | `_SEND_TIMEOUT` 实际行为 |
| 4 | 大响应（> 1 MB）在 Windows 上的 drain 稳定性 | 截断阈值 |
| 5 | 并发连接的串行化行为（backlog = 5） | 多会话并发 |
| 6 | 模态算子运行中发起请求的表现 | 诊断文案 |
| 7 | `bpy.data.*.remove()` 运行时统计的噪声水平 | `risk_notes` 可用性（差分已实现，噪声未评估） |
| 8 | **L2 拦截窗口之外（异步 / 延迟写）的逃逸面** | README 的风险声明范围 |
| 9 | 多会话并发时检查点文件名的**稳定会话标识**形式（现用 `session-<sanitized id>`，未在多会话下验证） | I8 的落地形式 |
| 10 | 典型场景下检查点耗时与磁盘占用（实测单份 100–280 KB / 数百对象场景，远未到压力场景） | 体积告警默认阈值 |
| 11 | EEVEE 在后台模式下的可用性 | 渲染路径 |
| 12 | `wm.open_mainfile` 的偏好上下文与 `check_existing=False` 实际行为 | 回滚入口 |
| 13 | `save_as_mainfile(copy=True)` 对 `is_dirty` 的影响 | 与 `undo` 前置条件的关系 |
| 14 | **`bpy` 必须由用户代码自己 `import`**：exec 命名空间里没有默认绑定 `bpy`，漏写会得到空 `result` 而不报错（压测实测）。**工具描述里应写明这一点**，否则模型会写出"看起来对、结果为空"的调用 | `exec` 的可用性 |

**已由本次长任务实测补上的那一条（原 deferred 待实测）**：见 §3.1d。

### 3.3 知识库（数据已落盘，以下为**仍未验证**的项）

| # | 项 | 影响 |
|---|---|---|
| 14 | **G3 小抄是否真的减少试错轮次**：规则条目的效果只能靠真实任务观察 | [`docs/contract.md#knowledge-granularity`](docs/contract.md#knowledge-granularity) 的效果验证 |
| 15 | **归一化正文的解析保真度**：本次只人工抽查了 `bmesh.rst` / `bpy.ops.object.rst` / `bpy.types.Scene.rst`，**未做全语料抽查** | 是否有 content 被解析器误吞 |
| 18 | **`data/api/` 的上游 ref 与确切许可** | `THIRD_PARTY_NOTICES.md` 的存疑项 |

---

## 4. 端到端验收结果

`diagnostics/probeEndToEnd.js` **真的调用 `apply()`、真的注册工具、真的逐个调用**（不是静态检查）。
离线门禁在 `test/`：[`test/corpus.test.js`](test/corpus.test.js)（全语料，15/15）、
[`test/repo.test.js`](test/repo.test.js)（仓库一致性，13/13）——`pnpm test` 即可跑，不需要 Blender。
实机套件还有 [`diagnostics/probeFindings.js`](diagnostics/probeFindings.js)（审计发现的逐条回归，41/41，
**需要实机 Blender，且不入库**）。

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

**当前：30/30 通过**（`node diagnostics/probeEndToEnd.js 9876`）。

`diagnostics/probeGuard.js` 单独覆盖 L2 的机制层，**18/18 通过**，其中包含三条只有实测才能确认的项：

- 代理**读写透传** `_op_create_function`，且与真实对象是同一个函数；
- 连续多轮正常 exec **不被误报**为篡改（`tampered` 是按轮结论，不是粘性标志）；
- 用户代码真的换掉 `bpy.ops` 后，**下一轮被如实记为 `tampered`**。

**判据口径**（来自 [`docs/contract.md#guard-ops-proxy`](docs/contract.md#guard-ops-proxy) 的教训）：
拦截类用例的通过条件必须是「**被拦的东西确实是我们装的**」，而不是「结果看起来对」。
L1 用例额外要求「**目标文件确实不存在**」——那才证明代码从未进入 Blender。

---


