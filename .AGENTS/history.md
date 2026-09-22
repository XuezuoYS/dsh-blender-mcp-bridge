# 决策记录

> 本文件是**历史坐标**，不是规范。**任何仍然生效的规则都在 [`docs/contract.md`](../docs/contract.md)**；
> 本文只回答"当时为什么这么定、后来为什么改、以及哪些旧结论已被证伪"。
>
> 读法：每一条旧结论后面都标了它**沉淀成了哪条规则**。若只想知道规则，不必读本文。
>
> 📦 位置：dev 周期由 `docs/HISTORY.md` 迁入 `.AGENTS/history.md`（`docs/` 只留契约与取证文档）。

---

## 0. dev 周期：按新版 AGENTS.md 的结构重组

**目标**：把实现对齐重写后的 `AGENTS.md`（基础安全三条 / 类型安全 / 注释风格 / 工作记忆）。

**落地的结构性变更**

| 变更 | 说明 |
|---|---|
| 工作目录默认位置 | `taskRootMode` 默认由 `workspace` 改为 **`blendFile`**（活动 `.blend` 所在目录下）。只读路径一起修：`taskRootOf(exec, blendDir)` 用握手已拿到的工程路径，**不额外发请求** |
| 目录可见性 | 新增 `lib/taskDir.js#listTaskDirs` 与 `status.existingTaskDirs`（**只读**，绝不创建目录）；提示词新增 `blender-mcp-bridge-taskdir-policy` 段落 |
| 类型安全 | `index.js` 去掉整文件 `@ts-nocheck`，`jsconfig.json` 纳入 `index.js` 与 `test/**`；新增 `pnpm check` |
| 测试拆分 | `diagnostics/checkRepo.js` → `test/repo.test.js`、`diagnostics/auditCorpus.js` → `test/corpus.test.js`（`node:test`）；`diagnostics/` 只留需实机 Blender 的探针且**整体不入库** |
| 工作记忆 | `docs/HISTORY.md` 与 `docs/design-review-v0.5.md` 迁入 `.AGENTS/`（内容原样保留，只修链接深度） |

**被证伪的旧结论（重要）**

- 旧 `index.js` 头部写着「`defineTool({...})` 的调用点在 `checkJs` 下**必然**报错，唯一解法是 `as const`」。
  **这条是错的。** `defineTool` 的签名是 `defineTool<const S extends ParameterSchemaSpec, const O extends ValueSchemaSpec>`，
  而真正会失败的是中间那层 `toolDefinition()` 把 `parameters` 声明成了 `Record<string, object>`（放宽成 `string`）。
  把它改回 `ParameterSchemaSpec` 后，对象字面量靠**上下文类型**保留字面量，`index.js` 直接通过检查（`pnpm check` 0 诊断）。
  → 教训：**"整文件抑制"常常掩盖的是自己的一处类型声明写松了**，不是工具链的固有限制。

**两条判据教训（都当场踩到）**

1. `probeCapabilities` 的"exec 只读"用例断言 `result.n > 0`，即**活动场景必须非空**。
   空场景下 `{"n":0}` 是**正确答案**却报 FAIL——判据依赖环境，不是实现缺陷。
   复跑时用一个物体播种即为 16/16。
2. `probeFindings` 的"死导出黑名单"把**新加的** `listTaskDirs` 判为死导出。
   改黑名单时必须同时加**正向断言**（"新导出确实有消费者"），
   否则只是把死导出从黑名单挪进了白名单，门禁看着变绿而判据已失效。

**本轮实测**：`pnpm check` 0 诊断；`pnpm test` 28/28；
实机 `probeEndToEnd` 30/30、`probeTaskRoot` 4/4、`probeGuard` 18/18、`probeTransport` 14/14、
`probeSettingsGuard` 11/11、`probeFindings` 42/42、`probeCapabilities` 15/16（空场景，见上）。
默认落点实测：`exec(mutating)` 的检查点落在 `<活动 .blend 所在目录>/.dsh-blender-{task}/`，
`status` 只读调用**没有**创建任何目录。

---

## 1. 为什么需要这份文件

`contract.md` 在 v2.0 之前同时承担三种职责：契约、决策过程、实现进度。
结果是读者无法分辨"哪句是必须遵守的契约、哪句是当时的想法、哪句是已经完成的工作"——
最终出现了「`§16` 声称 8 个模块已完成并端到端实测，而磁盘上什么都没有」这类无法自证的状态。

v3 起三者分离：契约在 `contract.md`，进度在 [`STATUS.md`](../STATUS.md)，决策过程在本文件。
**判据**：一条内容如果改变会导致实现必须改变，它属于 `contract.md`；否则属于本文件。

---

## 2. 决策索引（Qn → 现行落点）

v2.0 及更早用 `Qn` 编号记录结论。编号本身已废除，下表是唯一权威换算。

| Qn | 议题 | 结论 | 现行落点 |
|---|---|---|---|
| Q1 | 「一轮」定义 | 一次用户请求 = 一个 `turn` | [`contract.md#checkpoint`](../docs/contract.md#checkpoint) |
| Q2 | 检查点体积上限 | 可配；超限**只告警不失败** | 同上 |
| Q3 | 设置页面 | 不做（理由已更正，见 §5） | [`#packaging`](../docs/contract.md#packaging) |
| Q4 | 越界写的边界 | 可写范围**只有任务目录**；拒绝时带接管提示 | [`#handoff`](../docs/contract.md#handoff) |
| Q5 | 检查点写盘失败 | **硬失败**，不得"无备份继续" | [`#checkpoint`](../docs/contract.md#checkpoint) / I1 |
| Q6 | 回滚入口 | **不加工具**：agent 用 `exec` 调 `open_mainfile`，插件只给证据 | [`#checkpoint`](../docs/contract.md#checkpoint) / I9 |
| Q7 | undo 集成 | 纳入：写前 `undo_push`，回滚优先 undo、检查点兜底 | [`#checkpoint`](../docs/contract.md#checkpoint) |
| Q8 | 交付形态 | 纯 JS + TS 仅做类型检查 | [`#packaging`](../docs/contract.md#packaging) |
| Q9 | 是否运行 MCP server | **不运行**（见 §3） | [`#core-decisions`](../docs/contract.md#core-decisions) / I10 |
| Q10 | 上游 transport 复用 | **作废**：我们用自己的传输层 | [`#transport`](../docs/contract.md#transport) |
| Q11 | 受控列表实现路径 | **作废**：不再有第二个工具面需要路由 | — |
| Q12 | 落地顺序 | 先直连骨架 | [`STATUS.md`](../STATUS.md) |
| Q13 | 视觉反馈 | 纳入：`blender_mcp_capture` | [`#tools`](../docs/contract.md#tools) |
| Q14 | 偏好 / add-on 写入口是否纳入 L2 | **已决策：纳入，但收窄为三项**（见 §6） | [`#interception-env-writes`](../docs/contract.md#interception-env-writes) |
| Q15 | deferred 通道接线 | **已决策：接线，接线后必须先复测**（见 §6） | [`#transport-deferred`](../docs/contract.md#transport-deferred) |
| Q16 | 设置形态 | 本机配置文件；不做任何 HTML / 前端 | [`#packaging`](../docs/contract.md#packaging) |
| Q17 | 知识库方向 | **翻转 v1.0**：内嵌官方语料（不运行 server） | [`#knowledge`](../docs/contract.md#knowledge) |
| Q18 | 官方 Python 模板路由 | 只取接口形状与语义，在自有通道重写 | [`#knowledge`](../docs/contract.md#knowledge) / I18 |
| Q19 | 许可 | `GPL-3.0-or-later` | [`#licensing`](../docs/contract.md#licensing) |
| Q20 | 知识库检索粒度 | 分 G1 契约 / G2 语义 / G3 规则 | [`#knowledge-granularity`](../docs/contract.md#knowledge-granularity) |
| Q21 | 语料是否含完整 RST 原文 | 包含，但不参与默认检索 | [`#knowledge-corpus`](../docs/contract.md#knowledge-corpus) |
| Q22 | 语料版本漂移 | 不硬阻塞但**必须可见** | [`#discovery-drift`](../docs/contract.md#discovery-drift) / I11 |

**Q10 / Q11 作废的处置**：两者都是"要复用上游 MCP server 的传输与工具面"这一前提下的问题。
Q9 定为"不运行 server"后，前提消失，问题随之失去对象。ID **不再复用**。

---

## 3. v1.0 的五条理由里，哪些被保留、哪些被推翻

v1.0 用五条理由论证"不要知识库"。**前三条只对「server 作为进程运行」成立，对「嵌入语料」不成立。**

| # | v1.0 的理由 | 重审结果 | 沉淀 |
|---|---|---|---|
| 1 | 会新增**第二条不受管的写入通道**（server 自己连同一个 add-on 套接字，`execute_blender_code` 不经任何检查） | **仍然成立，且是决定性的**。因此**依旧不运行 server**；但"读它的语料"不产生通道 | I10 |
| 2 | 我们的护栏盖不住它（护栏只在自有 exec 期间安装，server 空闲期发来的写全在窗口之外） | **仍然成立**，同上：这是"不运行"的理由，不是"不读语料"的理由 | I10 / `#guard` |
| 3 | 拦不住（`tools/pre-execute` 只有 allow/deny/cancel/ask，且 `mcp__<server>__*` 是保留 namespace，注册冲突整代回滚） | **仍然成立**，同上 | I10 |
| 4 | 它拿到的能力**不服务于目标** | **被证伪**：当时把"目标"窄化成了三个安全目标；真实目标是**辅助创作**，而"模型写 Blender Python 老写错"正是创作效率的主因 | `#knowledge` |
| 5 | 成本不成比例（分叉 `dsh-mcp-client` 约 2.5k 行 TS 并跟上游同步） | **被证伪成本估算的对象**：真正的成本不是分叉 client，而是预处理一份静态语料 + 一个有界检索 | `#knowledge-corpus` |

**一条被保留的正确直觉**：v1.0 已经推到「把数据当数据来路由，而不是把 server 拉起来」，
只是当时把它标注成"可选、默认关闭、指向用户本机"。v3 把它落成「**必定内置、必定读取**」——
**知识库是交付事实，不是配置项**（I21）。

**一条被部分放宽的红线**：v1.0 定「不复制上游 GPL 源码文本，只取接口形状」。
现在 `prompts.yml` 与 RST 语料属于**数据**，按 GPL-3.0 内联并署名；
但 `*_toolcode.py` 的实现**仍然不复制原文**，只做语义摘要后重写（I18）。

---

## 4. 已作废的 `files` 声明（一次真实错误）

v1.0 曾在 `package.json` 的 `files` 里列入**不存在的** `LICENSE` 与 `CHANGELOG.md`。
前者后来补上了（GPL-3.0 全文），后者从未存在——**那是无据的臆测**。

同一次清理中还出现了第二种情况：`skills/`、`knowledge/`、`scripts/` 被提前声明、当时尚不存在，
但它们是**有章节支撑的既定交付物**，性质与"臆测一个 CHANGELOG"不同。

**沉淀出的规则**：`files` 里每一列出的路径都必须存在；
**不允许提前声明尚未实现的交付物**（[`#licensing`](../docs/contract.md#licensing)）。

---

## 5. 被证伪的技术结论（不要重走这些路）

### 5.1 算子拦截不能用 `_op_create_function`（**实测**证伪）

曾计划通过包装 `bpy.ops._op_create_function` 拦算子。**这条路走不通**：

| 观察 | 结果 |
|---|---|
| `bpy.ops._op_create_function` 的真实值 | `WeakSandboxForLLM.ops_blocked_store.<locals>._filtered_op_create_function` |
| 原因 | 上游弱沙箱**自己也**包装了这个函数 |
| 后果 | 它在**每次 exec 结束时**还原成自己的版本 → 我们在 exec 内打的补丁**活不过一次请求**；而且因为返回的是未包装算子，检查点自己的 `save_as_mainfile(copy=True)` 会被误判为"已放行" |
| 附带脆弱性 | `bpy.ops.wm` 的属性访问有缓存（`delattr` 后重新访问才会经过创建函数） |

→ 沉淀为 [`contract.md#guard-ops-proxy`](../docs/contract.md#guard-ops-proxy) 与 I16。

**历史脚本的处置**：`guard_probe.py` 当年基于 `_op_create_function` 得出的"算子拦截可行"结论**已被证伪**，
不要再当依据。事故现场脚本（`guard_probe.py` / `recover_probe.py` / `restore_probe.py` / `verify_restore.py` / `inspect_blend.py`）
已按"保持仓库干净"的要求删除——它们不是交付物，且 `restore_probe.py` 绑定了用户本机路径。

### 5.2 undo 家族"不可用"的判定已被证伪（**实测**）

v0.5 依据单次 `undo()` 的 `poll() failed, context is incorrect` 判定"undo 家族按不可用处理"。
**该判定错误**：`context is incorrect` 的真实含义是**"栈里当前没有可弹出的记录"**，不是上下文不合法。

这也解释了事故中直接 `undo()` 为何失败，而现场恢复脚本里那个"反复 `undo()` 直到目标对象重新出现"的循环为何能救回现场。

→ 沉淀为 I3：undo 是**首选**通道，检查点文件是**兜底**，不得假设 undo 能回到任意期望状态。
（**这半句排序在 v3 期间又被实测倒转**，见下面 5.2b。）

### 5.2b "undo 首选、检查点兜底"的排序被证伪（**实测**，返工期间）

5.2 纠正了"undo 不可用"，但顺势给出的**排序**（undo 优先、检查点兜底）建立在另一个
未经检验的前提上：**回滚前能查出"用户是否在 push 之后自己编辑过"**。
契约曾要求"检查基线之后是否出现非本插件的栈增长"。

实测下来这个前提**根本不存在**：`Scene.undo_history`、`WindowManager.history_active`
都不存在；唯一还能读的 `bpy.app.memory_usage_undo()` 是个**函数**，且**只对本插件的
`ed.undo_push` 跳变**（991046 → 1101578），对 `primitive_cube_add` / `object.delete` /
属性写入完全不敏感——**用户的编辑根本不让它动**。

于是那条检查两侧都读到 `None`，"没有用户编辑"变成**恒真**，
而 `true` 在语义上是"可以安全 undo 回滚"。**恒真的安心信号比没有信号更危险**：
它会让人放心地执行一次吞掉用户未保存编辑的回滚。

→ 现在的 I3：**检查点文件是唯一可靠的回滚来源**，undo 至多是一条需要自证安全的加速路径，
且当前证明不了，故不得自动采用；不可判定性由 `riskPosture.undoPrecheck`
（`measurable: false` + `userEditsIndeterminate: true`）摊给调用方决定
（[`contract.md#checkpoint-undo`](../docs/contract.md#checkpoint-undo)）。

**教训**：修好一个"不可用"的误判之后，紧接着给出的替代排序**同样是假设**，
也得实测。5.2 那次纠错只验证了 undo **能调通**，没有验证它**够不够安全地被优先采用**。

### 5.3 「复制 `copy=True` 的放行」曾因错误的原因通过

修复嵌套坑之前，`wm.save_as_mainfile(copy=True)` 的"放行"看起来是通过的——
实际返回的是**未被包装的原始算子**，即拦截整段失效。

→ 沉淀为一条**验收判据**：拦截类测试的通过条件必须是「**被拦的东西确实是我们装的**」，
而不是「结果看起来对」（[`contract.md#guard-ops-proxy`](../docs/contract.md#guard-ops-proxy)、[`STATUS.md`](../STATUS.md) §4）。

### 5.4 三条关于"守卫载体跨 exec 存活"的坑

载体活在 Blender 进程里，跨多次 exec 存活，因此出现三个只有实测才暴露的缺陷：
重装导致守卫嵌套（新根放行、旧根拒绝）、`allowRoot` 变化未触发重装（闭包捕获了旧根）、
证据跨 exec 累积（只读 exec 返回 `status: blocked`）。

→ 沉淀为 [`contract.md#guard-carrier`](../docs/contract.md#guard-carrier) 的三个修复与
「`tampered` 必须靠证据、不能靠推断」这条判据。

### 5.5 "设置卡片做不到"的旧论证不准确

v0.8 曾写"设置卡片需要的 `clientBundle` 预设未公开，工作量不成比例"。
**前置事实成立但结论不准确**：第三方插件 `dsh-whale-widget` 用 `ctx.webServer.register` + 注入 `<script>`
到 HTML 响应，**不依赖 `clientBundle`** 就实现了完整浏览器端 UI。

→ "不做设置页"的**正确理由是范围控制与信任边界**，不是"做不到"（[`contract.md#packaging`](../docs/contract.md#packaging)）。

---

## 6. 本轮（v3）新决的两个旧待定项

### 6.1 Q14：偏好 / add-on 写入口纳入 L2

**原状态**：只在 L1 静态名单里，容易漂移；标为待定。

**问题**：L1 只认字面量，`getattr(bpy.context.preferences, …)` 一绕就过。
**一条只在 L1 存在的规则等于没有规则**。但也不能承诺"接管所有 preferences 写"——那无法验证。

**决策**：纳入 L2，但**范围严格收窄为三项**（偏好写入口、`addon_utils` 启停、脚本自动执行开关）。
→ [`contract.md#interception-env-writes`](../docs/contract.md#interception-env-writes)。

### 6.2 Q15：deferred 通道接线

**原状态**：`deferredTimeoutMs` 是死配置，`check_is_finished` 未接线。

**决策**：**接线**，因为它与 I12（不允许死配置）冲突——留一个读了不用的键比不做更糟。
但 §3.1 第 1 条已明确"交互 GUI timer 模式整体未实测"，
因此**接线后、复测前不得声称可用**。
→ [`contract.md#transport-deferred`](../docs/contract.md#transport-deferred)。

---

## 7. 事故复盘：2026-09-16

一个"清理探测残留"的脚本把用户实时会话中的**整个资产（19 对象 / 207,224 三角面）删除**。
已从用户自己的 `蒹葭.blend` 完整恢复并核实。

**根因**：

1. 按**硬编码名字**取集合，而用户已把集合改名为「蒹葭」→ `None` → 保护集合**解析为空集**；
2. 对空集**没有中止** → "删除所有不在保护集合内的对象"退化为"删除全部"。

**沉淀出的不变量**：

| ID | 规则 |
|---|---|
| I13 | 破坏性扇出操作，保护集合为空或异常偏小 → **硬中止**，适用于本插件所有内部例程 |
| I2 | 归属判定用连接时记录的稳定标识，不用名字 |
| I3 | 不得假设 undo 能回滚到任意期望状态 |
| I5 | 保留 `open_mainfile` 作为自救通道 |
| I6 | 拦截判定针对写路径，不针对算子名 |
| I7 | 越界写/删的拒绝必须带接管提示与可用替代路径 |
| I8 | 归属判定与检查点清理都按会话隔离 |

**一条元规则（I4）**：探测性脚本与生产代码适用**同一套**约束。

---

## 7a. 事故复盘：批量文本改写损坏了源文件

为把 9 个场景脚本里的硬编码输出路径改成「跟随 `.blend` 推导」，用
`Get-Content -Raw` + `Set-Content -NoNewline` **批量改写**，结果**损坏了 8 个文件的中文**
（读出为无效 UTF-8；其中 `mc26_compositor.py` 的一个中文字符串被截断，直接变成 `SyntaxError`）。

**根因**：非 UTF-8 控制台下的 PowerShell 文本往返会丢字节。这是**工具选择错误**，不是脚本逻辑问题——
被改的内容本身是对的（路径确实该推导而非硬编码）。

**沉淀出的规则**：

| 规则 | 落点 |
|---|---|
| 文件内容改写**只用** `edit` / `write` 工具；**不用** shell 文本替换 | [`../AGENTS.md`](../AGENTS.md) |
| 批量改写若必须用脚本，用 Node（显式 utf8 编解码）并在写回后**逐个校验仍可解析** | 同一条的实际做法 |
| 用 `Set-Content` 破坏后的文件可能变成**无效 UTF-8**，此时 `read` / `write` 工具都进不去（要先在磁盘上删除再重建） | 排查线索 |

受影响的文件已在发布清理中一并删除（它们属于已删场景的构建脚本）；
同期重新生成的是 `diagnostics/` 下保留的探针与 `docs/` 文档。

---

## 8. 上游取证的基线沿革

| 时期 | 代码基线 | 语料基线 | 备注 |
|---|---|---|---|
| 早期 | tag `v1.0.3` | tag `v1.0.3` 自带 | 该 tag 的语料是 Blender **5.1** |
| v2.0 | tag `v1.0.3` | `main` HEAD | `main` 与 `v1.0.3` 的 `data/**` 差异巨大（新增 278 / 删除 48 / 变更 2280 文件） |
| **v3** | tag `v1.0.3` | **固定 commit sha** | 见 [`contract.md#knowledge-fingerprint`](../docs/contract.md#knowledge-fingerprint) |

**两点必须记住**：

1. **不要用 `main` 分支名做基准**：`main` 会前进，取到的内容随时变化 → 必须 pin 到 commit sha。
2. **不要用上游的版本号推导语料版本**：`main` 的 `manifest.json` / `pyproject.toml` 版本号停在滞后的开发态值，
   `v1.0.3` 内的版本号又与语料版本不同步。**代码基线与语料基线是两个不同的 ref**（I25）。

**本机已装 add-on 与 tag `v1.0.3`（commit `2cea8d566dde07fbac28a61d698909d69724e853`）逐 blob 相同（9 文件，实测）**，
因此 `contract.md#transport` 的行号级结论对两者都成立。

---

## 9. 参考来源

**上游（官方 —— 本插件唯一认的上游）**

- 产品页与安全声明：<https://www.blender.org/lab/mcp-server/>
- 仓库：<https://projects.blender.org/lab/blender_mcp>（Forgejo）
- 概览与数据流：仓库 `readme.md`
- 工具清单（26 个）：仓库 `readme_tools.rst`
- 注入提示词：仓库 `mcp/blmcp/data/prompts.yml`
- 本机扩展源码：`%APPDATA%\Blender Foundation\Blender\5.2\extensions\user_default\mcp\`

**上游（第三方 —— 明确不采用，仅用于避免混淆）**

- `github.com/ahujasid/blender-mcp`（PyPI `blender-mcp`，2.0.0 起转发 `mcp-for-blender`）：MIT，自带 add-on 与遥测

**DSH（本仓库的宿主）**

- `docs/cookbook/adding-a-tool.md`、`docs/user/develop/basic/{tool,config,publish}.md`
- `docs/agent-lifecycle.md`、`packages/core/session/src/types.ts`
- `packages/core/tools/src/index.ts`（`tools/pre-execute` 的 `Input rewriting is excluded`）
- `packages/mcp/mcp-client/`（原生 MCP 客户端的能力与限制）

**本仓库**

- [`contract.md`](../docs/contract.md)：契约、规则、不变量
- [`STATUS.md`](../STATUS.md)：交付与接线状态、待实测项
- `docs/architecture.md`：架构导读 + 两个第三方插件的实现方式对比
- `docs/upstream-facts-tools.md`：上游协议 / 26 个工具契约 / 安全面 / 许可的逐条取证
- `docs/upstream-facts-docs.md`：上游文档检索层（RST 解析与检索）的逐条取证
- [`.AGENTS/design-review-v0.5.md`](design-review-v0.5.md)：v0.5 的逐条可执行性核查（**其中的多数结论已被证伪或推翻，见 §5**）
- `diagnostics/`：**临时探针**（需要实机 Blender，不入库）
- `test/`：入库门禁（`pnpm test`：仓库一致性 + 全语料审计）
