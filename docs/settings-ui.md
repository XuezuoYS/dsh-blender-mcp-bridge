# 图形设置页

插件在 **设置** 里增加了一个独立页面，不用再手改 `cordis.patch.yml` 就能调 Blender 操作的默认超时、快照份数等。

## 1. 页面在哪

侧栏左下角 **设置** → 设置导航里的 **Blender MCP**（排在系统分区和 dsh-prompt-inject 之后）；页面标题是「Blender MCP 插件桥」，英文界面标题显示 `dsh-blender-mcp-bridge`。

插件自己的详情页不再放配置表单；配置只在设置页维护，避免两处入口。

设置页按从上到下的顺序分六组：

| 分组 | 能调什么 |
|---|---|
| 连接与超时 | 监听地址、端口；连接 / 执行 / 截图 / 渲染的默认超时（秒） |
| 快照与撤销 | 自动快照开关、保留份数、触发节奏、写入间隔、删除前补拍、压缩、快照超时 |
| 安全与审计 | 写入守卫、审计开关、是否记录完整代码 |
| 任务目录 | 跟随 `.blend` / 跟随工作区；自定义根目录 |
| Python 辅助环境 | 环境状态卡片、安装/修复/重建/重新检测、底座 Python、pip 镜像 |
| 高级与辅助分析 | helper 超时与输出上限、维护类 helper、回复上限 |

每项下面都有中文提示；页面顶部用三句话说明这个插件的安全边界（不保存 `.blend`、自动快照、超时只影响 DSH 等待）。

## 1.1 Python 辅助环境卡片

- 固定在 `DSH_HOME/dsh-blender-mcp-bridge/python/venv`，不搜索本机其它 Python；
- 状态：未安装 / 不完整 / 需要重建 / 需要更新 / 就绪 / 安装中；
- 卡片显示环境路径、底座（Blender/Python 版本）、四个包版本、缺失包、lock 版本和约 100 MB 下载预估；
- 点安装后 Host 在后台建 venv、装 lock、校验，页面每 2 秒轮询；关掉页面不影响安装；
- 环境不完整时顶部徽标会提示，`blender_mcp_helpers` 也会给出安装入口；
- 没有设置页的客户端（TUI 等）用 `scripts/setupAnalysis.js` 安装。

## 2. 保存行为

- 改完点「保存设置」，一次原子写入当前 profile 的 `cordis.patch.yml`，不碰用户的 `.blend`。
- 保存后立即生效，不需要重启 DSH，也不会打断正在跑的一轮对话。
- 「放弃改动」回到上次保存的值；「恢复默认」把继承来的默认值装进草稿，仍然要点保存才写盘。
- 如果别的窗口先改了配置，页面会提示冲突，先「重新载入」再保存。

## 3. 什么时候要重启

- **安装或升级插件之后**：需要重启一次 DSH，再刷新 Web 页面。原因有两个：Config schema 和 `dsh.client` 声明都在插件启动时读取，浏览器半侧也要等新的客户端模块图。
- **改完设置页代码之后**：开发时 HMR 会热替换浏览器半侧；如果设置导航没出现新条目，刷新页面即可。
- **日常改配置**：保存即生效，不用重启。

## 4. 实现约定（维护者）

- 浏览器半侧在 `client.js`，`package.json` 的 `dsh.client` 声明为 `web`，`./client` 导出该文件。
- 页面注册在 `settings.section` slot：`id: 'blenderBridge'`、`order: 55`、本地化 `label`；不再注册 `plugins.bundle.config`。
- 表单数据来自 Client 的 `configForms.get('dsh-blender-mcp-bridge')`；namespace 就是 Loader 条目 id。
- 环境卡片通过 `ctx.connection.fetch.register` 注册的 `GET/POST /api/blender-bridge/helper-env` 读取状态、触发安装；该路由与核心 `/api/file` 一样带 owner 鉴权，只接受固定动作和 `application/json`，不接受包名或路径。
- 没有 `connection` 服务的宿主会跳过路由注册，卡片显示静态说明和 CLI 命令。
- `index.js` 的 `Config` 字段都标了 `.volatile()`，所以 Settings 服务能生成可实时写入的表单；插件代码用 `liveValue()` 在每次调用时读当前值，不能提前把值拷进长生命周期对象。
- 页面文案走 `blenderBridge` locale 字典；颜色只用 `--dsw-alias-*` 主题 token，图标是插件自己的桥拱图形。
