# dsh-blender-mcp-bridge

DeepSeek Harness 到 **Blender 官方 MCP add-on** 套接字的桥接插件：握手与分级诊断、带检查点的执行、范围受限的误操作拦截、视觉反馈，以及**随包内置的离线 Blender 知识库**。

> **这不是沙箱。** 上游明文声明（[blender.org/lab/mcp-server](https://www.blender.org/lab/mcp-server/)）：
> 经此通道执行的 LLM 生成代码**没有任何防护**，数据可能被删除或发往远端。本插件的护栏**只降低误操作概率**，
> 不改变这一事实。只应连接可信的 Blender 会话，并假设该进程的数据可被读走。

## 它做什么

数据流（**文档**）：

```
MCP Client  ⇐ MCP/stdio ⇒  blender-mcp  ⇐ TCP socket ⇒  Blender Add-on
```

本插件**替代中间的 `blender-mcp` 这一层**，直接讲 add-on 的私有套接字协议（`{"type":"execute", …}` + `0x00` 定界）：

```
DSH  ⇐ 本插件  ⇐ TCP socket ⇒  Blender Add-on
       └─ 同进程内还持有一份只读知识库（源自官方 server 语料，但不运行它）
```

**不启动子进程、不需要 Python/uv 环境、不实现 MCP。** 名字里的 `mcp` 指被连接的 add-on（它有 MCP 之名、无 MCP 协议）。
它**不是 MCP 客户端/服务器**。

### 「不运行它，但把它的知识内嵌」是什么意思

本插件**不运行**官方 MCP server，也不复用它的任何代码路径。但它把官方仓库里的**静态语料**内嵌进来当作知识库：

| 内嵌了什么 | 来自哪里 | 用来干什么 |
|---|---|---|
| 注入提示词 `prompts.yml` | 官方 server 在连接时发给 LLM 的「易错点小抄」 | 技能壳里的常驻规则条目 |
| Blender Python API 参考（RST） | 官方 server 的 `data/api/` | 「这个算子/属性的参数与枚举值是什么」 |
| Blender 用户手册（RST） | 官方 server 的 `data/manual/` | 「这个概念/工作流是怎么回事」 |
| 工具契约与执行语义 | 官方 server 的 26 个工具定义与 `*_toolcode.py` | 「官方是怎么策展这个操作的」 |

**为什么这不是自相矛盾**：本插件反对的从来是**多一条不受管的执行路径**（server 自己连 add-on、执行任意代码、护栏窗口之外）。
知识库是**磁盘上的静态只读文本**，不产生任何请求。这条区分写在 [`docs/contract.md#decision-knowledge-is-data`](docs/contract.md#decision-knowledge-is-data)。

**知识库不是可选项**：语料与索引必定随包内置，`blender_mcp_docs` 必定读它
（[`docs/contract.md#core-decisions`](docs/contract.md#core-decisions) / I21）。

### 工具面

六个工具，注册开关见配置表的 `expose.*`。

| 工具 | 性质 | 作用 |
|---|---|---|
| `blender_mcp_status` | 只读 | 握手、指纹、版本门控、**风险姿态**（文件路径 / 是否脏 / 距今 / 可用检查点 / 场景规模 / 本轮是否已落检查点），并报告 `renderSettings`、`settingsDrift` 与**收尾清单 `sessionChecklist`**。可传 `task` 指定任务目录名 |
| `blender_mcp_inspect` | 只读 | 结构化场景快照（集合、数据块计数、链接库、缺失引用、逐对象类型/父级/修改器/网格统计/材质） |
| `blender_mcp_exec` | **写** | 唯一执行通道；过 L1 静态拦截、落检查点、装 L2 运行时护栏 |
| `blender_mcp_capture` | 写盘（任务目录） | **视觉反馈**：视口 / 区域 / 整窗截图；改过的渲染设置会还原（I15） |
| `blender_mcp_snapshot` | 写盘 | 把会话存成任务目录内的 `.blend` 副本（`copy=True`，**不改会话文件路径**） |
| `blender_mcp_docs` | 只读 | **内嵌知识库检索**：`api`（API 契约）/ `search`（全文）/ `rules`（策展规则）。纯离线、不写盘 |

> ⚠️ **一次 `exec` 必须控制在 30 s 以内**（`responseTimeoutMs`）。实测：1920×1080 / 128 采样 + 合成器 ≈ 17 s 可过；
> 256 采样单帧会超时。在这条通道上**唯一可靠的出图姿势是 `bpy.ops.render.render(write_still=True)`**
> （同步 + 直写文件）；**裸 `render()` 会静默空转**——返回 `FINISHED` 却什么都没渲染（`Render Result` 为 0×0），
> 而 `render('INVOKE_DEFAULT')` 是**异步**的（返回 `RUNNING_MODAL`，渲染任务可能在你这次 `exec` 返回之后才落盘）。
> 详见 [`docs/blender-5.2-findings.md`](docs/blender-5.2-findings.md)。高采样出图请用 Blender 自己的 **F12**。
>
> `exec` 里的 Python **必须自己 `import bpy`**：命名空间没有默认绑定，漏写会得到**空 `result` 且不报错**。

### 与 `dsh-blender` 的分工

环境里已装的第三方插件 `dsh-blender` 走**完全不同的模型**：每个操作 spawn 一个 `--background` Blender 进程，
作用在指定 `.blend` 或空场景上，靠**进程隔离**保证安全——因此它**看不见你的活会话**。

| 你想做的事 | 用哪个 |
|---|---|
| 分析/校验/批量导出某个 `.blend` 文件 | `dsh-blender`（批处理，无副作用） |
| 在你**正在编辑的场景**里干活、且不弄丢未保存工作 | **本插件** |
| 查 Blender API / 手册 / 官方策展语义 | **本插件**（离线知识库，不联网） |

两者互不干扰，可以并存。完整对照见 [`docs/contract.md#positioning`](docs/contract.md#positioning)。

## 安全模型（三层，如实说明边界）

| 层 | 位置 | 作用 | 是边界吗 |
|---|---|---|---|
| **L1 静态** | Node 侧，**发送前** | 认出**字面量**路径的越界写/删、覆盖保存、丢弃会话；命中就**根本不发送** | ❌ 只提前拒绝 |
| **L2 运行时** | Blender 进程内，与用户代码同一 exec | 包裹 `open`/`os.open`/删除族 + 用**代理**接管 `bpy.ops` 上的受控算子 | ✅ 唯一真实边界 |
| **L3 事后** | exec 尾部 | 数据块指针差分、钩子自检、检查点证据 | ❌ 只作报告 |

**已知边界（必须知道）**：

- L2 只检**主线程**（可配置）；补丁窗口是**同步 exec 期间**，窗口外的异步/延迟写不受约束。
  返回体里的 `guard.window` 如实说明这次覆盖到哪结束，`guard.jobsRunning` 会列出仍在跑的后台任务
  （例如异步渲染）——**它们的落盘在窗口之外，护栏看不到**。
- `importlib.reload`、ctypes 直调 C、动态构造路径都能绕过 L2（L1 也解析不出来）。**「未命中」不等于安全。**
- 可写范围**只有任务目录**；默认是**活动 `.blend` 文件所在目录**下的 `.dsh-blender-{task}/`
  （AGENTS.md 基础安全需要第 2 条）。可用 `taskRootMode: workspace` 改用会话工作区，
  或用 `taskRoot` 指定一个固定的父目录。⚠️ 任务目录的位置**就是**这条边界的位置——
  它在工程目录下时意味着"允许写工程目录下的一个子目录"。**这不是安全边界，只防误操作。**
  越界写/删会被拒绝并返回 `suggested_path` 与接管说明——这一步需要**用户**自己在 Blender 或系统里完成。
- 覆盖保存（`wm.save_mainfile`、`wm.save_as_mainfile` 不带 `copy=True`）一律拒绝；存盘走 `blender_mcp_snapshot`。
- **偏好 / add-on 开关 / 脚本自动执行**的写入口属于 L2 拦截范围（三项，可枚举）。
- 未保存的会话在写之前会落检查点；**检查点写盘失败即拒绝执行**，不会「无备份继续」。
- **联网不禁止**：Blender 进程内的代码有与 Blender 同等的网络能力，DSH 侧无法审计其出站流量（上游声明见上）。
  知识库本身**纯离线**，不联网、不回传。

细节见 [`docs/contract.md#interception`](docs/contract.md#interception)、[`#guard`](docs/contract.md#guard)、[`#handoff`](docs/contract.md#handoff)。

## 不动你的渲染与导出设置

这是本插件**明确的立场**，不是"建议"：

**默认不写** `scene.render.*`、`scene.cycles.samples`、`scene.view_settings.*`、
`scene.frame_start / frame_end / frame_current`、`scene.render.image_settings.*`、
`scene.render.filepath`、`scene.compositing_node_group` 的既有内容。

理由很实在：这些都是你按自己的显卡、动画长度和后期流程调好的**工作状态**，
AI 看到的是结果、不是空位。最典型的翻车是——为了出预览图把帧范围设成探针用的短范围，
忘记还原，你下次渲染只会得到 2 帧，还以为是工程坏了。

实现上分两层，**两层都是"让越界可见"，不是"替你做主"**：

| 层 | 做什么 |
|---|---|
| **提示词**（`systemPrompt` 段落 `blender-mcp-bridge-settings-policy`） | 告诉模型默认不动、为什么不该动、要动必须先问清数值 |
| **可见性**（工具返回字段） | `status.renderSettings` / `status.settingsBaseline` / `status.settingsDrift`；`exec.settingsDrift` 非空时同时进 `warnings` |

会话基线在**第一次 `exec`** 时记下，之后每次执行都会比对并列出差异（键名 + 原值 → 新值）。
它**不阻断**执行（阻断是 L1/L2 那层的事），目的是让"AI 改了你的设置"这件事
出现在你能看到的地方，而不是等出图不对才发现。

> 想自己核一遍：`node diagnostics/probeSettingsGuard.js`（含"故意改设置能否被抓到"，
> 以及"探针自己有没有把你的设置改回去"——收尾会复核每个键与开局一致）。

## 干完活会主动交接（不是等你发现）

**被拒时**的接管话术一直都有（结构化拒绝 + `handoff` + `suggested_path`）。**顺利干完时**的交接
同样是契约的一部分（I26）：

| 字段 | 在哪 | 说什么 |
|---|---|---|
| `handoffHint` | `blender_mcp_exec` 每次返回 | 会话仍是 dirty 时明确提示：改动**没有保存**在用户文件里、可按 **Ctrl+Z** 逐步回退、要出图请按 **F12**、任务目录已保留 |
| `sessionChecklist` | `blender_mcp_status` | `isDirty` / 任务目录 / 检查点份数 / 快照文件 / `nextSteps[]` |

**为什么要有这个**：一次顺利的建模任务如果没人提醒，用户很容易以为"AI 已经把结果保存了"——
而本插件**从不保存**他的文件。完成态的指引与拒绝态的指引是两件事，前者以前是缺的。

## 场景整洁约定（AI 会被要求做的）

插件的系统提示词里有一段 `场景整洁约定`，要求 AI 在建模时有意识地做组织，而不是堆一场景对象：

- **集合分层**：按用途分组（结构 / 家具 / 植物 / 灯光 / 大气 / 相机…），不要 137 个对象全在 `Collection` 里；
- **命名**：`<类别>_<角色>_<序号>`（例 `STR_Column_L_02`），而不是 `Cube.042`；
- **布线**：可见几何**四边面优先**；三角/ngon 只允许留在隐藏的分布体或不可见封盖上；
- **秩序**：灯光与体积雾**各自成组**并统一命名；空集合要删掉，不要留 `REF_Plates` 这种空壳。

这是**软限制**（提示词层，不阻断执行），与"出图设置默认不动"同级。它不替你做美术决策，
只是让"整洁"成为 AI 的默认行为而不是碰运气。

## 安装

作为 **profile bundle** 安装（无浏览器端设置卡片；配置经 profile 的 `cordis.patch.yml`）：

```sh
dsh plugin --profile web add ./dsh-blender-mcp-bridge
```

纯 JS 交付、**没有构建步骤**，因此不存在 `prepare` / `allowBuilds` 授权链。

### 运行前提

- Blender **≥ 5.1**，官方 add-on（扩展 id `mcp`）已安装并启用。
- Blender 系统偏好里**开启联网访问**——关闭时 add-on 根本不会启动。
- add-on 面板里按 Start（或用 Auto Start）。

**知识库不需要任何前提**：语料随插件交付，不联网、不装 Python 包。

## 配置

**全部配置都走本机配置文件**，没有设置页、没有浏览器端代码（与 `dsh-blender` 的做法一致）。

**改哪个文件**：你 profile 的 `cordis.patch.yml`。

| 平台 | 位置 |
|---|---|
| 默认 | `~/.dsh/profiles/web/cordis.patch.yml` |
| 自定义 `DSH_HOME` | `$DSH_HOME/profiles/web/cordis.patch.yml` |

插件自带的 [`cordis.patch.yml`](cordis.patch.yml) 只是**默认值模板**，改它不会生效（安装时已被 profile 的补丁层覆盖）。

**改完怎么生效**：配置变更会触发插件**热替换**（HMR）——卸载旧实例、按新配置加载新实例，无需重启 harness。
若你改的是 profile 的 `bundles` 列表或路径，则需要重启。

⚠️ **补丁层是按行整体替换 `config`，不做深合并**。你写的那一行必须包含**全部键**，否则缺的键会退回默认值而不是继承插件模板。
最省事的做法：从下面这段完整配置里复制，只改你要改的值。

### 完整配置（可直接粘贴）

```yaml
- insert:
    - id: blender-mcp-bridge
      name: dsh-blender-mcp-bridge
      config:
        # ---- 端点发现 ----
        host: 127.0.0.1
        port: 9876
        portCandidates: []
        allowPortScan: false
        connectTimeoutMs: 10000
        responseTimeoutMs: 30000
        deferredTimeoutMs: 3600000
        maxResponseChars: 200000
        rejectForeignPeer: true
        requireVersionMin: '5.1'
        # ---- 任务目录 ----
        taskRoot: ''
        # blendFile（默认）= 活动 .blend 文件所在目录下的子目录；workspace = 会话工作区
        taskRootMode: blendFile
        # ---- 检查点 ----
        checkpoint:
          enabled: true
          keep: 3
          maxBytes: 0
          # turn（默认）= 一轮一份；write = 每次 mutating 写各落一份（撤销/回滚点更细，占盘更多）
          perTurn: turn
        # ---- 拦截层 ----
        intercept:
          enabled: true
          guardThreadScope: main
        # ---- 内嵌知识库（语料随包内置，无可开关；这里只调 token 预算）----
        knowledge:
          maxHits: 8
          maxCharsPerHit: 4000
        # ---- 工具面 ----
        expose:
          status: true
          exec: true
          inspect: true
          capture: true
          snapshot: true
          docs: true
```

### 每个键

「接线」列说明当前代码是否真的读取了这个键——**`docs/contract.md#config` 里出现的键必须真的被读取**（I12），
未接线的项在 [`.AGENTS/README.md`](.AGENTS/README.md) 里有明确待办，不会长期挂着。

| 键 | 默认 | 取值 | 什么时候需要改 | 接线 |
|---|---|---|---|---|
| `host` | `127.0.0.1` | — | 一般不用改 | ✅ |
| `port` | `9876` | — | **在 add-on 偏好里改过端口时必须同步改这里**，否则连不上 | ✅ |
| `portCandidates` | `[]` | 端口数组 | 启用了 `allowPortScan` 时想额外试几个端口 | ✅ |
| `allowPortScan` | `false` | 布尔 | 默认关：静默连到别的服务比连不上更危险 | ✅ |
| `connectTimeoutMs` | `10000` | 毫秒 | 网络/机器很慢时 | ✅ |
| `responseTimeoutMs` | `30000` | 毫秒 | 与 add-on 的 30 s 写出窗口对齐；改它前先看 [`docs/contract.md#transport`](docs/contract.md#transport) | ✅ |
| `deferredTimeoutMs` | `3600000` | 毫秒 | 长渲染任务的上限（代码里出现 `check_is_finished` 时启用） | ✅ |
| `maxResponseChars` | `200000` | 字符 | 单次返回里 stdout/stderr 的截断上限 | ✅ |
| `rejectForeignPeer` | `true` | 布尔 | 端口被别的服务占用时是否拒绝继续（**不建议关**） | ✅ |
| `requireVersionMin` | `'5.1'` | 语义版本串 | add-on 要求的最低 Blender 版本 | ✅ |
| `taskRoot` | `''` | 绝对路径 | 留空 = 按 `taskRootMode` 决定；想统一放到某个盘时设它（优先级最高） | ✅ |
| `taskRootMode` | `'blendFile'` | `blendFile` \| `workspace` | 任务目录放哪。`blendFile`（默认）= **活动 `.blend` 文件所在目录下**，产出与工程在一起；`workspace` = 会话工作区（⚠️ 见下方说明） | ✅ |
| `checkpoint.enabled` | `true` | 布尔 | 关掉就没有"写前备份"（**不建议**） | ✅ |
| `checkpoint.keep` | `3` | 1–20 | 保留几轮备份；大场景吃磁盘时调小 | ✅ |
| `checkpoint.maxBytes` | `0` | ≥0 字节 | `0` = 不限；设了之后**超限的旧检查点会在轮次结束时被优先回收**（不再只告警）。⚠️ 写前不删——先写第 n+1 份、轮次结束才回落，所以峰值是 `keep + 1` 份 | ✅ |
| `checkpoint.perTurn` | `'turn'` | `turn` \| `write` | 检查点粒度。`turn`（默认）= 一轮一份，回滚是**整文件级**的；`write` = 每次 `mutating:true` 的写各落一份（`turn-{T}-{seq}.blend`），误删可回到更近的位置，代价是占盘与 `keep` 份数消耗都变多 | ✅ |
| `intercept.enabled` | `true` | 布尔 | 关掉就没有越界写/删拦截（**不建议**） | ✅ |
| `intercept.guardThreadScope` | `main` | `main` / `all` | `all` 会把非主线程的 I/O 也纳入检查，可能误伤后台渲染 | ✅ |
| `knowledge.maxHits` | `8` | 1–50 | 单次检索返回几条 | ✅ |
| `knowledge.maxCharsPerHit` | `4000` | 200–20000 | 单条摘录的字符上限，同时决定"超限降级为定义清单"的触发点 | ✅ |
| `expose.status` | `true` | 布尔 | 关掉握手/风险姿态工具 | ✅ |
| `expose.exec` | `true` | 布尔 | 关掉唯一写通道 | ✅ |
| `expose.inspect` | `true` | 布尔 | 关掉只读场景快照 | ✅ |
| `expose.capture` | `true` | 布尔 | 关掉截图工具 | ✅ |
| `expose.snapshot` | `true` | 布尔 | 关掉受控存盘 | ✅ |
| `expose.docs` | `true` | 布尔 | **只是**不把检索工具挂进会话；语料照旧随包内置 | ✅ |

**关于 `expose.docs`**：它只是**工具注册开关**，**不是"关掉知识库"**。
语料与索引必定随包内置（I21），关掉它不会让知识库变成可选资产。

**没有 `knowledge.source` 这类键**：知识库的语料与索引是**交付事实**，不是配置
（[`docs/contract.md#core-decisions`](docs/contract.md#core-decisions)）。你不需要（也不能）指向外部语料副本。

### 常见改法

**1. 端口和 add-on 不一致**（最常见）

```
Blender → 编辑 → 偏好设置 → 插件 → MCP → Port
```

把这里看到的端口填到配置里：

```yaml
        host: 127.0.0.1
        port: 9999        # 改成 add-on 里显示的端口
```

**2. 把任务目录固定到别处**

```yaml
        taskRoot: 'D:/blender-tasks'
```

之后所有产出落在 `D:/blender-tasks/.dsh-blender-{task}/`。

**3. 改用会话工作区**（默认是"跟着工程文件走"）

```yaml
        taskRootMode: workspace
```

之后任务目录是 `<会话工作区>/.dsh-blender-{task}/`，与工程文件解耦。

> ⚠️ **任务目录的位置就是护栏可写范围边界的位置。** 可写范围**仍然只有那一个任务目录**，
> 但它的位置决定"允许在哪个目录下写"：默认跟着工程文件走（等价于允许写工程目录下的一个子目录）。
> 这不是安全边界，只防误操作。
>
> 两条边界行为值得知道：**活动工程还没保存过时**（没有文件路径）会回退到会话工作区
> 并打一条 `console.warn` 说明，不会静默写到别处；**换了位置之后**，之前按旧位置
> 硬编码路径的脚本会被护栏拒绝（`write-outside-scope`）——那是护栏在跟随新边界，属正常。

**4. 关掉检查点**（场景极大、磁盘紧张时；会失去"写前备份"）

```yaml
        checkpoint:
          enabled: false
          keep: 3
          maxBytes: 0
          perTurn: turn
```

**5. 设 .blend 备份体积上限**（超限的旧检查点会在轮换时被优先回收）

```yaml
        checkpoint:
          enabled: true
          keep: 2
          maxBytes: 524288000   # 500 MB
          perTurn: turn
```

**6. 只想用只读工具**（临时排错时防止误改场景）

```yaml
        expose:
          status: true
          exec: false
          inspect: true
          capture: true
          snapshot: false
          docs: true
```

**7. 不把知识库检索工具挂进会话**（语料仍然随包内置）

```yaml
        expose:
          status: true
          exec: true
          inspect: true
          capture: true
          snapshot: true
          docs: false
```

### 配置错误与排错

非法配置会让**插件在加载期失败**，并给出可操作错误（这是有意设计：不要在运行期才发现配置写错）。
常见报错与处理：

| 现象 | 原因 | 处理 |
|---|---|---|
| 插件加载失败，提示 `config` 某键类型不对 | 写了 schema 不接受的类型（例如 `keep` 写成字符串） | 按上表改回正确类型 |
| 报 `expected string but got 5.1` | `requireVersionMin: 5.1` 没加引号，YAML 把它当**数字** | 写成 `requireVersionMin: '5.1'` |
| 报 `YAMLException: end of the stream or a document separator is expected` | 补丁文件里用了 `//` 注释——**YAML 只认 `#`** | 把 `//` 改成 `#` |
| 改了插件自带的 `cordis.patch.yml` 但没生效 | 那是默认值模板，安装时已被 profile 补丁层覆盖 | 改 **profile** 的 `cordis.patch.yml` |
| 改了配置，但某个键回退成默认值 | 补丁层整行替换、不深合并，你漏写了该键 | 从上面「完整配置」整段复制 |
| 启动即报 `ERR_MODULE_NOT_FOUND`，指向 `lib/…` | `lib/` 缺失（正常安装不会出现） | 重装，或看 [`.AGENTS/README.md`](.AGENTS/README.md) |
| 工具面里看不到 `blender_mcp_*` | 插件没被加载：`dsh.profile.bundles` 里没有它，或 profile 的 `cordis.patch.yml` 只剩一条指向不存在节点的**死 `id` 行**（加载器不报错） | 用 `plugin_manager(install_bundle, …)` 重新装载。profile 已是 `patchReload: live`，**同一轮里就能调用，不用重启 harness**（实测：`install_bundle` 返回 `applied` 后立刻可见 6 个工具）。只有改 profile 的 `bundles` 列表或路径才需要重启 |
| `status` 报 `port-not-listening` | add-on 没启动 / `online_access` 没开 / 端口不一致 | 见上面的「常见改法 1」 |
| `blender_mcp_docs` 报 `available: false` | 内置索引缺失或损坏（这是**交付缺陷**，不是配置问题） | 重装，或运行 `node buildKnowledge.js build` |
| `blender_mcp_docs` 返回里带 `drift` 警告 | 语料的 Blender 版本与你当前会话不同 | 用 `buildKnowledge.js` 重建索引，或接受提示 |

## 知识库

### 数据从哪来

语料取自 **Blender 官方 MCP server 仓库** [lab/blender_mcp](https://projects.blender.org/lab/blender_mcp)，
**按 commit sha 固定快照**（不使用会前进的分支名），完整 pin 与逐文件 blob sha 记在
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) 与 `knowledge/meta.json`。语料是**静态只读快照**：

- **不联网、不回传、无遥测**。
- 语料对应的 Blender 版本与你运行版本不符时，`docs` 会返回 `drift` 提示（**不会假装是最新**）。

> 说明：另一个同名项目 `ahujasid/blender-mcp`（PyPI `blender-mcp` / `mcp-for-blender`）是**第三方**，
> 本插件**不连接、不引用、不参考**它，也不使用它自带的 add-on 与遥测。

### 怎么用

- **技能**：插件在 `apply()` 时把 `skills/blender-mcp-knowledge/SKILL.md` **注册为运行时技能**
  （`ctx.skills.register()`，`source: 'runtime'`），所以它会出现在会话技能目录里、可被技能机制按需加载。
  `skill` 服务不可用时**只退回"文件仍在包里"**，不阻断插件加载。该文件也可以**直接读**（不装插件也能用）。
- **工具**：`blender_mcp_docs` 三种 mode——`api`（按标识符取契约）、`search`（全文检索）、`rules`（规则条目）。
- **不装插件也能查**：语料与索引就是普通文件，可以直接读：

  | 路径 | 内容 |
  |---|---|
  | `knowledge/g3-rules.md` | G3 小抄（人类可读；先读这个） |
  | `knowledge/index/api-map.jsonl` | 标识符 → 文件路径（精确查找，一行一条） |
  | `knowledge/normalized/` | 归一化正文（Markdown） |
  | `knowledge/source/` | 官方 RST 原文（不参与默认检索，是"原文怎么写的"的最后手段） |
  | `knowledge/meta.json` | 源指纹：代码/语料 commit、Blender 版本、未识别 directive 清单 |

- 知识库**必定随包交付**；你唯一能做的是用 `expose.docs` 决定要不要把检索工具挂进本次会话。

### 重建索引（语料升级或换 Blender 版本时）

```sh
node buildKnowledge.js fetch     # 按 commit 拉语料（维护用，需要联网）
node buildKnowledge.js build     # 归一化 + 建索引 + 写 meta.json / rules.json / g3-rules.md
node buildKnowledge.js verify    # 只校验指纹，不写任何文件
```

- 语料**按 commit sha 固定**（不接受分支名），`fetch` 会把实际 commit 与逐文件 blob sha 写进 `knowledge/meta.json`。
- 上游的归档 tarball 被 Cloudflare 的浏览器校验挡住，因此走 Forgejo 的 JSON API 逐文件取；
  `fetch` 可**断点续传**（已校验通过的本地文件不再请求），可用 `--concurrency N` 调并发。
- `build` 会先校验源指纹，**不符即中止**，不会用半份语料建出「一半新一半旧」的索引。
- **未识别的 RST directive 不会被静默丢弃**：原文保留并登记在 `meta.json` 的 `unparsedDirectives` 里。

## 许可

**本插件以 `GPL-3.0-or-later` 分发。**

原因：本插件内联了上游（`lab/blender_mcp`，GPL-3.0-or-later）的语料，**内联即再分发**。

- 完整许可证：仓库根 [`LICENSE`](LICENSE)。
- 上游来源、版本与修改声明：仓库根 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。
- ⚠️ **两部分语料的许可不同**：`data/api/` 随上游为 GPL-3.0-or-later；`data/manual/` 是 **CC-BY-SA-4.0**，
  署名 `Blender Documentation Team`。我们按**更严格的一方**履行（两者都署名）。
  上游仓库自己**没有**为手册附 CC-BY-SA 声明，照抄它的 GPL-only 口径会漏掉署名义务。

## 开发

```sh
pnpm check         # tsc --noEmit -p jsconfig.json；需要本地 node_modules 里有 DSH 类型
pnpm test          # node:test：仓库一致性 + 全语料审计 + 报告条目回归，离线可跑（当前 57 项）
```

**类型检查范围**：`index.js`、`lib/**/*.js`、`buildKnowledge.js`、`test/**/*.js`。
工具参数 schema 的**字面量类型**靠**上下文类型**保留（`toolDefinition()` 的 `parameters` 声明为
`ParameterSchemaSpec`），所以入口不再需要整文件 `@ts-nocheck`；注册点另有运行期结构断言。

`diagnostics/` 下的探针需要**实机 Blender**、且**不入库**（`.gitignore` 忽略整个目录）：
它们是设计期/实现期取证脚本，不属于交付物。离线门禁在 `test/`。

## 文档

| 文件 | 内容 |
|---|---|
| [`docs/contract.md`](docs/contract.md) | **契约、规则、不变量（I1–I27）的唯一权威来源** |
| [`docs/blender-5.2-findings.md`](docs/blender-5.2-findings.md) | **Blender 5.2 实测发现**：渲染通道三态、合成器与几何节点的静默失败、Cycles 与体积雾、undo 不可观测 |
| [`docs/architecture.md`](docs/architecture.md) | 架构与运行逻辑导读 + 生态里其它第三方插件的实现方式调研 |
| [`docs/upstream-facts-tools.md`](docs/upstream-facts-tools.md) | 上游协议 / 工具契约 / 安全面 / 许可的逐条取证 |
| [`docs/upstream-facts-docs.md`](docs/upstream-facts-docs.md) | 上游文档检索层（RST 解析与索引）的逐条取证 |
| [`.AGENTS/README.md`](.AGENTS/README.md) | **单一入口**：实现进度、配置接线状态、实测结论、待实测项、维护纪律 |
| [`.AGENTS/`](.AGENTS/README.md) | **工作记忆**：决策史、被证伪的旧结论、事故复盘、审计与报告记录、门禁怎么跑 |
| [`test/`](test/repo.test.js) | 离线门禁：仓库一致性 + 全语料审计 + 报告逐条回归（`pnpm test`） |
| [`AGENTS.md`](AGENTS.md) | AI 行为准则（基础安全需要、类型安全、注释风格、git 约束） |

**引用约定**：外部文档引用 [`docs/contract.md`](docs/contract.md) 一律用锚点（如 [`#guard-ops-proxy`](docs/contract.md#guard-ops-proxy)）
或不变量 ID（`I16`），不写裸章节号。参见 [`docs/contract.md#appendix-refs`](docs/contract.md#appendix-refs)。
