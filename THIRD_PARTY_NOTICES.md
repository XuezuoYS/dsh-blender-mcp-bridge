# THIRD PARTY NOTICES

本文件记录 **dsh-blender-mcp-bridge** 内联的第三方材料、其许可、署名要求与修改声明。

本项目的自有代码以 `GPL-3.0-or-later` 分发，全文见 [`LICENSE`](LICENSE)。

> **为什么必须有这个文件**：本插件内联了上游 GPL 语料（RST 语料、注入提示词）——**内联即再分发**。
> 上游仓库自己**没有** `LICENSE` / `NOTICE` / `COPYING` 文件（**实测**），因此全文与逐项署名必须由本项目补上。
> 设计依据与决策记录见 [`docs/contract.md`](docs/contract.md#licensing)。
>
> ⚠️ **本文件的 pin 需要随 `buildKnowledge.js fetch` 的实际结果更新**：
> 下表是**取证当时的**基线。语料**必须按 commit sha 固定**（不得按分支），
> 精确的语料 commit 与逐文件 blob sha 以 `knowledge/meta.json` 为准
> （见 [`docs/contract.md`](docs/contract.md#knowledge-fingerprint) / I25）。

---

## 1. Blender MCP（主组件）

| 项 | 值 |
|---|---|
| 名称 | Blender MCP（Blender Lab 的官方 MCP server 与 add-on） |
| 版权 | **Blender Authors**（逐文件 SPDX 头原文：`SPDX-FileCopyrightText: 2026 Blender Authors`） |
| 归属 | Blender Lab / Blender Foundation |
| 来源仓库 | <https://projects.blender.org/lab/blender_mcp> |
| **代码基线** | tag **`v1.0.3`** = commit `2cea8d566dde07fbac28a61d698909d69724e853`（2026-09-11） |
| **语料基线** | 取证记录：commit `ff54e4d8f6b09502f2f466189cca0e52b4a91643`（Blender **5.2** 语料）。**最终 pin 以 `knowledge/meta.json` 的 `corpusRevision` 为准**——语料按 commit sha 固定，不按分支 |
| 许可 | **GPL-3.0-or-later**（依据：`mcp/manifest.json` 的 `"license"` 字段；add-on 侧 `blender_manifest.toml` 的 `license = ["SPDX:GPL-3.0-or-later"]`；以及每个 `.py` 首行的 SPDX 头） |
| 取用日期 | 2026-09（本次重构取证期间） |

### 1.1 为什么代码与语料是两个不同的 ref

这不是笔误，是必须分别记录的**两个基线**：

- 本机已装的 add-on（扩展 id `mcp`，`version = "1.0.3"`）与 tag `v1.0.3` **逐 blob 相同**（9 个文件，**实测**）——所以**代码**基线取 `v1.0.3`。
- 但 **`v1.0.3` 自带的语料是 Blender 5.1**（4,279 文件 / 15,253,971 B），而本机运行的是 **Blender 5.2.2 LTS**。
  因此**语料**基线取 `main` HEAD（= v1.0.3 + 1 个语料提交），它是 **Blender 5.2**（4,508 文件 / 16,039,148 B）。
- 知识库要对齐**用户实际运行的 Blender**，而不是对齐代码 tag（[`docs/contract.md`](docs/contract.md#knowledge-corpus) / I25）。
- ⚠️ **不要用上游 `manifest.json` 的版本号推导语料版本**：`main` 的该字段写的是滞后的 `1.0.2`。

### 1.2 取用范围与逐项规模（**实测**）

| 内容 | 上游路径 | 文件数 / 字节 | 本仓库落点 | 修改情况 |
|---|---|---|---|---|
| Python API 参考（RST） | `mcp/blmcp/data/api/**/*.rst` | 2,150 / 10,293,766 | `knowledge/source/api/` | RST → Markdown **归一化改写**（结构保留） |
| 用户手册（RST） | `mcp/blmcp/data/manual/**/*.rst` | 2,358 / 5,745,382 | `knowledge/source/manual/` | 同上 |
| API 示例脚本 | `mcp/blmcp/data/api/examples/*.py` | 112 / 184,547 | `knowledge/source/api/examples/` | **原样保留**，未修改 |
| 注入提示词 | `mcp/blmcp/data/prompts.yml` | 1 / 6,235 | `knowledge/source/prompts.yml` | **原样保留** |

合计 `data/`：**4,621 个文件 / 16,229,930 字节**（其中 `.rst` 4,508 个 / 16,039,148 字节）。
→ **以上数字已由 `node buildKnowledge.js fetch` 实测复核一致**；实际落盘结果以 `knowledge/meta.json` 的
`sourceFiles` / `sourceBytes` / `blobs`（逐文件 git blob sha）为准。

**示例脚本必须单独列出**：上游 `mcp/pyproject.toml` 的 `package-data` **只声明了 `.rst` 与 `prompts.yml`**，
遗漏了 `data/api/examples/*.py`（**源码**）。因此不能照抄上游的打包声明，否则示例会缺（[`docs/contract.md`](docs/contract.md#knowledge-fingerprint)）。

### 1.3 修改声明

依据 GPL-3.0 §5(a)，此处明确声明本项目对上游材料所做的修改：

1. **RST → Markdown 归一化**：`data/api/**` 与 `data/manual/**` 的 `.rst` 原文被解析并改写为 Markdown
   （标题层级、代码块、directive 签名行、段落切分与章节面包屑）。
   这是**内容层面的改写**，不是格式转换——属于 GPL-3.0 §5 意义上的「modified version」。
   **原始 RST 也一并保留**（`knowledge/source/`），以便逐条回查原文。
   归一化还包含两项**结构性改动**，一并声明：
   - `.. include::` 目标**被展开内联**（245 处中已展开 220 处；25 处因上游仓库本身缺失目标文件而保留原样并登记）；
   - 未识别的 RST directive 保留原文并登记在 `knowledge/meta.json` 的 `unparsedDirectives` 里（不静默丢弃）。
2. **提取与索引**：由 `knowledge/source/` 生成 `knowledge/normalized/` 与 `knowledge/index/`（见 [`docs/contract.md`](docs/contract.md#knowledge-corpus)）。
   构建可复现，源指纹记录在 `knowledge/meta.json`。
3. **未做的修改**：`prompts.yml` 与 `data/api/examples/*.py` **原样保留**，未改写。
4. **没有内联的**：上游的 `*_toolcode.py`（送进 Blender 执行的 Python 片段）**不复制源码文本**，
   只做**语义摘要**并在本插件自己的通道上重写（见 §1.5）。

### 1.4 履行 GPL-3.0 的义务

| 义务 | 落点 |
|---|---|
| 完整许可证全文 | [`LICENSE`](LICENSE)（GPL-3.0，674 行；**上游仓库内没有该文件**，故由本项目提供） |
| 版权声明 | §1 的 `Blender Authors` 署名；`knowledge/source/` 保留上游逐文件原有的 SPDX 头 |
| 修改声明与日期 | §1.3（GPL-3.0 §5(a) 要求） |
| 整体以 GPL 分发 | 本项目 `package.json` 声明 `"license": "GPL-3.0-or-later"`；新写的 `.js` 文件首行带 `SPDX-License-Identifier: GPL-3.0-or-later` |
| 无担保声明 | 见 [`LICENSE`](LICENSE) §15–§17 |

**逐文件取用清单（blob sha）**：本次内联涉及 4,621 个语料文件，完整 sha 清单在 `knowledge/meta.json` 中逐条记录
（I25 要求「代码基线」与「语料基线」分别记录，且取用记录精确到 blob sha；见 [`docs/contract.md`](docs/contract.md#invariants)）。
本文件只列出**决定性 pin**（代码 tag 与语料 commit，见 §1）。

### 1.5 仅作参考、未内联的部分（不属于本文件的许可对象）

上游的 26 个工具定义与 16 个 `*_toolcode.py` 被**阅读**以提炼知识条目，但：

- **不复制源码文本**（含注释与文档串），只记录 API 语义、前置条件、副作用边界；
- 相应知识条目标注 `source: lab/blender_mcp@<ref> + 相对路径 + blob sha`；
- 这些摘要**不标** `SPDX-License-Identifier`（它们不是 GPL 衍生作品），在此以「参考来源」记录；
- 判定红线：**不得与原文逐句对应**——那会使其成为衍生作品（[`docs/contract.md`](docs/contract.md#knowledge) / [`#licensing`](docs/contract.md#licensing)）。

---

## 2. Blender Manual（子组件，**许可与 GPL 不同**）

`mcp/blmcp/data/manual/**` 的内容并非由 `lab/blender_mcp` 原创，其上游是 **Blender 用户手册**。

| 项 | 值 |
|---|---|
| 来源 | Blender Manual（`blender/blender-manual` 的 `manual/` 子目录；上游 `_misc/update_reference_manual.py` 从本地检出复制，**脚本不记录 URL/ref**） |
| 许可 | **Creative Commons Attribution-ShareAlike 4.0 International（CC-BY-SA-4.0）** 或更新版本 |
| 署名要求 | **`Blender Documentation Team`** + 超链接（在线）/ URL（印刷） |
| 手册网址 | <https://docs.blender.org/manual/en/latest/> |
| 许可全文 | <https://creativecommons.org/licenses/by-sa/4.0/legalcode> |
| 明确排除 | logos、trademarks、icons、**源码与 Python 脚本**（那一部分按 Blender 源码的 GPL 处理） |

### 2.1 署名（按语料自证的原文履行）

上游仓库**没有**为手册语料附任何 CC-BY-SA 声明（**实测**：全仓 grep `CC-BY` / `Creative Commons` / `copyright` 零命中），
但**语料自身**带有这段原文（`mcp/blmcp/data/manual/copyright.rst`）：

> Except where otherwise noted, the content of the Blender Manual is available under a
> Creative Commons Attribution-ShareAlike 4.0 International License or any later version.
> Excluded from the CC-BY-SA license are any logos, trademarks, icons, source code and
> Python scripts used in this manual.

因此本项目按**更严格的一方**履行义务，署名如下：

- **署名**：`Blender Documentation Team`
- **作品**：Blender Manual — <https://docs.blender.org/manual/en/latest/>
- **许可**：CC-BY-SA-4.0 — <https://creativecommons.org/licenses/by-sa/4.0/legalcode>
- **修改**：语料被改写为 Markdown 并生成检索索引（同 §1.3.1）；原始 RST 一并保留。

### 2.2 ShareAlike 的落点（如实说明）

CC-BY-SA-4.0 的 ShareAlike 条件要求：若你分享改编自该手册的材料，须以**相同、兼容或更高版本的 CC-BY-SA** 分享。

- **本项目的处理**：以 `GPL-3.0-or-later` 分发整体，并在**每个改写产物文件中保留 §2.1 的署名块**
  （`knowledge/normalized/manual/**` 与 `knowledge/source/manual/**`）。
- **§2 这一节是独立可分离的**：`knowledge/` 下的手册部分带有自己的署名与许可，可单独取出并按 CC-BY-SA-4.0 复用。
- ⚠️ **这是一处需要专业判断的许可交叠**（CC-BY-SA 材料并入 GPL 项目），本文件如实记录处理方式与依据，
  **不构成法律意见**；正式合规结论需法务复核（见 §5）。

### 2.3 手册语料里的 Python 脚本不在 CC-BY-SA 范围内

手册版权页明确排除 source code 与 Python scripts。本快照的 `data/manual/` **实测 0 个 `.py` 文件**，
因此当前不存在该问题的实际对象；若将来语料版本引入 `.py`，须按 Blender 源码（GPL）单独处理。

---

## 3. 明确未采用的部分

| 未采用 | 原因 |
|---|---|
| 上游 MCP server 的任何运行形态（含 `mcp/blmcp/server.py`、`addon/`） | 会引入第二条不受管的写入通道（[`docs/contract.md`](docs/contract.md#decision-knowledge-is-data) / I10） |
| 上游 `*_toolcode.py` 的源码文本 | 只取语义，在自有通道重写（§1.5 / I18） |
| 上游 6 个 `_for_cli` 变体（进程外批处理） | 属第三方插件 `dsh-blender` 的领域；且它们会先向活会话发写请求（[`docs/contract.md`](docs/contract.md#facts)） |
| 第三方项目 `ahujasid/blender-mcp`（PyPI `blender-mcp` / `mcp-for-blender`，MIT） | **不连接、不引用、不参考**（[`docs/contract.md`](docs/contract.md#core-decisions)）。本项目只认 Blender 官方（Blender Lab）仓库 |
| DSH（DeepSeek Harness，MIT，Copyright (c) 2026 DeepSeek） | 仅作为**宿主平台**，不内联其代码或数据；本插件通过其公开插件接口接入 |

---

## 4. 本项目自身的声明

- **许可**：`GPL-3.0-or-later`，全文见 [`LICENSE`](LICENSE)。
- **版权**：本项目自有代码的版权归其作者所有。
- **隶属关系**：本项目与 Blender Foundation、Blender Lab、Blender Documentation Team **均无隶属关系**，
  也未被其背书。名称中的 `mcp` 指被连接的 Blender 扩展（其扩展 id 为 `mcp`），不代表本项目实现了 MCP。
- **无担保**：见 [`LICENSE`](LICENSE) §15–§17。

---

## 5. 存疑与待办（不得当作已确证）

1. **`data/api/` 的确切上游许可未见明确声明**：`_misc/update_reference_api.py` 只接受一个本地目录参数，
   **不记录 URL / commit / 分支**；「Sphinx 构建产物」是**推断**（RST 里全是 Sphinx 专有语法）。
   仓库级 `mcp/manifest.json` 的 `GPL-3.0-or-later` **不自动等于**该生成文档的条款。
   → 本文件按仓库级声明处理，并**如实保留这一不确定性**。
2. **`data/manual/` 的上游 ref 未确证**：语料内的 `copyright.rst` 能证明**许可**（CC-BY-SA-4.0），**不能**证明 commit。
3. **CC-BY-SA-4.0 的完整许可全文未随仓库分发**：本文件给出署名与官方链接，
   但未附 legalcode 全文。若发布形态需要，应补 `knowledge/source/manual/LICENSE-CC-BY-SA-4.0.txt`
   （可由根目录 `buildKnowledge.js` 在构建时从语料/官方来源落盘）。
4. **`_misc/check_license.py` 的 `_SKIP_DIRS` 不是许可豁免**：它只跳过 `data/api`
   下的 `.py`（即 112 个 `examples/*.py` 不加 Blender Authors 的版权行），
   既**不审 RST**、也**不构成任何许可声明或豁免**。不得据此推断 `data/api` 无许可约束，
   也不得推断 `api` 与 `manual` 许可相同。
5. **本节全部内容为工程侧履行记录，不构成法律意见**；正式合规结论需法务复核。

---

## 6. 参考

- 设计依据、决策记录与不变量：[`docs/contract.md`](docs/contract.md)（[`#knowledge`](docs/contract.md#knowledge) 知识库、[`#licensing`](docs/contract.md#licensing) 许可）
- 上游事实取证：[`docs/upstream-facts-docs.md`](docs/upstream-facts-docs.md)、[`docs/upstream-facts-tools.md`](docs/upstream-facts-tools.md)
- 交付状态与工作记忆：[`.AGENTS/README.md`](.AGENTS/README.md)
- 本项目许可全文：[`LICENSE`](LICENSE)
