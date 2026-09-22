# dsh-blender-mcp-bridge — 实现契约

> **本文件是契约、规则、不变量与验收判据的唯一权威来源。**
> 它是**开发期文档**，版本与插件本体版本解耦，不跟踪实现进度。
>
> 事实来源类别：**实测** = 在本机活动 Blender 会话 / 独立后台实例 / 本机环境上验证；
> **源码** = 通读本机扩展、上游仓库或 DSH 仓库源码；**文档** = 上游官方文档与 readme；**规范** = 官方硬性要求。
>
> **各文件的职责边界**（不要把别的东西塞进来）：
>
> | 文件 | 职责 | 不包含 |
> |---|---|---|
> | **本文件** | 契约、规则、不变量、验收判据 | 实现进度、历史决策过程、逐条取证记录 |
> | [`../README.md`](../README.md) | 用户可见的说明、安装、配置、排错 | 规则推导过程 |
> | [`../.AGENTS/README.md`](../.AGENTS/README.md) | **交付状态 + 工作记忆的单一入口**：交付清单、配置接线状态、实测结论、待实测项、决策史、被证伪的旧结论、验证门禁 | 任何仍然生效的规则 |
> | [`architecture.md`](architecture.md) | 仓库结构、模块分层、运行路径（导读） | 规则本身 |
> | [`blender-5.2-findings.md`](blender-5.2-findings.md) | Blender 5.2 的实测事实（G3 规则的直接依据） | 契约、交付状态 |
> | [`upstream-facts-tools.md`](upstream-facts-tools.md) | 上游协议 / 工具契约 / 安全面 / 许可的逐条取证 | 本项目自己的规则 |
> | [`upstream-facts-docs.md`](upstream-facts-docs.md) | 上游文档检索层（RST 解析与索引）的逐条取证 | 同上 |
> | [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) | 上游语料的署名、许可与修改声明 | 设计理由 |
> | [`../AGENTS.md`](../AGENTS.md) | AI 行为准则（基础安全需要、类型安全、注释风格、git 约束、许可与 SPDX） | 项目定位与设计理由 |
>
> **引用约定**：本文件内部可以用章节号；**外部文件一律引用锚点**（`contract.md#transport`、`#invariants`）
> 或直接引用不变量 ID（`I1`–`I27`），不得引用裸章节号。章节号允许随版本变化，**锚点与不变量 ID 不变**。

---
---

## 1. 定位与架构 <a id="positioning"></a>

### 1.1 一句话定位

一个 **DSH profile bundle 插件**：让 DSH 上的模型直接说 **Blender 官方 MCP 扩展**（Blender Lab，扩展 id `mcp`）的私有套接字协议，
从而在**用户正在编辑的活会话**里安全工作。

插件只做四件事：

| # | 职责 | 落点 |
|---|---|---|
| 1 | **握手** | 端点发现、对端身份校验、版本门控、可操作的分级诊断（§5） |
| 2 | **拦截** | 只拦「不可逆且检查点救不回」的操作；其余编辑放行，写前落检查点（§7、§8） |
| 3 | **视野** | 视觉反馈（截图 / 视口渲染）+ 改动清单 + 结构化错误（§6、§8） |
| 4 | **知识** | 内嵌官方语料检索，让模型不用猜 Blender API（§11–§13） |

### 1.2 它替换了什么

官方数据流（**文档**，上游 `readme.md`）：

```
MCP Client  ⇐ MCP/stdio ⇒  blender-mcp  ⇐ TCP socket ⇒  Blender Add-on
```

本插件**替代中间的 `blender-mcp` 这一层**，直接讲 add-on 的私有套接字协议：

```
DSH  ⇐ 本插件（Node 进程内）  ⇐ TCP socket ⇒  Blender Add-on
        └─ 同进程内还持有一份只读知识库（源自官方 server 语料，但不运行它）
```

三条必须同时成立的推论：

1. `mcp` 指**被连接的 add-on**（它有 MCP 之名、无 MCP 协议），**不是**本插件实现了 MCP；
2. 本插件**不是** MCP 客户端、**不是** MCP 服务器，链路里不再有 MCP 这一层（§2.3）；
3. add-on 协议没有握手、没有能力协商、没有 `tools/list`，请求里 `type` **只认 `execute`**——把 `type` 当 MCP 方法名读就会全错。

### 1.3 明确不做

| 不做 | 理由 |
|---|---|
| 运行官方 MCP server 的**任何形态** | 那才是真的多一条不受管的执行路径（§2.3 / I10） |
| 引入 MCP SDK、分叉 `dsh-mcp-client`、注册 `mcp__*` | 同上 |
| 复用上游 `*_toolcode.py` 的**源码文本** | 只取接口形状与语义，在自有通道重写（I18） |
| 后台批处理任意 `.blend`（上游 6 个 `_for_cli`） | 属 `dsh-blender` 的领域；且它们**会先向活会话发写请求**（§4.7） |
| 建模知识引擎（"怎么建一座山"） | 定位外：本插件给"在这里安全地做"与"API 怎么用"，不给创作方法论 |
| 安全沙箱 | 那是虚假承诺（§7.1 / I10） |
| 浏览器端设置页 | 范围控制与信任边界（§15.2） |

<details>
<summary>与第三方插件 <code>dsh-blender</code> 的分工（不追求兼容，但要避免选错）</summary>

环境里另有第三方插件 `dsh-blender`，模型完全不同（**源码**，见 `docs/architecture.md` 附录）：

| | `dsh-blender` | 本插件 |
|---|---|---|
| Blender | 每个操作 spawn 一个 `--background` 进程 | 连**用户正在用的活会话** |
| IPC | 临时目录里的 `payload.json` / `result.json` | TCP 套接字 + `0x00` 定界 |
| 作用对象 | 指定 `.blend` 或 `--factory-startup` 空场景 | 活会话（含未保存改动） |
| 安全来源 | **进程隔离**（用完即弃） | 任务目录 + 多层护栏 + 检查点 |
| 看得见用户吗 | ❌ 看不见 | ✅ 就是用户的会话 |
| 知识来源 | 自带 21 KB Python 驱动，operation 是闭集 | 内嵌官方语料检索（§11） |

**处置**：不追求 API 兼容，但在 README 与工具描述里写清"什么时候用哪个"，避免模型选错工具去改用户的活会话。
</details>

---

## 2. 核心决策 <a id="core-decisions"></a>

### 2.1 知识是数据，不是第二条通道 <a id="decision-knowledge-is-data"></a>

**本插件不运行官方 MCP server，但把它的语料与实现知识置入本仓库。** 这不是自相矛盾，因为两者引入的东西不同：

| | 运行 server | 内嵌语料 |
|---|---|---|
| 新增写入通道 | ✅ 有：它自己连 add-on 并执行任意代码 | ❌ 没有：磁盘上的静态文本，无执行路径 |
| 护栏窗口之外的写 | ✅ 有：空闲期发来的请求不受管 | ❌ 没有：不产生任何请求 |
| 协议层拦不住 | ✅ 有 | ❌ 不适用 |
| 需要 Python / uv 环境 | ✅ 需要 | ❌ 不产生进程 |
| 随上游行为漂移 | ✅ 实时行为 | ⚠️ 静态快照，**可指纹追踪、可重建**（§12.4） |

**红线（I10）**：任何「从上游取能力」的方案，若引入**新的执行路径**或**与 add-on 的新连接**，一律回到本节重新论证；
**不得**在未重新论证的情况下回退到运行 server。

### 2.2 知识库是交付事实，不是可选项

**交付必定内置官方语料，且唯一入口 `blender_mcp_docs` 必须读它。**
不提供"关掉知识库"或"指向外部语料"的配置开关——原因有两条：

1. 知识库是**核心增量**而非附属功能（§11.1）：一个默认关闭、需要用户自己去找语料的功能，等于没有；
2. 「不读语料」这一状态如果存在，模型就会在真正需要查 API 时落进一个空的能力面，而**它无法分辨那是"没配"还是"没有这段"**。

**仍然成立的约束**：知识库只读磁盘上的静态资产，不联网、不回传、不产生任何对 add-on 的请求、不写任何位置（§14.6 / I19）。

**一条必须说清的边界**：`expose.docs` 这个注册开关**不属于**"关掉知识库"。
它只决定"要不要把检索工具挂进本次会话的工具面"——**语料与索引照旧随包内置、必须可用**，
关掉它不改变 I21，也不允许让知识库退化成"可选资产"。

### 2.3 只有一条写入通道

`blender_mcp_exec` 是**唯一**能改动用户会话的通道。这是 §7 的拦截层能说得上话的前提，也是"辅助创作"而非"全自动许愿机"的落点。
知识库只回答"这个 API 长什么样"，不执行任何东西。

### 2.4 不宣称安全

| 声明 | 落点 |
|---|---|
| 上游明文声明无任何防护（**规范**）：「The MCP server will execute LLM generated code in Blender **without any guards in place to protect your data from removal or being sent to a remote location**.」 | README 必须直接引用 |
| 本插件的拦截层**只防误操作**，不防对抗（动态构造、`importlib.reload`、ctypes 直调 C 都能绕过） | §8.6 / I10 |
| 工具描述与 README **禁止**出现「安全沙箱」「已保护你的数据」字样 | I10 |

### 2.5 会话变 dirty 是正确语义

桥接改动场景后会话变 dirty 是**事实，也是正确的**；桥接**不得**复位 `is_dirty` 来假装"什么都没发生"。
需要防的不是"变 dirty"，而是**用 undo 回滚时连带丢掉用户自己未保存的编辑**（§10.4）。

### 2.6 归属判定不认名字 <a id="decision-identity"></a>

中文界面下 `primitive_cube_add()` 生成的对象名是 **`立方体`**，不是 `Cube`（**实测**）。
归属判定必须用**连接时记录的稳定标识**（`as_pointer()`），不能用名字（I2）。

上游 `prompts.yml` 独立给出同一条告诫（**源码**）：*"Names auto-append `.001`, `.002` on collision — capture references immediately after creation, never look up by assumed name."*
→ 这是本项目教训与上游策展知识相互印证的例子，也是 §11.4「知识库要提炼跨工具规则、而不只是搬契约」的理由。

### 2.7 错误文本会本地化 <a id="decision-localized-errors"></a>

本机 Blender UI 为中文时，算子失败信息回来是**本地化文本**（例：`错误: 无法渲染, 没有摄像机`）（**实测**）。
→ 结构化错误（§13.1）**不得**靠匹配英文错误串判定成因，只能靠**类型 / 字段 / 算子名**等结构性信号。

### 2.8 上游有两个，不得混称

| | **官方（唯一认的上游）** | 第三方 |
|---|---|---|
| 仓库 | `projects.blender.org/lab/blender_mcp` | `github.com/ahujasid/blender-mcp`（PyPI `blender-mcp` → `mcp-for-blender`） |
| 许可 | **GPL-3.0-or-later** | MIT |
| Blender 侧 | **官方扩展**（扩展 id `mcp`） | 自带 add-on |
| 本插件定位 | ✅ 连它的 add-on、用它的语料 | ❌ **不连、不引用、不参考** |

第三方的 server 自带**遥测**（硬编码 Supabase URL 与 anon key，会上传 prompt / code / screenshot）。
一旦文档把两者混称「上游」，实现者就可能从错误的地方取契约。

---

## 3. 事实基础 <a id="facts"></a>

### 3.1 运行环境（**实测**）

| 项 | 值 |
|---|---|
| Blender / 内置 Python | 5.2.2 LTS / 3.13.13 |
| numpy | **2.3.4 可用**；PIL / cv2 / scipy **均不可用** |
| 扩展模块键 | `bl_ext.user_default.mcp` |
| 扩展版本 / 最低 Blender | 1.0.3 / `blender_version_min = "5.1.0"` |
| 默认端点 | `localhost:9876`（add-on 侧 `DEFAULT_HOST = "localhost"`），实测监听 `127.0.0.1:9876` |
| Blender 进程 cwd | `C:\Program Files\Blender Foundation\Blender 5.2` → **相对路径落不到 workspace** |
| 引擎枚举 | 只列出 `BLENDER_EEVEE`，Cycles 实际可用 → **不可作能力判据** |

### 3.2 扩展自带弱沙箱的真实范围（**源码** + **实测**）

| 项 | 结论 |
|---|---|
| 拦截内容 | 仅 `sys.exit` + `wm.quit_blender` / `read_factory_settings` / `read_factory_userpref` / `read_userpref` |
| `read_homefile` | 上游**不拦**；拦它是本插件的决定（§8.2） |
| 还原行为 | `WeakSandboxForLLM.__exit__` 在**每次 exec 结束时**还原 `_OVERRIDES` 与 `bpy.ops._op_create_function` |

最后一条是 §9.3 算子代理方案的**直接原因**：上游自己也包装了 `_op_create_function`，任何对它打的补丁都活不过一次请求。

### 3.3 undo 家族可用（**实测**）

| 机制 | 结果 |
|---|---|
| `bpy.ops.ed.undo.poll()` | 空历史时 `False`；推入记录后 `True` |
| `bpy.ops.ed.undo_push()` | ✅ 可用（`{'FINISHED'}`） |
| `bpy.ops.ed.undo()` | ✅ 可用，前提是栈内已有可弹出的记录 |

`poll() failed, context is incorrect` 的真实含义是**"栈里当前没有可弹出的记录"**，不是上下文不合法。
→ **I3**：不得假设 undo 能回滚到任意期望状态。
（**排序已被实测倒转**：早期版本写的是"undo 是首选通道，检查点文件是兜底"，
但 undo 栈的增长对 Python 不可观测，无法证明 undo 不会吞掉用户的未保存编辑——
见本文件 [undo 集成](#checkpoint-undo)第 5 步。**检查点文件才是唯一可靠的回滚来源**，
undo 至多是一条需要自证安全的加速路径。）

### 3.4 运行时拦截可行性（**实测**）

| 场景 | 结果 |
|---|---|
| `bpy.ops.wm.save_as_mainfile(...)` | ✅ 拦到 |
| 动态构造 `getattr(bpy.ops.wm, "save_"+"as_mainfile")(...)` | ✅ 拦到 |
| 动态构造 `getattr(getattr(bpy.ops,"w"+"m"), "open_"+"mainfile")(...)` | ✅ 拦到 |
| `os.remove` / `pathlib.write_text` | ✅ 拦到 |
| 未列入清单的算子 | ✅ 放行 |
| 补丁还原完整性 | ✅ 全还原 |
| `bpy.data.objects.remove()` | ❌ **不在覆盖范围**（靠 §8.4 的差分报告，不靠拦截） |

→ 运行时拦截有效；静态 AST / 正则会被动态构造绕过，**只作提示不作边界**。

### 3.5 轮次边界可用（**源码**）

`ctx.on('session/event', (session, event) => …)` 是官方会话事件订阅入口：

```ts
'turn/start': { turn: number }
'turn/end':   { turn: number; reason: TurnEndReason }
```

**一次用户请求 == 一个 turn**，正是"一轮"，且带编号。

### 3.6 上游工具面事实（**源码** + **实测**）

官方 server 暴露 **26 个工具**（证据三处一致：`readme_tools.rst`、`tests/test_tool_listing.py`、AST 计数）：

| 分类 | 数量 | 与本插件的关系 |
|---|---|---|
| 活会话（socket） | **17** | 能力上限与我们相同（同一个 `execute` 通道），差别只在**谁写 Python** |
| `_for_cli`（进程外） | **6** | ❌ 不做（§4.7） |
| 本地只读文档 | **3** | ✅ 与 §11 的知识库**功能重叠**：`get_python_api_docs` / `search_api_docs` / `search_manual_docs` |
| 合计 | **26** | 工具模块 20 个；`*_toolcode.py` 16 个（另有 4 个 `_template_*.py`） |

**`readOnlyHint` 不可信（I9 的依据，已逐条核实）**：

| 工具 | 标注 | 实际 |
|---|---|---|
| `render_viewport_to_path` | `readOnlyHint=True` | **写盘**，且临时改 `scene.render.filepath`；交互模式还会转 deferred |
| 5 个 `_for_cli` 摘要 | `readOnlyHint=True` | 调用前会先对**活会话**发 1–2 个 exec：脏检查 + `save_as_mainfile(copy=True)` 落一份编号副本 |
| `get_screenshot_of_*` | `readOnlyHint=True` | 场景无改动，但会写临时文件（用后自动清理） |
| `jump_to_*` | `destructiveHint=True` | 方向正确且确实有破坏性：反选、改 active、**无条件** `mode_set(OBJECT)`、`allow_edits` 时改 hide/exclude 甚至 duplicate workspace |

**一条不可照抄的落点语义**：`render_*` 工具的 `output_path` 文档语义是**错的**——它们把目录改写成 `<bpy.app.tempdir>/blender_mcp/<basename>`（**实测**），调用方给的目录被丢弃。
→ 我们自己的 `capture` / `snapshot` **必须自己定义落点语义**（§6.3），不得照抄这个形状。

**上游返回形状的一个契约细节**：`*_toolcode.py` 的 `main()` 返回 `Result` 命名元组，调用侧取 `_asdict()`，add-on 再包一层信封
→ 客户端看到 `{"status":"ok","result":{…}}`，**业务失败时外层仍是 `"ok"`**，只有内层 `result.status` 才是 `"error"`。
→ 我们的工具**不得照抄这个双层语义**，必须自己把业务失败提升到可判定的位置。

---

## 4. 传输契约 <a id="transport"></a>

> 本节是 **add-on 私有套接字协议**，与 MCP 无关：没有握手、没有能力协商、没有 tool 列表端点。
> **取证基线**：本机已装 add-on 与上游 tag `v1.0.3`（commit `2cea8d566dde07fbac28a61d698909d69724e853`）**逐 blob 相同**（9 文件，**实测**）。

### 4.1 帧格式

```
请求 / 响应：UTF-8 JSON + 单字节 0x00
请求体：{"type":"execute","strict_json":<bool>,"code":"<python>"}
```

| 项 | 规则 |
|---|---|
| `type` | **只认 `execute`**；其它值返回 `Unknown request type: <repr>` |
| `strict_json` | **必须存在且必须是 `bool`**（`isinstance(x, bool)`）；缺失、`"true"`、`1` 都返回同一条错误 |
| 执行位置 | 主线程 `exec`，被上游弱沙箱包裹（§3.2） |
| 响应编码 | `json.dumps` 默认 `ensure_ascii=True` → **响应字节是纯 ASCII**，中文也是 `\uXXXX`，解析侧无需转码 |
| 连接生命周期 | **一次连接 = 一次请求**；响应发出后 add-on 主动关闭；同连接再发得到 `ConnectionAbortedError [WinError 10053]` |
| 响应大小 | **无硬上限**，只受发送窗口与客户端 drain 约束 → `exec` / `inspect` **必须自带截断** |
| 错误信封 | `{status:"error", message:"…"}`；`message` 是短文本或完整 traceback；`stdout`/`stderr` **仅在捕获到非空输出时出现** |
| `result` | 必须是 `dict`；`strict_json=true` 且不可序列化 → 明确报错；`strict_json=false` 用 `default=repr` 兜底 |

### 4.2 限制与延迟特征

| 限制 | 值 | 含义 |
|---|---|---|
| 请求体上限 | `_MAX_REQUEST_BYTES` = 10 MiB | 超限**直接拒绝**，不截断执行 |
| 客户端超时 | `_CLIENT_TIMEOUT` = 10 s | **仅作用于"未发完的请求"**；`exec` 期间不计时 |
| 响应写出期限 | `_SEND_TIMEOUT` = 30 s | 分片写队列 deadline；客户端必须持续 drain，否则响应被放弃 |
| 延迟响应上限 | `_DEFERRED_TIMEOUT` = 3600 s | 定义在 `deferred_tool.py`；超时后**只废弃响应，Blender 侧任务继续跑** |
| backlog | `_LISTEN_BACKLOG` = 5 | 并发受限 |
| add-on 单次 `recv` 缓冲 | `_RECV_BUFFER_SIZE` = 4096 | **不是协议上限**；客户端读缓冲用 64 KiB |
| 后台阻塞轮询 | `_POLL_BLOCKING_TIMEOUT` = 1.0 s | `select` 超时 |

**三条实现约束**：

1. **读循环必须连续 `recv`，不得在两次读取之间 sleep**（I2）。
2. **响应必须 drain 到 `0x00` 再解析**（I2）。
3. **不得假设"连上就快"**：模块常量 `TIMER_INTERVAL_ACTIVE = 0.05 s`，而 `0.25 s / 1 s` 是 **Blender 偏好里的默认值**
   （可改范围 `0.05–5.0` / `0.1–10`），另有 `idle_delay = 5.0 s` 决定何时降到空闲档。
   → **超时阈值不得写死**，必须来自配置或握手探测。

### 4.3 执行模型

主线程由 `bpy.app.timers` 驱动轮询（活动 / 空闲双档退避）。代码同步执行 → **执行期间 GUI 冻结、不接受新连接**。

### 4.4 延迟响应（deferred） <a id="transport-deferred"></a>

代码内定义 `check_is_finished()`（**callable**）：返回 `None` = 未完成，返回 dict = 最终结果；每个 tick 调用一次，**必须轻量**。

| 阶段 | 行为 |
|---|---|
| 1. 代码执行完 | 若 `check_is_finished` 存在且可调用 → 立即返回，**此时 `result` 被忽略**，response 只带 stdout/stderr |
| 2. 连接移交 | 交互模式把连接交给 `deferred_tool`，**连接从 clients 移除但不关闭** |
| 3. 轮询 | 每 tick 调一次 `check_fn()`；有 pending 时**活动间隔被重置**，不会退化到空闲档 |
| 4. 完成 | 返回 dict → 校验后发正常信封 |
| 5. 超时 | 3600 s 后报 `Deferred operation timed out after 3600 seconds`，**Blender 侧任务继续** |

- **仅交互模式可用**；后台模式返回明确错误文案，**不得**静默降级为冻结 GUI（**实测**）。
- 失败面：`check_fn` 抛异常 → error + traceback；返回非 `None`/非 dict → 明确报错；客户端断开 → 丢弃不发响应。
- 上游只有渲染族走这条路（条件 `use_deferred = not bpy.app.background`）；
  另有 `_template_deferred_tool_check_for_file_output.py` 范式：等 `bpy.app.is_job_running(job_type)` 转假，再还原被改的渲染设置。
- **I3**：长任务走 deferred；不可用时**明确报错**，不冻结 GUI。

---

## 5. 连接与发现 <a id="discovery"></a>

解析顺序：配置 → 环境变量 → 扩展清单默认值 →（仅当 `allowPortScan` 为真时）候选端口扫描。
**所有候选强制 loopback。**

> `allowPortScan` 默认 `false`。默认关的理由：**静默连到别的服务比连不上更危险**。

### 5.1 指纹握手（自建）

回读 Blender / Python 版本、扩展模块键、pid、`background` 标志、`online_access`、numpy、**Blender 进程 cwd**、扩展根目录。**按端口缓存**。

**版本取证**：`bpy.utils.user_resource('EXTENSIONS')` 给出扩展根目录，进程内只读解析
`<root>/user_default/mcp/blender_manifest.toml` 拿到 `version` / `blender_version_min`（**实测**）。

### 5.2 诊断分级 <a id="discovery-diagnostics"></a>

**不得一律 `ECONNREFUSED`。** 五级判定：

| 级 | 判定 | 处置 |
|---|---|---|
| 1 | 无 Blender 进程 | 请先启动 Blender |
| 2 | 有进程但端口未监听 | 扩展未启动 / autostart 关闭 / `online_access` 未开 |
| 3 | 端口被占但指纹不符 | 受 `rejectForeignPeer` 控制；默认**拒绝继续** |
| 4 | 版本 < `requireVersionMin` | 明确给出要求版本与实际版本 |
| 5 | 超时 | 主线程被占用 |

**降级要求**：进程枚举在受限环境下可能不可用（**实测**：所有 spawn 均 `EPERM`，`tasklist` 也可能 `Access denied`）。
此时第 1 级**降级为"无法确认"并在 `actions` 里如实说明**，**不得猜**（I4）。

### 5.3 版本漂移检测 <a id="discovery-drift"></a>

知识库语料是在**某个 Blender 版本**上生成的（§12.4 记源指纹）。握手拿到实际版本后需与之比对：

| 情况 | 处置 |
|---|---|
| 完全一致 | 正常检索 |
| 小版本不同 | 正常检索，`docs` 返回带 `drift` 字段说明「语料来自 X，当前是 Y」 |
| 大版本不同 | 正常检索，但**置顶**一条 `warnings`（返回体顶层 `warnings: string[]`），要求 AI 向用户提示"知识可能过期，建议重建索引" |
| 无法取得版本 | 不猜，`drift` 记为 `unknown` |

**这不是硬阻塞**（**I11**）：旧版本的 RST 多数情况下仍可用，硬拦会让用户失去唯一的离线参考。
但**必须可见**——把"过期知识"当成"当前真相"比没有知识更危险（与 §8.4「不拦但可见」同一原则）。

---

## 6. 工具面 <a id="tools"></a>

六个工具，名字与字段名一经发布**不改**（I23）。

| 工具 | 变更 | 作用 |
|---|---|---|
| `blender_mcp_status` | 只读 | 握手、指纹、版本门控、**风险姿态**、诊断 |
| `blender_mcp_exec` | **写** | 唯一执行通道；过 §7 拦截；写前落检查点（§10）；支持 deferred（§4.4） |
| `blender_mcp_inspect` | 只读 | 结构化场景快照（策展化见 §11.4） |
| `blender_mcp_capture` | **写盘（任务目录）** | 视觉反馈：视口 / 区域 / 整窗截图（§6.3） |
| `blender_mcp_snapshot` | 写盘 | 受控存盘 / 导出到任务目录（§6.4） |
| `blender_mcp_docs` | 只读 | 内嵌知识库检索（§13） |

### 6.1 `status` 的返回必须是"风险姿态"

用词向官方 `get_blendfile_summary_path_info` 对齐：

| 字段 | 内容 |
|---|---|
| `path` | 当前 `.blend` 路径 |
| `save_status` | 是否 dirty |
| `age` | 文件 mtime 与距今天数 |
| `backups` | 可用检查点列表（可用可选参数 `task` 指定任务目录名，否则用默认任务名——**实测缺口**：自定义任务名的备份此前看不见，`backups: []` 而磁盘上明明有文件） |
| 场景规模 | 场景内非本插件数据的规模 |
| 本轮检查点 | 本轮是否已建立（**内存登记 ∪ 磁盘上已存在的 `turn-{T}*.blend`**；只看内存登记时会对已落盘的快照报 `false`，**实测踩过**） |
| `restoreEvidence` | 回滚候选与 `argmax(mtime)` 结论（有检查点或用户文件时才有） |
| `undoPrecheck` | undo 通道的前置条件证据；**实测在 5.2 上恒为 `measurable: false`**（[#checkpoint-undo](#checkpoint-undo) 第 5 条）。与 `restoreEvidence` **平级且独立**——未保存的工程没有用户文件，但可能有基线 |
| `sessionChecklist` | **完成态交接**（I26）：`isDirty` / 任务目录 / 检查点份数 / 快照文件 / `nextSteps[]` |

理由来自建模经验：开场时场景为空，重手操作才安全；**若已有用户未保存的工作，风险等级完全不同**。

**只读工具不得创建任务目录**（I14）：`status` 找不到既有任务目录时返回 `taskRoot: null`，而不是顺手建一个。

### 6.2 四个工具各自存在的理由

| 工具 | 理由 |
|---|---|
| `capture` | "看得见才知道做没做对" |
| `snapshot` | "覆盖保存正是要拦的东西，就必须给存盘留一条受控出口" |
| `docs` | "模型写 Blender Python 的常见错误来自 API 记错，而这是纯知识、零副作用的能力" |
| `inspect` | 让模型在改之前知道**改的是什么**，而不是先改再发现 |

### 6.3 `capture` 的落点与还原契约

- 支持三种目标：视口 / 区域 / 整窗；**全部只落任务目录**（I15）。
- **视口渲染必须还原被临时改动的渲染设置**（I15），包括 `scene.render.filepath`。
- ~~**待实测前提**：socket exec 调用时 `context.area` 可能为 `None`~~
  ——**已实测（5.2.2）**：经 socket `exec` 进来的调用**拿不到 UI 上下文**，
  `viewport` 与 `area` 两个目标**不可用**，只有 `window` 能成。
  所以工具面**不承诺三种目标都可用**：不可用的目标如实返回
  `captured: false` + `reason`，**不静默降级**成另一张图（否则调用方会以为拿到了视口）。

### 6.4 `snapshot` 的语义

单义：**只写盘**，不改会话当前文件路径。
**回滚入口不进工具面**（§10.5）——回滚由 agent 用 `exec` 调 `bpy.ops.wm.open_mainfile` 完成，插件只提供证据。

### 6.5 结果字段（只读附加字段，字段名不改） <a id="tools-result-fields"></a>

`exec` / `snapshot` / `capture` 的返回追加以下字段：

| 字段 | 内容 |
|---|---|
| `checkpoint` | 本轮检查点路径 / 是否本轮首次落盘 |
| `undo` | 是否已 `undo_push`（`channel`：`undo-push` / `undo-skipped-existing-checkpoint` / `undo-disabled` / `undo-failed` / `not-applicable`）。**放弃 undo 路径**由调用方依据 `status` 的 `riskPosture.undoPrecheck` 判定（[#checkpoint-undo](#checkpoint-undo)），不在 exec 返回里 |
| `guard` | `verified` / `opsProxyIntact` / `tampered` / `reinstalls` / `residualHooks` / `hooksUnloaded` / **`window`**（覆盖到的窗口，措辞见 §9.5）/ **`jobsRunning`**（窗口外仍在跑的后台任务） |
| `blocked` | 命中 L1/L2 时给出。**两层形状不同且都已发布，不得统一改名**：L1 = `blocked_path` / `reason` / `suggested_path` / `handoff` / `evidence` / `explanation`；L2 = `reason` / `events`（逐次命中的调用与路径）/ `suggested_path` / `handoff`。命中 ≥2 条时附 **`blockedAll`**（§8.7） |
| `noticed` | L2 **放行**但记了账的调用（`contract` §9 的 `noted`）；没有则缺席 |
| `issues` | L1 静态命中的模式与位置（**提示**性质，不代表已拦） |
| `changes` | 改动清单：这次动了哪些数据块。**增/删为聚合形状**（`objectsAdded: {count, byType, sample≤10}` + `objectsAddedTruncated`），逐条回显会在批量建对象时把响应顶爆（报告实测多轮 ~1k token/次）。**就地修改**由 `objectsModified` / `dataBlocksModified` 报出（**实测缺口**：改合成器参数 / 顶点 / 材质此前不产生任何 `changes`，而提示词把合成器内容列为用户所有） |
| `warnings` | 体积超限（§10.6）等 |
| `settingsDrift` / `settingsBaselineKnown` | 渲染/导出设置的会话基线比对；`Known=false` 时**空 drift 不等于"没改"** |
| `handoffHint` | **每次返回都在**（I26）：会话仍 dirty 时明确提示"改动没有保存在你的文件里、可按 Ctrl+Z、要出图请按 F12、任务目录已保留" |
| `partial` | 仅当本次以异常结束、而 L2 差分显示**改动已部分生效**时出现；附 `warnings` 一条说明"这些改动已保留在场景里，可回滚到 `checkpoint.path`" |

**被拦不是"把失败伪装成成功"**：L1 命中在**发送之前**就返回，`status: "blocked"` + 结构化字段，
让 agent 能立刻改用 `suggested_path` 重试（**实测**：这是纯 Node 侧判定，add-on 收不到任何请求）。
**L2 命中**则不同：护栏在 Blender 进程内抛结构化异常，信封本身是 `status: "error"`，
桥接**保留 `error`**（`error.kind: "blocked-by-guard"`）并**同时附上 `blocked`**——
改写状态会把 traceback 一起丢掉，而 traceback 正是"哪一行越界"的唯一证据（**实测**）。
两种情形都**不**属于"静默降级"：`blocked` 字段一定在场，`executed` 的语义一定可读。
**唯一例外是 `guard.verified=false`**——护栏被改写意味着本次执行的安全前提不成立，按**失败**处理并在返回里点名。

---

## 7. 越界写 / 删的处置：拒绝 + 接管提示 <a id="handoff"></a>

### 7.1 为什么是"接管"而不是"代劳"

**越界操作由用户决定是否执行，插件既不代劳也不假装能代劳。**
本插件**没有**浏览器端设置卡片（§15.2），因此**无法直接弹窗问用户**——"接管"的实现只能是
**结构化拒绝 + 可执行指引**。

### 7.2 拒绝必须携带的四项

| 字段 | 内容 |
|---|---|
| `blocked_path` | 被拒绝的 `realpath` 目标 |
| `reason` | 命中哪条规则（覆盖保存 / 越界写 / 越界删除 / 环境改动） |
| `suggested_path` | 任务目录内的等价落点（插件派生） |
| `handoff` | 明确写出"此操作需由用户在 Blender 或系统中自行完成" |

**防重复失败**：连续被拒时，返回里必须给出可用替代路径，避免 agent 反复试探同一路径刷噪声（I7）。

### 7.3 可写范围的唯一边界

可写范围**只有任务目录**（默认 `<活动 .blend 所在目录>/.dsh-blender-{task}/`，见 [#taskdir](#taskdir)）
及其派生路径；任务目录之外一律拒绝。
**报告、渲染、截图、导出等全部产物都落在任务目录内**（I5 / I19）。

判定一律用 **`realpath` 解析后的真实目标**，防符号链接逃逸；相对路径按**连接时记录的 Blender 进程 cwd**
解析（**实测**在 `Program Files` 下），解析结果几乎必然越界。

---

## 8. 拦截规则 <a id="interception"></a>

### 8.1 设计原则

只拦**不可逆损失且检查点无法挽回**的操作；检查点能覆盖的一律放行，改为**记录 + 报告**（I6）。

**判定对象是"写路径"而非"算子名"**：
`wm.save_mainfile` 是独立于 `save_as_mainfile` 的算子，只列后者会漏掉 Ctrl+S 这条覆盖路径；
反之绕过算子直接调 `io.open` 也必须被覆盖。**算子名只作补充信号。**

### 8.2 拦截清单（最终）

| 类别 | 条目 | 处置 |
|---|---|---|
| **覆盖保存** | `wm.save_as_mainfile` 且非 `copy=True`；`wm.save_mainfile`（等价 Ctrl+S）；写向已存在文件 | **拒绝** → 引导 `snapshot` |
| **丢弃会话** | `wm.read_homefile`、`wm.read_factory_*` | **拒绝** |
| **越界删除** | `os.remove/unlink/rmdir`、`shutil.rmtree`、`os.replace/rename`、`shutil.move`，且**任一实参**的 `realpath` 不落在任务目录内 | **拒绝 + 接管提示**（§7.2） |
| **任务目录内删除** | 同上，但 `realpath` 落在 `.dsh-blender-{task}/` 内 | **放行**——中间产物可自由清除 |
| **越界写** | 任何写操作（`builtins.open` / **`io.open`** / `os.open` / `shutil.copyfile\|copy2\|copytree\|move` / `os.truncate` / pathlib 写族 / 文件输出算子），`realpath` 不在任务目录内 | **拒绝 + 接管提示**（§7.2） |
| **环境改动** | 偏好写入口、add-on 开关、脚本自动执行 | **拒绝**（范围见 §9.5） |
| 打开其它文件 | `wm.open_mainfile` | **不拦**，但强制先落检查点 + 显式确认（§8.3） |
| 数据删除 | `bpy.data.*.remove()` | **不拦**，**运行时**比对数据块并报告目标清单（§8.4） |
| 联网 | `exec` 代码中的网络访问 | **不拦**（§14） |

### 8.3 `open_mainfile` 为何不硬拦

它是**唯一的自救通道**。硬拦会让 agent 出事后彻底失去恢复能力（I5）。
→ 处置：**不拒绝，但强制先落检查点 + 显式确认**；由 agent 用 `exec` 执行（§10.5）。

### 8.4 不拦但可见

对不拦截的高风险操作，在返回中追加 `risk_notes`：命中的模式、被删除对象的数量与名字、本轮检查点路径。

**数据删除必须用运行时证据，静态 AST 只作补充**：AST 会被动态构造绕过，
"未命中即安全"的错觉**比不报告更危险**。实现方式：在 `exec` 前后比对 `bpy.data` 各类数据块计数与
`as_pointer()` 集合（I2），把差集写进 `risk_notes`；AST 命中只用来**提高置信度**与点名目标。

### 8.5 环境改动纳入 L2 的收窄定义 <a id="interception-env-writes"></a>

**范围严格限定为三项**：

1. `bpy.context.preferences` 的写入口（含 `preferences.edit` / `preferences.filepaths` / `preferences.view` 等子树的赋值）；
2. `addon_utils` 的启用 / 禁用（含 `bpy.ops.preferences.addon_enable` / `addon_disable` / `addon_install` / `addon_remove`）；
3. 脚本自动执行开关（`preferences.filepaths.use_scripts_auto_execute` 及同类）。

**为什么收窄**：现在的清单只在 L1 静态层，而 L1 只认字面量，`getattr(bpy.context.preferences, …)` 一绕就过——
**一条只在 L1 存在的规则等于没有规则**。但不能因此承诺"接管所有 preferences 写"：那无法验证。
收窄到三项是可枚举、可验证的。

**为什么必须做**：偏好与 add-on 开关是**跨会话持久**的副作用，比丢一个场景更不可逆。

### 8.6 诚实边界

上述机制防的是**疏忽**，不是**对抗**。动态构造、`importlib.reload`、直接调 C API 都能绕过。
工具描述与 README 中**不得**出现"安全沙箱""已保护你的数据"字样（I10）。
上游明文声明无任何防护（§2.4），本插件只是**加了一层防误操作**，不改变这一事实。

**两条必须写明的判定边界**：

- **改名 / 移动作族按"任一实参越界即拒"判定**（**实测教训**：此前只校验第一个实参＝源，
  于是 `shutil.move(界内 → 界外)`、`os.rename`、`os.replace` 的**目标端**可以越界写成功）。
  fail-closed：宁可误拦，不可漏放。
- **有写盘能力但没有路径实参的算子（例如 `image.save()`）没有可判定的目标**：
  L1 与 L2 都**无法判定**它写到哪，因此**不得**声称它已被覆盖。要判定 `image.save_as()` 这类
  带路径实参的算子，走 §8.2 的"文件输出算子"条目。

### 8.7 一次拒绝要能列出全部命中

**实测**：三个越界载荷写在同一个 `exec` 里时，此前只报**第一个**命中，其余不列出——
对"告诉用户犯了哪条规"够用，对"审计一次 payload 的全部风险面"不够。

要求：扫描**不得**在第一个命中处停下；返回体里 `blocked` 的既有字段仍取**第一个**命中
（字段名与形状不变，I23），并新增 `blockedAll`（命中 ≥2 条时出现）列出本次全部命中。
`issues` 同时带全部命中（L1 的提示性质不变）。

---

## 9. 拦截层机制（三层） <a id="guard"></a>

### 9.1 三层职责

| 层 | 位置 | 作用 | 是否边界 |
|---|---|---|---|
| **L1 静态** | Node 侧，**发往 add-on 之前** | 解析 `code` 里的字面量路径与算子调用，认出越界写/删、覆盖保存、`read_homefile` 等；命中则**根本不发送**，直接回结构化拒绝 | ❌ 只作提前拒绝与可读报错 |
| **L2 运行时** | Blender 进程内，与用户代码**同一个 exec** | 包裹写删入口，并用**代理**接管 `bpy.ops` 上的受控算子；按 `realpath` 判定并抛结构化异常 | ✅ **唯一真实边界** |
| **L3 事后** | Blender 进程内，exec 尾部 | 数据块差分、钩子自检、检查点证据汇总 | ❌ 只作报告 |

**为什么静态层必须在 Node 侧**：Python `ast` 要跑在 Blender 里，等于"为了检查代码而先执行代码"。
放到 Node 侧还白捡两个好处——被拒的代码**从未进入 Blender**，且拒绝理由可以用插件自己的措辞。

### 9.2 L2 载体：一次安装、重入自检、绝不放行

护栏源码**随每次 exec 一起发送**（自包含，不预先植入）。载体是 `sys.modules` 里一个合成模块。

**三条硬规则**：

1. **`sys.modules` 是刻意选择**：它是一个 `str -> module` 的 dict，非 str 键会跳过模块级 `__getattr__`，
   因此**不触发 `bpy` 的数据块查找**。**不要**改用 `bpy.app.driver_namespace`（会被 `bpy` 枚举）或
   `bpy.types.Scene` 自定义属性（会污染用户的 `.blend`）。
2. **重入必须重装**：包装函数打 `__dsh_guard__` 标记，天然"已包装则不重复包装"；
   但**从不因为"状态还在"就信任钩子**。
3. **重装即记账**：`tampered` 与 `reinstalls` 计数进入返回值的 `guard` 字段——这是"用户代码试图动护栏"的证据。

### 9.3 算子拦截必须用模块级代理 <a id="guard-ops-proxy"></a>

**规则：把 `bpy.ops` 换成 `_OpsProxy`**（**实测**可行），真实 `bpy.ops` 存在载体状态里；
代理按受控名单**惰性**替换算子，未列入的直接返回原对象。作用域与文件钩子一致（exec 期间装上、收尾卸下）。
**I16**：L2 护栏只在 exec 作用域内安装，**不得常驻**。

| 约束 | 理由（违反后果） |
|---|---|
| **禁止**包装 `bpy.ops._op_create_function` 来拦算子 | 上游弱沙箱**自己也**包装这个函数（§3.2），它在**每次 exec 结束时**还原成自己的版本 → 我们的补丁**活不过一次请求**；且返回未包装算子会让检查点自己的 `save_as_mainfile(copy=True)` 被误判为"已放行" |
| 代理**必须读写透传 `_op_create_function`** | 上游弱沙箱在 `__enter__` 读它、`__exit__` 写它。挡掉这个属性会让沙箱进入即抛 `AttributeError`，而该异常被 server 当作请求异常返回 traceback → **每个请求都失败** |
| 代理对**不在名单内**的算子**必须委托给当前** `_op_create_function` | 上游那 4 个被拦算子的过滤逻辑**活在那个包装里**；代理若自己重建算子就会绕开它——**不能用"自己的护栏"换掉"上游的护栏"** |

**为什么代理能存活**：弱沙箱只管理 `_OVERRIDES` 里登记过的属性（`sys.exit` 与 `_op_create_function`），
**不碰 `bpy.ops` 这个模块对象本身**（**实测**）。对照：exec 内对 `_op_create_function` 打的补丁活不过一次请求；
对 `builtins.open` 这类沙箱不碰的属性，补丁**跨 exec 存活**。
→ `sys.exit` 同样属于被还原的位置，**不要试图在那里装东西**。

**两条必须写进实现的细节**：

1. **`wm.save_as_mainfile(copy=True)` 必须在算子层放行**——它是**检查点机制自己的**存盘出口（§10.3）。
   否则检查点无法落地：拦覆盖保存的规则会把桥接自己的写路径一起拦掉。放行时记录 `noted`。
2. 代理替换的是 `bpy.ops` 这个**模块属性**；`_dsh_verify()` 在卸下**之前**判定代理是否仍在位（`opsProxyIntact`）。

**验证方法上的教训（写成判据）**：`copy=True` 的"放行"曾经**因错误的原因通过**——返回的是未被包装的原始算子，
看起来"放行了"，实际是拦截整段失效。
→ **判据必须是「被拦的东西确实是我们装的」，而不是「结果看起来对」**。

### 9.4 载体跨 exec 存活的三个坑 <a id="guard-carrier"></a>

护栏载体活在 Blender 进程里，**跨多次 exec 存活**。三个只有实测才会暴露的缺陷：

| 坑 | 现象 | 修复 |
|---|---|---|
| **重装 = 嵌套** | 重装时把 `builtins.open` 存成"原始函数"，而它其实是**上一次的 `_guard`**。守卫层层嵌套：外层按新根放行、内层按旧根拒绝。实测表现为**任务目录内的写被以旧根为由拒绝** | 新增 `_dsh_unwrap()` 剥掉所有 `__dsh_guard__` 层；真原始函数只在首次安装时捕获 |
| **allowRoot 变化未触发重装** | 钩子是**闭包**，捕获了当时的根目录。任务目录一变（轮换、换任务名、换会话），旧钩子仍按旧根判定 | 状态记 `installed_root`；根变化时**强制重装**，不能只看"钩子还在不在" |
| **证据跨 exec 累积** | `blocked_events` / `noted` 不重置，历史拦截被算到本轮账上：只读的 exec 会返回 `status: "blocked"` | 每次 exec 开头 `_dsh_maintain('prep')` 重置本轮证据；收尾只读不重置 |

**`tampered` 必须靠证据，不能靠推断**：规则是——只有在「上一次留下的确实是本插件装的钩子」且此刻钩子确实不在位时，
才记 `tampered`。收尾主动卸下算子代理属于正常流程，**不算篡改证据**。

### 9.5 作用域判定与线程策略

- **判定范围**：`allowRoot` = 本任务目录的 `realpath`；用 `abspath` + `realpath` + `normcase` 与根做前后缀比较
  （Windows 大小写不敏感）。
- **覆盖入口**：`builtins.open`（写模式：`w`/`a`/`x`/`+`）、**`io.open`**（必须一并包裹：
  CPython 里 `io.open is builtins.open`，两者都要指向同一个钩子，否则会有名字漏网）、
  `os.open`（`O_WRONLY`/`O_RDWR`/`O_CREAT`/`O_APPEND`/`O_TRUNC`）、`os.truncate`、
  删除/改名族按 §8.2 清单（**全部实参**）、文件输出算子（路径实参）、
  以及 §8.5 的三项环境写入口。
- **只读一律放行**：非写模式的 `open` 直接透传（**实测**读操作零影响）。
- **线程策略**：`guardThreadScope = main`（默认）时只有 `threading.main_thread()` 上的调用受检，其余线程**一律透传**；
  `all` 时检所有线程。
  理由：补丁是进程级全局的，而 `exec` 只在主线程；后台线程（渲染、图像保存、插件 I/O）在补丁窗口内被拦会造成无法解释的故障面。
  **代价必须写进 README。**
- **拦截窗口 = 同步 exec 期间**；窗口外的异步 / 延迟写不受约束。
  **返回体必须如实说明这个窗口到哪结束**：`guard.window` 给出措辞（`exec（主线程同步期间）`），
  并新增 `guard.jobsRunning` 列出仍在运行的后台任务（异步渲染等）——**实测事故**：
  一次 `INVOKE_DEFAULT` 起的渲染在 exec 返回之后写出了 `C:\tmp\Untitled.png`，
  而护栏对此完全无感，返回体里的 `hooksUnloaded:true` 却给人一种"全程覆盖"的错觉。
  检测到仍在运行的后台任务时**不**拒绝结束本次 exec（那会把"渲染被记错成失败"的代价加给用户），
  而是让它**可见**。

### 9.6 返回值与自检

字段见 §6.5。**被拦不等于"安全前提成立"**：L1 命中返回 `status:"blocked"`（未发送）；
L2 命中保留信封的 `error` 并附上 `blocked`（traceback 是定位越界行的唯一证据）。
唯一例外是 `guard.verified=false`——那意味着护栏本身被改写，按失败处理。

---

## 10. 检查点策略 <a id="checkpoint"></a>

### 10.1 配置

| 字段 | 默认 | 约束 | 说明 |
|---|---|---|---|
| `checkpoint.enabled` | `true` | — | 默认开 |
| `checkpoint.keep` | `3` | 1–**20** | 保留轮次数 |
| `checkpoint.maxBytes` | `0`（不限） | ≥0 | **体积上限**；超限的旧份在**轮次结束的收尾轮换**里优先被回收（不再只是告警）。⚠️ 写前**不删**——先写第 n+1 份、轮次结束才回落，见 §10.3 |
| `checkpoint.perTurn` | `'turn'` | `turn` \| `write` | 检查点粒度。`turn` = 一轮一份（`turn-{T}.blend`）；`write` = 每次 `mutating:true` 的写各落一份（`turn-{T}-{seq}.blend`）。**实测动机**：一轮 40+ 次写全部共享一份"轮次起点"快照时，中段误删只能整体回滚 |

### 10.2 轮次边界（一次用户请求 = 一轮）

插件订阅会话事件流（§3.5）：

```ts
ctx.on('session/event', (session, event) => {
  if (event.type === 'turn/start') openRound(session, event.data.turn)
  if (event.type === 'turn/end')   closeRound(session, event.data.turn)
})
```

- `turn/start` **不立刻**产生检查点；只标记本轮开始。
- **本轮首次写操作之前**才落检查点——**只读轮次不产生任何文件**。
- `turn/end` 触发收尾轮换。
- **兜底**：若进程在 turn 中途消失，下一轮 `turn/start` 先做一次收尾轮换，防止累积。
  收尾轮换**只处理本会话登记的检查点**，不得跨会话清理（I8）。

### 10.3 原子轮换

设当前配置保留 `n` 份：

1. **轮次落检查点时先写第 `n+1` 份**（`turn-{T}.blend`，或 `perTurn='write'` 时的 `turn-{T}-{seq}.blend`）。
   此刻磁盘上最多 `n+1` 份。
2. **轮次结束后**才清除最早的，回落到 `n` 份。
3. 因此**任何时刻都不会先删旧快照再写新快照**——写入失败也绝不丢历史（I8）。
4. **配额按文件数算**（`perTurn='write'` 时一个轮次会占多份，这是该取值的代价，如实写在 README 配置表里）。
5. `maxBytes > 0` 时，**超限的旧份**在**收尾轮换**（第 2 步）里优先列入删除计划。
   写前阶段**绝不删除**：若在写新快照之前回收，而写入失败（磁盘满 / 权限不足——正是 I1 要防的场景），
   旧历史就已经被删掉；`keep = 1` 时更会把唯一一份备份删空。峰值份数是 `keep + 1`，这是它的代价。

### 10.4 实现

- 路径：`<任务目录>/checkpoints/turn-{T}.blend`（`perTurn='write'` 时为 `turn-{T}-{seq}.blend`）；
  任务目录默认在活动 `.blend` 所在目录下，见 [#taskdir](#taskdir)。
- 调用：`bpy.ops.wm.save_as_mainfile(filepath=…, copy=True)`——`copy=True` **不改动会话当前文件路径**（**实测**）。
- **轮换删除只针对「本插件登记过的、且属于本会话的」检查点**（**I1**：保护集合为空则硬中止）。
  多会话并发时，检查点文件名必须带**会话稳定标识**，禁止用名字判定归属（I2）。
- **检查点写盘失败 = 硬失败**：磁盘满、权限不足、路径被占等情况下**拒绝执行本次写操作**，给出可操作原因；
  **不得静默降级为"无检查点继续"**（I1）。体积超限仍按 §10.6 只告警。
- 每次写操作返回中给出检查点路径。

**undo 集成** <a id="checkpoint-undo"></a>：

1. 桥接在**首次实际写操作之前**、检查点落盘**之后**执行一次 `bpy.ops.ed.undo_push(message=…)`，同时记录此时的基线。
2. 回滚优先级：**默认走检查点文件**。undo 回退（快、不落盘）只有在**能证明安全**时才可用作加速路径；
   而第 5 步的实测结论是**当前证明不了**，所以它**现在不可自动采用**。
   返回中必须写明实际走了哪条通道。
3. **前置条件：不得吞掉用户的未保存编辑**。`undo_push` 使会话变 dirty 是正确语义（§2.5），**桥接不复位该标记**；
   真正要防的是 undo 回滚把**用户自己**在 push 之后做的未保存编辑一并弹掉。因此：
   - push 时记录基线（`bpy.data.filepath`、`is_dirty`、`memory_usage_undo`）；
   - ~~回滚前检查基线之后是否出现**非本插件**的栈增长（用户手工编辑）~~
     ——**此路在 Blender 5.2 上不成立**（**实测**，见第 5 步）；
   - 一旦检测到用户编辑：**不执行 undo 回滚**，改为报告冲突、列出候选，把选择权交还用户（与 §7.1 的接管原则一致）。
4. **不得假设 undo 一定能回到期望状态**（I3）：用户自己的 Ctrl+Z、模态算子、以及不产生 undo 记录的操作都会与栈交互，
   所以检查点文件不是"兜底"，而是**唯一可靠的回滚来源**（这条由第 5 步的实测倒过来修正了早期的排序）。
5. **栈增长不可观测（实测，Blender 5.2.2）**：Python API 不暴露 undo 栈——
   `Scene.undo_history` 与 `WindowManager.history_active` **都不存在**；
   唯一还能读的 undo 相关量是 `bpy.app.memory_usage_undo()`（**函数**，不是属性），
   而它**只对本插件的 `ed.undo_push` 跳变**（实测 991046 → 1101578），
   对 `mesh.primitive_cube_add` / `object.delete` / 属性写入**完全不敏感**。
   也就是说：用户的编辑根本不让它动，拿它当增长指标会退化成恒假命题，
   因此**不能**当作用户编辑的指标。
   结论：第 2 步的 undo 加速路径在当前**无法证明安全**，**不得自动采用**。
6. **证据的出口**（回滚入口不进工具面，见 §10.5）：基线比对结果由 `blender_mcp_status` 的
   `riskPosture.undoPrecheck` 摊出。它**必须**如实报告 `measurable: false` 与
   `userEditsIndeterminate: true`，并给出 `recommendation`（改用检查点文件、先问用户）——
   **不得**为了显得可用而输出一个猜测性的"没有用户编辑"。
   "检测到（或无法排除）用户编辑就**不执行** undo 回滚"这一步由**调用方（agent）负责**：
   插件没有回滚入口，它的职责是把不可判定性摊开，而不是替用户决定。

### 10.5 回滚来源与入口

回滚时比较两个 mtime，**取更近者**：

| 候选 | 含义 |
|---|---|
| 检查点 `turn-{T}.blend` | 该轮开始时的会话状态（**含未保存内容**） |
| 用户的原始文件 `bpy.data.filepath` | 用户最后一次显式保存的状态 |

规则：`restore_source = argmax(mtime)`。这样**用户自己较新的保存不会被较旧的检查点覆盖**。
返回中同时给出两个时间戳与最终选择，便于人工复核。

**回滚入口不进工具面**（Q6 / I9）：`blender_mcp_snapshot` 保持"只写盘"单义；
回滚由 **agent 用 `blender_mcp_exec` 调 `bpy.ops.wm.open_mainfile`** 完成，插件只负责给出**证据**——
候选检查点路径、用户文件路径、两者 mtime、`argmax(mtime)` 结论、以及下面的能力边界告知。

- 回滚属"打开其它文件"，不硬拦（§8.3），但**必须先落检查点**。回滚动作本身不得再次触发检查点。
- `open_mainfile` 需带 `check_existing=False` 以避免 GUI 弹窗；加载偏好上下文的行为**以实现期实测为准**。

**能力边界（必须告知用户）**：检查点是**整文件级**快照。回滚 = 整个场景回到该时刻，
**该时刻之后用户自己的手工编辑会一并丢失**。这不是细粒度撤销。

### 10.6 体积上限

超过 `checkpoint.maxBytes` 时**不硬失败**：正常完成本次操作，并在返回中附 `warnings`，
要求 AI **向用户告警**——提示"减少备份份数或提高体积上限"。文案由插件给出，措辞由 AI 转达。

---

## 11. 知识库：资产与粒度 <a id="knowledge"></a>

### 11.1 为什么知识库是核心增量

本插件的真实目标是**辅助创作**。"模型写 Blender Python 老写错"正是创作效率的主因，
而这类错误绝大多数是**纯知识问题**（API 记错、枚举值记错、前置条件不知道）——
修它的代价是零副作用的静态数据，收益是减少试错轮次。

上游 `prompts.yml` 的存在本身就是证据：官方也在用同一手段（**源码**）。它的规则——
「模式 / 活动对象 / 选择必须显式设置」「bmesh 要 flush」「返回值别用 print」「创建后立刻抓引用而不是按名字回查」——
全部是"模型写 Blender Python 老出错"的目录。

### 11.2 上游知识资产盘点（**源码**）

官方仓库里**对我们有用**的知识只有四类，价值与处理方式完全不同：

| # | 资产 | 位置 | 是什么 | 我们怎么用 |
|---|---|---|---|---|
| **K1** | 注入提示词 | `mcp/blmcp/data/prompts.yml` | 官方在**连接时**发给 LLM 的"易错点小抄"原文（1 个 key `initial_instructions`，123 行） | ✅ **内联**（数据，GPL-3.0，署名即可）；作为技能的常驻小抄 |
| **K2** | API / 手册语料 | `mcp/blmcp/data/api/`、`data/manual/` | RST 全文 | ✅ **内联 + 预处理**（§12），提供有界检索 |
| **K3** | 工具契约 | `mcp/blmcp/tools/*.py`（非 `_toolcode`）与 `readme_tools.rst` | **26 个**工具的参数名/类型/默认值/返回形状 | ✅ **抄形状、不抄实现**（I18） |
| **K4** | Blender 侧执行语义 | `mcp/blmcp/tools/*_toolcode.py`（16 个）、`_template_*.py`（4 个） | 真的送进 Blender 执行的 Python 片段 | ✅ **读语义、重写实现**；❌ **不复制原文**（I18） |
| — | 6 个 `_for_cli` 变体 | 同上 | 另起后台 Blender 处理任意 `.blend`，**且会先向活会话发写请求** | ❌ 不做（§4.7 / I10） |
| — | 3 个本地只读文档工具 | `get_python_api_docs.py` 等 | 直接读 `data/api` / `data/manual` | ✅ 与我们的 `docs` **功能重叠**——正因如此才值得自己做（§2.1：不需要它的进程） |
| — | server / add-on 运行时 | `mcp/blmcp/server.py`、`addon/` | 协议实现 | ❌ 不用：传输层是自己写的（§4） |

**K4 的处置理由**：`*_toolcode.py` 是经过实战打磨的实现，但它跑在**上游自己的 server 通道**上。
读它的价值在于**知道官方怎么做、有什么前提、踩过什么坑**；照抄会同时抄进它的假设
（例如依赖自己的 `Params` / `Result` 装配约定）。

### 11.3 三种知识粒度（决定知识库回答什么问题） <a id="knowledge-granularity"></a>

| 粒度 | 回答的问题 | 来源 | 返回形状 |
|---|---|---|---|
| **G1 契约** | "这个算子 / 属性 / 函数的参数名、类型、默认值、枚举值是什么？" | K2 的 `api/` + K4 的签名 | 结构化条目（路径 + 签名 + 面包屑） |
| **G2 语义** | "这个操作到底做什么、有什么前提、会改什么？" | K4 的语义摘要 + K2 的 `manual/` | 散文段落摘录（带来源路径） |
| **G3 规则** | "写 Blender Python 时有哪些反复踩的坑？" | K1 + 本项目契约（§2.6、§2.7、§7、§8、§10） | 短规则条目（**整条返回**） |

**为什么必须分**：G1 需要**精确匹配优先**（标识符命中就是命中，模糊检索是噪声）；
G3 需要**整条返回**（半条规则比没有规则更危险）；G2 才适合有界摘录。
用一套检索参数服务三种粒度，一定会做成"什么都能搜到一点，但都不好用"。

### 11.4 本项目自己的策展知识（不来自上游，但必须一起进知识库）

上游知识是**通用**的；本项目有只有我们才知道的规则，它们同样会反复被模型踩到：

| 来源 | 规则 | 粒度 |
|---|---|---|
| §2.6 / §8 | 名字不是身份，用 `as_pointer()` | G3 |
| §7.3 | 相对路径会落到 Blender 的 cwd，不是你的 workspace | G3 |
| §8.2 / §7.2 | 覆盖保存会被拒，存盘走 `snapshot`；越界写会被拒并给出 `suggested_path` | G3 |
| §10.2 | 写盘前会落检查点 | G3 |
| §6.3 | 截图落在任务目录，返回里有路径与字节数 | G3 |

→ **`prompts.yml` 原文与我们的规则合并**成一份 G3 小抄（放技能壳里），而不是让模型自己从两份文档里拼。
**知识库要提炼跨工具的规则，而不只是搬契约。**

### 11.5 明确不做

| 不做 | 理由 |
|---|---|
| 运行官方 MCP server（任何形态） | §2.1：那才是真的多一条执行路径 |
| 复用上游 `*_toolcode.py` 源码文本 | §11.2 K4 / I18 |
| 后台批处理任意 `.blend` | 那是 `dsh-blender` 的领域（§1.3）；且会引入额外写通道 |
| 建模知识引擎（"怎么建一座山"） | 定位外（§1.3） |
| 把语料当唯一真相 | §5.3：必须暴露版本漂移（I11） |

---

## 12. 知识库：语料、索引与构建 <a id="knowledge-corpus"></a>

### 12.1 交付形态

语料**全量随包交付**（I21）：

```
knowledge/
├── source/          # 官方 RST 原文（api/ + manual/ + prompts.yml）
│                    #   含 data/manual/copyright.rst —— 手册署名原文必须与语料同置
├── normalized/      # 归一化产物（Markdown 正文 + 面包屑）
├── index/           # 预构建索引（§12.3）
└── meta.json        # 源指纹 / 版本 / 构建时间（§12.4）
```

- **RST 原文一并保留**，但**不参与默认检索**——它是"可回答原文怎么写的"的最后手段。
  若不保留，用户与 agent 都无法回答"手册原话怎么写的"。
- **归一化产物按上游相对路径组织**（`api/…`、`manual/…`），便于回查原文。
- **手册部分必须带自己的署名与许可**：`knowledge/source/manual/copyright.rst` 是唯一一份可照抄的署名原文（§16.3）。

### 12.2 唯一管理入口：根目录 `buildKnowledge.js`

**一个文件承担三件事**，用子命令区分：

```sh
node buildKnowledge.js fetch     # 按 commit 下载语料到 knowledge/source/
node buildKnowledge.js build     # 归一化 + 建索引 + 写 meta.json
node buildKnowledge.js verify    # 只校验指纹，不写任何文件
```

| 契约 | 规则 |
|---|---|
| 位置 | **仓库根目录**，且**必须列入** `package.json` 的 `files` |
| 依赖 | 只用 Node 内置模块（`node:fs` / `node:path` / `node:crypto` / `node:zlib`）；**不引入 Python、不引入 docutils、不引入 npm 依赖** |
| 类型检查 | 必须被 `jsconfig.json` 的 `include` 覆盖 |
| 构建时机 | **维护时运行，不在安装时运行**；`index/` 与 `normalized/` 是**随包交付的预构建产物** |
| 幂等 | 同一 `corpusRevision` + 同一 `builderVersion` 必须产出逐字节相同的结果（I22） |

**`fetch` 的来源锚定（必须按 commit，不能按分支）**：

- 上游 `main` 会前进，按分支取到的内容随时变化 → **必须 pin 到 commit sha**；
- 取用记录**精确到 blob sha**（I25），写进 `knowledge/meta.json` 与 `THIRD_PARTY_NOTICES.md`；
- `fetch` 结束时**校验**：文件数、总字节数、逐文件 blob sha 与记录一致，不符即中止。

**三条取语料时必须遵守的通道约束（全部实测踩过）**：

| 约束 | 理由 |
|---|---|
| **归档端点不可用**：`/archive/<sha>.tar.gz` 被 Cloudflare 的浏览器校验挡住（GET 403 `Just a moment...`，HEAD 却是 200） | 因此**走 Forgejo 的 JSON API 逐文件取**（`/api/v1/repos/<owner>/<repo>/contents/<path>?ref=<sha>`，含 148 KB 巨型页也可用） |
| **不能用 `git/trees?recursive=true` 列文件** | 上游实现会**截断在 1000 条**（`truncated=true`）：实测只拿到 965 个文件，而语料有 4,600+ 个。必须**逐级列目录** |
| **哈希口径必须是 git blob hash** | tree 给出的 `sha` 是 `sha1("blob <字节数>\0" + content)`，**不是内容的裸 sha1**。用错口径会得出"全部文件都不符"的假结论 |

**取用不完整即硬失败**：请求失败（上游 429 限流）时**不得写出完整的 `blobs` 记录**——
否则 `build` 会拿一份残缺指纹去比对，得出误导性的"源指纹不符"。`fetch` 必须支持**断点续传**
（本地已按 git blob hash 校验通过的文件不再请求），并允许调并发。

### 12.3 索引格式与硬要求

| 项 | 规则 |
|---|---|
| 格式 | **JSON Lines**：`index/files.jsonl` 每行一个文件级记录（含 `path` / 文件级 token 集合 / 词频）；`index/df.json` 存 `df` / `n_files` / `idf` |
| 读取方式 | **流式**逐行读，不得一次载入全量 |
| 必须携带语料级预计算量 | **DF / IDF / 文件级 token 集合**（**I20**）。理由：上游慢的不是解析而是**每次查询把 16 MB 语料读一遍算 DF**——这些量在语料固定时是常量 |
| 体积上限（**验收**） | `index/` 总字节 ≤ **1.5 ×** `normalized/` 总字节 |
| 导航页 | `data/manual/**/index.rst`（370 个）在**索引期排除或降权**——导航页在检索里是噪声 |

### 12.4 源指纹（`knowledge/meta.json`） <a id="knowledge-fingerprint"></a>

许可取证与版本漂移**共用这一份元数据**，不重复维护（I25）。

| 字段 | 值 |
|---|---|
| `sourceRepo` | `https://projects.blender.org/lab/blender_mcp` |
| `corpusRevision` | **固定 commit sha**（不是分支名；§12.2） |
| `codeRevision` | 代码基线 tag `v1.0.3` = commit `2cea8d566dde07fbac28a61d698909d69724e853` |
| `blenderVersion` | 语料对应的 Blender 版本（依据 `data/api/index.rst` 标题） |
| `rstFiles` / `rstBytes` | 文件数与总字节数 |
| `apiFiles` / `apiBytes` | 同上，仅 `api/` |
| `manualFiles` / `manualBytes` | 同上，仅 `manual/` |
| `examplePyFiles` / `examplePyBytes` | 同上，`api/examples/*.py`（**必须显式覆盖**，见 §16.4） |
| `promptsYmlBytes` | `prompts.yml` 字节数 |
| `blobs` | 逐文件 blob sha（至少覆盖 `prompts.yml`、`api/**`、`manual/**`、被摘要的 `*_toolcode.py`） |
| `builderVersion` / `builtAt` | 构建脚本版本与时间 |

**「代码基线」与「语料基线」是两个不同的 ref，必须分别记录**（I25）。
上游的 `manifest.json` 版本号**与语料版本不同步**（`main` 写滞后值，tag 内写另一个值）——
**不得用上游版本号推导语料版本**。

**语料必须对齐运行版本**：知识库要对齐**用户实际运行的 Blender**，而不是对齐代码 tag。

### 12.5 语料版本升级的流程

1. `node buildKnowledge.js fetch`（pin 新 commit）→ 2. 审阅 diff → 3. `node buildKnowledge.js build`
→ 4. 核对 `unparsed` 清单（§13.2）与体积验收值（§12.3）→ 5. 更新 `THIRD_PARTY_NOTICES.md` 的 pin 与 blob sha。

**指纹不符即中止**，**不得静默用半份语料建索引**（I22）。

---

## 13. 知识库：检索与工具 <a id="knowledge-retrieval"></a>

### 13.1 沿用与改掉的上游做法

| 上游做法 | 处置 |
|---|---|
| 两层过滤（文件级 AND 预筛 → 段落级 AND） | ✅ **沿用**——最省事也最有效，是上游 0.4 s 跑完的直接原因 |
| match surface = `body + path + 标题栈` | ✅ **沿用**：让 `"bpy.props IntProperty"` 这类"一半靠文件名"的查询能命中 |
| 标题合并进其后第一段（标题不单独占位） | ✅ **沿用**：避免返回"只有标题没有内容"的命中 |
| token 首尾加 `\b`；39 个 stop-word 只作用于查询侧 | ✅ **沿用**：`obj` 不应命中 `object` |
| 字段名 `truncated` / `breadcrumb` / `path` / `score` / `index` | ✅ **沿用**（与上游同名同义，便于对照） |
| 超限降级为**定义清单**（不内联，改列顶层定义名 + "用 `<id>.<name>` 继续查"） | ✅ **沿用形状**，阈值按 §13.2 重定 |
| `kind` 化的"找不到"：`suggestions` / `partial`(+`available`) / `missing` | ✅ **沿用语义**：比单一 `notFound` 更能让模型自我纠错 |
| **每次查询重读全语料算 DF** | ❌ **改掉**（I20，§12.3） |
| `data/manual/**/index.rst` 参与检索 | ❌ **改掉**（§12.3） |
| docutils 全量语义 | ❌ 不做：Node 侧行式解析（§12.2） |
| 深 2 成员解析：对 `bpy.types.Scene.frame_current` 这类**类成员**返回 `partial` 而非 `definition` | ❌ **不照抄**：这是上游的**行为缺口**，不是契约。我们的 `api` mode 要么修好，要么在返回里如实说明，**不得假装它不可查** |

### 13.2 行式解析器的两条硬要求

1. **未识别的 RST directive 必须显式可见**（**I24**）：保留原文并标注 `unparsed`，**不得静默丢弃内容**。
   理由：静默丢弃会让模型以为"手册里没有这段"。
2. **`build` 必须输出"未识别 directive 清单"**，使它**能随语料版本变化被重扫**。

**为什么这条不是小题大做**：上游自己的解析器 stub 表**已经跟不上语料**——Blender 5.2 语料新增的 `.. details::`
未注册，导致上游自己的 strict 测试在 5.2 语料上**实测失败**。
→ 我们也会遇到同样的事，区别只在于**是否让它可见**。

### 13.3 单页内联阈值：不拍数字，定验收判据

- 单页内联上限由 `knowledge.maxCharsPerHit` 驱动；
- **"超限降级为定义清单"的触发点与该值同源**，不再引入独立的 KB 常量；
- **验收判据**：语料内**至少 90% 的 `.rst` 文件**能被单次命中**完整内联**；
  巨型页（如 `bpy.ops.object.rst`，148 KB）必须降级，且降级后返回"顶层定义名 + 用 `<id>.<name>` 继续查"的指引。

**不照抄上游 32 KB 的理由**：那是上游的参数形状，不是我们的约束。我们的真实约束是模型侧 token 预算，
而它已经由 `maxCharsPerHit` 表达。

### 13.4 `blender_mcp_docs`：一个工具、三种 mode

| mode | 语义 | 对应上游工具 | 关键参数 |
|---|---|---|---|
| `api` | 按标识符取契约（G1） | `get_python_api_docs` | `identifier`（支持 `*` / `X.*` 列举语义） |
| `search` | 全文检索（G2 为主） | `search_api_docs` / `search_manual_docs` | `query` / `maxResults`（默认 20）/ `context`（默认 0，对称窗口）/ `index`（钻取回传） |
| `rules` | 取 G3 规则条目 | `prompts.yml` | 无参数 |

**返回形状**（字段名一经发布不改，I23；标注「沿用」者与上游同名同义）：

```jsonc
{
  "status": "ok",
  "available": true,                    // 见下方「不可用语义」
  "source": "…/knowledge",              // 取证：数据从哪来
  "indexed": { "files": 0, "builtAt": "…" },
  "drift": { "corpus": "5.2", "runtime": "5.2.2", "level": "minor" },  // §5.3
  "kind": "definition",                 // 沿用：definition | exact | namespace | partial | suggestions | missing
  "found": true,                        // 沿用
  "hits": [
    { "path": "api/bpy.ops.object.rst",      // 沿用（相对 knowledge/，正斜杠）
      "breadcrumb": "bpy.ops.object > add",  // 沿用（" > " 连接；无 section 时为空串）
      "index": 0,                            // 沿用：钻取用
      "score": 12,                           // 沿用：整数
      "text": "……（含代码块，≤ maxCharsPerHit）" }
  ],
  "truncated": false,                   // 沿用
  "unparsed": []                        // 本插件新增：未识别 directive 清单，空数组表示无
}
```

**为什么沿用上游的 `kind` / `found`**：它们承载"**找到了相关信息但形状不同**"的语义
（`partial` 附 `available`、`suggestions` 附候选），能让模型继续往下查，而不是卡在一次失败的查找上。

### 13.5 「不可用」语义 <a id="knowledge-unavailable"></a>

**`available: false` 只表示"内置资产损坏"，不表示"用户没配"。**

配置开关已被移除（§2.2），因此这个分支**不是**给用户看的功能开关，而是**交付缺陷的自报**：

| 触发条件 | 返回 |
|---|---|
| `knowledge/index/` 缺失或不可解析 | `available: false` + `"内置索引缺失或损坏——这是一处交付缺陷，请重新安装或运行 buildKnowledge.js build"` |
| 语料指纹与索引不符 | 同上，并附 `verify` 的输出 |
| 语料版本与运行版本不符 | **不是不可用**：正常检索 + `drift` / `warnings`（§5.3） |

**这个分支必须保留**（**I17**）：如果删掉它，损坏的索引只能返回空命中，
而空命中与"手册里确实没有这段"**无法区分**——那正是我们批评上游的地方
（上游语料缺失时只返回 `{"hits": [], "truncated": false}`）。

**不可用时：**
- 不报 `isError`，用 `available: false` + 可执行指引（与 §7.1 的接管风格一致）；
- **不得静默降级、不得凭空编造 API**（I17）。

### 13.6 消费入口是技能，不是"指望模型想起来" <a id="knowledge-skill"></a>

**双入口**：

| 入口 | 作用 | 由谁保证 |
|---|---|---|
| **技能**（`skills/blender-mcp-knowledge/SKILL.md`） | 进入 Blender 任务时按需加载：**常驻 G3 小抄** + 「什么时候必须查 `blender_mcp_docs`」的判定规则（写算子参数前、遇到 `poll` 失败时、不确定枚举值时） | 插件在 `apply()` 时用 `ctx.skills.register()` 注册为**运行时技能**（`source: 'runtime'`） |
| **`blender_mcp_docs` 工具** | 真正的检索入口，token 有界 | 插件工具面 |

**为什么需要技能**：一个工具即便做出来，模型也可能整场不调用它——它不会"想起来要查 API"。
**技能是壳不是数据**：技能目录里放 SKILL 描述与检索判定规则；**数据在 `knowledge/`**。

**为什么必须真的注册**（**实测缺口**）：此前 `skills/` 只是包内的一个普通目录，
插件只注册工具与提示词，于是会话技能目录里**看不到这个技能**——它只能被"读到文件"才起作用，
等于把"消费入口"寄托在模型碰巧去读它。现在它经 `skill` 服务注册（缺该服务时**只退回文件**，
不阻断插件加载），`SKILL.md` 仍是真身来源、可被人工直读。

### 13.7 检索成本基线（**实测**，来自上游做法）

| 项 | 上游实测 |
|---|---|
| 语料规模 | 4,508 `.rst` / 16,039,148 B |
| 单次检索（冷） | 0.39–1.22 s；主要成本是**把整个 scope 的 16 MB 读一遍**去算 DF，不是解析 |
| 单次检索（同进程第二次） | 0.35–0.38 s——热缓存**只省解析，不省读盘** |
| 实际被解析的文件数 | 2–43 / 2,150–2,358（文件级预筛极狠） |
| 全量 RST 解析一遍（单进程，docutils） | 35.5 s |
| 归一化产物 | 56,340 段；纯正文 10.1 MB（0.63×）；带面包屑 JSON 12.9 MB（0.81×） |
| 单次响应体积（`maxResults=20`） | 8.4–16.6 KB ≈ 2–4K token |

→ **I20 的直接依据**：预构建的价值不在"避免解析"，而在"避免每次读 16 MB"。
**验收目标**：单次检索显著优于上游的 0.39–1.22 s（测法见 [`../.AGENTS/README.md`](../.AGENTS/README.md)）。

---

## 14. 配置与工作目录 <a id="config"></a>

### 14.1 配置形态

- 插件是 **profile bundle**；配置写在 profile 的 `cordis.patch.yml`（插件自带的 `cordis.patch.yml` 只作默认值模板）；
- **不做任何浏览器端代码**（无 HTML 注入、无 `webServer` 路由、无 `clientBundle`）；
- **补丁层语义是按行整体替换 `config`，不做深合并**（**规范**）：用户覆盖时必须重述该行的所有键。

### 14.2 配置键全集

**原则（I12）**：schema 里出现的键，**必须真的被代码读取**。
不允许"看起来已实现"的死配置留在 schema / YAML / README 里。当前接线状态见
[`../.AGENTS/README.md`](../.AGENTS/README.md) 的配置接线表。

| 键 | 默认 | 域 |
|---|---|---|
| `host` / `port` | `127.0.0.1` / `9876` | 端点 |
| `portCandidates` | `[]` | 端点（仅 `allowPortScan` 为真时使用） |
| `allowPortScan` | `false` | 端点 |
| `connectTimeoutMs` | `10000` | 超时 |
| `responseTimeoutMs` | `30000` | 超时 |
| `deferredTimeoutMs` | `3600000` | 超时（deferred 上限，§4.4） |
| `maxResponseChars` | `200000` | 截断 |
| `rejectForeignPeer` | `true` | 诊断第 3 级 |
| `requireVersionMin` | `'5.1'` | 版本门控 |
| `taskRoot` | `''`（空 = 按 `taskRootMode` 决定） | 任务目录 |
| `taskRootMode` | `'blendFile'` | 任务目录（`blendFile` = 活动 `.blend` 同级；`workspace` = 会话工作区） |
| `checkpoint.enabled` / `.keep` / `.maxBytes` / `.perTurn` | `true` / `3` / `0` / `'turn'` | 检查点（`perTurn` = `turn` \| `write`，§10.1） |
| `intercept.enabled` / `.guardThreadScope` | `true` / `'main'` | 护栏 |
| `knowledge.maxHits` | `8` | 知识库（1–50） |
| `knowledge.maxCharsPerHit` | `4000` | 知识库（200–20000） |
| `expose.status` / `.exec` / `.inspect` / `.capture` / `.snapshot` / `.docs` | 全 `true` | 工具面 |

**为什么 `knowledge.*` 只有这两个键**：知识库的**语料与索引是交付事实**（§2.2），不是配置；
只有"每次部署可能取不同值"的量才配做配置——`maxHits` 与 `maxCharsPerHit` 是**模型侧 token 预算**的参数，符合这个条件。

**为什么超时与轮询阈值不得写死**（**规范**）：Blender 偏好的 timer 间隔可被用户改动（§4.2），
任何"不同部署可能不同"的量都必须是配置字段或握手探测值。

### 14.3 配置错误必须在加载期失败

- `Config` 必须导出**同名 Schemastery schema**并带默认值；**非法配置在加载期失败并给出可操作错误**（**规范**）。
- README 必须给出**完整可复制的配置片段**（含全部键，因为不做深合并）与**一条真实报错示例**。

### 14.4 工作目录约定 <a id="taskdir"></a>

在**活动 `.blend` 文件所在目录**下创建 **`.dsh-blender-{task}`**，**任务名由 AI 创建目录时自动生成**：

```
<blendDir>/.dsh-blender-{task}/
├── checkpoints/   renders/   exports/   reports/   logs/
└── .dsh-blender-task.json   # 属主标记
```

父目录的优先级：显式 `taskRoot` > `taskRootMode`（默认 `blendFile` = 活动 `.blend` 同级；
`workspace` = 会话工作区）。活动工程尚未保存过（没有文件路径）时回退 workspace 并 `console.warn` 说明。

| 规则 | 内容 |
|---|---|
| slug 化 | 保留中英文与数字；剥离路径分隔符、控制字符、Windows 保留名（`CON`/`NUL`/`AUX`…）与结尾点号空格；上限 48 字符；为空回退 `task` |
| 已存在且无属主标记 | 视为**他人数据**，**拒绝复用**，追加 `-2` / `-3` |
| 强制落点 | 所有输出路径由插件派生。理由不只是防误伤——**实测 Blender 进程 cwd 在 `Program Files` 下，相对路径根本落不到 workspace** |
| 目录可见性 | `status.existingTaskDirs` **只读**列出同级既有 `.dsh-blender-*`（名 + 最后修改时间）；目录过多时由 AI 询问用户是否清理，**删除始终由用户自己做**（[#tools](#tools)） |
| 生命周期 | 任务目录**不自动删除** |
| 只读工具 | **不得创建任务目录**（I14）：找不到既有任务目录时返回 `taskRoot: null` |

### 14.5 知识库的读取位置

`docs` **只读** `knowledge/` 下的静态资产（随包交付、只读），**不写任何位置**（I19）。
构建产物与缓存**不落任务目录**——它是插件侧资产，与"某个会话的某次任务"无关。

### 14.6 落点约束的统一表述

| 主体 | 可写范围 |
|---|---|
| Blender 侧 `exec` 代码 | **只有**任务目录（§7.3） |
| 插件自身的产物（检查点 / 截图 / 导出 / 报告） | **只有**任务目录（I19） |
| 知识库工具 | **任何位置都不写**（§14.5 / I19） |

---

## 15. 打包与分发 <a id="packaging"></a>

### 15.1 交付形态

```
dsh-blender-mcp-bridge/
├── package.json           # dsh.bundle.patch -> ./cordis.patch.yml
├── cordis.patch.yml       # 默认配置模板（列出全集）
├── LICENSE                # GPL-3.0 全文
├── THIRD_PARTY_NOTICES.md # 上游语料的署名与许可
├── index.js               # name / inject / Config(schemastery) / apply(ctx, config)
├── buildKnowledge.js      # 语料下载 / 归一化 / 建索引的唯一入口（§12.2）
├── lib/                   # 小驼峰文件名，纯 ESM
├── skills/
│   └── blender-mcp-knowledge/   # DSH 技能壳（§13.6）
├── knowledge/             # 语料 + 归一化 + 索引 + meta.json（§12.1）
├── jsconfig.json          # checkJs + strict：类型检查用，不产出构建产物
├── AGENTS.md / README.md / THIRD_PARTY_NOTICES.md   # 规范类（根目录只保留这三份）
├── .AGENTS/               # 交付状态 + 工作记忆（非交付物）：README（单一入口）/ 红线 / 决策史 /
│                          #   审计与报告记录 / 验证门禁
├── test/                  # 入库门禁（非交付物）：仓库一致性 + 全语料审计 + 报告逐条回归，离线可跑
├── docs/                  # 契约、导读、实测发现与上游取证（非交付物）
└── diagnostics/           # 临时探针（非交付物，**不入库**）
```

### 15.2 纯 JS 交付、TS 只做类型检查

- `node:net` / `node:fs` 之外**不引入运行时依赖**；JSDoc 承担类型注解，由 `tsc --noEmit`（`checkJs`）把关；
- **不引入构建步骤**，从根上避开 `prepare` / `allowBuilds` 授权链（**规范**）；
- **曾经的局限（已解除）**：`defineTool({...})` 要求 `type: 'string'` 这类**字面量类型**，
  纯 JS 对象字面量一度会放宽成 `string`。现在 `toolDefinition()` 把 `parameters` 直接声明为
  `ParameterSchemaSpec`，对象字面量靠**上下文类型**保留字面量，于是类型检查覆盖
  `index.js` + `lib/**` + `buildKnowledge.js` + `test/**`（`pnpm check`），入口不再有 `@ts-nocheck`。
  → 工具注册点同时保留**运行期结构断言**（`diagnostics/probeEndToEnd.js`）。

### 15.3 不做设置页

**决定：不做浏览器端设置卡片，配置一律走本机配置文件。**

| 理由 | 说明 |
|---|---|
| 与生态一致 | 参考实现 `dsh-blender` 就是纯配置文件 + README，用户不需要学第二套东西 |
| 范围控制 | 本插件配置项少且稳定；为它维护一条前端链路不划算 |
| 不碰信任边界 | 一旦自建 HTTP 路由，就必须处理 Host/Origin 伪造与未认证请求；配置文件没有这个问题 |

**明确记录一条可行性事实**：浏览器端 UI **不是做不到**——第三方插件 `dsh-whale-widget` 用
`ctx.webServer.register` + 注入 `<script>` 到 HTML 响应就实现了完整浏览器端 UI，**不依赖 `clientBundle`**。
所以"不做"的理由是**范围控制与信任边界**，不是"做不到"。将来若要加，这是一条已知可行的路。

### 15.4 安装与分发

- 本地装到 profile：`dsh plugin --profile web add ./dsh-blender-mcp-bridge`
- **纯 JS 交付下没有构建步骤**：不存在 `prepare` 脚本，安装时执行包代码的风险一并消失；
- 知识库索引是**预构建产物、随仓库交付**；`buildKnowledge.js` 只在**维护时**运行；
- 安装后没有设置卡片，端点差异只能靠 README 指引（默认 `127.0.0.1:9876`）。

### 15.5 README 配置章节的要求（**必须满足**）

README 必须能被一个没读过设计契约的人照着改对：

| 必须包含 | 形式 |
|---|---|
| 配置文件位置 | profile 的 `cordis.patch.yml` 路径写法 |
| **完整可复制片段** | 含**全部键**（因为不做深合并），可直接粘贴 |
| 每个键的作用与默认值 | 表格：键 / 默认 / 取值 / 什么时候需要改 |
| 改完如何生效 | 配置变更触发插件热替换；需要重启 harness 的情形要写明 |
| 常见改法 | "换端口"、"换任务目录父目录"、"关检查点"、"只装技能壳不装插件"各给一段 |
| 知识库与许可 | 语料来源、许可、如何重建索引 |
| 校验与排错 | 加载期失败的说明 + 一条真实报错示例 |

---

## 16. 许可与署名 <a id="licensing"></a>

### 16.1 结论

**本插件以 `GPL-3.0-or-later` 分发。**

### 16.2 为什么

因为 §11–§13 内联了上游 GPL-3.0 语料。**内联即再分发**：一旦语料成为本仓库的一部分，本仓库就不能再用 MIT 分发。

**为什么不靠"独立目录 + MIT"规避**：技术上可以让语料"看起来是聚合"（mere aggregation），
但**本插件的核心价值之一就是这份语料可用**：插件要读它、技能要索引它、构建脚本要处理它。
这种耦合不是"恰好放在一起"，因此**不应当靠目录边界去主张许可边界**。

### 16.3 两份语料的许可不同，必须分别表述

| 语料 | 来源（脚本可证） | 许可（语料内可证） | 逐文件声明 | 署名要求 |
|---|---|---|---|---|
| `data/api/` | Blender API reference build 的产物（`_misc/update_reference_api.py` 只接受本地目录，**不记 URL/commit/ref**） | 仓库级 `GPL-3.0-or-later`（`mcp/manifest.json`） | **无**（`check_license.py` 豁免整棵子树） | 无可照抄的原文 |
| `data/manual/` | Blender manual 检出的 `manual/` | **CC-BY-SA-4.0**，由**语料自证**（`data/manual/copyright.rst`） | 无（只有这一页） | **明确且可直接照抄**：署名 `Blender Documentation Team` + 许可链接 |
| `data/prompts.yml` | Blender Authors | 仓库级 `GPL-3.0-or-later`（依据 `mcp/manifest.json`；文件本身无头） | 无 | 无 |

**`data/manual/copyright.rst` 是唯一一份可照抄的署名原文**：它同时说明"Blender 本体按 GNU GPL 发布"，
并明确**排除** logo / 商标 / 图标 / 源码 / Python 脚本。
→ `THIRD_PARTY_NOTICES.md` 应**引用这段原文**，而不是自己改写。

**⚠️ 一处必须如实标注的存疑**：`data/api/` 的确切上游许可**未见明确声明**。
`update_reference_api.py` 不记录来源 ref，"Sphinx 构建产物"是**推断**（RST 里全是 Sphinx 专有语法），
仓库级 `manifest.json` 的 `GPL-3.0-or-later` **不自动等于**该生成文档的条款。
→ 处理方式：按仓库级声明署名，但在 `THIRD_PARTY_NOTICES.md` 里**如实写出这一不确定性**，不假装已确证。

**`_SKIP_DIRS` 只跳过 `data/api` 的真实含义**（必须写对，否则会误读成全目录豁免）：
那是"本仓库自写的 `.py` 必须有 SPDX 头"这一条**内部规约**的检查（只查 `.py`、只查第一行、不审 RST、不写 attribution），
豁免的实质是"从 API 构建里整体拷来的 `examples/*.py` 不贴 Blender Authors 的版权行"。
**它不构成许可声明或豁免。**

**保守原则**：不确定归属时**按更严格的一方履行**（既署名 GPL 也署名 CC-BY-SA），代价只是多写几行。
⚠️ 以上结论来自**仓库声明与外部仓库实测**，不是法律意见；正式合规需法务复核。

### 16.4 履行义务

| 义务 | 落点 |
|---|---|
| 完整许可证文本 | 仓库根 `LICENSE`（GPL-3.0 全文）。⚠️ **上游仓库自己根本没有 `LICENSE`/`NOTICE`/`COPYING`**，所以全文必须我们自己放 |
| 逐文件 SPDX 标识 | 新写的 `.js` 文件首行加 `SPDX-License-Identifier: GPL-3.0-or-later`（与上游 `_misc/check_license.py` 同规：判定方式是**第一行含字面量 `SPDX`**） |
| 来源与版本声明 | `THIRD_PARTY_NOTICES.md`：仓库地址、**代码 pin**、**语料 pin（commit sha）**、取用范围、**逐路径 + blob sha**、许可、取用日期 |
| 修改声明 | 语料被**归一化改写**过（RST → Markdown），属于修改，须标明；`prompts.yml` 若只做格式转换/节选也要写明"未改语义" |
| 手册部分的额外署名 | `data/manual/` 是 **CC-BY-SA-4.0**，须署名 `Blender Documentation Team` + 手册链接 + 许可链接 |
| **不要照抄上游的许可口径** | 上游只声明全局 GPL-3.0-or-later，对 `data/manual/**` **一句 CC-BY-SA 都没提**。照抄它就会漏掉手册的署名义务 |
| **语义摘要不要冒充 GPL 作品** | `*_toolcode.py` 的语义摘要不属于 GPL 衍生作品，**不要**给它加 `SPDX-License-Identifier`；在 NOTICE 里以"参考来源"记一行即可。红线是**不得与原文逐句对应**（那就成了衍生作品） |
| 示例文件必须随包 | 上游 `pyproject.toml` 的 `package-data` **只声明了 `.rst` 与 `prompts.yml`**，遗漏了 `data/api/examples/*.py`。我们的 `package.json` `files` 与 `meta.json` **必须显式覆盖**，不得照抄上游的声明形状 |
| **`package.json` 的 `files` 必须真实** | 每一列出的路径都必须存在。**不允许提前声明尚未实现的交付物**（历史教训见 `.AGENTS/history.md`） |

---

## 17. 实现不变量 <a id="invariants"></a>

**这是编码红线。ID 一经分配**不重编号、不复用**（`.AGENTS/history.md` 记录已作废 ID 的处置）。**

| ID | 不变量 |
|---|---|
| **I1** | 本轮首次写操作前先落检查点，**无检查点不执行**；**检查点写盘失败即拒绝执行**，不得静默降级为"无检查点继续" |
| **I2** | 响应必须**连续 `recv` 直到 `0x00`** 再解析（两次读取之间不得 sleep）。归属判定用**连接时记录的稳定标识**，不用名字 |
| **I3** | 长任务走 deferred；不可用时**明确报错**，不冻结 GUI。不得假设 undo 能回滚到任意期望状态——**检查点文件是唯一可靠的回滚来源**（undo 栈增长不可观测，见 [#checkpoint-undo](#checkpoint-undo)，故 undo 不得自动采用） |
| **I4** | 失败按 §5.2 **分级**给出可操作原因；进程枚举不可用时降级为"无法确认"，**不得猜** |
| **I5** | 路径由**任务目录**派生，判定用 `realpath`；保留 `open_mainfile` 作为自救通道 |
| **I6** | 拦截判定针对**写路径**，不针对算子名（`wm.save_mainfile` 与 `save_as_mainfile` 同等对待） |
| **I7** | 越界写/删的拒绝必须带**接管提示**与**可用替代路径**，不得只抛 `PermissionError` |
| **I8** | 检查点的登记、轮换、清理都按**会话隔离**（+ 先写第 n+1 份再回落 n 份） |
| **I9** | 回滚入口**不进工具面**：`snapshot` 只写盘，回滚由 agent 用 `exec` 调 `open_mainfile` |
| **I10** | **不宣称安全沙箱**：如实引用上游无防护声明；拦截层只防疏忽、不防对抗 |
| **I11** | **过期的知识必须可见**：语料版本与运行版本不符时，返回必须带 `drift` / `warnings` |
| **I12** | **不允许死配置**：schema 里出现的键必须真的被读取；未能接线的键要么接线、要么删除 |
| **I13** | 内部**破坏性例程**先校验保护集合非空，为空或异常偏小则硬中止 |
| **I14** | **只读工具不得创建任务目录** |
| **I15** | 视觉反馈产物**只落任务目录**；视口渲染必须**还原被临时改动的渲染设置** |
| **I16** | L2 护栏**只在 exec 作用域内安装，不得常驻**；`bpy.ops` 代理必须**读写透传 `_op_create_function`**，且对非名单算子**委托给当前** `_op_create_function` |
| **I17** | 知识库资产缺失或损坏时，**明确报"不可用"并给出下一步**，不得静默降级、不得凭空编造 API |
| **I18** | **不得复制上游 `*_toolcode.py` 的源码文本**；只取接口形状与语义，实现在自有通道重写 |
| **I19** | 产物与检索摘录都**不得越过任务目录**；知识库返回的是**有界摘录 + 来源路径**，不是整份数据；知识库工具**不写任何位置** |
| **I20** | **索引必须携带语料级预计算量（DF / IDF / 文件级 token 集合）**，查询不得每次重扫全语料 |
| **I21** | **知识库是交付事实**：官方语料必定内置，`blender_mcp_docs` 必须读它；不得提供"关掉知识库"或"指向外部语料"的开关 |
| **I22** | **索引构建必须可复现**：源指纹不符即中止；同一 revision + builderVersion 必须产出逐字节相同的结果 |
| **I23** | 工具名、参数名与返回字段名**一经发布不改**（兼容红线） |
| **I24** | **未识别的 RST directive 必须显式可见**：保留原文并标注 `unparsed`，不得静默丢弃内容；构建脚本必须输出未识别清单 |
| **I25** | **「代码基线」与「语料基线」分别记录**，精确到 commit sha 与 blob sha；不得用上游 `manifest.json` 的版本号推导语料版本 |
| **I26** | **完成态必须交接**：`exec` 每次返回必须带 `handoffHint`（会话仍 dirty 时明确写出"未保存 / 可 Ctrl+Z / 渲染请按 F12 / 任务目录已保留"）；`status` 必须带 `sessionChecklist`。**拒绝态**的接管话术（§7.2）**不能代替**完成态的交接 |
| **I27** | **场景整洁约定属于交付行为**：系统提示词必须包含"集合分层 + `<类别>_<角色>_<序号>` 命名 + 四边面优先 + 灯光与体积各自成组"这段软限制；不得把"组织与命名"完全推给用户或委托给模型碰运气 |

---

## 附录 A. 文档间引用规则 <a id="appendix-refs"></a>

1. **本文件内部**：可以用 `§N`（章节号允许随版本变化）。
2. **外部文件**（`README.md` / `AGENTS.md` / `.AGENTS/**` / `docs/**` / `THIRD_PARTY_NOTICES.md` / 代码注释）：
   引用**锚点**（如 `contract.md#transport`、`contract.md#invariants`）或**不变量 ID**（`I16`）；
   **不得**引用 `§N`。
3. **锚点与不变量 ID 是稳定契约**：章节可以增删挪动，锚点与 ID 不变。
4. 需要"为什么"时指向 [`history.md`](../.AGENTS/history.md)；需要"做到哪一步"时指向
   [`../.AGENTS/README.md`](../.AGENTS/README.md)；
   需要"旧编号对应的现行章节"时看下面的附录 B。

**锚点索引**：`#positioning`、`#core-decisions`、`#decision-knowledge-is-data`、`#decision-identity`、`#decision-localized-errors`、
`#facts`、`#transport`、`#transport-deferred`、`#discovery`、`#discovery-diagnostics`、`#discovery-drift`、
`#tools`、`#tools-result-fields`、`#handoff`、`#interception`、`#interception-env-writes`、
`#guard`、`#guard-ops-proxy`、`#guard-carrier`、`#checkpoint`、`#knowledge`、`#knowledge-granularity`、
`#knowledge-corpus`、`#knowledge-fingerprint`、`#knowledge-retrieval`、`#knowledge-unavailable`、`#knowledge-skill`、
`#config`、`#taskdir`、`#packaging`、`#licensing`、`#invariants`。

---

## 附录 B. 旧编号导航（v2.0 → v3） <a id="appendix-oldrefs"></a>

旧文档的 `§N` 与 `Qn` 不再使用；按下表换算。**旧编号只在 `.AGENTS/history.md` 与两份取证记录里作为历史坐标存在。**

| 旧 | 新 | 旧 | 新 |
|---|---|---|---|
| §1（目的与范围） | §1 / §2 | §9.5（预处理与索引） | §12 |
| §1.2（v1.0 翻转论证） | `.AGENTS/history.md` | §9.6（`docs` 工具） | §13.4 / §13.5 |
| §1.3（与 `dsh-blender` 分工） | §1.3 折叠节 | §9.7（技能入口） | §13.6 |
| §1.4（三重身份） | §12.1 / §15.1 | §9.8（明确不做） | §11.5 |
| §2（事实基础） | §3 | §10（联网策略） | §14 |
| §2.2（安全网现状） | §3.2 / §3.3 | §11（事故复盘） | `.AGENTS/history.md`（I1/I2/I3 留在 §17） |
| §2.3（上游安全声明） | §2.4 | §12.1（交付形态） | §15.1 |
| §2.5（名字不是身份） | §2.6 | §12.2 / §12.2a（配置与 README） | §15.3 / §15.5 |
| §2.7（工具面事实） | §3.6 | §12.2b（接线状态表） | `.AGENTS/README.md` |
| §2.8（错误本地化） | §2.7 | §12.3（安装分发） | §15.4 |
| §2.9（上游有两个） | §2.8 | §13（实现不变量） | §17（ID 不变） |
| §3（传输契约） | §4 | §14（许可） | §16 |
| §4（连接与发现） | §5 | §15（结论状态） | 已并入各节；`Qn` 见 `.AGENTS/history.md` |
| §4.1（漂移检测） | §5.3 | §16.3（未实现待办） | `.AGENTS/README.md` |
| §5（工具面） | §6 | §17（参考来源） | `.AGENTS/history.md` |
| §6（工作目录） | §14.4 | Q1–Q9、Q12、Q16–Q22 | 各节；`.AGENTS/history.md` |
| §7（拦截） | §7 / §8 | Q10、Q11 | **作废**（`.AGENTS/history.md`） |
| §7.7（三层机制） | §9 | Q14（偏好写入口） | §8.5（**已决策：纳入，收窄为三项**） |
| §8（检查点） | §10 | Q15（deferred 接线） | §4.4（**已决策：接线，待复测**） |
| §9（知识库论证） | §2.1 / §11 | — | — |
