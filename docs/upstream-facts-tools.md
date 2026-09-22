# 上游事实清单：add-on 协议 / 26 个工具契约 / 安全面与许可

> 取证对象：Blender 官方 MCP server 仓库 **`lab/blender_mcp`**（`https://projects.blender.org/lab/blender_mcp`，GPL-3.0-or-later）。
> 目标：本插件直连的 **add-on 私有套接字协议**，以及我们后续要变成知识库的上游 **工具契约 / `*_toolcode.py` 执行语义 / 许可义务**。
> 来源类别标注：**实测**（本机跑出来的观察）/ **源码**（上游仓库源码，路径+行号）/ **文档**（上游自带文档）/ **规范**（许可与外部规范）。
>
> 📌 **本文里指向本项目的 `§N` 引用指这份契约文档 v2.0 的旧编号，已冻结**——它们是取证当时的坐标，不是现行章节。
> 换算表见 [`contract.md#appendix-oldrefs`](contract.md#appendix-oldrefs)；
> 本文自身的 `§0`–`§9` 是本文内部章节，不受影响。

## 0. 取证基线与方法（先读这一节，否则会引用错版本）

### 0.1 语料怎么来的

| 项 | 值 | 来源 |
|---|---|---|
| 仓库 | `https://projects.blender.org/lab/blender_mcp` | **实测**（Forgejo API 拉取） |
| `main` HEAD（拉取时） | `ff54e4d8f6b09502f2f466189cca0e52b4a91643`（2026-09-11T21:35:31+10:00） | **实测**（`/api/v1/repos/lab/blender_mcp/branches/main`） |
| 本机 add-on 版本 | 扩展 id `mcp`，`version = "1.0.3"`，`blender_version_min = "5.1.0"` | **实测**（`addon/blender_mcp_addon/blender_manifest.toml`，`%APPDATA%\Blender Foundation\Blender\5.2\extensions\user_default\mcp\blender_manifest.toml`） |
| tag `v1.0.3` | commit `2cea8d566dde07fbac28a61d698909d69724e853`（2026-09-11T09:55:18+02:00） | **实测**（`/api/v1/repos/lab/blender_mcp/tags/v1.0.3`） |
| 仓库全部 tag | `v1.0.3` `v1.0.2` `v1.0.1` `v1.0.0` `v0.3.0` `26.04.10` `v0.1.0` | **实测** |
| 本机 Blender | 5.2.2 LTS（build 2026-09-15），内置 Python 3.13.13 | **实测**（`blender --version`） |

**本机已装 add-on == tag v1.0.3（逐字节，实测）**——用 git blob sha 比对，9 个文件全部一致：

| 文件（`addon/blender_mcp_addon/`） | 字节 | git blob sha（= v1.0.3） |
|---|---|---|
| `__init__.py` | 12449 | `804871cf7895b543d7c1eb749f09b449542ccd53` |
| `capture_output.py` | 2019 | `28601f5601bac331dd7bfefdbd1d73b8bf6bf13a` |
| `cli.py` | 1477 | `ba64e7db298b8e04000cdd7d3c1731291404a42d` |
| `deferred_tool.py` | 6207 | `7976706ddf353702533802f86789818d3e90f7b6` |
| `execute_blocking.py` | 753 | `bad2e4627297f19866a132e22d4b655b945b7640` |
| `execute_interactive.py` | 1460 | `d70189bac452f6201323c830e2035fdef090d4bf` |
| `mcp_to_blender_server.py` | 23117 | `1d59773f50085e1df35cf02ac5a5a066ed1dbeaf` |
| `weak_sandbox.py` | 5608 | `8514dd71bcc0a6b7a6722238536a74753d58305f` |
| `blender_manifest.toml` | 396 | `7deb87e4a47301e06cab36a8e6ff4a5d9eb94dfc` |

### 0.2 `main` 与 `v1.0.3` 的差异（决定"知识库按哪个版本取语料"）

**实测**（`tree.json` = main 4711 blobs vs `tree_v103.json` = v1.0.3 4481 blobs 的 sha 比对）：

| 类别 | 数量 | 说明 |
|---|---|---|
| 仅 v1.0.3 有 | 48 | 全部在 `mcp/blmcp/data/**` |
| 仅 main 有 | 278 | 全部在 `mcp/blmcp/data/**` |
| 内容不同 | 2284 | 2280 在 `mcp/blmcp/data/**`；**只有 4 个非语料文件不同** |
| 不同的 4 个非语料文件 | `_misc/update_reference_manual.py`、`addon/blender_mcp_addon/blender_manifest.toml`、`mcp/manifest.json`、`mcp/pyproject.toml` | 都是版本/脚本元数据：main 的 manifest 写 `version = "1.0.0"`、`mcp/pyproject.toml` 与 `mcp/manifest.json` 写 `1.0.2`，v1.0.3 才统一为 `1.0.3` |

结论（**源码**/**实测**）：
1. **所有代码路径（addon、tools、tools_helpers、tests、_misc 除一个脚本）在 main 与 v1.0.3 完全同 blob**，所以本文件引用行号对两者都成立；
2. **RST 语料在两版本间差异巨大**（Blender API/手册被重新生成）。我们的 add-on 是 v1.0.3，**语料必须按 tag `v1.0.3` 取**，否则"版本漂移提示"（DESIGN §4.1）会拿错基准；
3. 不要用 main 的 `version` 字段做版本门控（它是滞后的开发态值）。

### 0.3 下载物与探测器（都在工作区，供复核）

| 路径 | 内容 |
|---|---|
| `.tmp-blmcp/upstream/repo/` | main 的精选源码镜像（本次结论的引用对象） |
| `.tmp-blmcp/upstream/tree.json` / `tree_v103.json` | main / v1.0.3 的完整递归文件树（含 blob sha） |
| `.tmp-blmcp/upstream/repo_v103files_*` | v1.0.3 的 `blender_manifest.toml` / `mcp/pyproject.toml` / `mcp/manifest.json` / `prompts.yml` |
| `.tmp-blmcp/upstream/tools_analysis.json` | 26 个工具的 AST 提取结果（参数/默认值/annotations/行号） |
| `.tmp-blmcp/upstream/probe_results*.json` | 实测探针原始响应（round1/2/3/4/5） |
| `.tmp-blmcp/upstream/probe_protocol.py`、`probe_round2..5.py`、`analyze_tools.py` | 探针脚本 |

**⚠️ 关于既有的 `.tmp-blmcp/upstream/files/`（点名 prompts.yml 那份）**：它是 **main 分支内容 + CRLF 转换**，不是 v1.0.3。
**实测**：`mcp_to_blender_server.py` 该副本 23823 B 而 v1.0.3 是 23117 B，差值 706 = 文件行数（706 行），且该副本含 706 个 CRLF、0 个纯 LF；`prompts.yml` 同理（6358 vs 6235，差 123 = 行数）；逐行 diff 无差异。另外该目录的 `mcp__pyproject.toml` / `mcp__manifest.json` 是 **1.0.2**。
→ **可以拿它读文本，但不要用它做 sha/字节数/版本结论**；本文件一律以 `.tmp-blmcp/upstream/repo/`（main，代码路径 == v1.0.3）与 tag 拉取的元数据文件为准。

### 0.4 实测环境（协议探针）

- 命令：`blender --background --online-mode --command blender_mcp --port 9877`（**实测**：`--port` 能穿透 `--command` 传给 `cli.py` 的 argparse）。
  - 需要 `--online-mode`：否则 `bpy.app.online_access` 为假，CLI handler 直接返回 1（`addon/blender_mcp_addon/__init__.py:76-86, 303-310`）。
- **用户 GUI 会话（PID 3468）当时正监听 `127.0.0.1:9876`，本次探针全程使用 9877，未触碰该会话**；探针结束后后台实例已终止，9877 只剩 TIME_WAIT。
- 探针会话环境（**实测**，后台模式）：`background=true`、`online_access=true`、`bpy.data.filepath=""`、`scene.render.filepath="/tmp\"`、`engine="BLENDER_EEVEE"`、机器 UI 语言为中文（错误串会本地化，见 §5）。
- **未覆盖**：交互（GUI timer）模式、`_SEND_TIMEOUT` 的"客户端停止 drain"路径、`use_log` 日志、`_for_cli` 的子进程路径。

---

## 1. A. 协议与传输（与 `lib/protocol.js` 对账）

### 1.1 帧格式、请求体与响应编码

| 项 | 事实 | 来源 |
|---|---|---|
| 定界 | 单字节 `0x00`；请求与响应都是"UTF-8 JSON 文本 + `\0`" | **源码** `addon/blender_mcp_addon/mcp_to_blender_server.py:224-228`（`(json.dumps(response) + "\0").encode("utf-8")`）；**实测** |
| 请求体 | `{"type":"execute","strict_json":<bool>,"code":"<python>"}` | **源码** `:326-350`；**实测** |
| JSON 解析 | `json.loads(data)`；**只取第一个 `\0` 之前的字节** | **源码** `:324`、`:526`（`client.buffer.index(b"\0")`）、`:596` |
| `type` 允许值 | **只有 `execute`**；其它值（含缺失）→ `{"status":"error","message":"Unknown request type: <repr>"}` | **源码** `:326-330`；**实测**（`'list_tools'` → `Unknown request type: 'list_tools'`；缺失 → `Unknown request type: None`） |
| `strict_json` | **必须存在且必须是 `bool`**（`isinstance(x, bool)`）。缺失 / 字符串 `"true"` / 整数 `1` 都返回**同一条**错误：`Internal error: a blender_mcp tool sent a request without the required 'strict_json' boolean key. This is a bug in the tool that generated this code` | **源码** `:335-346`；**实测**（4 组） |
| `code` | `request.get("code", "")`；缺失 → 空串（`exec("")` 成功，`result` 保持初值 `{}`）。非字符串 → `TypeError: exec() arg 1 must be a string...` 的 traceback | **源码** `:249`（`namespace = {"result": {}}`）、`:331`；**实测** |
| 非法 JSON | 不单独处理，异常冒泡到调用者 → `{"status":"error","message":"<traceback>"}` | **源码** `:527-531`（交互）、`:603-604`（后台）；**实测**（traceback 指向 `_handle_blocking_client` L598 → 证明后台走的是 blocking 路径） |
| 响应编码 | `json.dumps` 默认 `ensure_ascii=True` → **响应字节是纯 ASCII**，即使结果是中文也会转成 `\uXXXX` | **源码** `:228`；**实测**（`result={'s':'中文-ü'}` → 响应字节 100% `<0x80`） |
| 成功信封 | `{"status":"ok","result":{...}}`（`result` 必须是 `dict`，否则报错，见下） | **源码** `:272-304`；**实测** |
| 错误信封字段 | `status:"error"` + `message`（短文本或完整 traceback）；**可选** `stdout` / `stderr`（仅当捕获到非空输出时才出现） | **源码** `:253-258`、`:300-303`、`:601`；**实测** |
| `stdout`/`stderr` 捕获 | `CaptureOutput` 用 `_Tee` 同时写真实流与缓冲；`print` 到 stdout/stderr 都会回传 | **源码** `addon/blender_mcp_addon/capture_output.py:20-82`、`:246-250`；**实测**（`{"status":"ok","result":{},"stdout":"hello-stdout\n","stderr":"hello-stderr\n"}`） |
| 响应大小上限 | **没有**。只有 30 s 分片写期限 + 客户端 drain | **源码** `:428-456`（无长度检查） |

### 1.2 失败与边界表现（全部实测，除注明外）

| 输入 | 响应 |
|---|---|
| `result` 不是 dict（`result=[1,2,3]`） | `error` / `The \`result\` variable must be a dict, not list. Wrap your return value: \`result = {"key": value}\`` |
| `strict_json=true` 且结果不可序列化（`bpy.data.objects`） | `error` / `The \`result\` value is not JSON-serializable: Object of type bpy_prop_collection is not JSON serializable` |
| `strict_json=false` 且结果不可序列化 | `ok` / `{"o": "<bpy_collection[0], BlendDataObjects>"}`（`json.dumps(..., default=repr)` 兜底，**源码** `:296-299`） |
| 代码抛异常 | `error` / traceback（RESTART 无） |
| `sys.exit(3)` | `error` / traceback，末行 `RuntimeError: sys.exit() is not allowed in LLM-generated code`（弱沙箱，§1.6） |
| `bpy.ops.wm.quit_blender()` | `error` / `RuntimeError: Operator 'bpy.ops.wm.quit_blender()' is not allowed in LLM-generated code: Terminates the Blender process, use bpy.app.quit() if you must` |
| 代码里定义 `check_is_finished`（后台模式） | `error` / `Deferred responses via \`check_is_finished\` are only supported by the interactive addon server, and are not available in background mode. Finish the request synchronously instead.` |
| 请求体 10.8 MB | `error` / `Request exceeds 10485760 byte limit`（不是截断执行） |
| 发半截请求后不再发 | **10.04 s** 后 `error` / `Client timed out`，随后连接关闭 |
| 同一连接发第二个请求 | 第一个响应后 add-on 即关闭连接；第二次发送 → `ConnectionAbortedError [WinError 10053]`（**一次连接 = 一次请求**） |
| 超时后服务是否存活 | 是，后续请求正常（实测） |

### 1.3 协议常量（逐条：实测值 / 行号）

| 常量 | 值 | 行号（`addon/blender_mcp_addon/mcp_to_blender_server.py`） | 备注 |
|---|---|---|---|
| `_MAX_REQUEST_BYTES` | `10 * 1024 * 1024` = **10485760**（10 MiB） | `:128` | 交互 `:514-519`、后台 `:588-594`；错误文案 `Request exceeds {:d} byte limit` |
| `_CLIENT_TIMEOUT` | **10.0 s** | `:133` | 交互：tick 计数 `max(2, ceil(10/interval_active))`（`:102`、`:166`、`:489-494`）；后台：`conn.settimeout(10.0)`（`:579`）。**实测 10.04 s** |
| `_SEND_TIMEOUT` | **30.0 s** | `:135` | 分片写队列的 deadline（`:438`、`:451`）；**未实测**（需大响应 + 停止 drain） |
| `_POLL_BLOCKING_TIMEOUT` | **1.0 s** | `:137` | `poll_blocking(timeout=1.0)` 的 `select` 超时（`:620-644`）；**源码** |
| `_LISTEN_BACKLOG` | **5** | `:130` | `sock.listen(5)`（`:672`） |
| `_RECV_BUFFER_SIZE` | **4096** | `:131` | 只是 add-on 每次 `recv()` 的大小（`:498`、`:583`），不是协议上限。上游 MCP server 侧用 65536（`mcp/blmcp/tools_helpers/connection.py:23`）；本插件 `lib/protocol.js:15` 也用 65536 |
| `TIMER_INTERVAL_ACTIVE`（模块常量） | **0.05 s** | `:43` | 仅用于**首次** timer 间隔与下限（`:240-243`、`:297-300`） |
| 活动间隔（偏好默认） | **0.25 s**（范围 0.05–5.0） | `addon/blender_mcp_addon/__init__.py:140-150` | `start()`/autostart 时会用它覆盖模块常量（`__init__.py:228-232`、`:276-280`） |
| `_TIMER_INTERVAL_IDLE` / 空闲偏好默认 | **1.0 s**（范围 0.1–10） | `:45` / `__init__.py:157-167` | |
| `_TIMER_INTERVAL_IDLE_DELAY` / 默认 | **5.0 s**（范围 1.0–60） | `:47` / `__init__.py:174-184` | 空闲多久后降到 idle 档 |
| deferred 上限 `_DEFERRED_TIMEOUT` | **3600.0 s** | `addon/blender_mcp_addon/deferred_tool.py:41` | **不在 server 模块里**；每个 deferred 连接一个 deadline（`:71`） |
| `DEFAULT_HOST` / `DEFAULT_PORT` | `"localhost"` / `9876` | `:39-40` | 偏好面板可改；端口范围 1024–65535（`__init__.py:24-25, 96-101`） |

### 1.4 旧文档（DESIGN §3.2）数字对账

| 旧说法 | 结论 | 正确值 / 备注 |
|---|---|---|
| 请求体上限 10 MiB | ✅ **正确** | 10485760，`:128`；**实测**错误文案 |
| 客户端超时 10 s | ✅ **正确** | `:133`；**实测 10.04 s**。语义补充：仅约束"请求未发完"；交互模式按 tick 计数（`ceil(10/活动间隔)`，最少 2 tick），后台模式是 socket 超时 |
| 响应写出期限 30 s | ✅ **正确** | `:135`（`_SEND_TIMEOUT`）。旧文档没写清"客户端必须持续 drain"是由 `:441-456` 的队列 + deadline 实现的 |
| 延迟响应上限 3600 s | ✅ **正确但归属写错** | 值在 `deferred_tool.py:41`，不是 server 常量；语义是"每个 deferred 连接的等待总时长"，超时后**只废弃响应，Blender 里的后台任务继续跑**（`deferred_tool.py:36-40, 142-148`） |
| backlog 5 | ✅ **正确** | `:130` |
| 活动 0.25 s / 空闲 1 s | ⚠️ **不精确** | 0.25/1.0 是**偏好默认值**（`__init__.py:143, 160`）；模块常量活动档是 **0.05 s**（`:43`），且首次 tick 用 0.05；两档都可被用户改成 0.05–5 / 0.1–10；还有第三个量 `idle_delay = 5.0` |
| （旧文档未列） | 补充 | `_RECV_BUFFER_SIZE = 4096`（`:131`）、`_POLL_BLOCKING_TIMEOUT = 1.0`（`:137`）、`_TIMER_INTERVAL_IDLE_DELAY = 5.0`（`:47`） |

### 1.5 deferred（延迟响应）精确契约

`check_is_finished()` 的完整生命周期（**源码** + 后台模式**实测**）：

| 阶段 | 行为 | 出处 |
|---|---|---|
| 1. 代码执行完 | `namespace.get("check_is_finished")` 存在且 **callable** → 立即返回 `_ExecResult(response, check_fn)`，此时 `namespace["result"]` **被忽略**；response 只带 stdout/stderr | `mcp_to_blender_server.py:262-270` |
| 2. 连接移交 | 交互模式：`deferred_tool.add(conn, check_fn, strict_json, stdout, stderr)`，连接**从 clients 移除但不关闭** | `:533-544` |
| 3. 后台模式 | **不支持**：把 response 替换成 `_DEFERRED_UNSUPPORTED_MESSAGE`（保留 stdout/stderr）后同步返回 | `:138-142`、`:599-602`；**实测**文案一致 |
| 4. 轮询 | 每个 timer tick 调一次 `check_fn()`；`poll()` 里 `deferred_tool.poll()`；`has_pending()` 为真时 `poll()` 返回 True → **活动间隔被重置**，deferred 期间不会退化到 idle 档 | `:565-569`、`deferred_tool.py:126-196`、`execute_interactive.py:45-48` |
| 5. 语义 | 返回 `None` = 未完成（继续等）；返回 `dict` = 最终结果 → 校验（见下）后发 `{"status":"ok","result":<dict>}` + stdout/stderr | `deferred_tool.py:161-193` |
| 6. 轻量要求 | 文档明确要求 checker 必须轻量（查标志/文件存在性），否则会卡住 UI | `deferred_tool.py:13-18` |

失败表现（**源码**）：

| 情况 | 表现 |
|---|---|
| check_fn 抛异常 | `{"status":"error","message":"<traceback>"}` 并关闭连接（`deferred_tool.py:151-158`） |
| 返回值既不是 `None` 也不是 dict | `{"status":"error","message":"check_is_finished must return None or dict, not <类型>"}`（`:165-172`） |
| `strict_json=true` 且结果不可序列化 | `{"status":"error","message":"Deferred result is not JSON-serializable: ..."}`（`:175-185`） |
| 客户端断开 | 用 `recv(1, MSG_PEEK)` 检测 → 直接丢弃并关闭，不发响应（`:98-110`、`:135-139`） |
| 总时长超过 3600 s | `{"status":"error","message":"Deferred operation timed out after 3600 seconds"}`；Blender 侧任务继续（`:142-148`） |
| 等待期间 add-on 是否阻塞 | **不阻塞**（exec 已返回，连接只是被持有） |

工具侧怎么产生 deferred：`toolcode_wrap_with_calling_convention` 的尾部约定 —— `main()` 返回 **callable** 时置 `check_is_finished = _rv; result = {}`，返回 NamedTuple 时置 `result = _rv._asdict()`（**源码** `mcp/blmcp/tools_helpers/__init__.py:85-114`）。
上游只有渲染族走这条路，且条件是 `use_deferred = not bpy.app.background`（`mcp/blmcp/tools/render_viewport_to_path_toolcode.py:43`、`render_thumbnail_to_path_toolcode.py:62`）。

### 1.6 `weak_sandbox.py`：拦什么、何时还原、对我们的模块级代理意味着什么

**拦什么（源码 `addon/blender_mcp_addon/weak_sandbox.py`）**

| 目标 | 实现 | 出处 |
|---|---|---|
| `sys.exit` | 替换为 `_blocked_exit`，抛 `RuntimeError("sys.exit() is not allowed in LLM-generated code")` | `:29-36` |
| 4 个算子 | `wm.quit_blender`、`wm.read_factory_settings`、`wm.read_factory_userpref`、`wm.read_userpref` | `:56-71` |
| 算子过滤机制 | 包装 `bpy.ops._op_create_function`：命中名单才返回"会抛 RuntimeError 的替身"，否则透传 `original` | `:105-137` |
| 明确不拦 | `wm.read_homefile` 等（注释举例 `screen.spacedata_cleanup`、`wm.previews_clear` 也不拦）；文档自称"不是沙箱，只是拍一下手腕" | `:38-54`、`:5-19` |

**什么时候还原（源码）**：`__enter__` 先记录当前值（`override_store` `:86-93`；`ops_blocked_store` `:105-113` 记 `original`），`__exit__` 依次还原（`:153-161`）——即"还原成**进入 exec 那一刻捕获的值**"。每次请求都会新建一个 `with CaptureOutput() as captured, WeakSandboxForLLM():`（`mcp_to_blender_server.py:250`），所以沙箱自己碰过的属性每次请求都被重置。

**实测（决定性）**：

| 探针 | 结果 |
|---|---|
| exec 内读取 `bpy.ops._op_create_function.__qualname__` | `WeakSandboxForLLM.ops_blocked_store.<locals>._filtered_op_create_function`，`__module__ = bl_ext.user_default.mcp.weak_sandbox` → 执行期间**确实**被包装 |
| exec A 里把 `bpy.ops._op_create_function` 换成带 `_dsh_marker` 的替身，连同替身对象一起存进 `bpy.app.driver_namespace` | A 内读到 `marker="A"` |
| exec B 从 `_filtered_op_create_function.__closure__` 里取出被包装的 `original` | `original.__name__ == "create_function"`、**无 `_dsh_marker`** → 我们在 exec 内打的补丁**没有活过这次请求** |
| exec A 里替换 `builtins.open` 为带 marker 的替身 | |
| exec B 读 `builtins.open` | marker 仍在、`is` 同一对象 → 沙箱**不碰**的属性其补丁**跨 exec 存活** |

**对本插件"模块级 `bpy.ops` 代理"的结论**

1. **不能用 `_op_create_function` 做拦截**：**实测**支持 DESIGN §7.7.2a——补丁每次 exec 结束都被还原；如果补丁在 exec 内打，下一请求就回到真实函数。
2. **换成 `bpy.ops` 模块级代理是对的**：沙箱只 `setattr/getattr` 一个名为 `_op_create_function` 的属性（`weak_sandbox.py:112, 136, 143`），不管理 `bpy.ops` 这个模块对象本身，也不管理我们自己的载体属性 → 代理不会被它还原（**源码推理**，非实测；DESIGN §7.7.2a 已有实测支撑）。
3. **两条硬约束（源码推理，建议进实现不变量）**：
   - 代理**必须**保留 `_op_create_function` 的读写透传。否则沙箱 `__enter__` 的 `original = _bpy_ops._op_create_function`（`weak_sandbox.py:112`）会抛 `AttributeError`，而该异常发生在 `with` 的 `__enter__`，会被 `mcp_to_blender_server.py:527-531` 当作请求异常返回 traceback → **每个请求都会失败**。
   - 如果代理在 `bpy.ops.<name>` 查找路径上**绕开** `_op_create_function`，上游那 4 个被拦算子就**不再被拦**（过滤逻辑活在那个包装里）。要保留上游语义，代理对未列入自己名单的算子应委托给**当前**的 `_op_create_function`（即让沙箱的包装仍然生效），而不是自己重建算子。
4. **`sys.exit` 的补丁同样不可跨请求存活**（同一个 `_OVERRIDES` 还原机制，`:86-99`）。想持久化只能放在沙箱不管理的位置（如 `builtins.open`，实测可存活）。

---

## 2. B. 工具面：**26 个**（不是 27）

### 2.1 真实数字

| 事实 | 值 | 证据 |
|---|---|---|
| 工具总数 | **26** | **实测**（AST 提取：26 个带 `@mcp.tool` 的函数）；**源码** `readme_tools.rst:11-102` 列 26 项；**源码** `tests/test_tool_listing.py:26-654` 冻结清单 26 项 |
| 工具模块数 | **20**（`mcp/blmcp/tools/*.py`，去掉 `*_toolcode.py` 与 `_template_*.py`）；自动发现规则：跳过 `*_toolcode` 与 `_template_`，调用模块的 `register(mcp)` | **源码** `mcp/blmcp/__init__.py:62-70` |
| 分类（按执行通道） | **活会话（socket）17 个** + **`_for_cli`（进程外）6 个** + **本地只读文档 3 个** | **源码**（是否调用 `send_code` / `run_blender_cli` / `rst_doc_search`），见 §2.3 |
| `*_toolcode.py` | **16 个**（+ 4 个 `_template_*.py`） | **实测**（AST/目录计数） |
| 无 toolcode 的 4 个模块 | `get_python_api_docs.py`（本地 RST 读取）、`search_api_docs.py`、`search_manual_docs.py`（本地检索）、`execute_blender_code.py`（直接转发模型给的代码） | **源码** |

> 旧 DESIGN 写"27 个（20 个模块 + 13 个 `_for_cli` 变体）"：**20 对，26/13 错**，而且 `20 + 13 = 33 ≠ 27` 本身自相矛盾。**13 应为 6**。

### 2.2 全清单（工具 / 定义处 / 标注 / 通道）

所有路径相对 `mcp/blmcp/tools/`。`annotations` 里未列出的 hint 即未设置（如 `readOnlyHint` 缺省 = 未声明，不代表"写"）。

| # | 工具名 | 定义处（模块:行） | title | readOnlyHint | destructiveHint | 通道 |
|---|---|---|---|---|---|---|
| 1 | `execute_blender_code` | `execute_blender_code.py:24` | Execute Python Code | — | ✅ | 活会话（`strict_json=False`） |
| 2 | `execute_blender_code_for_cli` | `execute_blender_code.py:43` | Execute Python Code for Command-Line | — | ✅ | `_for_cli` |
| 3 | `get_blendfile_summary_datablocks` | `get_blendfile_summary_datablocks.py:31` | Get Blend-File Data-blocks Summary | ✅ | — | 活会话 |
| 4 | `get_blendfile_summary_datablocks_for_cli` | `get_blendfile_summary_datablocks.py:43` | … for Command-Line | ✅ | — | `_for_cli` |
| 5 | `get_blendfile_summary_missing_files` | `get_blendfile_summary_missing_files.py:31` | Get Blend-File Missing Files Summary | ✅ | — | 活会话 |
| 6 | `get_blendfile_summary_missing_files_for_cli` | `get_blendfile_summary_missing_files.py:44` | … for Command-Line | ✅ | — | `_for_cli` |
| 7 | `get_blendfile_summary_of_linked_libraries` | `get_blendfile_summary_of_linked_libraries.py:31` | Get Blend-File Linked Library Summary | ✅ | — | 活会话 |
| 8 | `get_blendfile_summary_of_linked_libraries_for_cli` | `get_blendfile_summary_of_linked_libraries.py:43` | … for Command-Line | ✅ | — | `_for_cli` |
| 9 | `get_blendfile_summary_path_info` | `get_blendfile_summary_path_info.py:31` | Get Blend-File Path Info Summary | ✅ | — | 活会话 |
| 10 | `get_blendfile_summary_path_info_for_cli` | `get_blendfile_summary_path_info.py:43` | … for Command-Line | ✅ | — | `_for_cli` |
| 11 | `get_blendfile_summary_usage_guess` | `get_blendfile_summary_usage_guess.py:31` | Get Blend-File Usage Summary | ✅ | — | 活会话 |
| 12 | `get_blendfile_summary_usage_guess_for_cli` | `get_blendfile_summary_usage_guess.py:43` | … for Command-Line | ✅ | — | `_for_cli` |
| 13 | `get_object_detail_summary` | `get_object_detail_summary.py:31` | Get Object Detail Summary | ✅ | — | 活会话 |
| 14 | `get_objects_summary` | `get_objects_summary.py:30` | Get Objects Summary | ✅ | — | 活会话 |
| 15 | `get_python_api_docs` | `get_python_api_docs.py:370` | Get Python API Docs | ✅ | — | 本地（`data/api`） |
| 16 | `get_screenshot_of_area_as_image` | `get_screenshot_of_area_as_image.py:33` | Get Area Screenshot | ✅ | — | 活会话（返回 MCP `Image`） |
| 17 | `get_screenshot_of_window_as_image` | `get_screenshot_of_window_as_image.py:33` | Get Window Screenshot | ✅ | — | 活会话（返回 MCP `Image`） |
| 18 | `get_screenshot_of_window_as_json` | `get_screenshot_of_window_as_json.py:30` | Get Screenshot as JSON | ✅ | — | 活会话 |
| 19 | `jump_to_tab_by_name` | `jump_to_tab_by_name.py:31` | Switch to Workspace | — | ✅ | 活会话 |
| 20 | `jump_to_tab_by_space_type` | `jump_to_tab_by_space_type.py:31` | Switch to Matching Workspace | — | ✅ | 活会话 |
| 21 | `jump_to_view3d_object_by_name` | `jump_to_view3d_object_by_name.py:31` | Focus on Object | — | ✅ | 活会话 |
| 22 | `jump_to_view3d_object_data_by_name` | `jump_to_view3d_object_data_by_name.py:31` | Focus on Object Data | — | ✅ | 活会话 |
| 23 | `render_thumbnail_to_path` | `render_thumbnail_to_path.py:31` | Render Thumbnail to Path | — | ✅ | 活会话（可 deferred） |
| 24 | `render_viewport_to_path` | `render_viewport_to_path.py:31` | Render Viewport to Path | ✅ | — | 活会话（可 deferred） |
| 25 | `search_api_docs` | `search_api_docs.py:28` | Search API Docs | ✅ | — | 本地（`data/api`） |
| 26 | `search_manual_docs` | `search_manual_docs.py:28` | Search User Manual | ✅ | — | 本地（`data/manual`） |

### 2.3 标注哪些**不准确**（逐条核实）

| 工具 | 标注 | 实际问题 | 来源 |
|---|---|---|---|
| `render_viewport_to_path` | `readOnlyHint=True` | **写盘**（渲染输出）+ 临时改 `scene.render.filepath`；交互模式还会发起后台渲染 job 并转 deferred | **源码** `render_viewport_to_path.py:28`；`render_viewport_to_path_toolcode.py:46,50-70,60`；**实测** 见下 |
| 5 个 `*_for_cli` 摘要 + `execute_blender_code_for_cli` | 5 个摘要标 `readOnlyHint=True` | `synced_blend_for_cli` 会先对**活会话**发请求，文件脏且同一文件时执行 `bpy.ops.wm.save_as_mainfile(filepath=..., copy=True)` → **在磁盘上新建一份编号副本**（退出时删除），然后起 `blender --background` 子进程 | **源码** `mcp/blmcp/tools_helpers/blender_cli.py:110-167`（`:123-127` 脏检查、`:154-158` 存副本、`:162-167` 删副本） |
| `render_thumbnail_to_path` | `destructiveHint=True`（不是只读） | 标注**方向正确**，但"临时覆盖渲染设置"比 destructive 更准确地说是"临时改设置 + 写盘"：分辨率/百分比/`use_simplify`/`simplify_subdivision_render` + Cycles samples 或 EEVEE samples，靠 context manager 还原 | **源码** `render_thumbnail_to_path_toolcode.py:87-99`；**实测**（调用后 `res=[64,64]`、`use_simplify=false`、`eevee.taa_render_samples=128`、`render.filepath="/tmp\"` 均回到调用前） |
| `get_screenshot_of_*` | `readOnlyHint=True` | 场景无改动，但会**写临时文件**（`bpy.ops.screen.screenshot` → `<tmp>/screenshot.png`，降采样再写 `downscaled.png`），走 `tempfile.TemporaryDirectory` 自动清理 | **源码** `get_screenshot_of_window_as_image_toolcode.py:58-70`、`_template_image_downscale_to_size_limit.py:34,44` |
| `jump_to_tab_by_name` | `destructiveHint=True` | 只切 `window.workspace`（UI 会话状态，不改 `.blend` 数据）→ 标 destructive 偏保守 | **源码** `jump_to_tab_by_name_toolcode.py:45` |
| `jump_to_view3d_object_*` | `destructiveHint=True` | 确实有破坏性：`bpy.ops.object.select_all(action="DESELECT")`、改 active、`bpy.ops.object.mode_set(mode="OBJECT")`（若非 OBJECT 模式**无条件**切）、`allow_edits=True` 时清 hide/exclude 标志 | **源码** `jump_to_view3d_object_by_name_toolcode.py:43-68`、`:63-64` |
| `jump_to_tab_by_space_type` | `destructiveHint=True` | `allow_edits=True` 且无匹配工作区时 `bpy.ops.workspace.duplicate()` **新建工作区**并改其 area 类型 | **源码** `jump_to_tab_by_space_type_toolcode.py:58-74` |
| `get_python_api_docs` / `search_*` | `readOnlyHint=True` | 准确：只读本地 RST（`data/api`、`data/manual`），不连 add-on、不碰场景 | **源码** `get_python_api_docs.py:422`、`search_api_docs.py:11-15`、`rst_doc_search.py:503` |
| `get_*_summary`（非 `_for_cli`） | `readOnlyHint=True` | 准确：只读 `bpy.data` / `context`（无写盘、无 handler 调用） | **源码** 各 toolcode 的 `main()` |

**结论（可直接引用 I9）**：上游 `readOnlyHint` 至少有 **1 个明确反例（`render_viewport_to_path`）**和 **5 个 `_for_cli` 摘要的隐性写盘**；路由/危险分级不得采信该字段。

### 2.4 关键族：参数与返回形状

> 说明：`_toolcode.py` 的 `main()` 返回 `Result` NamedTuple；调用侧 `result = _rv._asdict()`，add-on 再包一层信封 → 客户端看到的是 `{"status":"ok","result":{ ...Result 字段... }}`。
> **因此 `Result.status` 会成为内层 `result.status`**：外层恒为 `"ok"`（除非异常），业务失败时**内层**才是 `"error"` + `message`。这是最容易踩的契约细节（**源码** `get_object_detail_summary_toolcode.py:44-52`；`tools_helpers/__init__.py:103-110`）。

#### (a) 场景/对象摘要族

| 工具 | 参数（名:类型=默认） | 返回字段（`result.*`） | 副作用/前置 |
|---|---|---|---|
| `get_blendfile_summary_datablocks` | 无 | `status`、`datablock_counts: dict[str,int]`、`render_engine`、`scene_name`、`workspaces: [str]`、`active_workspace: str\|None`（`_toolcode.py:17-23`） | 只读；无窗口时 `active_workspace=None`；遍历 `dir(bpy.data)` 取有 `keys/__len__` 的集合计数（`:31-41`） |
| `get_blendfile_summary_missing_files` | 无 | `status`、`missing_files: [{id_type,id_name,path}]`、`total_checked: int`（`:18-21`） | 只读；`bpy.data.file_path_foreach(flags={SKIP_PACKED,SKIP_WEAK_REFERENCES,RESOLVE_TOKEN})` + `os.path.exists`（`:42-45`） |
| `get_blendfile_summary_of_linked_libraries` | 无 | `status`、`direct_libraries: [{filepath,name,linked_datablocks_count}]`、`indirect_libraries: [... + parent_library]`、`total_library_count`（`:17-21`） | 只读；遍历 `bpy.data.libraries` + 统计每个 lib 的引用数（`:31-56`，O(libs × bpy.data 集合)） |
| `get_blendfile_summary_path_info` | 无 | `status`、`filepath`、`is_saved: bool`、`is_dirty: bool`、`age_seconds`、`file_size_bytes`、`backups: [{path,age_seconds,size_bytes}]`（`:23-30`） | 只读；**未保存文件** → `age/size/backups` 为 `None`；backup 探测最多 32 个（`<path>1..32`），遇缺失即停止（`:20, 47-57`） |
| `get_blendfile_summary_usage_guess` | 无 | `status`、`usage_guesses: {用例: {score:int, certainty:int}}`（`:21-23`） | 只读；11 类用例（Animation/Rendering/Scripting/Video Editing/Modeling/Grease Pencil/Geometry Nodes/Compositing/UV Unwrapping/Motion Tracking/Audio），按信号加权平均（`:217-229, 235-249`） |
| `get_objects_summary` | 无 | `status`、`scene_name`、`active_workspace`、`active_object`、`object_mode`、`camera_object`、`collections: [{name,exclude,hide_viewport,objects:[{name,type,parent,data_name,selected,visible,hide_viewport}(+instance_collection)],children:[…]}]`（`:22-29`） | 只读；递归 `view_layer.layer_collection`；**每层都排序**（`:53-60`）→ 大场景返回体可能很大 |
| `get_object_detail_summary` | `name: str`（必填） | `status`、`name`、`type`、`location/rotation/scale/dimensions: [float]`、`parent`、`children: [str]`、`modifiers: [{name,type,show_viewport,show_render}]`、`constraints: [{name,type,enabled}]`、`materials: [str\|None]`、`visibility: {hide_viewport,hide_render,hide_get}`、`data_name`、`collections: [str]`、`message`（`:22-38`） | 只读；对象不存在 → 内层 `status="error"` + `message="Object 'X' not found. Available objects: …"`（`:44-52`） |

#### (b) 截图与渲染族

| 工具 | 参数（名:类型=默认） | 返回 | 副作用/前置（**实测**标注处已跑通） |
|---|---|---|---|
| `get_screenshot_of_window_as_image` | `size_limit_in_bytes: int = 0` | **MCP `Image`（PNG）**，不是 dict；`_toolcode` 返回 `{status, image_base64, message}`，调用侧 base64 解码后构造 `Image`（`get_screenshot_of_window_as_image.py:43-50`） | 后台模式直接 `error:"Screenshots are not available in background mode"`；无窗口 → `"No active window"`；写临时 PNG + 可能写 `downscaled.png`；默认上限 `784896` B（`_toolcode.py:24`），容忍度 `limit//16 = 49056`（`:68`） |
| `get_screenshot_of_area_as_image` | `area_ui_type: AreaUIType`（必填，22 个枚举值）、`size_limit_in_bytes: int = 0` | 同上（`get_screenshot_of_area_as_image.py:45-53`） | 优先用 `context.area`，否则挑**面积最大**的匹配 area（`:89-94`）；无匹配 → 内层 error 并列出可用 `ui_type`（`:96-102`）；`context.temp_override(window, area)` 内调 `bpy.ops.screen.screenshot_area`（`:108-110`） |
| `get_screenshot_of_window_as_json` | 无 | `status`、`window_width/height`、`screen_name`、`workspace`、`scene`、`areas: [{type,x,y,width,height,space:{…},regions:[…]}]`、`active_object: {name,type,mode,location}`、`selected_objects: [{name,type}]`、`message`（`_toolcode.py:17-27`） | 纯内存读取；后台/无窗口 → 内层 error，且 `areas=[]`、`window_width=0`（`:35-54`） |
| `render_viewport_to_path` | `output_path: str`（必填） | `status`、`filepath`、`message`（`_toolcode.py:23-26`） | ⚠️ **写盘位置被改写**：`output_path = os.path.join(bpy.app.tempdir, "blender_mcp", os.path.basename(params.output_path))`（`:46`）——**调用方给的目录被丢弃**。**实测**：传 `dsh_probe.png` 返回 `C:\\...\\Temp\\...\\blender_a31976\\blender_mcp\\dsh_probe.png`（64×64 EEVEE PNG，768 B），调用后 `scene.render.filepath` 还原为 `/tmp\`。临时改 `rd.filepath`（`:50-55`）；交互模式用 `INVOKE_DEFAULT` + deferred（`:57-68`），后台同步返回 |
| `render_thumbnail_to_path` | `output_path: str`（必填） | 同上（`_toolcode.py:33-36`） | 同上路径改写（`:65`）+ 临时改分辨率（最长边 320，保持比例）、`resolution_percentage=100`、`use_simplify=True`、`simplify_subdivision_render=1`、Cycles `samples=16` 或 EEVEE `taa_render_samples=16`（`:23-26, 87-99`）；**实测** 调用后设置全部还原 |

> 两个 render 工具的 `output_path` 语义与文档描述不符（docstring 说 "Render … to *output_path*"）。若我们的 `capture`/`snapshot` 要复用其"形状"，必须**自己重写路径语义**，不要照抄。
> 另：`<tempdir>/blender_mcp/` 目录不存在时**由 Blender 渲染写出自动创建**（**实测**：渲染前 `scratch_exists=false`，渲染后目录与文件都存在），`_toolcode` 里没有 `os.makedirs`。

#### (c) 视口跳转族

| 工具 | 参数 | 返回（`result.*`） | 前置/副作用 |
|---|---|---|---|
| `jump_to_tab_by_name` | `name: str` | `status`、`workspace`、`message`、`available_workspaces`（`_toolcode.py:22-26`） | 后台/无窗口 → 内层 error；找不到 → error + 可用列表（`:32-43`）；成功即改 `window.workspace`（`:45`） |
| `jump_to_tab_by_space_type` | `space_type: str`、`allow_edits: bool = False` | `status`、`workspace`、`space_type`、`created: bool`、`message`、`available_space_types`（`:23-29`） | 匹配规则 = 某工作区**最大 area** 的 `type == space_type`（`:40-52`）；`allow_edits=True` 才 duplicate 并改 area（`:58-74`） |
| `jump_to_view3d_object_by_name` | `name: str`、`allow_edits: bool = False` | `status`、`object`、`type`、`location`、`message`（`:23-28`） | 后台/无窗口 error；`allow_edits` 时取消 hide 并递归放行所属集合（`:43-61`）；随后 `mode_set(OBJECT)` + 反选 + 选中 + 设 active（`:63-68`）；退出相机视角并 `view3d.view_selected()`（`:70-83`）；无 3D 视口 → `message` 提示"已选中但未取景" |
| `jump_to_view3d_object_data_by_name` | `name: str`、`allow_edits: bool = False` | `status`、`object`、`data_name`、`type`、`location`、`message`（`:23-29`） | 按 `obj.data.name == name` 找**第一个**匹配（`:40-44`）；其余同上 |

### 2.5 `*_toolcode.py` 的统一形状与执行语义

**形状（源码）**

| 环节 | 约定 | 出处 |
|---|---|---|
| 文件命名 | `<tool_module>_toolcode.py`，与工具模块同目录 | `mcp/blmcp/tools_helpers/__init__.py:27-42` |
| 加载 | 工具模块顶层 `_TOOL_CALL = toolcode_wrap_with_calling_convention(toolcode_load_from_filepath(__file__))` | 例：`get_objects_summary.py:20` |
| include 展开 | 片段里 `# @include_begin: _template_x.py` … `# @include_end` 之间的**占位实现**会被模板文件内容替换（磁盘上的占位体是桩，如 `return b''`） | `tools_helpers/__init__.py:45-82`；例：`get_screenshot_of_window_as_image_toolcode.py:37-42` |
| 参数注入 | `toolcode_format_call(code, params)` 把 `__BLMCP_PARAMS__` 替换成 `repr(params)` → `Params(...)` 字面量**在 Blender 进程内构造** | `tools_helpers/__init__.py:17, 20-24`；例：`get_object_detail_summary.py:40-42` |
| 调用约定尾部 | `_rv = main(__BLMCP_PARAMS__)`；`callable(_rv)` → `check_is_finished=_rv; result={}`，否则 `result=_rv._asdict()` | `tools_helpers/__init__.py:97-110` |
| 命名元组 | 头文件 `__all__`；有参的工具定义 `Params(NamedTuple)`，所有工具定义 `Result(NamedTuple)`；`main(params)` 内部才 `import bpy` | 例：`get_object_detail_summary_toolcode.py:18-41` |
| 传输 | `send_code(code, strict_json=True)` → `{"type":"execute","code":…,"strict_json":true}` | `mcp/blmcp/tools_helpers/connection.py:32-49`；例：`get_objects_summary.py:37` |
| 回程 | `result` dict → add-on 信封 `{"status":"ok","result":{…}}` | `mcp_to_blender_server.py:272-304` |

**三个代表性片段的执行语义**

| 片段 | 读什么 | 改什么 | 写盘 | 前置/副作用 |
|---|---|---|---|---|
| `get_objects_summary_toolcode.py` | `context.scene`、`context.view_layer.layer_collection` 全树（递归 `_layer_collection_tree` `:47-61`）、每个对象的 `select_get()/visible_get()/hide_get()/parent/data`（`_object_info` `:32-44`） | 无 | 无 | 纯只读；**无背景模式守卫**（后台可用，`active_workspace=None`）；大场景会很大（无截断） |
| `get_screenshot_of_window_as_image_toolcode.py` | `context.window`、`window.screen` | 无（不开窗口、不动场景） | ✅ 临时目录里 `screenshot.png` + 可能 `downscaled.png`（`tempfile.TemporaryDirectory(prefix="blmcp_screenshot_")`，退出即删） | 后台模式 → error `"Screenshots are not available in background mode"`；无窗口 → error `"No active window"`；`bpy.ops.screen.screenshot(filepath=…)` 可能抛 RuntimeError → 转为 error 结果（`:61-63`）；默认上限 784896 B，做了 HiDPI 归一下采样 + 二分降采样（`_template_image_downscale_to_size_limit.py:31-120`） |
| `_template_deferred_tool_check_for_file_output.py` | `bpy.app.is_job_running(job_type)`、`os.path.exists(output_path)` | ✅ 按 `restore_attrs` 列表 `setattr` 还原（典型用途：还原 `scene.render.filepath`） | 无（它只检查文件是否出现） | 返回**闭包**，由 add-on 每 tick 调用一次；任务结束但文件不存在 → `{"status":"error","message":"Job completed but output file was not created"}`（`:30-38`） |

配套：`render_viewport_to_path_toolcode.py:39-71` 是"deferred + 副作用"的完整样例（临时改 `rd.filepath`、后台同步渲染、交互模式转 deferred 并在完成时还原 filepath）。
`render_thumbnail_to_path_toolcode.py` 额外演示 `_backup_attrs_and_assign_multi`（多对象多属性临时赋值 + finally 还原，`_template_backup_attrs_and_assign_multi.py:13-33`）与 `_backup_attrs_multi`（只备份，`_template_backup_attrs_multi.py:13-35`）。

**结论（给 K4 用）**：`*_toolcode.py` 的价值是**契约与副作用边界**，不是可直接搬运的实现：它们依赖 `Params/Result` 命名元组 + 尾部约定在**上游 server 的通道**里才成立，且路径语义/错误表示（内层 `status`）都被上游封装假定过。重写语义摘要时，必须一并记录"前置条件（后台/窗口）、写盘落点、临时设置与还原、是否 deferred"。

### 2.6 `_for_cli` 结论核实（旧文档第 3 条）

| 旧结论 | 核实 |
|---|---|
| 数量 13 | ❌ **错，实测 6 个**（见 §2.2 表 #2、#4、#6、#8、#10、#12） |
| "与本插件定位无关（属进程外批处理）" | ✅ **仍成立**：6 个全部走 `subprocess.run([BLENDER_PATH, "--background", blend_file, "--python-expr", wrapper])`（**源码** `blender_cli.py:50-75`，CLI 超时 120 s `:27`），语义 = 对任意 `.blend` 起独立 Blender 处理，正是 `dsh-blender` 的领域 |
| 补充（旧文档没说） | ⚠️ 它们**不是纯进程外**：调用前会先向**活会话**发 1–2 个 exec 请求（脏标志探测；脏则 `save_as_mainfile(copy=True)` 落一份编号副本，退出时 `os.remove`）——**源码** `blender_cli.py:110-167`。所以任何"复用这 6 个形状"的设计都会引入一条对活会话的**额外写通道**，与 DESIGN I10 冲突 |

---

## 3. C. 许可与署名

### 3.1 逐项实测值

| 项 | 实测值 | 出处 |
|---|---|---|
| `.py` 的 SPDX 头要求 | 扫描目录 **`mcp/`、`addon/`、`chat_client/`**；跳过 `mcp/blmcp/data/api`；判定方式是**第一行包含字面量 `SPDX`** | **源码** `_misc/check_license.py:17-26, 43-53`（注意 `_misc/`、`tests/` **不在**扫描范围，虽然它们自己带头） |
| 实际头文本 | `# SPDX-FileCopyrightText: 2026 Blender Authors` + `# SPDX-License-Identifier: GPL-3.0-or-later` | **源码** 例：`addon/blender_mcp_addon/mcp_to_blender_server.py:1-3`、`mcp/blmcp/__init__.py:1-3` |
| add-on 清单许可 | `license = ["SPDX:GPL-3.0-or-later"]`（v1.0.3 的 `version = "1.0.3"`） | **实测** `addon/blender_mcp_addon/blender_manifest.toml:4, 12-14`（与本机已装副本 byte-identical） |
| `mcp/manifest.json` | `"version": "1.0.3"`，`"license": "GPL-3.0-or-later"` | **实测** v1.0.3 副本 `:4, :25` |
| `mcp/pyproject.toml` | **没有 `license` 字段、没有 classifiers**（只有 name/version/description/requires-python/dependencies） | **实测** v1.0.3 副本 `:5-14`。→ PyPI 元数据里**缺**许可表达式 |
| `addon/pyproject.toml`、`chat_client/pyproject.toml` | **纯工具配置**（ruff/pylint/autopep8），无项目元数据/许可 | **实测**（全文 37 / 12 行） |
| 仓库根许可文件 | **不存在** `LICENSE`/`COPYING`/`NOTICE`/`AUTHORS`（整个 tree 无此类 blob） | **实测**（`tree.json` 全量筛查） |
| `readme.md` | **没有** License 章节（只有 overview / 组件说明 / 工具指向） | **实测** `readme.md:1-83` |
| `mcp/blmcp/data/prompts.yml` | **无 SPDX、无版权头**；前两行只是普通注释 `# Prompts configuration for Blender MCP Server.` / `# This file contains various prompts...` | **实测** `:1-2` |
| `mcp/blmcp/data/api/**` | 由 `_misc/update_reference_api.py` 从 Blender API 参考构建产物复制（RST + `examples/`） | **源码** `_misc/update_reference_api.py:1-9, 74-94`（`check_license.py` 明确跳过该目录 → 这些 `.py` 示例**无 SPDX 头**，**实测** `data/api/examples/gpu.1.py` 首行是文档字符串） |
| `mcp/blmcp/data/manual/**` | 由 `_misc/update_reference_manual.py` 从 Blender manual 检出复制（含 `.rst` 与 `.py`） | **源码** `_misc/update_reference_manual.py:1-9, 34-66` |
| **manual 语料的真实许可** | **CC-BY-SA 4.0**（或更新）：`blender/blender-manual` 仓库根 `LICENSE` = *Attribution-ShareAlike 4.0 International* 全文；`manual/copyright.rst` 明确"除外注明，手册内容按 CC-BY-SA 4.0 或更新版本提供；**排除** logos/trademarks/icons/**source code 与 Python scripts**"，并要求署名 **"Blender Documentation Team"** + 链接 | **实测**（外部仓库 Forgejo API：`blender/blender-manual` `LICENSE`、`manual/copyright.rst`，`https://projects.blender.org/blender/blender-manual`） |
| ⚠️ 上游自身的问题 | `lab/blender_mcp` **没有**为 `data/manual/**` 附任何 CC-BY-SA 声明或署名：全仓库 grep `CC-BY`/`Creative Commons`/`GFDL`/`copyright` → **0 命中**；仓库整体只声明 GPL-3.0-or-later | **实测**（grep 全仓 + 上述许可文件清单）。→ **不能照抄上游的"GPL-only"声明来覆盖 manual 语料** |

### 3.2 我们要内联时的义务（要点，非法律意见）

| 内联对象 | 许可基础 | 义务要点 |
|---|---|---|
| `*_toolcode.py` 的**语义摘要**（重写、不复制原文） | 事实与思想不受版权保护；独立重写不构成复制（**规范**） | ① 每条知识条目记 `source: lab/blender_mcp@v1.0.3` + 相对路径 + blob sha；② **不抄注释/文档串/实现叙述原文**（注释同样受版权保护），只保留 API 语义、"读什么/改什么/写盘落点/前置条件"这类事实；③ 摘要**不要**标 `SPDX-License-Identifier`（它不是 GPL 衍生作品），在 `THIRD_PARTY_NOTICES.md` 里以"参考来源"记一行；④ 若发现摘要与原文逐句对应，就退回重写 —— 风险点是"衍生作品"认定，不是引用行为本身 |
| `mcp/blmcp/data/prompts.yml` **原文内联** | GPL-3.0-or-later（依据 `mcp/manifest.json:25` + 该文件随 GPL 包分发；文件本身无头） | ① 随发行版提供 **GPL-3.0 全文**（`LICENSE`）；② 保留版权与来源：`Blender Authors`（SPDX 头用的作者串）、仓库 URL、tag `v1.0.3` + commit `2cea8d56…`、文件路径、取用日期、blob sha `78dc537f…`；③ 声明是否修改（若只做裁剪/拼接，写明"仅格式转换/节选，未改语义"）；④ 整体以 GPL-3.0-or-later 兼容方式分发（本项目已定 `GPL-3.0-or-later`）；⑤ 写入 `THIRD_PARTY_NOTICES.md` |
| `mcp/blmcp/data/api/**` | 与 Blender 源码/API 参考同源（GPL 侧；上游以 GPL-3.0-or-later 声明分发） | 同上 GPL 义务；`examples/*.py` 无头，需按"Blender Authors / Blender 源码示例"署名 |
| `mcp/blmcp/data/manual/**` | **CC-BY-SA 4.0**（**不是** GPL！） | ① **必须**署名 `Blender Documentation Team` + 链接（在线：`https://docs.blender.org/manual/en/latest/`）；② 注明许可 **CC-BY-SA 4.0** 并给许可链接；③ 注明语料版本/来源 commit；④ ShareAlike：原样收录 + 索引属"复制/汇集"要保留 BY-SA；**若我们改写/摘要手册正文，产物也应按 CC-BY-SA 4.0 提供**（最保守做法）；⑤ manual 里的 `.py` 脚本**不在** CC-BY-SA 范围内（版权页明确排除），按 Blender 源码（GPL）处理 |
| 我们自己的新增文件 | `GPL-3.0-or-later`（AGENTS/`contract.md` 已定） | `.js` 首行 SPDX；`LICENSE` 放 GPL-3.0 全文；`package.json` 的 `files` 必须含 `knowledge/`、`skills/` |

### 3.3 `THIRD_PARTY_NOTICES.md` 建议字段（要点，不写全文）

1. **组件**：Blender MCP（上游 `lab/blender_mcp`）
2. **版权**：`Blender Authors`（逐文件 SPDX 头：`2026 Blender Authors`）；仓库归属 Blender Lab / Blender Foundation
3. **许可**：`GPL-3.0-or-later`（+ 指向随附 `LICENSE` 全文）
4. **来源与版本**：仓库 URL；`v1.0.3` = commit `2cea8d566dde07fbac28a61d698909d69724e853`；取用日期；**逐路径 + blob sha** 清单（至少 `mcp/blmcp/data/prompts.yml`、`mcp/blmcp/tools/*_toolcode.py`（仅语义摘要）、`data/api/**`）
5. **修改声明**：`*_toolcode.py` 仅作语义摘要重写（不含原文）；`prompts.yml` 原样/节选（写明）
6. **独立子组件**：Blender Manual（`blender/blender-manual`）——**CC-BY-SA 4.0**，署名 `Blender Documentation Team` + 手册链接 + 许可链接 + 语料版本；说明 manual 内 Python 脚本不适用 CC-BY-SA
7. **免责**：不提供担保（GPL §15-17 对应）；可选的"本项目与 Blender Foundation 无隶属关系"说明
8. **本项目许可**：`GPL-3.0-or-later`，`LICENSE` = GPL-3.0 全文

### 3.4 `prompts.yml` 的定位与用法

| 问题 | 事实 | 出处 |
|---|---|---|
| 谁读它 | 进程启动时 `main()` 读一次：`open(os.path.join(data_dir, "prompts.yml"))` + `yaml.safe_load` | **源码** `mcp/blmcp/__init__.py:55-58` |
| 怎么用 | `FastMCP("blender-mcp", instructions=str(prompts["initial_instructions"]))` → 成为 MCP server 的 **initialize `instructions`** | **源码** `mcp/blmcp/__init__.py:60` |
| 什么时候发给 LLM | **连接时一次**（MCP 握手返回 server instructions）；每个工具调用**不再重复**发送 | **文档** `readme.md:65-66`（"provides instructions sent to the LLM at connection time"）；**源码**（只在 `main()` 读一次）；**源码** 测试 `tests/test_mcp_server.py:358-371` 断言 server 返回的 instructions 与 `prompts.yml` 完全一致 |
| 结构 | 只有 **1 个 key** `initial_instructions`（多行字符串），实测 123 行、6235 B（v1.0.3） | **实测** `mcp/blmcp/data/prompts.yml:1-123`；测试 `tests/test_mcp_server.py:198-204` |
| 内容骨架（实测章节） | "Bundled Manuals"（告诉 LLM 直接读 `data/api/`、`data/manual/`）、"Executing Code"（`execute_blender_code` 是最后手段、优先 `bpy.ops`、mode/active/selection 显式设置、bmesh 回写、返回 dict 而非 print）、"Scene & Data Structure"、"Object Types & Creation"（**"Names auto-append `.001`"**）、"Transformations & Coordinate Spaces" | **实测** `mcp/blmcp/data/prompts.yml:12-123` |
| 与 RST 的关系 | 上游把 RST 当作**捆绑文件**让 LLM 用普通文本工具读（提示里给路径），另有 3 个本地只读工具（`get_python_api_docs`/`search_api_docs`/`search_manual_docs`）提供结构化入口 | **实测** `prompts.yml:12-20`；**源码** 三个工具模块 |

---

## 4. 旧 `contract.md` 需要更正的事实清单（本次交付重点）

行号基于 2026-09-11 当次读到的 `contract.md`（该文件正在被 Lead 并发修改，**行号可能漂移，请按引文定位**）。

| # | 旧文档说法（位置） | 核实结论 | 正确值 / 建议改法 |
|---|---|---|---|
| 1 | "官方 server 暴露 **27 个工具**"（§9.2 K3，DESIGN `:598`） | ❌ **错**（**实测**） | **26 个** = 17 活会话 + 6 `_for_cli` + 3 本地只读；`readme_tools.rst:11-102`、`tests/test_tool_listing.py:26-654`、AST 计数三处一致 |
| 2 | "**13 个 `_for_cli` 变体**"（§9.2 K3/K4、§9.8，`:600, :701`） | ❌ **数字错**（**实测**） | **6 个**；"与本插件定位无关 / 属进程外批处理"这个**结论仍成立**（`blender_cli.py:69-75` 起 `blender --background`）；补充：它们会先向活会话发 1–2 个 exec（`blender_cli.py:123-158`） |
| 3 | "20 个模块"（同上） | ✅ 对 | 20 个工具模块（`mcp/blmcp/__init__.py:62-70` 的自动发现规则可复核） |
| 4 | §3.2 五个数字：10 MiB / 10 s / 30 s / 3600 s / backlog 5（`:221-225`） | ✅ **全部正确**（**实测**+**源码**） | 但建议补三点：3600 s 定义在 `deferred_tool.py:41`（不在 server）；10 s 在交互模式是 tick 计数、后台模式是 socket 超时（`mcp_to_blender_server.py:102,133,579`，实测 10.04 s）；30 s 是"分片写队列 deadline"（`:135,441-456`，未实测） |
| 5 | 活动/空闲间隔只在 §3.3 写"活动 0.25 s / 空闲 1 s 退避"（`:229-234`），§13 又说不能硬编码 | ⚠️ **不精确**（**源码**） | 模块常量 `TIMER_INTERVAL_ACTIVE = 0.05`（`:43`）；**0.25/1.0 是偏好默认值**（`addon/.../__init__.py:143,160`）；范围 0.05–5.0 / 0.1–10；首次 tick 用 0.05；另有 `idle_delay = 5.0`（`:47`）。写"默认 0.25 s，可配置，首 tick 0.05 s"才准确 |
| 6 | §3.2 表缺 `_RECV_BUFFER_SIZE` / `_POLL_BLOCKING_TIMEOUT` | ⚠️ 遗漏 | `_RECV_BUFFER_SIZE = 4096`（`:131`，非协议上限）；`_POLL_BLOCKING_TIMEOUT = 1.0`（`:137`）；建议在表里补一行，免得实现方误以为 recv 缓冲是 64 KiB 的协议约定 |
| 7 | §3.4 / §9.1 对 deferred 的表述"仅交互模式可用；后台直接报错" | ✅ 对（**实测**） | 已补精确契约：调用点 `mcp_to_blender_server.py:262-270,533-544,565-569,599-602`；状态机与 5 类失败表现见本文件 §1.5；`render_*` 在 `not bpy.app.background` 才 deferred（`render_viewport_to_path_toolcode.py:43`） |
| 8 | §2.2 vs §7.7.2a：弱沙箱会"还原它碰过的一切"（`:130-131` 标"实测"，`:434-436` 标"实测"） | ✅ 与我的**实测**一致 | 机制是"还原成进入 exec 时捕获的值"（`weak_sandbox.py:86-99,140-161,148-161`）；**补充实测**：exec 内对 `bpy.ops._op_create_function` 的补丁**活不过一次请求**（下一请求其 `__closure__` 里的原函数是真实 `create_function`）；而对 `builtins.open` 这类沙箱不碰的属性，补丁**跨 exec 存活**（A3/A4）→ 这正是我们"载体 + 模块级代理"方案成立的依据 |
| 9 | §7.7.2a 的"算子拦截必须用代理" | ✅ 结论对；补两条**源码推理**的硬约束 | ① 代理必须透传 `_op_create_function` 的读写，否则沙箱 `__enter__`（`weak_sandbox.py:112`）抛 `AttributeError` → 每个请求都失败；② 若代理绕开 `_op_create_function`，上游那 4 个被拦算子会**不再被拦**（过滤逻辑在那个包装里），代理应对非自管算子委托给当前 `_op_create_function` |
| 10 | §2.2 弱沙箱拦截范围（`:130`）：`sys.exit` + 4 个算子，`read_homefile` 不拦 | ✅ 对（**源码**+**实测**） | `_BLOCKED_OPS` 4 条 `weak_sandbox.py:56-71`；`_OVERRIDES` 仅 `sys.exit` `:34-36`；错误文案见本文件 §1.2 |
| 11 | "实测的延迟特征：空闲 >5 s 后首次请求约 900 ms、随后约 10 ms"（`:229`） | ⚠️ **本次未能复现/核实** | 我这次所有探测（后台 blocking 模式）都是 0–30 ms 级；该特征需要**交互模式 + 空闲 >5 s**（timer 退化到 1 s）。**标存疑**，建议在 GUI 会话上复测后再写死数字 |
| 12 | §9.2 K4 / §9.8：不复制 `*_toolcode.py` 原文，只取语义 | ✅ 方向对；建议把"要记录的语义维度"写死 | 每个片段至少记：前置条件（后台/窗口/相机/选中）、读什么、改什么、**写盘落点**、临时设置与还原、是否 deferred、返回字段（含内层 `status`） |
| 13 | 若 DESIGN 任何地方沿用"render 工具写 `output_path`"的字面语义 | ⚠️ **必须更正** | 上游两个 render 工具**把目录改写为 `<bpy.app.tempdir>/blender_mcp/<basename>`**（**源码** `render_*_toolcode.py:46/65`；**实测** 实写该路径）。我们自己的 `capture`/`snapshot` 必须自己定义落点语义 |
| 14 | `THIRD_PARTY_NOTICES` 里写"prompts.yml 属 GPL-3.0-or-later，内联署名"（`:897, :909` 一带） | ⚠️ **大体对，但不完整** | ① `prompts.yml` **文件本身无 SPDX/版权头**，许可依据是包/manifest 声明，NOTICE 里要写清"依据 `mcp/manifest.json:25` 的 GPL-3.0-or-later 声明"；② `mcp/pyproject.toml` **没有 license 字段**（PyPI 元数据缺许可）；③ **`data/manual/**` 是 CC-BY-SA 4.0，不是 GPL**，需独立署名"Blender Documentation Team"+链接，且上游自己漏了这一声明（不能照抄它的 GPL-only 口径） |
| 15 | 版本 pin：NOTICE 记 `v1.0.3`（`:897`） | ✅ 对（**实测**：本机 add-on 与 tag v1.0.3 逐 blob 相同） | 但**语料必须按 tag v1.0.3 取**：main 与 v1.0.3 的 `data/**` 差异巨大（v1.0.3 4481 blobs vs main 4711；新增 278、删除 48、变更 2280），且 main 的 `manifest.json`/`pyproject.toml` 还停在 `1.0.2`、addon manifest 停在 `1.0.0` |
| 16 | `.tmp-blmcp/upstream/files/` 被当作可用副本（含 prompts.yml） | ⚠️ **注意**：那是 **main + CRLF**（**实测**：行数=字节差；`mcp__pyproject.toml`/`mcp__manifest.json` 是 1.0.2） | 文本可读、行号一致；但**不要**用它做版本/sha/字节结论。本次结论基于 `.tmp-blmcp/upstream/repo/`（代码 == v1.0.3）与 tag 元数据 |

---

## 5. 存疑 / 未核实（不得当成事实写进 DESIGN）

1. **交互（GUI timer）模式未实测**：活动/空闲间隔的真实生效组合、deferred 在真 GUI 下的时延与行为、`_SEND_TIMEOUT` 的"停止 drain 即弃响应"——本次只有 `--background` 实例，全部按**源码**记录。
2. **30 s 分片写路径未触发**：`_flush_pending_writes` 需要客户端停止读取且响应大于内核发送缓冲；上游注释（`mcp_to_blender_server.py:399-408`）称 macOS HiDPI 截图（~1 MB base64）会命中，本机未复现。
3. **`save_as_mainfile(copy=True)` 对 `bpy.data.is_dirty` 的影响未实测**：`blender_cli.py:154-158` 只发这一条请求；是否会清 dirty 标志、是否会触发 `save_pre`/`save_post` handles，我未验证。
4. **`_for_cli` 子进程路径未实测**：120 s CLI 超时（`blender_cli.py:27`）、`BLENDER_PATH` 缺失时的报错、`__BLMCP_RESULT__`/`__BLMCP_ERROR__` 标记解析（`:25-26, 84-95`）都只看源码。
5. **`_DEFERRED_TIMEOUT` 的 3600 s 未实测**（等待成本过高），只有源码与错误文案模板。
6. **上游许可元数据的空白**：仓库无 `LICENSE`/`NOTICE`；`mcp/pyproject.toml` 无 license 字段；`prompts.yml`/`data/**` 无文件级声明；`data/manual/**` 的 CC-BY-SA 4.0 结论来自**外部仓库** `blender/blender-manual`（根 `LICENSE` + `manual/copyright.rst`），不是 `lab/blender_mcp` 内的声明。若要做正式合规结论，需法务复核。
7. **`data/api/**` 的确切版权归属**：它由 Blender API 参考构建产物复制而来，逐文件无语境；"与 Blender 源码同源（GPL）"是**推断**，未逐文件核验。
8. **头文件 `__all__` 在 `exec()` 语义下的作用**：`_toolcode.py` 里 `__all__`/`__doc__` 会被执行（无害），但我不确定上游是否依赖 `_misc/check_namespace.py` 的检查覆盖 toolcode 文件（该检查未被本次取证覆盖）。
9. **中文 locale 的副作用（实测但需注意泛化）**：本机 Blender UI 为中文时，算子失败信息回来是本地化文本（例：`错误: 无法渲染, 没有摄像机`）。插件**不得**用英文错误串做模式匹配；但"其它 locale 是否也本地化"未逐一验证。
10. **`get_objects_summary` 等大返回无截断**：上游工具返回整个集合树，没有分页/上限；我们若仿形状必须自己加上限（本插件 `maxResponseBytes` 32 MiB 是客户端侧观察，不是上游契约）。
