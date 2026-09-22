# 契约文档 v0.5 设计评审（可执行性核查）

> 评审人：DSH agent　｜　评审日期：本机 Blender 活动会话实测当日
> 标注沿用 `contract.md`：**实测**（本机活动 Blender 会话，5.2.2 LTS / Python 3.13.13）/ **源码**（本机扩展源码 + DSH 仓库源码）/ **文档**（上游官方页面与 readme）/ **规范**（官方硬性要求）。
> 取证脚本：`diagnostics/probeBridge.js`、`probeUndo.js`、`probeUndo2.js`、`probeCheckpoint.js`
> （均为设计期一次性探针，**已在发布清理中删除**；现存探针见 [`architecture.md`](architecture.md) §10）。
>
> 🗄️ **已归档（历史文档，不是规范）。**
> 本文评审的是 `contract.md` **v0.5**，其中的 **§N 是 v2.0 以前的旧编号且已冻结**，不再与现行文档对应；
> 不要按本文的章节号去查现行 [`contract.md`](../contract.md)，换算表见
> [`contract.md#appendix-oldrefs`](contract.md#appendix-oldrefs)。
> **本文的多数结论已被证伪或推翻**（尤其是 undo 可用性、算子拦截方案、许可建议、工具数量），
> 现行结论以 [`contract.md`](../contract.md) 为准，被证伪的过程见 [`HISTORY.md`](HISTORY.md)。

---

## 0. 结论

**总体可执行性：高。** 传输契约、执行模型、DSH 侧接入点、拦截可行性四条主线我都逐条复核过，`contract.md` 没有方向性错误，事实基础基本成立，可以进入编码。但有 **1 处已实测证伪的事实错误**（§2.2 undo）、**1 处必须补的机制定义**（§7 拦截层如何落地）、以及 **3 处会让实现卡住的规格空洞**（越界写边界、恢复入口、多会话轮次冲突）。这些不解决会直接体现为返工，不是文字问题。

改动成本从低到高：§2.2 事实更正（零成本）→ 拦截层机制定义（半天）→ 越界写边界决策（需要你定）→ 恢复入口 + 多会话轮次（影响工具面）。

---

## 1. 已逐条复核并证实的事实

| DESIGN | 结论 | 依据 |
|---|---|---|
| §3.1 帧格式 `{"type":"execute","strict_json":bool,"code":str}` + 单字节 `0x00` | ✅ 准确；`type` 只认 `execute`，`strict_json` 非 bool 会直接报错并提示调用方有 bug | **源码** `_execute_code_from_request` |
| §3.2 请求 10 MiB / 客户端 10 s / 发送 30 s / 延迟 3600 s / backlog 5 | ✅ 四项数值全部对上；10 s 确为「未发完请求」的驱逐计数，非 exec 计时 | **源码** `_MAX_REQUEST_BYTES`/`_CLIENT_TIMEOUT`/`_SEND_TIMEOUT`/`_DEFERRED_TIMEOUT`/`_LISTEN_BACKLOG` |
| §3.2 「读循环必须连续 recv，不得 sleep」 | ✅ 成立，且有更硬的证据：响应经 `_send_partial` 排队重发，**客户端停止读取 → 30 s 后响应被丢弃、连接关闭** | **源码** `_flush_pending_writes` 注释与实现 |
| §3.3 主线程 timer 驱动、exec 期间 GUI 冻结 | ✅ 成立 | **源码** `execute_interactive.run` |
| §3.4 延迟响应仅交互模式可用、后台必须报错 | ✅ 成立：后台走 `_handle_blocking_client`，命中 `check_is_finished` 时替换为明确错误文案，不静默降级 | **源码** `_DEFERRED_UNSUPPORTED_MESSAGE` |
| §2.2 扩展自带弱沙箱范围 | ✅ 成立，但**实际比文档还窄**：`_BLOCKED_OPS` 只有 4 条（`quit_blender`/`read_factory_settings`/`read_factory_userpref`/`read_userpref`），`read_homefile` **上游不拦**——拦它是本插件自己的决定 | **源码** `weak_sandbox.py` |
| §2.3 官方安全声明原文 | ✅ 逐字一致 | **文档** blender.org/lab/mcp-server |
| §2.7 27 个工具 | ✅ 精确 27 条。补充：其中 14 条是 `_for_cli` 变体，**会另起后台 Blender 进程**，与本插件连的会话无关；「全部走同一个 execute 通道」对交互侧 13 条成立 | **文档** readme_tools.rst |
| §2.6 DSH 会话事件 | ✅ `'turn/start'`/`'turn/end'` 形状与文档一致；`ctx.on('session/event', (session, event) => …)` 是真实入口，监听器抛错会被隔离（不会拖垮 turn） | **源码** DSH `packages/core/session/src/types.ts`、多处 `ctx.on('session/event')` |
| §11.2 「不做设置页」+ profile bundle + `cordis.patch.yml` | ✅ 与 DSH 官方文档一致；`Config` 必须导出同名 Schemastery schema、非法配置加载期失败、**不得硬编码部署相关参数**均为**规范**原文 | **文档** `docs/user/develop/basic/{config,tool}.zh.md` |
| §2.1 版本/模块键/端点 | ✅ 本机实测复核：`5.2.2 LTS`、Python `3.13.13`、`online_access=true`、`bl_ext.user_default.mcp`、`127.0.0.1:9876` LISTENING | **实测** |
| §2.4 检查点式 copy 存盘 | ✅ `save_as_mainfile(filepath=…, copy=True)` → `{'FINISHED'}`，**会话 `filepath` 保持不变**，磁盘上确实出现文件 | **实测** |
| §12 版本门控取证 | ✅ 可行：`bpy.utils.user_resource('EXTENSIONS')` 返回扩展根目录，进程内 `open()` 可读 `<root>/user_default/mcp/blender_manifest.toml`，拿到 `version`/`blender_version_min` | **实测** |

---

## 2. 必须更正的事实错误：undo 不是「不可用」

`contract.md` §2.2 写「桥接内 `undo()` ❌ `poll() failed`，`undo_push` 按不可用处理」，§13.3 据此立不变量 I3。**实测证伪**：

| 探针步骤 | 结果 |
|---|---|
| `bpy.ops.ed.undo.poll()`（空会话，冷启动） | `false` |
| `bpy.ops.ed.undo_push.poll()` | **`true`** |
| `bpy.ops.ed.undo_push(message=…)` | **`ok`（成功）** |
| `bpy.ops.ed.undo()`（紧接 push 之后） | **`ok`（成功）** |
| push+undo 之后再 `undo.poll()` | `false` |

**正确结论**：`undo` 的 `poll()` 反映的是「**undo 栈里当前是否有可弹出的记录**」，不是上下文不合法。历史为空时它返回 `false`，看起来像 `context is incorrect`（这正好解释了 §10 事故里为什么直接 `undo()` 会失败）；而 `undo_push()` **可用**，push 之后 `undo()` 也随之可用。旁证：`recover_probe.py` 里那个 25 次循环的 `undo()` 救回流程，本身就说明 undo 有时是能跑的。

**对设计的影响（正面）**：如果先 `undo_push` 再用 `undo` 是一条可行路径，就能在同会话内得到一次**零文件成本的轻量还原点**。但第 2 步要确认这不会反过来污染可逆性——**实测**发现 `undo_push` 会把 `bpy.data.is_dirty` 置为 `true`，也就是**桥接自己动一下就会让用户会话变脏**，这在 `status` 的 `save_status` 里会被读成「有未保存改动」，必须显式处理（要么 push 后记录并抵消该标记，要么在 `save_status` 里注明是桥接造成的脏标记）。

**建议**：§2.2 改为「undo 家族在历史为空时 `poll()` 失败；`undo_push` 可用且可作为轻量还原点，但会使会话变脏」；§12 的 Q4 中 `undo_push` 一项结案。I3 应改写成「不得假设 undo 一定能回滚到任意期望状态」而不是「不得假设有 undo」。

---

## 3. 规格空洞（会卡实现）

### 3.1 §7 拦截层「怎么落地」没有定义（最关键）

§2.4 只证明了「某个机制拦得到」，§7 只列了清单，但从未说明**拦截器以什么形式出现在 exec 里**。实现上至少有三件事必须现在定：

1. **注入与还原**：护栏代码是每次 `exec` 前置拼接，还是由桥接先做一次常驻安装？如果用「与用户代码同一个 exec 拼接」，就必须处理：护栏安装代码本身被 `CaptureOutput`/`WeakSandboxForLLM` 包裹、`result` 变量冲突（`namespace = {"result": {}}`，用户代码会覆盖它）、以及用户代码 `return`/异常时护栏的还原时机。
2. **被用户代码反噬**：如果用户代码自己 `builtins.open = orig`、`os.remove = orig`，护栏是**静默失效**还是能被检测到？一个「看起来拦住了但其实没拦」的拦截层，比没有更危险。至少要：安装后校验钩子仍是自己的、退出前再校验一次，并把校验结果写进返回。
3. **并发/后台线程**：`exec` 期间补丁是进程级全局的。Blender 单次 exec 在主线程，但**其它线程**（后台渲染、图像保存、插件自己的 I/O）可能在补丁窗口内调用 `open`/`os.remove`，从而被误判为越界。需要明确：钩子是否按线程判定、非主线程一律放行。
4. **不变量 I1 必须作用于钩子本身**：钩子内的任何清理/轮换逻辑，保护集合为空时必须硬中止（§10 的根因正是空集退化）。

### 3.2 §7.2 白名单有洞：`wm.save_mainfile`

清单只列了 `wm.save_as_mainfile` 且非 `copy=True`。**`bpy.ops.wm.save_mainfile()` 是独立算子**，等价于 Ctrl+S，会直接覆盖 `bpy.data.filepath` 指向的用户文件，且**不在清单里**。同理需要显式覆盖的还有：`io.open`、`os.open`、`shutil.copyfile/copy2/move`、`os.truncate`、`pathlib.Path.write_bytes`（若走 `io.open` 则已被覆盖，需在实现时确认，不能假设）。§7.2 应该改为**按「写路径」而非「算子名」列清单**，算子名只作为补充。

### 3.3 §7.2「越界写」的边界需要你定（见第 5 节 Q1）

当前表述是「任何写操作 `realpath` 不在任务目录内 → 拒绝」。这条规则的**目标**（防覆盖用户资产）和**手段**（只允许写任务目录）不匹配，会误伤大量正常流程：渲染出图、导出 GLB、渲染序列、报告都天然落在 `<workspace>` 下而不是 `.dsh-blender-{task}/` 里。而且我在实测中发现，桥接进程的**当前工作目录是 `C:\Program Files\Blender Foundation\Blender 5.2`**（**实测**：`os.getcwd()`），所以「写相对路径」在 Blender 里根本不会落到 workspace，插件必须强制派发绝对路径——这一点 §6 的「强制落点」是对的，但**理由**应当补上，否则实现者会以为相对路径可以用。

### 3.4 §8.6 选了回滚来源，但没有回滚入口

§8.6 定义了 `restore_source = argmax(mtime)`，§5 的 4 个工具里却没有任何一个能执行回滚。真要靠 agent 手写 `bpy.ops.wm.open_mainfile` 自救，就需要：`check_existing=False` 才不会弹窗、`open_mainfile` 会重置偏好上下文（**规范**：`wm.open_mainfile` 与 `read_homefile` 的偏好加载行为不同，需要实测确认 `--factory-startup` 语义）、而且它正是 §7.2 里「不拦但强制检查点」的那条。**建议**：要么 `blender_mcp_snapshot` 增加 `action: "restore"`（受控回滚，天然有确认语义），要么明确写「回滚由 agent 用 exec 执行、插件只提供路径与 mtime 证据」——现在两处都不落地。

### 3.5 多会话 / 子 agent 的轮次冲突

`turn` 编号是**每会话**的，而 Blender 套接字和检查点目录是**全局**的。同一 workspace 下并发两个会话、或一个会话起了子 agent 并行干活时：

- `checkpoints/turn-{T}.blend` 的 `T` 会跨会话重名，两个会话互相覆盖或误删对方的检查点；
- §8.2「兜底：下一轮 turn/start 先收尾轮换」在多会话下会由**另一个会话**触发轮换，直接删掉别人正在用的检查点（I1 保护集合是「本插件登记过的」，跨会话是否共享登记簿没写）。

**建议**：检查点文件名引入会话前缀并用稳定标识（不是名字），并把「收尾轮换」限定为「只轮换本会话登记的检查点」。

### 3.6 §13.1 与 §8.2 的次序矛盾

§13.1「本轮首次写操作前先落检查点，**无检查点不执行**」 vs §8.2「`turn/start` 不立刻产生检查点」。那么：落检查点**本身**算不算「首次写操作」？如果检查点写盘失败（磁盘满/权限），是拒绝执行还是降级放行？§8.5 只说了体积超限不硬失败，没说**写失败**。这条必须明确，因为它决定 `exec` 的失败模式。

### 3.7 响应体积上限没有定义

`readme` 只约束了请求 10 MiB，**响应没有上限**，只有 30 s 发送窗口。一次 `inspect` 或一次大 stdout 很容易撑爆；§3.2 的记录里应该补一句「响应无硬上限，靠 30 s 窗口与客户端 drain」并让 `exec`/`inspect` 自带截断。

---

## 4. 次要问题与优化建议

1. **§3.3 数值表述**：timer 默认 `0.05` 是模块常量，但**偏好默认值是 0.25 s**，空闲退化在 5 s 无活动后发生——与文档一致，建议写明「默认 0.25 s / 5 s 后退化到 1 s」并注明这是 Blender 偏好项，用户可改（因此诊断里不该硬编码这两个数）。
2. **§9 的缓解措辞**：「关闭 `online_access` 时扩展根本不会启动」已实测（`register()` 早退 + 后台模式 `--online-mode`），这条可以更硬气地写成可验证断言。
3. **§2.7 建议补 CLI 变体**：14 个 `_for_cli` 工具会另起后台 Blender，README 里值得点明，否则用户会以为本插件也能做后台批量。
4. **§11.1 建议零依赖**：`package.json` + `index.js` 的形态完全可以只用 `node:net`/`node:fs` 实现（除 DSH 自身 import 外）。若引入 TypeScript 构建，会把自己拖进 §11.3 描述的 `prepare` 构建/`allowBuiltDependencies` 授权问题。建议 v1 用纯 JS + JSDoc 类型，把构建链留到 v2。
5. **§6 任务目录 slug**：Windows 保留名与结尾点号已考虑，建议再补「不与 `.dsh-blender-{task}.json` 属主标记自身同名」和「大小写不敏感文件系统下的重名判定」。
6. **§7.3 `risk_notes` 的 AST 命中**：AST 只作提示（§2.4 已定），但**静态 AST 会漏**——建议 `bpy.data.*.remove()` 一类改为**运行时**统计（钩住 `bpy.data` 的 remove 或在 exec 后比对数据块计数差），静态命中只作为补充信号，否则「未命中即安全」的错觉比不报更糟。
7. **§10 事故的 I1 落地**：脚本已删除、事故已恢复，建议把 `guard_probe.py` 之外的那次「25 次 undo 循环」的恢复证据结论化写进 §10（它就是 undo 可用性的旁证）。
8. **文档口径**：§1.1 强调「不是 MCP 客户端」，但 §3 标题「传输契约」容易让人误解为 MCP 帧格式；建议在 §3 开头补一句「这是 add-on 私有套接字协议，与 MCP 无关」。

---

## 5. 待定问题 —— 已全部定稿（2026-09-16 评审对话）

| 编号 | 问题 | 决定 |
|---|---|---|
| Q4 | 越界写边界（原评审 Q1） | **维持现状**：可写范围只有任务目录；报告/渲染/导出全部落在任务目录内。拒绝不是静默报错，而是返回 `blocked_path` / `reason` / `suggested_path` / `handoff`，明确提示「需由用户接管」。 |
| Q5 | 检查点写盘失败（原评审 Q4） | **硬失败**：拒绝执行并给出可操作原因；体积超限仍按 §8.5 只告警。 |
| Q6 | 回滚入口（原评审 Q3） | **不加工具**：回滚由 agent 用 `blender_mcp_exec` 调 `wm.open_mainfile`；插件只提供候选路径、两端 mtime 与 `argmax(mtime)` 结论。 |
| Q7 | undo 集成（原评审 Q2） | **纳入**：检查点落盘后、首次实际写前 `undo_push`；回滚优先 undo、检查点兜底；必须处理 `is_dirty` 副作用并报告实际通道。 |
| Q8 | 交付形态（原评审 Q5） | **纯 JS + TS 仅类型检查**：无构建产物，顺带消除 `prepare`/`allowBuilds` 授权链。 |

以上均已写回 `contract.md`（v0.6）：§2.2、§7.2、§7.3、§7.6、§8.2、§8.4、§8.7、§11.1、§11.3、§12、§13。

**由此新增的实现约束**（编码前必须落实）：

- 拦截层的注入/还原/自检机制（§7 尚未定义，见本文 §3.1）——这是下一步唯一的机制性缺口。
- `risk_notes` 必须用**运行时**数据块计数差，静态 AST 只作补充。
- §7.1 的「拒绝 + 接管提示」需要一个统一的返回结构，越界写与越界删共用。
