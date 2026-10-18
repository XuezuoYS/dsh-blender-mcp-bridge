# 引用 `create-3d-model` 技能库

本项目直接引用 `create-3d-model` 上游技能库，改写为面向 Blender 活会话的技能。本文记录这些内容的来源、许可、引用范围和标注方式。

这是一份**自行剪裁**的引用，不是上游作者发布的官方子集；原作者没有审阅、没有背书。`dsh-blender` 只作为兼容参考，不作为文件来源。

## 来源

`create-3d-model` 技能库的直接来源是 `CheshireJCat/create-3d-model-skill`；它再保留了 `RobLe3/cc-blender-skill` 的模块和 helper。

| 层 | 项目 | 版本 | 许可 |
|---|---|---|---|
| 原始技能 | [RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill) | 1.3.0，commit `11016c9a5847897491dde935c346571bd7548e3d` | MIT，Copyright (c) 2026 RobLe3 |
| 直接来源 | [CheshireJCat/create-3d-model-skill](https://github.com/CheshireJCat/create-3d-model-skill) | `main`，`skills/create-3d-model/` | MIT，Copyright (c) 2026 CheshireJCat |
| 兼容参考 | [CheshireJCat/blender](https://github.com/CheshireJCat/blender)（`dsh-blender`） | v0.2.3 | MIT；仅参考其工具映射和 helper 字段，不复制文件 |

本项目实际取用的是 `create-3d-model-skill` 的 `skills/create-3d-model/`。该目录自带 `LICENSE`（CheshireJCat）和 `UPSTREAM_LICENSE`（RobLe3）；`references/upstream.md` 记录了上游版本和 commit。

`dsh-blender` 不是引用链的一层：它的工具名映射、helper catalog 字段可以作为兼容参考，但本项目不复制它的 `index.js`、`lib/`、技能目录或 helper 实现。因此第三方许可全文只需要 CheshireJCat 和 RobLe3 两份。

## 许可

上述直接来源和原始技能均为 MIT。MIT 允许使用、复制、修改、合并、发布、分发、再许可和销售，条件是保留版权声明与许可全文。它不要求开源本项目，也不要求本项目同样使用 MIT。

本项目自己的许可证为 **MIT**（仓库根 `LICENSE`，Copyright (c) 2026 xuezuoys）。第三方部分仍按各自的 MIT 声明执行，两份版权声明与许可全文随包保留。

MIT 不授予商标权或背书权。引用时可以做事实性署名，但不能把这份剪裁说成“官方精选”“作者推荐”或上游项目的官方子集。

## 引用范围

### 核心内容

| 上游文件 | 用途 | 处理方式 |
|---|---|---|
| `SKILL.md` | 顶层流程：目标分类、先检查再改、blockout 到 detail、验收、交接 | 改写为 `blender-live-session`，替换工具名、保存流程和路径 |
| `references/visual-validation.md` | 看图检查表、阶段门、纠错循环 | 节选并改写，改为 `capture` / `render` |
| `references/core/assembly-order.md` | 11 步生产顺序、时间预算、critique 方法 | 改写，保留顺序，去掉“保存 .blend”表述 |
| `references/modeling-patterns.md` | 坐标与命名、几何策略、modifier 顺序、失败模式 | 节选并改写 |
| `references/core/common-object-dimensions.md` | 常见物体真实尺寸与比例 | 节选，作为数据表保留 |
| `references/blender-5-compat.md` | 引擎名、BSDF 输入、layered Actions 等防御写法 | 节选，并按 Blender 5.2.2 复核 |

### 按需内容

| 上游文件 | 用途 | 处理方式 |
|---|---|---|
| `references/modules/blender-modeling/SKILL.md` | 建模配方、硬表面、失败模式 | 节选 |
| `references/modules/blender-materials/SKILL.md` | PBR 配方、物理值、`set_input` | 节选 |
| `references/modules/blender-lighting/SKILL.md` | 三点光、灯位、色温 | 节选 |
| `references/modules/blender-cameras/SKILL.md` | 焦距、光圈、构图 | 节选 |
| `references/modules/blender-rendering/SKILL.md` | Cycles / EEVEE、采样、降噪 | 节选 |
| `references/modules/blender-export/SKILL.md` | 各格式参数、polycount、导出验证 | 节选 |
| `references/capability-map.md` | 模块路由与推荐管线 | 节选，只保留实际注册的模块 |

其余参考锁定模块（`wireframe-to-3d`、`reference-to-3d`、`multiview-*`、`atlas-uv-fitting`、`closed-surface-uv-coverage`、`texture-*` 等）的 `SKILL.md`、`references/` 和 helper 脚本也随包保留；是否注册成独立技能待定，默认按需引用。

### Helper 运行时

v1 自带 `create-3d-model` 技能库的 26 个 helper，不依赖 `dsh-blender` 的安装或分析环境：

- 23 个常规 helper 直接进模型可调用的工具面；
- 3 个维护类 helper（`skill-graph-audit`、`release-readiness-check`、`sanitize-skill-contributions`）随包保留，但默认隐藏，只有打开 `enableMaintenanceHelpers` 才可用；
- 本插件自己的 `blender_mcp_helpers` / `blender_mcp_helper` 负责列出和运行 helper；
- Python 解释器、依赖清单、安装脚本都由本插件管理，不共享 `dsh-blender` 的 `.venv`。

详细设计见 [`helper-runtime.md`](helper-runtime.md)。

### 参考锁定模块

`wireframe-to-3d`、`reference-to-3d`、`multiview-*`、`atlas-uv-fitting`、`closed-surface-uv-coverage`、`texture-*` 的 helper 脚本随包放在 `helpers/`，核心 references 放在 `skills/blender-live-session/references/`；29 个领域模块的 `SKILL.md` 正文 v1 暂不随包（后续版本再补），实现时按需从上游读取。它们的自动化流程在 v1 可用，但前提是分析 Python 依赖已经安装：

- Blender 运行时 helper：`surface-texture-coverage-audit` 直接通过插件内部 exec 运行，只读、不 push；
- 外部 Python helper：通过 `blender_mcp_helper` 启动独立 Python 进程，参数按 catalog 校验，输出只落任务目录；
- 缺依赖时明确报缺失模块和安装命令，不静默跳过。

这些模块仍然按活会话规则使用：不保存 `.blend`、不覆盖用户文件、输出落任务目录；模块正文里的 BlenderMCP/Codex 工具名由运行时 preamble 统一映射到 `blender_mcp_*`。

## 标注方式

### 文件头

每个改写文件在开头标明来源、版本、许可和改动。Markdown 用 HTML 注释，JS 用 `//`，Python 用 `#`。

```md
<!--
Adapted from CheshireJCat/create-3d-model-skill `skills/create-3d-model/`
(MIT, Copyright (c) 2026 CheshireJCat), which preserves modules from
RobLe3/cc-blender-skill (release 1.3.0, commit 11016c9a..., MIT,
Copyright (c) 2026 RobLe3).
Changes: BlenderMCP/Codex tool names mapped to blender_mcp_*; save flow
replaced by task-dir snapshots + Ctrl+Z; live-session safety rules;
English-only.
This is a self-curated adaptation, not an official subset.
-->
```

### 许可文件

如果复制了上游文件，技能目录下保留原始许可：

```text
skills/blender-live-.../
├── LICENSES/
│   ├── CheshireJCat-MIT.txt
│   └── RobLe3-MIT.txt
├── SKILL.md
└── references/...
```

MIT 要求版权声明和许可全文随副本走，不能只留一个链接。

### README

根目录 `README.md` 只保留简短提示，指向本文档；详细授权说明不在 README 里重复。

### 版本与更新

引用时记录 `create-3d-model-skill` 的 commit、上游 `cc-blender-skill` 1.3.0 和 commit `11016c9a...`。上游升级时先做 diff，只更新实际复制的文件，再同步本文档的版本信息；不要用新版本直接覆盖改写内容。

## 许可全文

### create-3d-model / CheshireJCat adaptation

来源：https://github.com/CheshireJCat/create-3d-model-skill

```text
MIT License

Copyright (c) 2026 CheshireJCat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### RobLe3/cc-blender-skill

来源：https://github.com/RobLe3/cc-blender-skill （release 1.3.0）

```text
MIT License

Copyright (c) 2026 RobLe3

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
