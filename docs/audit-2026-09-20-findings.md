# 深度审计发现（2026-09-20）

> 这是一份**时间点评审记录**，不是规则来源。契约与不变量的唯一来源仍是 [`contract.md`](contract.md)；
> 待办归属仍是 [`STATUS.md`](STATUS.md)。本文件里的每一条都只是"某次审计在某个 commit 上看到的事实"，
> 修掉之后不需要维护它——它可以被后来的审计记录取代。
>
> 审计范围：`index.js`、`lib/**`、`buildKnowledge.js`、`diagnostics/**`、`docs/contract.md`。
> 审计方法：先跑仓库自带的门禁，再逐条把文档主张与代码对照，最后对可疑点写**一次性探针实测**（探针已删除）。
>
> 标注约定沿用 `AGENTS.md`：**实测** / **源码**。
> ⚠️ 本文件里对 `AGENTS.md §N` 的引用用的是**改写前的旧编号**（新版 AGENTS.md 没有章节号）；
> 同理，文中出现的 `diagnostics/checkRepo.js`、`diagnostics/auditCorpus.js` 如今在
> [`test/repo.test.js`](../test/repo.test.js) 与 [`test/corpus.test.js`](../test/corpus.test.js)。
> 本文件**不声称**任何"安全性"结论；两层护栏都不是安全边界（I10）。

---

## 0. 摘要

门禁全绿，但门禁看不见下面这些：

| # | 严重度 | 一句话 | 依据 |
|---|---|---|---|
| **1** | 高 | L1 环境写护栏**有跨调用状态**，同一段代码第二次扫就不再拦 | **实测** |
| **2** | 高 | `save_as_mainfile(copy=True)` 的目标路径**在 L1 与 L2 都不做范围校验** | **实测** + 源码 |
| **3** | 中高 | deferred 两段读取在两帧合并到达时**丢掉第二帧**，竞态失败 | **实测** |
| **4** | 中 | `blender_mcp_docs` **每次都向 add-on 发一次 exec**，违反 contract I19 | 源码 |
| **5** | 中 | `knowledge.maxHits` 是**读了不用的死配置**（I12），且生效默认值与发布默认值不一致 | 源码 |
| **6** | 中 | 渲染设置**基线在 exec 之后才采集**，首次写操作的漂移永远报不出来 | 源码 |
| **7** | 中 | L2 的文件族钩子**常驻**，并把上一次 exec 的作用域强加到整个 Blender 会话（I16） | 源码 |
| **8** | 低 | 一批导出符号无人使用；其中 `readUndoBaseline` 的死掉意味着一处**文档化的回滚前置检查根本没实现** | 源码 |
| **9** | 低 | 护栏的 `noted`（范围内写轨迹）被采集但**从不回报** | 源码 |
| **10** | 低 | 发布出去的 `snapshot.name` 描述与实现不符；`loadKnowledge` 的 JSDoc 承诺了不存在的缓存 | 源码 |
| **11** | 提示 | `checkRepo` 的 R3/R4 覆盖面不足，正是 F5 与若干锚点检查漏网的原因 | 源码 |
| **12** | **高** | 契约要求的"undo 栈增长检测"在 5.2 上**无从测量**：`Scene.undo_history` 不存在，基线与现状两侧恒为 `None`，于是"没有用户编辑"这个**安全信号恒真** | **实测** |
| **13** | 中低 | 知识库有 45 处 `literalinclude:` 指针，但**没有任何通道**能读到被指的示例脚本（`examples[]` 通道只存在于注释里） | 源码 + 实测 |
| **14** | 中 | 端口扫描找到的 `activePort` 不被后续工具沿用：`status` 说连上了，`exec` 仍打配置端口 | 源码 |
| **15** | 中 | **验收方法自身有副作用**：两个探针往用户的活动场景里造物体且不回收；`.blend` 未保存时残留**无法靠重开文件消除**，并污染后续所有计数测量 | **实测** |

F12–F15 是**返工期间**新发现的（§3.9）。F1–F11 的处理结果见 §5；F12、F14、F15 已修，F13 **未修**，只登记。

已澄清、**不是**缺陷的两项见 §4（`session/event` 事件名、残留 connect 定时器）。

---

## 1. 高危

### F1 — L1 环境写护栏有跨调用状态（实测）

`lib/requestPolicy.js:63-66` 的四条 `ENV_WRITE_PATTERNS` 编译时带 `/g`：

```js
{ pattern: /\bbpy\.context\.preferences\b\s*\.\s*[A-Za-z_]\w*\s*\.\s*[A-Za-z_]\w*\s*=[^=]/gu, ... }
```

消费方式是 `lib/requestPolicy.js:193-195` 的**直接 `pattern.exec(source)`**，且从不重置 `lastIndex`：

```js
for (const { pattern, what } of ENV_WRITE_PATTERNS) {
  const found = pattern.exec(source)
```

`/g` 正则的 `lastIndex` 挂在**正则对象**上，而这些对象是模块级单例——于是护栏的判定结果取决于
**本 Node 进程此前扫过什么**。命中一次之后 `lastIndex` 停在匹配末尾，下一次同样的源码从中间开始找，找不到，放行。

探针结果（同一进程内连扫同一条环境写）：

```
--- C. 同一条环境写连扫两次（第二次还拦吗）---
  run1 blocked=true
  run2 blocked=false     <-- DEFECT
  run3 blocked=true
```

四种环境写形态单独扫时都正确拦截（`blocked=true reason=environment-change`），
所以缺陷不是"模式写错了"，而是**纯状态泄漏**，且呈**奇偶交替**（run3 又拦住，因为 run2 把 `lastIndex` 归零了）。

对照：同文件其它族用的是 `source.matchAll(...)`（`lib/requestPolicy.js:87,125,153,181,206`）。
`matchAll` 在内部**克隆**正则，不会推进原对象的 `lastIndex`，所以那几族没有这个问题——
缺陷精确定位在唯一使用裸 `exec` 的这一族。`COPY_TRUE_PATTERN`（`lib/requestPolicy.js:70`）是 `/u` 无 `g`，
它的 `.test()`（`lib/requestPolicy.js:108`）也因此安全。

**影响**：`environment-change` 是拦"改偏好 / 启停 add-on / 打开脚本自动执行"这类**跨会话持久**写的那一层。
它会在本该拦的时候静默不拦，且不可复现于单次调试——只有连扫才暴露。

**修法**（任选其一，都很小）：去掉这一族的 `g` 标志（这族只需要"有没有"），或在 `exec` 前显式
`pattern.lastIndex = 0`。更一致的做法是统一改成 `matchAll` 或 `.test()`（无 `g` 时）。

---

### F2 — `save_as_mainfile(copy=True)` 绕过界外路径校验（实测 + 源码）

**L1**：`lib/requestPolicy.js:106-121` 只检查 `copy=True` **是否存在**：

```js
if (module === 'wm' && name === 'save_as_mainfile') {
  const literal = extractLiteralPath(rawArgs, ['filepath', 'file'])
  const copies = COPY_TRUE_PATTERN.test(rawArgs)
  if (!copies) {
    return reject({ ... path: literal.value, ... }, { code, allowRoot, blenderCwd })
  }
}
```

`literal` 在 `copies === true` 的分支里**被取出后被丢弃**——从未与 `allowRoot` 比较。
同文件的删除/改名族（`lib/requestPolicy.js:125-141`）走的是 `resolveTarget` + `isInsideTask` 的完整校验，
`save_as_mainfile` 少了这一步。

**L2**：`lib/guardPayload.js:331-333` 的算子直通分支同样不看路径：

```python
if module_name == 'wm' and kwargs.get('copy') is True:
    _dsh_noted(kwargs.get('filepath'), module_name + '.' + op_name + '(copy=True)')
    return real_op(*args, **kwargs)
```

它在 `if not _dsh_checked()` **之前**返回，且整个 `wm.*` 分支里没有任何一处调用 `_dsh_in_root`
（`lib/guardPayload.js:336-341` 只做 `overwrite-save` / `discard-session` 判定，不做路径判定）。
`_dsh_in_root` 只在文件族（`lib/guardPayload.js:215,234`）被用到。

探针结果：

```
--- D. save_as_mainfile(copy=True) 指向界外 ---
  L1: blocked=false reason=- issues=0        <-- DEFECT
  L2 载荷里有 copy 直通分支: true
  L2 对 wm.* 界外路径做判定吗: false          <-- DEFECT
```

**这与契约并不冲突，是实现少写了一半。** [`contract.md:577`](contract.md) 要求
"`wm.save_as_mainfile(copy=True)` 必须在算子层放行"，理由是它是**检查点机制自己的**存盘出口
（[`contract.md:657`](contract.md)）。检查点确实只在界内写：`lib/checkpoint.js:165-172` 的路径由
`join(this.taskRoot, 'checkpoints', ...)` 派生。所以正确的判据是**"copy=True 且落在允许根内 → 放行"**，
而不是"copy=True → 无条件放行"。现状是任意用户代码可以
`bpy.ops.wm.save_as_mainfile(filepath='C:/Users/…/重要文件.blend', copy=True)`
**覆盖掉一个与会话无关的用户文件**，两层都不拦，也不出现在 `issues` / `blocked` 里。
这违反 I5（可写范围只有任务目录）与 [`contract.md:487`](contract.md) 对"写向已存在文件"的定性。

**修法**：L2 的直通分支加 `_dsh_in_root(kwargs.get('filepath'))`，不满足就走 `_dsh_block`；
L1 在这一支补 `resolveTarget` + `isInsideTask`，与删除族同构。注意检查点走的是
`lib/checkpoint.js:173` 的直连 `sendExecute`，**不经过 L1**，所以收紧 L1 不会影响 I1 的落盘路径——
这点值得在修的时候顺手加一条断言。

---

## 2. 中危

### F3 — deferred 第二帧在合并到达时丢失（实测）

`lib/protocol.js:224-236` 的 `onData` 只在**当前这个 chunk** 里找定界符，找到就截断，**尾部字节被丢弃**：

```js
const onData = (chunk) => {
  const at = chunk.indexOf(DELIMITER)
  if (at === -1) { chunks.push(chunk); return }
  chunks.push(chunk.subarray(0, at))
  ...
}
```

而 `sendExecute` 的第二段（`lib/protocol.js:87`）是一次**全新的** `readFrame`，带着全新的空 `chunks`
（`lib/protocol.js:195-196`），完全依赖"第二帧会在未来的某个 `data` 事件里单独到达"。

[`contract.md:313-318`](contract.md) 的时序是：帧 1 在代码执行完时立刻发出，帧 2 在后续 tick 发出。
两者通常有时间差，所以多数情况下能工作——但**只要两次 `socket.send` 的字节落进同一个读**，
第二帧就在第一帧的 `data` 事件里被扔掉，随后 `end` 触发：

```
FAIL 耗时 3 ms code=truncated-response message=连接在收到定界符前被对端关闭
```

对照实验（人为把两帧拉开 30 ms）：`OK result={"final":true}`。
也就是说这是**竞态**，不是必然失败——最快的 deferred 任务（首轮 `check_is_finished()` 就返回 dict、
或 `bpy.app.is_job_running` 立刻转假的那类，见 [`contract.md:324`](contract.md) 的模板范式）最容易撞上。

**实际代价**：工具返回 `truncated-response`，而 **Blender 侧的任务还在跑**（[`contract.md:319`](contract.md)）。
调用方看到的是一条看起来像"连接失败"的错误，最自然的反应是重试——于是同一个有副作用的长任务被执行两次。

**修法**：把帧缓冲提到连接作用域（一次 `sendExecute` 共享一个累加器），或让 `readFrame`
返回 `{envelope, rest}` 并把 `rest` 喂给第二段。顺带一提，`looksDeferred`（`lib/protocol.js:102-104`）
的判据是结构性的，这一点是对的；问题只在字节层。

---

### F4 — `blender_mcp_docs` 每次调用都发 exec（源码，违反 I19）

`lib/tools.js:894-895`：

```js
const fingerprint = await readFingerprint(context.config)
const drift = computeDrift(meta?.blenderVersion, fingerprint?.blenderVersion)
```

`readFingerprint`（`lib/tools.js:1048-1055`）是一段实打实的 `sendQuiet` → `sendExecute` → 连 add-on 的 Python。

而 [`contract.md:122`](contract.md) 写的是：知识库"只读磁盘上的静态资产，不联网、不回传、
**不产生任何对 add-on 的请求**、不写任何位置（§14.6 / I19）"，另见 I19/I20（[`contract.md:1218-1219`](contract.md)）。
`docs` 工具当前的行为**直接违反**这一句。

附带两个后果：① 每次检索多付一次 socket 往返，add-on 没起来时白白等一轮超时；
② `drift` 这个字段在 `status` 里已经有权威来源（`lib/tools.js:157` 用的是 `diagnose()` 已经拿到的指纹），
`docs` 里的这份是重复计算。

**修法**：`docs` 里删掉探测，`drift` 要么不报，要么从 `status` 最近一次已知指纹取（只读缓存）。

同一处还有第二个问题：`loadKnowledge` 的 JSDoc 说"载入知识库索引（**进程内缓存**）"
（`lib/tools.js:958`），但 `lib/tools.js` 里**没有任何缓存**（全文搜 `cache` 无命中），
`lib/tools.js:965-981` 每次都重新 `readFile` + 解析 `files.jsonl` / `df.json` / `tokens.json`
（语料归一化体量约 14.7 MB，见 `knowledge/meta.json` 的 `normalizedBytes` 实测值 14725671）。
注释承诺与实现不符，且这是每次检索的固定开销。**修法**：加一个模块级 promise 缓存，或改掉那句 JSDoc。

---

### F5 — `knowledge.maxHits` 是死配置（源码，违反 I12）

- 声明：`index.js` 的 `Config`（`index.js:57-132` 区间内）里 `knowledge.maxHits`，默认 `8`。
- 传入：`lib/tools.js:970` `KnowledgeIndex.load(root, { maxHits: context.config.knowledge.maxHits })`。
- 存下：`lib/knowledge.js:93` `this.maxHits = maxHits`。
- **读取**：无。`this.maxHits` 在 `lib/knowledge.js` 里没有任何消费者（全文只有 `:81/:93/:112/:149`
  四处，全是构造与透传，没有一处参与检索判定）；检索实际用的是
  `options.maxResults ?? 20`（`lib/knowledge.js:164`，截断在 `lib/knowledge.js:197`），而调用方在 `lib/tools.js:946`
  已经把它夹到 `clampNumber(args.maxResults, 1, 50, 20)`。

于是：配置项**读了不用**（I12 与 [`../AGENTS.md`](../AGENTS.md) §1.4 明令禁止），
而且生效默认值是 20、发布的默认值是 8——用户把这个值调大调小都没有反应。

**修法**：要么让 `maxResults` 缺省时回落到 `context.config.knowledge.maxHits`，要么删掉这个键并同步
`index.js` 的 schema、`docs/contract.md#config` 与 `STATUS.md`。二选一，但不能维持现状。

（为什么门禁没抓到：`diagnostics/checkRepo.js:115-130` 的 R3 只对 5 个文件里的
`config.<顶层键>` 做正则存在性检查，**叶子键** `knowledge.maxHits` 因为顶层 `knowledge` 被读过而通过。见 F11。）

---

### F6 — 设置基线在 exec 之后采集，首次写操作的漂移报不出来（源码）

`lib/tools.js:578-583`，注意顺序——**执行完之后**才采：

```js
const settings = await captureSettings(context.config)
if (settings !== undefined) { context.settingsBaseline.remember(sessionId, settings) }
const settingsBaseline = context.settingsBaseline.get(sessionId)
const settingsDrift = diffSettings(settingsBaseline, settings)
```

`remember` 的语义是"每个会话**只记第一次**"（`lib/settingsGuard.js:99-102`，且从不覆盖已有基线），
而它在全仓库**只有一个调用点**，就是上面这行（`lib/tools.js:580`）。推论链：

1. 会话内**第一次** exec 时 `get()` 返回 `undefined` → `diffSettings(undefined, …)` 直接返回 `[]`
   （`lib/settingsGuard.js:86`）→ **首次 exec 无论改了什么，`settingsDrift` 都是空的**。
2. 记进基线的是**首次 exec 之后**的状态。也就是说：如果第一次 exec 把 `cycles.samples` 从 4096 改成 256，
   那么 256 从此成为"用户原本的设置"，后续任何一次探测都**不会再报这条漂移**——而这恰好是
   `index.js:186+` 的 `SETTINGS_POLICY` 里复盘过的那次事故形态（把探测值固化成交付值）。
3. `blender_mcp_status` 只 `get` 不 `remember`（`lib/tools.js:160-166`），所以一个只用只读工具的会话
   `settingsBaseline` 恒为 `null`、`settingsDrift` 恒为 `[]`——**空数组既表示"没有漂移"也表示"不知道"**，
   调用方无法区分。系统提示却告诉模型"看到 `settingsDrift` 非空就还原"（`index.js:236-238`）。

**修法**：基线必须在 **exec 之前**采（或在 `status` 首次成功采集时就 `remember`），
并且把"尚无基线"表达成一个独立信号而不是空数组。这一条改动很小，但它决定了整套软限制是否真的有效。

---

### F7 — L2 文件族钩子常驻，并把上次 exec 的作用域外溢到整个会话（源码，违反 I16）

`_dsh_install`（`lib/guardPayload.js:394-422`）替换了 `builtins.open`、`os.open/remove/unlink/rmdir/rename/replace/mkdir/makedirs`、
`shutil.rmtree/move/copyfile/copy2`、`pathlib.Path.write_text/write_bytes/touch/unlink/mkdir/rmdir`。
收尾只还原了算子：

```python
intact = _dsh_proxy_in_place()
try:
    _dsh_bpy.ops = _dsh_state.original_ops
except Exception:
    pass
```
（`lib/guardPayload.js:492-496`）

文件族钩子**没有对应的卸载步骤**——`lib/guardPayload.js` 里不存在 `_dsh_uninstall`。
更关键的是 `_dsh_finalize`（`lib/guardPayload.js:466-509`）**没有把 `_dsh_state.enabled` 置假**
（`enabled` 只在载荷渲染时写入，`lib/guardPayload.js:95`），而 `_dsh_checked()`
（`lib/guardPayload.js:130-136`）只看 `enabled` 与线程作用域。

于是两轮 exec 之间：钩子在位、`_dsh_checked()` 为真、`requested_root` 还是**上一次 exec 的任务目录**
（`finalize` 只清了 `installed_root`，`lib/guardPayload.js:500`）。此时 Blender 主线程上**任何**
其他来源的文件写（别的 add-on、handler、UI 触发的脚本）都会被上一次那个作用域判定为界外并抛
`PermissionError`。

这正是 `lib/guardPayload.js:135` 自己写下的顾虑所描述的故障面——"补丁是进程级全局的……
后台线程被拦会造成无法解释的故障面"——只不过它把线程维度排除掉了，**时间维度没有排除**。

与 I16 的关系：[`contract.md:562/1215`](contract.md) 要求"L2 护栏只在 exec 作用域内安装，**不得常驻**"
（另见 [`../AGENTS.md`](../AGENTS.md) §1.4 把"让 L2 护栏常驻"列为禁止项）。当前实现是常驻的。

**边界说明**（沿用 I10 的措辞要求）：这一层不是安全边界，只防误操作；但"防误操作"反过来
**误伤用户自己的 Blender** 同样是缺陷。

**修法**：`_dsh_finalize` 里补文件族钩子的还原（`original_open` / `original_os` / `original_shutil` /
`original_pathlib` 都已经存着，`lib/guardPayload.js:79-82,377-379,407-408,417-418`，材料齐全），
或至少在收尾时 `_dsh_state.enabled = False` 并把 `requested_root` 清空——前者更干净，
因为它同时消除"钩子在位但形同虚设"这一类自检歧义。

**标注**：本条是**源码**推理，未在实时 Blender 里实测（本轮没有可用的 add-on 会话）。
落地修复时应先用 `diagnostics/probeGuard.js` 补一条"两轮之间界外写不被拦"的实测断言。

---

## 3. 低危与信息项

### F8 — 死符号，其中一个是"文档化安全检查未实现"

无人使用的导出（全仓库搜索无消费者）：

| 位置 | 符号 | 备注 |
|---|---|---|
| `lib/tools.js:1207` | `ensureExtension` | 见 F10：本该被 `snapshot` 用 |
| `lib/tools.js:1225` | `guardInternals` | JSDoc 自称"探针/测试用"，但 `diagnostics/*` 都没用它 |
| `lib/tools.js:1235` | `writeReport` | JSDoc 称"内部用"，实际 undo 基线是 `lib/checkpoint.js:308` 自己 `writeFile` |
| `lib/tools.js:1247` | `humanBytes` | 只是 `formatBytes` 的转发 |
| `lib/knowledge.js:362,368` | `isDefinitionType`、`SEGMENT_TYPES` | 同文件只有 `DIRECTIVE_HANDLING`（`lib/knowledge.js:387`）被 `diagnostics/auditCorpus.js:15` 消费 |
| `lib/diagnostics.js:198,225` | `resolveEndpoint`、`HANDSHAKE_SOURCE` | — |
| `lib/taskDir.js:214` | `listTaskDirs` | — |
| `lib/checkpoint.js:256` | `readUndoBaseline` | **见下** |

重复实现：`sendReadOnly`（`lib/tools.js:91-99`）与 `sendQuiet`（`lib/tools.js:1064-1072`）行为一致；
`endpointOf`（`lib/tools.js:1033-1040`）与 `index.js:489` 重复。

**值得单独点名的一条**：`readUndoBaseline` 死亡意味着 undo 基线**只写不读**——
`lib/checkpoint.js:308` 写入、`lib/checkpoint.js:245` 随轮换删除，从未被加载。
而 [`contract.md:671-672`](contract.md) 把它当作回滚的前置条件：

> - push 时记录基线（undo 栈深度、`bpy.data.filepath`）；
> - 回滚前检查基线之后是否出现**非本插件**的栈增长（用户手工编辑）；

即：**"回滚前检查用户是否手工编辑过"这一步在当前实现里不存在**，回滚路径
（`pickRestoreSource`，`lib/checkpoint.js:347`、消费者 `lib/tools.js:226`）直接取更近的一份。
这不是死代码问题，是**一条文档化的保护没有接线**。应进 `STATUS.md` 待办，或在
[`contract.md`](contract.md) 里把该条降级为"未实现"。

### F9 — 护栏的 `noted` 被采集但从不回报（源码）

`_dsh_noted` 在三处记录范围内写与检查点存盘（`lib/guardPayload.js:332,218,237`），
`_dsh_finalize` 把它放进返回元数据（`lib/guardPayload.js:506`）。
但 `lib/tools.js` 全文**没有一处读 `meta.noted`**——只读了 `risk_notes`（`lib/tools.js:587`）、
`intact`（`lib/tools.js:609-610`）、`tampered`、`reinstalls`（`lib/tools.js:611-612`）与
`blocked`（`lib/tools.js:639-648`）。

后果：审计轨迹是不对称的——"被拦了什么"有报告，"实际写了什么"没有。对 F2 这类
"copy=True 存盘到某处"的行为，`noted` 本来是唯一的可见性来源。

### F10 — 发布描述与实现不符（源码）

`index.js:651` 对 `snapshot` 的 `name` 参数写着 *"a .blend extension is added when missing"*，
但实现（`lib/tools.js:671-672`）是：

```js
const rawName = typeof args.name === 'string' && args.name !== '' ? args.name : `snapshot-${Date.now()}.blend`
const safeName = sanitizeFileName(rawName, 'snapshot.blend')
```

`sanitizeFileName`（`lib/tools.js:1193-1198`）只做分隔符/控制符/前导点清理与截断，**不加扩展名**；
`ensureExtension` 恰好存在（F8）却没被调用。所以 `name: "进度"` 产出的是没有后缀的 `进度`——
在 Windows 上这是一个打不开的文件，而描述告诉调用方它会变成 `进度.blend`。
工具描述属于已发布契约面（I23 的精神），要么实现补上 `ensureExtension(safeName, '.blend')`，
要么改描述；**不能留着描述说谎**。

另一处同类：`lib/tools.js:958` 的"进程内缓存"（见 F4）。

### F11 — 门禁的覆盖面盲区（源码）

本轮门禁全部通过：`tsc --noEmit -p jsconfig.json` 退出 0；`node diagnostics/checkRepo.js` 退出 0
（R1–R9 全过）；`node diagnostics/auditCorpus.js` 退出 0（`# 15/15 通过`，E1 实测
14725671 与 `meta.json` 一致）；`node buildKnowledge.js verify` 通过。**而 F1–F7 一个都没被拦住。**

两处结构性原因：

- **R3**（`diagnostics/checkRepo.js:115-130`）用 `'config\\.' + key + '\\b'` 在固定 5 个文件里做
  **顶层键**存在性检查。叶子键只要父键被碰过就通过 → F5 这类死配置天然漏网。
  真正的 I12 检查需要解析点号路径并追到读取点。
- **R4**（`diagnostics/checkRepo.js:138`）扫的是一个**硬编码 18 文件列表**，不含
  `docs/contract.md` 自身、`design-review-v0.5.md`（现 [`../.AGENTS/design-review-v0.5.md`](../.AGENTS/design-review-v0.5.md)）、`docs/upstream-facts-tools.md`。
  也就是说契约文件内部的相对链接与锚点**从不被校验**——而 `AGENTS.md` §3 恰恰要求"相对路径要算对，
  写错会让 R4 失效"。列表应当从磁盘枚举 `docs/**` 而不是手写。

另外：`buildKnowledge.js:603` 的 `collectExamples` 收集并计数了 112 个
`knowledge/source/api/examples/*.py`，但 `lib/**` 里**没有任何代码服务这些示例**（搜 `examples` 无命中）——
它们是随包交付的死重量（与 [`contract.md`](contract.md) 对 `package.json` `files` 不得列不存在路径的那条
红线性质的问题同源：交付物里有不服务于任何主张的部分）。

> **修正（同一轮返工中实测）**：这句"死重量"的定性**过头了**。
> [`contract.md`](contract.md#licensing) 的"履行义务"一节明确要求
> 示例文件随包（上游 `pyproject.toml` 的 `package-data` 漏了 `.py`），并且 `meta.json` 的
> `examplePyFiles` / `examplePyBytes` 就是为这条主张存在的计数器。所以它们**服务于一条文档主张**，
> 不是红线问题。真正的缺口是另一件事，见 **F13**。

---

## 3.9 返工期间新发现的四条（实测）

审计记录的 11 条修完之后，**返工过程中**又撞到四条。前三条有一个共同点：
都来自"文档/代码声称能做某事，而运行时根本没有那个 API"——正是 F6 那一类的形状。
第四条（F15）不同：它讲的是**验收方法自己有副作用**，与前 14 条不在一个层面上。

### F12 — 契约要求的"undo 栈增长检测"在 Blender 5.2 上**无从测量**（实测）

`docs/contract.md` 的 undo 集成第 3 步要求：回滚前比较基线，看是否出现**非本插件**的栈增长
（= 用户手工编辑过）。F8 把 `readUndoBaseline` 接出来之后，这条检查终于有了出口，
但**接出来才发现它比对的两个数都不存在**：

- 基线侧：`lib/checkpoint.js` 的 `#pushUndo` 用 `len(scene.undo_history)` 取栈深度 →
  **实测恒为 `None`**（`Scene.undo_history` 在 5.2 不存在）；
- 现状侧：`readSceneSummary` 用同一个表达式取"当前深度" → 同样恒为 `None`。

于是 `possibleUserEdits` 永远是 `false`，而 `false` 在这个契约里的含义是"没有用户编辑，可以安全回滚"。
**一个恒真的"安全"信号比没有信号更危险**——这正是 F6 的 `settingsDrift` 陷阱（空数组被读成"没改过"）。

探针逐个排查 5.2 里能观察 undo 的所有途径：

| 候选 | 实测结果 |
|---|---|
| `bpy.types.Scene.undo_history` | 属性**不存在**（`dir()` 里只有 `use_auto_undo`、`undo_factor`） |
| `bpy.types.WindowManager.history_active` | **不存在** |
| `bpy.app.memory_usage_undo` | 存在，但是**函数**（返回 int），且只对 `ed.undo_push` 跳变：`991046 → 1101578`；对 `mesh.primitive_cube_add`、`object.delete`、`obj.location.x = …` **完全不变** |

`memory_usage_undo` 因此**不能**当增长指标：用户的编辑不让它动，检测就会退化成"只有插件自己 push 时才变化"。

**处理方式**：不猜、不凑。`evaluateUndoPrecheck` 交出 `measurable: false` +
`userEditsIndeterminate: true` + `unmeasurableBecause`（写清是哪几个 API 不存在），
并把契约第 3 步的原要求**划掉标注为不成立**，新增第 5、6 条：
"先试 undo 回退"在无法证明安全时**不得自动采用**，证据必须如实承认不可判定。
基线里同时**删掉**恒为 `null` 的 `stackDepth` 字段（留着它就是一条永久为假的断言），
改记 `memoryUsageUndo` 作为唯一可测的 undo 相关量。

顺带把证据从 `restoreEvidence` 里**提到平级**（`riskPosture.undoPrecheck`）：
原先嵌在里面，而 `restoreEvidence` 只在"有检查点**或**有用户文件"时才生成——
未保存的工程（`filepath` 为空、首轮无检查点）恰恰最需要这份证据，却整个字段缺席。

### F13 — 知识库返回 `literalinclude:` 指针，但**没有任何通道能读到被指的脚本**（源码 + 实测）

归一化语料里有 45 处 `literalinclude` 段，形如：

```
api/blf.rst 段 3  →  "literalinclude: ./examples/blf.0.py"
api/bpy.app.timers.rst 段 0–3  →  四条这样的指针
```

`buildKnowledge.js:943-945` 对 `literalinclude` 的处理是**只留路径线索**，注释写着
"示例脚本的正文由 `examples[]` 通道提供"——而 **`examples[]` 通道不存在**：
`lib/knowledge.js` 里搜 `examples` 零命中，`blender_mcp_docs` 的三个 mode（`api`/`search`/`rules`）
都没有读脚本的能力。

后果：agent 查 `blf` 的用法，语料明确告诉它"去看 `examples/blf.0.py`"，但它拿不到那个文件——
`knowledge/` 装在插件包里，不在工作区，`read` 工具也不知道绝对路径。
这是一条**指向空气的引用**，比没有这条引用更费 token。

与 F12 同型：文档声称有一条通道（`examples[]` / "栈深度可比对"），实现里没有。
差别在于 F13 目前只是**低效**（多花 token，不会误导安全判断），所以定级为中低。

可选的修法（**本轮未实施**，见 [`STATUS.md`](../STATUS.md)）：
① 给 `blender_mcp_docs` 加一个读示例脚本的 mode，把 112 个 `.py` 真正接上；
② 或在归一化时**内联**示例正文（体积代价：0.18 MB 源文件 → 语料增长），并同步改
[`contract.md`](contract.md#licensing) 里"示例文件必须随包"那条主张；
③ 或把指针段从索引里剔掉，只在 `meta.json` 保留计数。
三者都要先改契约，**不得**先改代码再补文档（I22）。

### F14 — 端口扫描的结果**没有被后续工具沿用**（源码，F8 收尾时发现）

`diagnose` 会返回 `activePort`（在候选端口上握手成功的那个），但 `lib/tools.js` 里
每个工具各自用 `endpointOf(context.config)` 重新拼端点 → 扫描找到 9877 之后，
`exec` / `inspect` 仍然打配置端口 9876。表现是"`status` 说连上了，`exec` 报 `port-not-listening`"，
而且**只在用户开了 `allowPortScan` 时才出现**——正好是最需要它工作的那一刻。

修法：端点收敛成 `context.endpoint()` 一个出口，扫描成功的端口经 `context.rememberPort()`
进入会话缓存（`index.js` 的 `discoveredPort`），三个工具共用。
`diagnostics/probeFindings.js` 加了 3 条断言：配置端口指向死端口、候选端口指向真 add-on，
然后要求 `status` / `exec` / `inspect` **三者都**走候选端口。

### F15 — 探针在用户的**活动场景**里留下删不掉的残留（实测）

前 14 条讲的都是代码与文档；这一条讲的是**验收方法本身**有副作用，
而且副作用落在**用户看不见的地方**——直到本轮收尾才被发现。

两个探针各造一个物体，**都不回收**：

| 位置 | 造什么 |
|---|---|
| `diagnostics/probeCapabilities.js:101` | `bpy.data.objects.new("SWEEP_PROBE", None)` |
| `diagnostics/probeFindings.js:371`（F8 用例） | `bpy.ops.mesh.primitive_cube_add()` |

危害不在于"多了一个物体"，而在于**用户的 `.blend` 往往是未保存的**
（本轮实测：`filepath = null`、`is_dirty = true`）。这时残留**无法靠重开文件消除**——
没有磁盘版本可回退。跑得越多攒得越多：本轮现场是 5 个物体（用户自己的 1 个 + 探针 4 个）
外加 2 个**孤立网格**（`primitive_cube_add` 造的网格在对象被删后 `users` 归 0，
但 Blender **不自动回收**，实测确认）。

还有一层：这些物体**污染了后续所有测量**。`inspect` 的对象计数、
`riskPosture.scene.objects`、F8 用例里 `len(bpy.data.objects)` 的返回值，
全都包含了别人的残留——**验收数据本身不可信**。

**修法**（三点，缺一不可）：

1. **建与删放在同一次 `exec` 里**。检查点与 undo 基线都在用户代码**之前**生成，
   所以这条写路径被测到的仍然是原来那条；被测的断言（`checkpoint.created`、
   `guard.verified`）一个字没改。
2. **顺手回收自己的网格**：删对象后 `users == 0` 的 mesh 要显式 `bpy.data.meshes.remove()`。
   **不要**用 `bpy.ops.outliner.orphans_purge`——它会波及用户的数据块。
3. **加一条能失败的全套断言**：`probeFindings.js` 开局记录活动场景的清单
   （objects / meshes / materials / images 四组名字），收尾再量一次，**必须逐项相等**。

第 3 点的判据同样按 F11 的教训验证过它会失败：用一次性脚本注入一个泄漏的立方体，
判据报出 `objects: ["立方体"] → ["立方体","立方体.001"]`；回收后回到原样。
（该脚本已删，且它自己也遵守"不留残留"。）

> **这条应该更早被门禁看见**：`checkRepo` 的 R1–R9 全都只看仓库文件，
> **没有任何一条检查"探针会不会弄脏用户的 Blender"**。
> 本轮把它做成了 `probeFindings` 的 F15 断言（跑探针时生效），
> 但**离线**门禁仍然看不见这类副作用——这是覆盖面盲区的**第二种形态**，
> 与 F11 互补：F11 是"静态检查面太窄"，F15 是"动态验收有副作用"。

---

## 4. 已澄清的疑点（**不是**缺陷）

保留这一段，是为了避免下一轮审计重复劳动。

1. **`session/event` 事件名**：`index.js:252` 监听 `session/event`（单数）。曾怀疑应为 `session/events`。
   对照 harness 源码证伪：载体确实是单数
   （`packages/core/session/src/index.ts:72`、`packages/core/scope/src/scoped-events.generated.ts:27`）。
   轮次边界 `turn/start` / `turn/end` 与 `index.js:253-265` 的用法一致；
   `index.js:254` 把第一个参数当 Session 对象取 `.id` 也符合该载体的签名。
2. **残留的连接超时定时器**：怀疑 `openSocket`（`lib/protocol.js:114`）在连接成功后没清掉 connect
   超时，导致长响应被连接超时打掉。探针实测（服务端 hold 1500 ms、`connectTimeoutMs=400`）：
   `OK 收到响应，耗时 1512 ms`。`readFrame` 的 `cleanup`（`lib/protocol.js:201-207`）路径正确，
   该项**排除**。
3. **注释/文档串里的危险算子不被拦**（探针 E：`blocked=false`）与**变量绑定的写目标交给 L2 兜底**
   （探针 F：`blocked=false issues=["write-outside-scope"]`）都符合设计：
   `stripCommentsAndDocstrings`（`lib/requestPolicy.js:411-415`）先把注释与文档串 blank 掉，
   非字面量路径则由 L2 按 realpath 判定（`lib/guardPayload.js:111`）。L1 的**架构**是对的，
   F1/F2 是两处局部缺陷，不是整体失守。

---

## 5. 处理状态（返工后回填）

原本是"建议的处理顺序"，现在按实际结果改写：**除 F13 外全部已修并有断言覆盖；F13 未修，只登记。**
每条的修法与回归断言都在 §1–§3 正文里，这里只给索引。

| # | 状态 | 覆盖它的断言 |
|---|---|---|
| F1 | 已修 | `probeFindings.js`：同一条环境写连扫三次都拦 |
| F2 | 已修 | `probeFindings.js`：`save_as_mainfile(copy=True)` 越界目标被 L1 拦；检查点自身路径不误伤 |
| F3 | 已修 | `probeTransport.js`：两帧合并到达时 deferred 第二段不丢 |
| F4 | 已修 | `probeFindings.js`：`docs` 不再敲 add-on（I19） |
| F5 | 已修 | `knowledge.maxHits` 真正生效；`R3` 现在按**叶子键**判定 |
| F6 | 已修 | `probeFindings.js`：基线在 exec **之前**采集；"无基线"与"无漂移"可区分 |
| F7 | 已修 | `probeGuard.js`：文件族钩子在轮次之间还原 |
| F8 | 已修（并引出 F12） | `probeFindings.js`：`undoPrecheck` 字段齐全；死导出已删（`stillThere.length === 0`） |
| F9 | 已修 | `probeFindings.js`：`noticed` 出现在 exec 返回里 |
| F10 | 已修 | 发布描述与 `loadKnowledge` 注释对齐 |
| F11 | 已修 | `R3` 剥注释 + 排除 schema 声明；`R4` 从磁盘枚举 `docs/**`。**判据有效性用注入死键验证过**（能失败），不只看它绿 |
| F12 | 已修 | `probeFindings.js`：`measurable === false`、`userEditsIndeterminate === true`、磁盘基线里**没有** `stackDepth` |
| F13 | **未修** | 无。三条候选修法见 §3.9，任一条都要先改 [`contract.md`](contract.md#licensing) 的随包主张（I22），因此**故意留给人决策** |
| F14 | 已修 | `probeFindings.js`：死配置端口 + 真候选端口下，`status`/`exec`/`inspect` 三者都走候选端口 |
| F15 | 已修 | `probeFindings.js`：开局/收尾**活动场景清单逐项相等**（41/41）；判据用注入泄漏验证过**能失败** |

**F11 末关于 examples 的定性已在 §3.9 修正**：那 112 个 `.py` 服务于
[`contract.md`](contract.md#licensing) 的明主要求，
不是死重量；真正的问题是它们**没有被任何通道服务**（F13）。

**本轮改动落在**：`lib/**`、`index.js`、`buildKnowledge.js`、`diagnostics/**`、
`docs/contract.md`、`docs/architecture.md`、`docs/blender-5.2-findings.md`、
`docs/audit-2026-09-20-findings.md`、`STATUS.md`、`README.md`。
门禁与探针的最终状态见 [`../STATUS.md`](../STATUS.md)：

| 类别 | 套件 |
|---|---|
| 离线（随时可跑） | `checkRepo` 13/13、`auditCorpus` 15/15、`buildKnowledge.js verify` 通过、`tsc --noEmit` 干净 |
| 实机（需开着 add-on 的 Blender） | `probeFindings` 41/41、`probeEndToEnd` 30/30、`probeGuard` 18/18、`probeCapabilities` 16/16、`probeTransport` 14/14、`probeSettingsGuard` 11/11、`probeTaskRoot` 3/3 |

> 原文在审计结束时写的是"本轮未做任何修改"。那句话现在**过期了**：审计之后同一轮里做了返工，
> F1–F12 与 F14–F15 已落进代码，处理状态见上表。保留这段是为了说明**本文件前两节的口径**：
> 它们描述的是"审计时刻看到的事实"，不是当前代码的状态；当前状态以
> [`../STATUS.md`](../STATUS.md) 与代码为准。一次性探针脚本（`diagnostics/.scratch-*.mjs`）已全部删除。
