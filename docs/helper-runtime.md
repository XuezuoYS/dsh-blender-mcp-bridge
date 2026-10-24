# Helper 运行时

本项目在 v1 直接内置 `create-3d-model` 技能库的 helper，不依赖 `dsh-blender` 的安装或分析环境。本文记录 helper 的运行方式、Python 环境、工具接口、安全边界和验收标准。

## 1. 范围

`create-3d-model` 技能库共有 26 个 helper：

- 23 个常规 helper：v1 纳入 `blender_mcp_helpers` / `blender_mcp_helper` 两个工具，不是 23 个独立工具；
- 3 个维护类 helper（`skill-graph-audit`、`release-readiness-check`、`sanitize-skill-contributions`）：随包保留，但默认隐藏，只有显式打开 `enableMaintenanceHelpers` 才可用。它们改的是技能库本身，不是 Blender 场景，不应混进日常建模流程。

不依赖 `dsh-blender`：Python 解释器、helper 脚本、依赖清单都由本插件自己管理；`dsh-blender` 装不装都能用。

helper 脚本和 catalog 内容直接来自 `CheshireJCat/create-3d-model-skill` 的 `skills/create-3d-model/`。`dsh-blender` 的 helper catalog 只作为字段和参数形状的兼容参考，不复制它的实现；两边各跑各的。

## 2. 两种运行方式

### 2.1 Blender 运行时 helper

只有 `surface-texture-coverage-audit` 属于这一类。

- 脚本在 Blender 进程内执行，只读场景数据；
- 通过插件内部的受信任 exec 调用，不走用户 `exec` 的写路径；
- 不产生快照、不 push 撤销步骤、不修改场景；
- 报告写到任务目录；stdout 里的 JSON 直接作为结果返回。
- 该脚本默认只扫 `AVATAR_BASE__` / `SIDE_BACK__` 前缀的对象；调用时必须显式传 `objects`，或由插件默认改成“当前场景全部网格”，不要照搬它的默认过滤。

### 2.2 外部 Python helper

其余 22 个常规 helper 在独立的 Python 进程中运行。

- 只使用固定环境：`<DSH_HOME>/dsh-blender-mcp-bridge/python/venv`。需要第三方依赖的 helper 必须等这个环境装好；
- **不搜索** PATH、DSH 自带 Python、插件目录 `.venv` 或用户已有环境里的库；
- 依赖列表为空的 7 个 helper 可以直接用 Blender 自带的 Python 运行；底座不可用时才退回 venv；
- Node 侧用 `child_process.spawn` 启动解释器，不经过 shell；
- 只允许运行随包脚本，脚本路径来自 helper 目录表，不接受任意路径；
- 参数由 Node 侧按 catalog 校验，再拼成固定参数数组；
- 工作目录是当前任务目录，输入路径解析成绝对路径，输出只允许落任务目录；
- stdout/stderr 有上限，超时杀进程；
- 返回解析后的 JSON（能解析时）、报告路径、stdout/stderr 摘要；
- 环境装好后，Python helper 不要求 Blender 活会话。

## 3. Python 环境

### 3.1 版本与依赖

- 底座要求 Python **3.12+**；Blender 5.1+ 自带 3.13，正好满足；
- 依赖固定为 `requirements-analysis.lock.txt`：

```text
numpy==2.5.4
Pillow==12.3.0
opencv-python-headless==4.14.0.94
scipy==1.18.1
```

- `requirements-analysis.txt` 保留为版本范围说明；改它之后要同步更新 lock；
- 安装用 `--only-binary=:all:`，只接受 wheel。这四个版本在 Python 3.13/3.14 的 Windows、macOS、Linux 上都有 wheel。

### 3.2 位置与底座

```text
<DSH_HOME>/dsh-blender-mcp-bridge/python/
├─ venv/                 # 唯一运行环境（普通 venv，不带 system-site-packages）
├─ venv.json             # 安装标记：底座、包版本、lock 哈希
├─ base.json             # 最近一次看到的 Blender Python
├─ install-state.json    # idle / running / failed / interrupted
├─ install.lock          # Host 与 CLI 共用的单飞锁
└─ install.log           # 安装日志
```

`DSH_HOME` 取 `process.env.DSH_HOME`，缺省 `~/.dsh`（Windows 是 `%USERPROFILE%\.dsh`）。

底座按优先级取：

1. 配置 `helper.basePython`（显式路径；空 = 使用 Blender 自带 Python）；
2. 本进程最近一次握手拿到的 `sys.executable`；
3. `base.json` 里记录的上次底座；
4. `venv.json` 里记录过的安装底座。

每一层都会实际探测版本、`venv` 和 `ensurepip`；**不扫描其他解释器**。没连 Blender 又没有以上记录时，设置页会提示先连接 Blender，或者用 CLI 的 `--python` 显式指定。

venv 用普通模式（不加 `--system-site-packages`）：四件套全部装进 venv，不依赖 Blender 自带的 numpy，也不会触发 Blender `sitecustomize.py` 在 venv 里算错 `blender.shared` 的问题。

### 3.3 安装

只有用户能触发安装：

- **设置页**：设置 → Blender MCP → Python 辅助环境 → 安装 / 修复 / 重建；
- **命令行**（TUI、第三方客户端、无设置页的宿主）：

```sh
node "<插件目录>/scripts/setupAnalysis.js"
node "<插件目录>/scripts/setupAnalysis.js" --python "C:\Program Files\Blender Foundation\Blender 5.2\5.2\python\bin\python.exe"
node "<插件目录>/scripts/setupAnalysis.js" --home "D:/custom-dsh-home" --mirror "https://pypi.example/simple"
node "<插件目录>/scripts/setupAnalysis.js" --rebuild
```

流程：

1. 解析并探测底座；
2. `python -m venv <python/venv>`；
3. `venv python -m pip install ... -r requirements-analysis.lock.txt`；
4. 导入四个包并读版本，写 `venv.json`；
5. 设置页每 2 秒轮询进度，日志写 `install.log`；页面关闭不影响后台安装。

体积：约 100 MB 下载、350 MB 磁盘（venv 约 300–350 MB）。安装完成前，需要依赖的 helper 会返回 `helper-env-missing` / `helper-env-incomplete`，消息里带设置页入口和 CLI 命令。

安装期间：

- 有 helper 在跑时，安装会被拒绝；
- 安装进行中，新的 helper 调用返回 `helper-env-installing`；
- Host 和 CLI 同时安装时，`install.lock` 会让第二个失败；过期的锁（30 分钟或进程已退出）会被清理；
- 失败时保留 venv 供重试，pip 缓存能复用。

### 3.4 状态与可用性

`blender_mcp_helpers` 和设置页共用同一套状态：

| 状态 | 判定 | 可用 |
|---|---|---|
| `missing` | 没有 venv，也没有 `venv.json` | 否（无依赖 helper 仍可用 Blender Python） |
| `incomplete` | venv 能跑，但四件套缺某个 | 否 |
| `broken` | venv 起不来，或 marker 的底座路径消失 | 否 |
| `outdated` | 四件套都在，但 lock 哈希与 marker 不一致 | 是，建议更新 |
| `ready` | 四件套都在，lock 哈希一致 | 是 |

安装任务另有 `install.state = idle | running | failed | interrupted`，设置页优先显示它。

探测只跑固定 venv，结果缓存 60 秒；`venv.json` 比缓存新时自动失效（CLI 在外部安装也能被 Host 看到）。底座版本变化不会强制重建：venv 还能跑就继续用，设置页只显示“安装时底座”；只有 venv 起不来才需要重建。

### 3.5 缺环境时的行为

- 依赖为空的 helper：用 Blender 自带 Python；底座也不可用时报 `helper-env-missing` / `helper-env-base-unavailable`；
- 有依赖的 helper：报 `helper-env-missing` / `helper-env-incomplete`，带设置页入口和 CLI 命令；
- 维护类 helper 默认关闭的行为不变。

## 4. 工具面

v1 仍只有 `blender_mcp_helpers` 和 `blender_mcp_helper` 两个 helper 工具；没有“安装 helper”的模型工具，安装只由用户触发。

### 4.1 `blender_mcp_helpers`

只读列出 helper：

- 顶层 `env`：状态、venv 路径、底座（路径/版本/来源）、四个包版本、缺失包、lock 版本与哈希、安装任务状态、日志尾、安装命令；
- `helpers[]`：`name`、`runtime`、`maintenance`、`dependencies`、`ready`、`missing`、参数 schema；
- 维护类 helper 默认不出现；打开 `enableMaintenanceHelpers` 后才列出。

模型看到的摘要保持紧凑：全 ready 时只有环境一行、包一行和 helper 列表；未就绪时多一行修复入口。

### 4.2 `blender_mcp_helper`

运行一个 helper。参数：

| 参数 | 类型 | 说明 |
|---|---|---|
| `name` | string，必填 | helper 名，必须在 catalog 中 |
| `task` | string，必填 | 任务名，决定输出目录 |
| `args` | object，必填 | helper 自己的参数，按 catalog 校验 |
| `timeoutMs` | integer，可选 | 覆盖默认超时，设上限 |

路径规则不变：

- 输入文件/目录：解析后必须在会话 workspace、当前 `.blend` 所在目录或任务目录内；
- 输出文件/目录：解析后必须在任务目录内；
- 路径里出现 `..`、`//`、结尾斜杠、跨盘符，按解析结果判定，不靠字符串前缀；
- 输出目录不存在时由插件创建。

返回：

- `status`: `ok` / `error`；
- `helper`、`runtime`；
- `report`：stdout 能解析成 JSON 时的对象；
- `stdout` / `stderr` 摘要；
- `outputs[]`：实际产生的文件（绝对路径、字节数）；
- `durationMs`；
- 如果输出里有 PNG/JPEG/WebP/GIF，按图片块规则附给模型；模型不支持图片时只给路径；
- 环境问题返回 `helper-env-*` 错误，不抛裸 traceback，也不会尝试安装。

## 5. 安全边界

这是**受信任的随包 Python 代码**，不是用户代码执行通道：

- 不接受 AI 直接提供脚本路径或代码；
- 只接受 catalog 里的 helper 名和结构化参数；
- `spawn` 不使用 shell，参数逐个传递；
- 环境变量只保留 `PATH`、`SYSTEMROOT`、`TEMP`、`TMP`、`HOME`、`USERPROFILE`、`APPDATA`、`LOCALAPPDATA` 和 UTF-8 相关项；子进程加 `PYTHONNOUSERSITE=1`；
- 超时默认 120 s，硬上限 10 min；
- stdout/stderr 上限 200k 字符，超限截断并标记；
- 维护类 helper 默认关闭；
- 运行记录进任务目录 `audit.jsonl`；默认只存代码 sha256；
- 这些 helper 不联网、不安装包。

安装边界：

- 路由是 `ctx.connection.fetch.register` 注册的 owner 鉴权 Fetch 路由（和核心 `/api/file` 同一机制），只接受 `POST` + `application/json` + `{"action":"install"|"rebuild"}`；
- 不接受包名、安装路径、index URL；镜像只从配置读；
- 只允许用户点设置页按钮或自己跑 CLI；AI 工具不触发安装；
- 安装日志对 `https://user:pass@host` 这类内联凭据脱敏；
- 不写插件安装目录，不改 DSH 自带 Python，不改 Blender 安装目录。

仍然不是沙箱：helper 脚本是随包代码，如果脚本本身有 bug，仍可能写坏文件；路径限制和输出目录限制是防误操作，不是安全隔离。

## 6. Helper 清单

### 6.1 直接启用（23）

| 分类 | helper |
|---|---|
| Blender 运行时（1） | `surface-texture-coverage-audit` |
| 纯 Python 报告/计划（7） | `atlas-region-mapper`、`fit-repair-queue`、`landmark-fit-report`、`view-constraint-report`、`quality-refinement-plan`、`orbit-layout-manifest`、`contour-correspondence-report` |
| Pillow（2） | `animation-contact-sheet`、`texture-transition-plan` |
| OpenCV（4） | `atlas-region-detector`、`register-orthographic-views`、`look-fit-report`、`segment-source-parts` |
| OpenCV + NumPy（6） | `multiview-fit-report`、`reference-manifest-compiler`、`render-overlay-validator`、`silhouette-validator`、`template-analyzer`、`seeded-part-masks` |
| OpenCV + NumPy + SciPy（3） | `mask-to-mesh-recipe`、`source-locked-skin-recipe`、`wireframe-analyzer` |

### 6.2 默认关闭（3）

`skill-graph-audit`、`release-readiness-check`、`sanitize-skill-contributions`。它们只处理技能库文件，不参与 Blender 创作。

## 7. 配置

```yaml
helper:
  basePython: ''        # 空 = 使用 Blender 自带 Python；只在安装 venv 时使用
  pipIndexUrl: ''       # 空 = PyPI；也可以填公司镜像或代理镜像
  timeoutMs: 120000
  maxOutputChars: 200000
  enableMaintenanceHelpers: false
```

- `analysisPython` / `autoDetectPython` 已删除。旧 profile 里残留的键会被忽略，不影响加载；
- `basePython` 只在创建/重建 venv 时使用；日常运行只认固定 venv；
- `pipIndexUrl` 支持 `http://` / `https://`；`http://` 会自动追加 `--trusted-host`；
- 代理和证书交给 pip 自己的配置文件（`%APPDATA%\pip\pip.ini` 等），插件不向子进程传凭据环境变量；
- 每个 helper 的依赖检查结果缓存 60 s，安装完成后主动清缓存。

## 8. 验收

1. 全新环境、无配置、无 venv：设置页显示“未安装”，给出路径、lock 版本和约 100 MB 预估；`blender_mcp_helpers` 显示同样的状态；需要依赖的 helper 报 `helper-env-missing`。
2. 连上 Blender 点安装：完成后 23/23 ready；`blender_mcp_helpers` 显示 venv 路径、底座 Blender/Python 版本、四个包版本。
3. 关掉设置页再安装：后台继续；重新打开显示进度/完成。
4. 删除 venv：回到“未安装”；无依赖 helper 仍可用 Blender Python；有依赖 helper 报错并给安装入口。
5. 删除 venv 里一个包：显示“不完整”，修复后恢复。
6. 删除/升级 Blender 导致底座路径消失：显示“需要重建”，重建后恢复。
7. 断网安装：`failed`，日志可看，重试复用缓存。
8. 安装中调用 helper：`helper-env-installing`；有 helper 在跑时安装：被拒绝。
9. 不连 Blender、没有 `base.json`：设置页提示先连接 Blender；CLI 用 `--python` 能装。
10. 自定义 `DSH_HOME`：CLI 用 `--home`，Host 能识别同一个目录。
11. 不搜索 PATH / DSH payload / 插件 `.venv`；离线测试断言无底座时不起任何探测进程。
12. 输出路径越界、输入路径越界、超时、输出超限、脚本参数注入的旧规则全部保持。

## 9. 风险

| 风险 | 处理 |
|---|---|
| 用户机器没有 Blender 5.1+ | 插件本来就要求 5.1+；底座不可用时明确报错，不假装可用 |
| Blender 换 Python 版本（3.15） | lock 需要随插件发版更新；当前 lock 覆盖 3.13/3.14 |
| OpenCV/SciPy wheel 体积大 | 用户显式安装；安装前显示约 100 MB 预估 |
| 下载慢/被墙 | `pipIndexUrl` 镜像、pip 缓存、失败重试 |
| 代理/证书 | pip 自己的配置文件；插件不传凭据环境变量 |
| venv 被 Blender 升级弄坏 | 状态探测为 `broken`，设置页重建；旧 venv 保留供排查 |
| 并发安装 | `install.lock` + 409；过期锁自动清理 |
| 安装时 helper 在跑 | 拒绝安装；安装中拒绝新 helper 调用 |
| `DSH_HOME` 不可写 | 安装前检查并报 `home-unwritable` |
| 设置页通道在旧宿主不存在 | 路由注册前判断能力；卡片退化为静态说明 + CLI 命令 |
| 远端 Web 会话触发安装 | 路由是 owner 鉴权；本版不做额外 loopback 限制，部署方应限制 Web 访问 |
| 维护类 helper 被误调用 | 默认关闭，需要配置显式打开 |
| 与 `dsh-blender` 的 helper 重名 | 本插件用自己的 catalog 和脚本副本，不共享状态、不互相调用 |
