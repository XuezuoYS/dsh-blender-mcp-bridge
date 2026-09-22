# 架构与运行逻辑

> 本文梳理当前仓库的真实结构与运行路径。事实标注沿用 `contract.md`：**实测** / **源码** / **文档** / **规范**。
> 若本文与 `contract.md` 冲突，以 `contract.md` 为准（本文是导读，不是规范）。
>
> 交付与接线状态以 [`STATUS.md`](../STATUS.md) 为准；Blender 侧的实测发现见
> [`blender-5.2-findings.md`](blender-5.2-findings.md)。

---

## 1. 仓库盘点：四类文件，只有一类是交付物

| 类别 | 文件 | 是否交付 | 说明 |
|---|---|---|---|
| **插件本体** | `index.js`、`lib/*.js`（10 个）、`package.json`、`cordis.patch.yml`、`README.md`、`jsconfig.json`、`skills/`、`knowledge/` | ✅ **是** | 纯 JS、零运行时依赖、无构建步骤 |
| **契约与文档** | `docs/contract.md`、`docs/blender-5.2-findings.md`、`STATUS.md`、`docs/HISTORY.md`、`AGENTS.md` | ❌ | 契约、实测发现、交付状态、决策记录 |
| **诊断探针** | `diagnostics/*.js`（7 个） | ❌ | 设计期/实现期取证脚本，可复跑 |

**没有 TypeScript 源码**：JS 文件全部手写，TypeScript 只以 `tsc --noEmit` 形式做类型检查（`jsconfig.json`）。

**已清理**：事故现场脚本、旧天一阁/明潮场景的构建脚本与一次性诊断、以及场景专用的 `probeScene.js`
（它硬编码已删场景的 `TY_` 前缀，且自身会改用户渲染设置）均已删除；`diagnostics/` 从 67 个文件收敛到 7 个。

---

## 2. 进程模型：两个进程，一条套接字

```
┌─────────────────────────────┐         ┌──────────────────────────────────────┐
│ dsh web（Node 进程）         │         │ Blender 进程（GUI，用户实时会话）        │
│                             │         │                                      │
│  index.js  apply(ctx,cfg)   │         │  mcp add-on                          │
│    └ 注册 5 个工具 ──────────┼─ DSH ──▶│   bpy.app.timers 每 0.25s / 空闲 1s   │
│                             │  工具调用│   poll() → 收请求 → exec(code)        │
│  lib/protocol.js            │         │                                      │
│    net.createConnection ────┼─ TCP ───▶│   127.0.0.1:9876                     │
│    {type:execute,code,      │  JSON +  │   主线程同步执行 → GUI 冻结            │
│     strict_json} + 0x00     │  0x00    │                                      │
│                             │◀────────┤   响应 JSON + 0x00 → 关闭连接          │
└─────────────────────────────┘         └──────────────────────────────────────┘
```

两条关键事实（**源码** + **实测**）：

1. **每次请求一条新连接**：add-on 响应后主动关闭连接，因此 `protocol.js` 不做连接复用。
2. **Blender 进程里有跨请求存活的插件状态**：L2 护栏载体放在 `sys.modules['dsh_blender_mcp_bridge.guardState']`，
   它跨多次 exec 存活 —— 这带来三个必须处理的坑，见 `contract.md#guard-carrier`。

> **这不是 MCP。** add-on 的协议只有 `type: "execute"`，没有握手、没有 `tools/list`。名字里的 `mcp` 指被连接的 add-on。
> 上游的 `blender-mcp`（MCP server）在直连模式下被本插件**替代**掉了。

---

## 3. 模块分层：谁依赖谁

```
                         index.js
                            │  组装：Config / 轮次订阅 / 任务目录与检查点缓存 / 工具注册
        ┌───────────────────┼───────────────────┬────────────────────┐
        ▼                   ▼                   ▼                    ▼
   lib/tools.js ──┬──▶ lib/diagnostics.js  lib/taskDir.js ──▶ lib/slug.js
   5 个工具实现    │        │                    │
                  │        └──▶ lib/protocol.js │
                  ├──▶ lib/requestPolicy.js ───┘（复用 isInsideTask）
                  ├──▶ lib/guardPayload.js
                  └──▶ lib/checkpoint.js ──▶ lib/protocol.js
```

| 模块 | 职责 | 关键导出 |
|---|---|---|
| `protocol.js` | 帧编解码、持续 drain、三类超时 | `sendExecute`、`asExecEnvelope` |
| `diagnostics.js` | 指纹握手、扩展清单解析、分级诊断（`contract.md#discovery-diagnostics`） | `diagnose`、`handshake` |
| `slug.js` | 任务名 slug 化（纯函数） | `slugifyTaskName`、`suffixedTaskName` |
| `taskDir.js` | 任务目录建立/复用、属主标记、界内判定 | `ensureTaskDir`、`findExistingTaskDir`、`isInsideTask` |
| `requestPolicy.js` | **L1** 静态判定 | `scanRequest` |
| `guardPayload.js` | **L2** 运行时护栏的 Python 载荷生成 | `wrapWithGuard` |
| `checkpoint.js` | 轮换计划、落盘、回滚来源选择 | `CheckpointManager`、`planRotation`、`pickRestoreSource` |
| `tools.js` | 工具的实现与结果规范化（v1.0 起 5 个：status / exec / inspect / capture / snapshot） | `make*Tool`、`sessionIdOf`、`workspaceOf` |

`lib/` **不反向依赖 `index.js`**：`ToolContext` 的 `config` 在 `tools.js` 里按结构化类型声明，避免入口一变、lib 类型跟着碎。

---

## 4. 启动路径

```
dsh 加载 profile bundle
   └─ cordis.patch.yml 的 insert 行 → 加载 index.js，注入 Config 校验后的 config
        └─ apply(ctx, config)
             ├─ ctx.on('session/event', …)      仅记录 turn/start 的轮次号
             ├─ 建 ToolContext（作品目录/检查点按需惰性创建）
             └─ ctx.tools.register(defineTool(…)) × 4（受 config.expose 开关控制）
```

**轮次语义**（**源码** DSH `packages/core/session/src/types.ts`）：一次用户请求 == 一个 `turn`。
`turn/start` **只**更新会话→轮次映射，**不**产生任何文件；检查点是「本轮首次写操作之前」才落（`contract.md#checkpoint`）。

---

## 5. 运行路径

### 5.1 `blender_mcp_status`（只读）

```
diagnose()
 ├─ handshake()：发只读 Python，读回 Blender/Python 版本、模块键、pid、background、
 │              online_access、numpy、cwd、扩展根目录
 ├─ readExtensionManifest()：只读 <扩展根>/user_default/mcp/blender_manifest.toml → 1.0.3 / 5.1.0
 └─ 五级判定：no-blender-process → port-not-listening → foreign-peer → version-too-old → ok
另：readSceneSummary()（只读）+ statBlend() → 风险姿态：
    path / saveStatus / ageDays / checkpoints[] / sessionObjects / roundHasCheckpoint
   / restoreEvidence（有检查点或用户文件时）/ undoPrecheck（平级，只要有任务目录就出）
```

> `undoPrecheck` 与 `restoreEvidence` **平级**而不是嵌在它里面：`restoreEvidence` 需要"有检查点或有用户文件"，
> 而未保存的工程两者都可能没有——恰是最需要这份证据的情形。
> **实测（5.2.2）**：undo 栈对 Python 不可见，所以它恒为 `measurable: false`
> （见 [`contract.md#checkpoint-undo`](contract.md#checkpoint-undo)）。

**只读工具绝不创建目录**：找不到既有任务目录就返回 `taskRoot: null`、`checkpoints: []`，而不是顺手建一个。

### 5.2 `blender_mcp_exec`（唯一写通道）

```
1. ensureTask(exec, args.task)
     workspace = config.taskRoot || 会话 cwd
     → slugifyTaskName → 逐个候选名尝试
        不存在            → 建目录 + 5 个子目录 + 写 .dsh-blender-task.json（属主标记）
        已存在且有标记     → 复用
        已存在但无标记     → 视为他人数据，换下一个候选名（-2、-3…）
2. scanRequest(code, taskRoot)                      ← L1
     blocks 非空 → status:"blocked" + suggestedPath + handoff，**直接返回，不发送**
3. args.mutating === true ? CheckpointManager.createForTurn() : 跳过
     写盘失败 → status:"refused"，**拒绝执行**（无检查点不执行）
4. wrapWithGuard(code, {allowRoot: task.root, sessionId, …})   ← L2 载荷
5. sendExecute(…)                                   ← 传输
6. 规范化返回：
     payload 顶层去掉本插件元键后剩余部分 = result
     guard.blocked 非空 → 保留信封的 error（kind=blocked-by-guard）+ 附上 blocked（traceback 是越界行的唯一证据）
     guard.verified === false → 报失败
     riskNotes = 数据块差分 + noted + 检查点路径
```

**结果形状的关键点**：收尾逻辑把 `result` 变量整个替换成「用户写入的键 + `guard`」，所以 Node 侧按
`PAYLOAD_META_KEYS`（`guard`/`status`/`exception`/`message`/`traceback`/`value_repr`）**减法**取出用户结果。

### 5.3 `blender_mcp_inspect` / `blender_mcp_snapshot`

- `inspect`：发一段只读 Python（读集合、计数、逐对象类型/父级/集合/修改器/网格统计/材质），不带护栏、不落检查点。
- `snapshot`：`withinTask()` 派生 `exports/<name>.blend` → 发 `save_as_mainfile(copy=True)` → 回读 `stat` 校验字节数。
  **实测**：会话 `bpy.data.filepath` 不变。

---

## 6. L2 护栏：载荷与跨请求载体

`wrapWithGuard(body, opts)` 生成的 Python 分四段：

```
① 定义段     DshWriteBlocked / DshOperatorBlocked、_dsh_norm/_dsh_in_scope、
             _dsh_wrap/_dsh_unwrap、_dsh_install/_dsh_install_ops、_dsh_verify、_dsh_snapshot
② 进入段     state = _dsh_maintain('prep')   ← 重置本轮证据 + 校验钩子/代理在位 + 记录 before 快照
③ 用户代码   try: <body>  except BaseException: 收敛成 status:"aborted"/"raised"
④ 收尾段     _dsh_verify() → _dsh_remove_ops() → _dsh_collect() → 替换 result
```

**装什么**：

| 目标 | 手段 |
|---|---|
| `builtins.open`、`os.open` | 包装：写模式/写 flags 且 `realpath` 越界 → 抛 `DshWriteBlocked` |
| `os.remove/unlink/rmdir/truncate`、`os.rename/replace`、`shutil.rmtree/move` | 同上，按删/移分别判定 |
| `bpy.ops.wm.save_mainfile` 等受控算子 | **代理**：安装期把 `bpy.ops` 换成 `_OpsProxy`（`contract.md#guard-ops-proxy` 说明为何不能用 `_op_create_function`） |

**载体跨请求存活 → 三个必须处理的坑**（全部踩过并修复，详见 `contract.md#guard-carrier`）：

| 坑 | 现象 | 修复 |
|---|---|---|
| 重装=嵌套 | 重装时把上一次的 `_guard` 当原始函数，守卫层层嵌套：外层按新根放行、内层按旧根拒绝 | `_dsh_unwrap()` 剥层；真原始函数只在首次安装时捕获 |
| `allowRoot` 变化不重装 | 钩子是闭包，任务目录一变仍按旧根判定 | 状态记 `installed_root`，不同即强制重装 |
| 证据跨 exec 累积 | 历史拦截被算到本轮账上 | 每次开头 `_dsh_maintain('prep')` 重置 |

**自检语义**：`verified` = 文件钩子仍在 + 钩子 target 未被掉包 + 算子代理仍在。
`tampered` = **有证据**表明钩子被换掉（`installed` 为真且此刻钩子不在位）；收尾主动卸下算子代理**不算**篡改。

**作用域**：只检主线程（可配 `intercept.guardThreadScope`）；窗口 = 同步 exec 期间。

---

## 7. 已删除的事故现场脚本与一条历史偏差

仓库里曾有 5 个根目录 `.py`，它们是 2026-09-16 那次「探测脚本删掉整个资产」事故（见 `docs/HISTORY.md#7-事故复盘2026-09-16`）的现场工具，
**不是插件代码**、也不在 `package.json` 的 `files` 里。按「保持仓库干净」的要求现已删除：

| 曾有的文件 | 用途 |
|---|---|
| `guard_probe.py` | 事故后验证「拦截机制是否可行」的设计探针（在 Blender 内跑，`finally` 还原所有补丁） |
| `recover_probe.py` | 紧急恢复：反复 `bpy.ops.ed.undo()` 直到目标对象重新出现，不写盘 |
| `restore_probe.py` | 从用户自己的 `蒹葭.blend` 恢复现场（只 `open_mainfile`，不写盘） |
| `verify_restore.py` | 恢复后的只读核验（对象数/三角面/集合/材质/父子关系） |
| `inspect_blend.py` | 另起进程只读检查一份已保存的 `.blend` |

**一条必须记住的历史偏差**：`guard_probe.py` 当年用 `bpy_ops._op_create_function` 做算子拦截并**报告成功**，
这份结论曾是设计的依据。生产实现才发现这条路**活不过一次请求**（上游 `weak_sandbox` 会在每次 exec 结束时还原它，
见 `contract.md#guard-ops-proxy`），因此改用了模块级 `bpy.ops` 代理。
**旧探针在这一点上的结论是被高估的**——以 `contract.md#guard-ops-proxy` 为准，不要再拿它当依据。

**教训**：一个探针报告「成功」，不等于它验证的机制在真实调用路径上成立。判据必须是
「被拦的东西确实是我们装的」，而不是「结果看起来对」。

---

## 8. 不变量（编码红线，见 `contract.md#invariants`）

| # | 不变量 | 落点 |
|---|---|---|
| 1 | 无检查点不执行；检查点写盘失败即拒绝 | `tools.js` 的 `mutating` 分支 |
| 2 | 响应必须 drain 到 `0x00` | `protocol.js` 的 `indexOf(DELIMITER)` |
| 3 | 长任务走 deferred，不可用明确报错 | 传输层按响应窗口处理（**deferred 尚未接线**） |
| 4 | 失败按 `contract.md#discovery-diagnostics` 分级 | `diagnostics.js` 的 `kind` |
| 5 | 路径由任务目录派生，判定用 `realpath` | `taskDir.js`、`guardPayload.js` |
| 6 | 破坏性例程先校验保护集合非空（I1） | `checkpoint.js` 的 `unregistered.length > 0 → return []` |
| 7 | 归属判定用稳定标识（I2） | `as_pointer()` |
| 8 | 先写第 n+1 份 | `planRotation` 的 `during-write` 分支 |
| 9 | 回滚取更近者 | `pickRestoreSource` |
| 10 | 不宣称沙箱 | `README.md`、`status.guardScope.honesty` |
| 11 | 按写路径判定 | `requestPolicy.js`、`guardPayload.js` 的算子名单 |
| 12 | 拒绝时给接管提示与替代路径 | `tools.js` 的 `handoff` / `suggestedPath` |
| 13 | 检查点按会话隔离（I8） | `index.js` 的 `${sessionId}\0${task.root}` 缓存键 |

---

## 9. 已知缺口与风险（如实列出）

| 项 | 状态 |
|---|---|
| **deferred（延迟响应）** | **未接线**。长任务（如延迟渲染）目前不会走 `check_is_finished` 通道，只受 `responseTimeoutMs` 约束（契约见 `contract.md#transport-deferred`） |
| 视觉反馈 | `blender_mcp_capture` 已设计但**未实现**（`contract.md#tools`）；三种截图目标在被 socket exec 调用时的可用性待实测（`context.area` 可能为 `None`） |
| 结构化错误 / 改动清单 | 已设计未实现（`contract.md#knowledge-retrieval` / `#knowledge-granularity`） |
| 每步检查点 | 当前**每轮只落 1 份**；多步重手操作中途没有还原点 |
| 偏好/add-on 写入口 | **契约已定**：纳入 L2，范围收窄为三项（`contract.md#interception-env-writes`）；实现未开始 |
| 类型检查范围 | 只覆盖 `lib/` 与 `buildKnowledge.js`；`index.js` 的 `defineTool` 调用点无法过严格检查（纯 JS 字面量类型的固有限制），改为运行期验证 |
| 子进程枚举 | 受限环境下 spawn 全为 `EPERM`，`contract.md#discovery-diagnostics` 第 1 级降级为「无法确认」，不猜 |
| 导出其它格式 | `snapshot` 只做 `.blend`；GLB/FBX/OBJ/USD/STL 走生态内既有导出工具，不重复实现 |
| L2 边界 | 只检主线程；窗口外异步写不受约束；`importlib.reload` / ctypes 可绕过 |
| 许可与清单 | **已定 `GPL-3.0-or-later`**（内联上游语料即再分发，`contract.md#licensing`）；`LICENSE` 已落盘为 GPL-3.0 全文 |
| **已移除** | ~~嵌套模式 / 分叉 MCP client~~ —— 不运行任何形态的 server，见 `contract.md#decision-knowledge-is-data` |

---

## 附录：生态里其它第三方插件是怎么实现的（调研）

profile 里只有两个第三方插件，**实现路子完全不同**：

| | `dsh-blender` (v0.2.2) | `dsh-whale-widget` (v0.3.0) |
|---|---|---|
| 类型 | host 侧工具插件 | host 侧 + **自带浏览器端 UI** |
| 接口 | `ctx.tools.register`（10 个工具） | `ctx.webServer.register`（HTTP 路由）+ 注入 `<script>` |
| 与 Blender 的关系 | **每操作 spawn 一个 `--background` Blender 进程** | 无关 |
| 与用户活会话 | **完全没有** | — |
| 体积 | `index.js` 1156 行 + 内置 Python 驱动 21 KB | 单文件 `lib/index.js` **152 KB** |

### A.1 `dsh-blender`：进程外驱动（A 型）

10 个工具**按操作切分**：`blender_status` / `scene_info` / `object_info` / `import` / `preview` /
`render` / `render_frames` / `export` / `validate_scene` / `validate_export`。

IPC **不是套接字、也不是管道，而是磁盘文件**（`runBlender()`）：

```
mkdtemp() → 写 payload.json
→ blender [file] --background --disable-autoexec --python-exit-code 1
          --python <DRIVER> -- --operation X --payload P --result R
→ 读 result.json → 删临时目录
```

驱动脚本 `scripts/dsh_blender_driver.py`（**随插件打包**）用 argparse 收 `--operation`，
operation 是**闭集**（`inspect` / `execute` / `preview` / `render` / `import` / `export` / `validate_*`），
每个都有**策展好的 Python 实现**。

**它的安全模型与我们根本不同**：

| | `dsh-blender` | 本插件 |
|---|---|---|
| 作用对象 | 新起的进程（`--factory-startup` 或打开指定 `.blend`） | **用户正在用的活会话** |
| 隔离来源 | **进程隔离 + 临时目录**（用完即删） | 任务目录 + 护栏 + 检查点 |
| 会碰未保存工作吗 | **不会**（根本不在那个进程里） | 会，所以必须落检查点 |
| 失败后果 | 临时目录被删，无副作用 | 可能留下半完成改动，靠检查点兜 |
| 检查点 / 撤销 | **没有**（也不需要） | 有 |

注意两点：`--disable-autoexec` 关的是**从文件加载时的自动执行**；而 `blender_python` 工具本身就是执行任意代码，
其内部**没有文件系统护栏**——写边界是 Node 侧的 `restrictToWorkspace` 在把关。所以「它安全」的来源是**临时进程**。

**代价**：看不见用户在做什么（拿不到视口、选择、未保存状态）；每个操作一个冷启动进程；工具是闭集，
闭集之外要落到 `blender_python`（即兴写代码）。

### A.2 `dsh-whale-widget`：自建浏览器端 UI（B 型）

它**没有用 `clientBundle`**，而是自己把前端脚本送到浏览器：

```js
// 1) 注册静态路由
path: '/dsh-whale/widget.js'
// 2) 拦截 HTML 响应并注入
if (html.indexOf('/dsh-whale/widget.js') !== -1) return html
const tag = '<script defer src="/dsh-whale/widget.js"></script>'
```

并且**显式处理信任栅栏**（注释指向上游 issue #92）：所有自定义路由先过
`ctx.get('connection').requestRejection(req)`，防 Host/Origin 伪造（DNS 重绑定）与未认证请求；
服务缺失时打 warn 而**不是静默放行**；未认证时结束响应。

**这条调研推翻了一个旧论证**：`contract.md#packaging` 一节曾以「`clientBundle` 预设未公开、工作量不成比例」为由不做设置页。
**前置事实仍然成立**（确实要自己复现），但结论的理由错了——第三方已有可行先例。
现在不做设置页的理由是**范围控制**（配置项少，改 YAML 足够），而非「做不到」。

### A.3 对本插件的启示

1. **两条路互不干扰，且不应强行统一**：`dsh-blender` 在**批处理**（分析别人的 `.blend`、跑校验、批量导出）上更强；
   本插件在**辅助创作**（贴着用户视口干活、不丢未保存工作）上才有意义。→ 不追求兼容，但要在文档里写清怎么选。
2. **A 型的核心手法我们已经在做**：不是"进程隔离"这个形式，而是**每次操作都有可丢弃的独立落点**——
   我们有检查点 + 任务目录 + 越界拒绝。差别只在「失败可逆性的来源」：A 型靠进程即弃，我们靠检查点 + 原子轮换。
3. **A 型给了"更准"的现成答案：按操作切工具**。10 个工具全是策展 operation，没有一个通用 exec 暴露给模型。
   → 本插件据此新增 `blender_mcp_capture` 并规划 `inspect` 的策展化（`contract.md#tools`）。

---

## 10. 怎么自己验证

```sh
# 类型检查
pnpm typecheck

# 不需要 Blender 的两项（随时可跑）
node diagnostics/checkRepo.js        # 仓库一致性 13 项：配置三方一致、锚点可解析、SPDX、语料产物齐备
node diagnostics/auditCorpus.js      # 全语料审计 15 项

# 需要「开着 add-on 的 Blender 会话」（没有会自动 SKIP 并说明，退出码 0）
node diagnostics/probeEndToEnd.js     # 真的注册工具并逐个调用（30 项）
node diagnostics/probeFindings.js     # 审计发现的逐条回归（41 项，含"探针不留场景残留"）
node diagnostics/probeGuard.js        # L2 机制层（18 项，含蓄意篡改）
node diagnostics/probeCapabilities.js # 工具面压测（16 项，含故意越界以验证拦截）
node diagnostics/probeSettingsGuard.js# 设置漂移检测 + 提示词段落（11 项）
node diagnostics/probeTaskRoot.js     # taskRootMode 三条分支（3–4 项：工程未保存时少一条）
node diagnostics/probeTransport.js    # 帧格式与超时（14 项）

# Node 侧工具链自检
node --check index.js                 # 语法
```

**没有 Blender 时探针会自动跳过**（`probePreflight.js` 先做可用性检查）——
环境缺失与被测能力失败是两件事，混在一起会让"探针红了"这句话失去意义。

`probeEndToEnd.js` 是最有信息量的一个：它**不 mock**，而是加载真实 `index.js` 的 `apply()`，
用假 `ctx` 收下工具定义，然后对活动 Blender 逐个调用并断言结果。
