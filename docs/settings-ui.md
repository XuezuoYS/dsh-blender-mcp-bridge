# 图形设置页

插件在 **设置** 里增加了一个独立页面，不用手改文件也能调 Blender 操作的默认超时、快照份数等。设置数据存在插件自己的文件夹里，不再写 DSH profile。

## 1. 页面在哪

侧栏左下角 **设置** → 设置导航里的 **Blender MCP**（排在系统分区和 dsh-prompt-inject 之后）；页面标题是「Blender MCP 插件桥」，英文界面标题显示 `dsh-blender-mcp-bridge`。

插件自己的详情页不再放配置表单；配置只在设置页维护，避免两处入口。

设置页按从上到下的顺序分六组：

| 分组 | 能调什么 |
|---|---|
| 连接与超时 | 监听地址、端口、并发上限；连接 / 执行 / 截图 / 渲染的默认超时（秒） |
| 快照与撤销 | 自动快照开关、保留份数、触发节奏、写入间隔、删除前补拍、压缩、快照超时 |
| 安全与审计 | 写入守卫、审计开关、是否记录完整代码 |
| 任务目录 | 跟随 `.blend` / 跟随工作区；自定义根目录 |
| Python 辅助环境 | 环境状态卡片、安装/修复/重建/重新检测、底座 Python、pip 镜像 |
| 高级与辅助分析 | helper 超时与输出上限、维护类 helper、回复上限 |

每项下面都有中文提示；页面顶部用三句话说明这个插件的安全边界（不保存 `.blend`、自动快照、超时只影响 DSH 等待）。

## 1.1 Python 辅助环境卡片

- 固定在 `DSH_HOME/dsh-blender-mcp-bridge/python/venv`，不搜索本机其它 Python；
- 状态：未安装 / 不完整 / 需要重建 / 需要更新 / 就绪 / 安装中；
- 未安装时用醒目红色：顶部徽标和卡片状态都显示「Python 辅助环境未安装」；
- 只有“就绪”才回到正常位置；未安装、安装中、不完整、需要重建、需要更新时，整个“Python 辅助环境”分组都会自动排到设置页最上面；
- 卡片显示环境路径、底座（Blender/Python 版本）、四个包版本、缺失包、lock 版本和约 100 MB 下载预估；
- 点安装后 Host 在后台建 venv、装 lock、校验，页面每 2 秒轮询；关掉页面不影响安装；
- 环境不完整时顶部徽标会提示，`blender_mcp_helpers` 也会给出安装入口；
- 没有设置页的客户端（TUI 等）用 `scripts/setupAnalysis.js` 安装。

## 2. 设置文件在哪

全部设置都在 DSH 存储根下，和 Python 环境共用一个插件目录：

```text
<DSH_HOME>/dsh-blender-mcp-bridge/
├─ connection.json      # host、port、并发上限、连接/执行/截图/渲染超时、回复上限
├─ snapshot.json        # 自动快照策略
├─ safety.json          # 写入守卫、审计
├─ task.json            # 任务目录模式与自定义根目录
├─ helper.json          # basePython、pipIndexUrl、helper 超时/输出、维护类开关
└─ python/              # 辅助环境（venv、marker、安装日志）
```

- 每个文件都是 `{ "schemaVersion": 1, "updatedAt": "...", "values": { ... } }`；
- 没有 `settings.json`，按上面的分组切开管理；
- 每个文件写入走临时文件 + rename，单个文件不会出现半截内容；一次保存会按文件逐个替换；
- 文件损坏时保留一份 `.bak` 并用默认值恢复；
- 手工编辑这些文件后，运行中的插件会在约 1 秒内重新读取，不需要重启；
- 任务目录和审计日志仍然在 `.blend` 旁边（安全设计），不属于设置文件。

## 3. 第一次启动与迁移

- 插件第一次启动时，如果上面某个文件不存在，会把当前 DSH profile 里的值（含旧的 `analysisPython` 等已废弃字段之外的已知字段）写进对应文件；
- 文件一旦存在，**插件文件就是唯一来源**；之后修改 profile 的 `cordis.patch.yml` 不会再影响插件；
- `cordis.patch.yml` 里的插件配置块保留为初始默认值，方便全新安装直接迁移；
- 旧字段（`analysisPython`、`autoDetectPython`）会被丢弃，不会写进新文件；
- 手工删除某个文件后，下次启动会用 profile/默认值重建；想临时重置也可以直接编辑 `values`。

## 4. 保存行为

- 改完点「保存设置」，设置页调用 `POST /api/blender-bridge/settings`，一次提交一组 `{ op: 'set', path, value }`；
- Host 校验后写入对应的 JSON 文件，并返回新的 `revision`；
- 保存后立即生效，不需要重启 DSH，也不会打断正在跑的一轮对话；
- 「放弃改动」回到上次保存的值；「恢复默认」把 schema 默认值装进草稿，仍然要点保存才写盘；
- 如果别的窗口或手工编辑先改了文件，页面会提示冲突，先「重新载入」再保存。

## 5. 什么时候要重启

- **安装或升级插件之后**：需要重启一次 DSH，再刷新 Web 页面。原因有两个：Host 半侧和浏览器半侧的模块图都在插件启动时读取。
- **改完设置页代码之后**：开发时 HMR 会热替换浏览器半侧；如果设置导航没出现新条目，刷新页面即可。
- **日常改配置**：保存即生效，不用重启。
- **手工改 JSON**：运行中的插件约 1 秒内重新读取；如果文件写坏，会保留 `.bak` 并在日志里提示。

## 6. 实现约定（维护者）

- 浏览器半侧在 `client.js`，`package.json` 的 `dsh.client` 声明为 `web`，`./client` 导出该文件。
- 页面注册在 `settings.section` slot：`id: 'blenderBridge'`、`order: 55`、本地化 `label`；不再注册 `plugins.bundle.config`。
- **不再使用 `ctx.configForms`**。浏览器半侧用一个轻量的 `createRemoteSettingsForm()` 适配器，通过 `GET/POST /api/blender-bridge/settings` 读取和保存，界面上的草稿/校验/冲突逻辑保持原样。
- 设置路由和环境卡片路由都通过 `ctx.connection.fetch.register` 注册；它们与核心 `/api/file` 一样带 owner 鉴权，只接受 `application/json` 和固定形状的请求体。
- 没有 `connection` 服务的宿主会跳过路由注册；设置页显示“设置通道不可用”，用户仍可直接编辑上面的 JSON 文件。
- `index.js` 通过 `createSettingsStore()` 读取设置；工具调用、快照策略和 helper 环境都读同一个 store，文件变化约 1 秒内生效。
- `lib/config.js` 里的 `Config` schema 只负责 DSH 加载和默认值；`lib/settingsStore.js` 负责文件、校验、revision 和迁移。
- 页面文案走 `blenderBridge` locale 字典；颜色只用 `--dsw-alias-*` 主题 token，图标是插件自己的桥拱图形。
