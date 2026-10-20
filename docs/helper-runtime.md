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

- Node 侧用 `child_process.spawn` 启动 `analysisPython`，不经过 shell；
- 只允许运行随包脚本，脚本路径来自 helper 目录表，不接受任意路径；
- 参数由 Node 侧按 catalog 校验，再拼成固定参数数组；
- 工作目录是当前任务目录（不再使用只读的插件安装目录），输入路径解析成绝对路径，输出只允许落任务目录；
- Python helper **不要求 Blender 活会话**；任务目录在 Blender 未连接时按 workspace 落；
- stdout/stderr 有上限，超时杀进程；
- 返回解析后的 JSON（能解析时）、报告路径、stdout/stderr 摘要。

## 3. Python 环境

### 3.1 版本与依赖

- Python 3.10+；
- 常规依赖：`numpy>=2.0,<3`、`Pillow>=10,<13`；
- 分析依赖：`opencv-python-headless>=4.10,<5`、`scipy>=1.13,<2`。

依赖清单放在 `requirements-analysis.txt`，安装脚本放在 `scripts/setupAnalysis.js`。

### 3.2 解释器选择

按优先级：

1. 配置项 `analysisPython` 指定的绝对路径；
2. 自动探测 `python`、`python3`、Windows 的 `py -3`；
3. 找不到就报明确错误，不安装、不下载、不静默跳过。

探测时跑一次 `python -c "import sys; print('%d.%d' % sys.version_info[:2])"`，并把解释器命令、版本和来源记进 `blender_mcp_helpers` 的结果。

### 3.3 安装

用户显式运行：

```text
node scripts/setupAnalysis.js
```

脚本在插件目录创建 `.venv`，然后执行：

```text
python -m pip install -r requirements-analysis.txt
```

不在插件启动或工具调用时自动安装依赖；网络和磁盘写入由用户自己决定。

### 3.4 缺依赖时的行为

`blender_mcp_helpers` 对每个 helper 报告 `ready` 和 `missing`：

- 纯 Python / Pillow helper：只检查 Python 和对应模块；
- OpenCV / SciPy helper：检查完整依赖；
- 缺依赖时，`blender_mcp_helper` 返回可操作错误，包含缺失模块和安装命令，不抛裸 traceback。

## 4. 工具面

v1 新增两个工具，工具总数从 6 个变 8 个。

### 4.1 `blender_mcp_helpers`

只读列出 helper：

- `name`、`runtime`（`blender` 或 `python`）、`maintenance`；
- 顶层 `python`：解释器版本、来源、命令与固定参数；
- `dependencies`；
- `ready`、`missing`；
- 参数 schema（名称、类型、是否必填、路径方向）。

维护类 helper 默认不出现；打开 `enableMaintenanceHelpers` 后才列出。

### 4.2 `blender_mcp_helper`

运行一个 helper。参数：

| 参数 | 类型 | 说明 |
|---|---|---|
| `name` | string，必填 | helper 名，必须在 catalog 中 |
| `task` | string，必填 | 任务名，决定输出目录 |
| `args` | object，必填 | helper 自己的参数，按 catalog 校验 |
| `timeoutMs` | integer，可选 | 覆盖默认超时，设上限 |

路径规则：

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
- 如果输出里有 PNG/JPEG/WebP/GIF，按图片块规则附给模型；模型不支持图片时只给路径。

## 5. 安全边界

这是**受信任的随包 Python 代码**，不是用户代码执行通道：

- 不接受 AI 直接提供脚本路径或代码；
- 只接受 catalog 里的 helper 名和结构化参数；
- `spawn` 不使用 shell，参数逐个传递；
- 环境变量只保留 `PATH`、`SYSTEMROOT`、`TEMP`、`TMP`、`HOME`、`USERPROFILE`、`APPDATA`、`LOCALAPPDATA` 和 UTF-8 相关项，不传 API key、token、代理凭据；
- 超时默认 120 s，硬上限 10 min；
- stdout/stderr 上限 200k 字符，超限截断并标记；
- 维护类 helper 默认关闭；
- 运行记录进任务目录 `audit.jsonl`（工具名、helper 名、参数摘要、耗时、输出文件）；默认只存代码 sha256，`audit.storeCode=true` 才存原文；
- 这些 helper 不联网、不安装包；需要安装时由用户显式跑 setup 脚本。

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
  analysisPython: ''          # 空 = 自动探测
  autoDetectPython: true
  timeoutMs: 120000
  maxOutputChars: 200000
  enableMaintenanceHelpers: false
```

- `analysisPython` 设了但不可用：`blender_mcp_helpers` 报错，不偷偷回退；
- 自动探测失败：报“找不到 Python 3.10+”，给安装提示；
- 每个 helper 的依赖检查结果缓存 60 s，避免每次调用都重新导入模块。

## 8. 验收

1. `blender_mcp_helpers` 能列出 23 个常规 helper；维护类默认不出现。
2. `surface-texture-coverage-audit` 在活会话里跑通，返回 UV/材质覆盖报告。
3. `fit-repair-queue` 用一份样例 JSON 跑通，输出到任务目录。
4. `animation-contact-sheet` 用样例帧生成联系表，模型能拿到图片或路径。
5. `wireframe-analyzer` 在依赖齐全时跑通；缺 OpenCV 时给出安装命令，不抛裸 traceback。
6. 输出路径越界被拒绝；输入路径越界被拒绝。
7. 超时能杀掉进程并返回 `timeout`；输出超限被截断。
8. 任意脚本路径、任意 Python 代码、`--help` 之外的额外参数都不能注入。
9. 维护类 helper 默认不出现；打开 `enableMaintenanceHelpers` 后可列出、可运行，结果里明确提示“会改技能库文件，不只是场景”。
10. 运行记录进 `audit.jsonl`，包含工具名、helper 名、参数摘要、耗时、输出文件；默认不存代码原文。

## 9. 风险

| 风险 | 处理 |
|---|---|
| 用户机器没有 Python 3.10+ | 明确报错，给安装提示；不自动装 |
| OpenCV/SciPy 安装体积大 | setup 脚本显式执行；按 helper 报告缺失模块 |
| 大图/大模型处理慢 | 超时、输出上限、任务目录 |
| helper 脚本 bug 写坏文件 | 输出限制在任务目录；脚本随包审查；不是沙箱 |
| 与 `dsh-blender` 的 helper 重名 | 本插件用自己的 catalog 和脚本副本，不共享状态、不互相调用 |
| 维护类 helper 被误调用 | 默认关闭，需要配置显式打开 |
