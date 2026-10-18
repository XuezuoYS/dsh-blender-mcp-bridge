# dsh-blender-mcp-bridge

DeepSeek Harness（DSH）的 Blender 活会话桥插件：直接连用户当前打开的 Blender（官方 `mcp` 扩展的套接字），在活会话里做**可撤销、可审计、不保存**的辅助创作。

> 当前处于 **dev 开发周期**，代码与功能上破坏性变更无需做兼容和迁移。

## 当前状态

**v1 落地完成（实机验收通过）**：活会话桥、任务目录与快照、L1/L2 护栏、撤销与审计、整窗截图、可控预览渲染、26 个 helper、1 个编排技能、系统提示词、离线测试与实机探针都已就绪。

- 离线：`pnpm test` **68/68**、生成的 Python 载荷 **7/7** 编译通过、守卫离线探针 **3/3**。
- 实机（Blender 5.2.2 LTS）：`probeLive` **11/11**，插件工具层端到端 **18/18**（撤销、保存拦截、快照、截图、渲染还原、helper、用户文件未变）。
- 安装：隔离 profile 里 `--dump-config` / `--dump-config-schema` 均能加载本插件。
- 未实测项：`dsh-blender` 共存（本机未安装），工具名与提示词分工已核对。

## 运行前提

- DSH `0.2.1-rc.2`（`engines.dsh` 精确 pin）。
- Blender 5.1+，并在 Extensions 里启用官方 **MCP** 扩展，点 Start（默认监听 `127.0.0.1:9876`）。
- DSH 与 Blender 在同一台机器、同一个文件系统。

## 安装（开发期用 link）

1. 在 profile 的 `package.json` 里加依赖：
   ```json
   "dsh-blender-mcp-bridge": "link:D:/0-code-project/dsh-blender-mcp-bridge"
   ```
2. 在同一个 `package.json` 的 `dsh.profile.bundles` 里加 `"dsh-blender-mcp-bridge"`。
3. 重启 DSH，模型工具表里应出现 `blender_mcp_status`。
4. 需要改端口/快照代次时，在 profile 的 `cordis.patch.yml` 覆盖：
   ```yaml
   - id: dsh-blender-mcp-bridge
     config:
       port: 9877
       snapshot:
         generations: 5
   ```
5. 首次用 helper 前运行 `node scripts/setupAnalysis.js`，把输出里的解释器路径填到 `helper.analysisPython`，或留空自动探测。

正式分发：`npm pack` 出的 tarball 已包含 `index.js`、`lib/`、`helpers/`、`skills/`、`types/`、`cordis.patch.yml`、`requirements-analysis.txt`、`scripts/`、`README.md`、`LICENSE`；也可以用 `dsh plugin --profile <name> add <tarball>` 安装。

## 排错

- `blender_mcp_status` 返回 `port-not-listening`：Blender 没开，或 MCP 扩展没点 Start，或端口不一致。
- 开了多个 Blender：Windows 上先启动的实例会占住 9876，改 `port` 或在 add-on 面板改端口。
- 模型看不到截图/渲染图：当前模型不支持图片输入，工具会只返回路径；用文件工具或 `web_fetch` 查看。
- helper 报缺依赖：运行 `node scripts/setupAnalysis.js`，不要指望插件自动装包。
- 会话被改坏：**不要**让 AI 自行回滚；按 `handshakeHint`/快照路径手动 `Ctrl+Z` 或打开快照。

## 配置

配置写在 profile 的 `cordis.patch.yml` 里，按条目 id 覆盖；没写的键用插件 schema 默认值。

| 键 | 默认 | 说明 |
|---|---|---|
| `host` | `127.0.0.1` | add-on 地址 |
| `port` | `9876` | add-on 端口；多 Blender 实例时改这里 |
| `connectTimeoutMs` | `5000` | TCP 连接超时 |
| `responseTimeoutMs` | `30000` | `exec` / `inspect` 回复超时 |
| `captureTimeoutMs` | `30000` | 截图超时（M3） |
| `renderTimeoutMs` | `120000` | 预览渲染超时，覆盖冷 Shader 缓存（M3） |
| `maxResponseChars` | `200000` | 单次回复上限 |
| `taskRootMode` | `blendFile` | `blendFile` = `.blend` 同级；`workspace` = 会话 workspace |
| `taskRoot` | `''` | 非空时固定任务根目录，忽略 `taskRootMode` |
| `snapshot.*` | 见 `cordis.patch.yml` | 快照开关/代次（1–20）/时机/压缩（M2） |
| `guard.enabled` | `true` | 只关 L2 运行时守卫；L1、快照、撤销、审计照常 |
| `helper.*` | 见 `cordis.patch.yml` | 分析 Python 与 helper 链（M3） |
| `audit.*` | 见 `cordis.patch.yml` | 审计开关与是否存代码（M2） |

## 工具

| 工具 | 读写 | 说明 |
|---|---|---|
| `blender_mcp_status` | 只读 | 连接诊断、版本、文件路径、dirty、对象数、模式、撤销步数、渲染设置、英文手册入口、任务目录列表 |
| `blender_mcp_inspect` | 只读 | 场景结构摘要：集合、类型计数、对象父级/修改器/网格统计/材质 |
| `blender_mcp_exec` | 写 | 写前快照 → L1 检查 → 带守卫执行 → 审计；一次调用一个撤销步骤 |
| `blender_mcp_snapshot` | 写任务目录 | 显式再落一代快照，用于冒险操作前；不动当前文件与 dirty |
| `blender_mcp_capture` | 写任务目录 | 整窗截图（含 UI）到 `captures/`；后台模式明确报错；模型不支持图片时只给路径 |
| `blender_mcp_render` | 写任务目录 | 按用户给的宽/高/采样预览渲染到 `renders/`；参数逐个还原；超时按 120 s 设计 |
| `blender_mcp_helpers` | 只读 | 列出 23 个常规 helper（维护类默认隐藏）、依赖就绪状态与参数 schema |
| `blender_mcp_helper` | 写任务目录 | 运行一个 catalog helper；只收名字和结构化参数，不收脚本或代码 |

## Helper 链

26 个 helper（23 常规 + 3 维护类）随包放在 `helpers/`，来自
`create-3d-model` 上游（MIT，见 `helpers/README.md`）。Python 类 helper 在独立进程里跑，
只接受 catalog 参数；输入限 workspace / `.blend` 目录 / 任务目录，输出只落任务目录。
Python helper **不需要 Blender 开着**，只有 `surface-texture-coverage-audit` 走活会话。

安装分析依赖（只跑一次，用户自己执行）：

```sh
node scripts/setupAnalysis.js
# 然后把输出里的解释器路径填到 helper.analysisPython，或让它自动探测
```

## 技能

v1 注册 1 个编排技能 `blender-live-session`（英文正文），正文在
`skills/blender-live-session/SKILL.md`，核心参考资料在 `references/`，
许可证在 `LICENSES/`。技能只在 `skills` 服务存在时注册；缺失时插件照常工作。

## 安全边界

- **不是沙箱**，只防误操作：`ctypes`、`importlib.reload`、动态构造路径都能绕过。
- **绝不保存**用户的 `.blend`；每次 `exec` 正好一个 `Ctrl+Z` 步骤。
- **L1 静态检查**只认直白写法（保存/打开/退出/偏好、越界绝对路径），命中就根本不发给 Blender。
- **L2 运行时守卫**只在 `exec` 的同步窗口、主线程里生效：`builtins.open` / `io.open` / `os` / `shutil` / `pathlib` 的写删入口 + `bpy.ops` 代理；收尾自检、卸载。窗口外的后台线程或异步落盘不受约束。
- **失误操作禁止 AI 自行回滚**：发现异常时 AI 只负责告知用户并结束本轮，回滚由用户自己决定（`Ctrl+Z` 或打开快照）；插件不提供恢复工具。
- 任务目录与快照**只增不自动删**；快照只写不读。
- 与 `dsh-blender` 分工：活会话用本插件；磁盘 `.blend` 的批量分析/导出用 `blender_*` 工具。

## 开发

```sh
pnpm install
pnpm check          # tsc --noEmit（checkJs + strict）
pnpm test           # node:test，离线，不需要 Blender
node diagnostics/probePythonSyntax.js   # 用 Blender 自带 Python 编译所有生成的载荷
node diagnostics/probeGuardOffline.js   # 假 bpy 下验证 L2 守卫（越界写/放行/保存算子）
node diagnostics/probePreflight.js      # 实机预检（没开 Blender 时 SKIP）
node diagnostics/probeLive.js           # M0 实机全量探针（会短暂加/删一个 cube）
```

## 文档

- [已知问题与改进建议](docs/knownIssues.md)
- [Helper 运行时](docs/helper-runtime.md)
- [create-3d-model 技能引用](docs/refer-create-3d-model.md)

## 第三方引用

本项目的 `blender-live-session` 技能与 `helpers/` 下的 26 个 helper **直接引用** `create-3d-model` 上游技能库（MIT，版权人：CheshireJCat / RobLe3）：技能正文改写为活会话版本，helper 脚本原样随包。`dsh-blender` 只作为兼容参考，不作为文件来源。

完整版权声明、MIT 全文和改动说明见 [docs/refer-create-3d-model.md](docs/refer-create-3d-model.md) 与 [helpers/README.md](helpers/README.md)。这是自行剪裁版，不是原作者发布的官方子集，原作者没有审阅或背书；本项目与 DeepSeek AI、Blender Foundation、`dsh-blender` 作者均无隶属或背书关系。

## 许可

MIT，见 [LICENSE](LICENSE)。
