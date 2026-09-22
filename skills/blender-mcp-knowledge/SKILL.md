---
name: blender-mcp-knowledge
description: Use when writing Blender Python (bpy) for a live session through the dsh-blender-mcp-bridge tools — before writing operator calls, when an operator's poll() fails, when an enum value or parameter name is uncertain, or when a bpy API call errored. Provides the offline Blender API/manual knowledge base lookup contract and the recurring-pitfall rules, without network access.
---

# Blender MCP 知识库

本技能教**什么时候查、怎么查**。数据不在本文件里——它在随插件交付的 `knowledge/` 语料里。

**这份语料是静态只读快照**（源自 Blender 官方 `lab/blender_mcp`）：不联网、不回传、无遥测。
**不要**用网络检索去补 Blender API 契约——离线语料与你的实际运行版本对齐，网络结果不一定。

## 第一条规则：不要凭记忆写算子调用

「记错 API」是写 Blender Python 出错的第一大原因：参数名、枚举值、前置条件（poll 依赖的模式与选择状态）。
**在写任何 `bpy.ops.*` 调用之前先查契约**，这比写完再修便宜得多。

## 三个入口，按可用的选

| 情况 | 用什么 | 说明 |
|---|---|---|
| 插件已装（工具面里有 `blender_mcp_docs`） | **首选它** | 有界摘录 + 来源路径 + 版本漂移提示 |
| 只想查、不连 Blender（没装插件） | 直接读 `knowledge/` 文件 | 见下面「离线直读」 |
| 需要「原文怎么写的」 | 读 `knowledge/source/**` 的 RST 原文 | 原文**不参与默认检索**，是最后手段 |

### 用 `blender_mcp_docs`

| mode | 什么时候用 | 关键参数 |
|---|---|---|
| `api` | 已知标识符，要精确契约 | `identifier`，如 `bpy.ops.object.add`、`bpy.types.Scene.frame_current`、`bpy.types.Scene.*`（列举） |
| `search` | 只知道概念/关键词 | `query`、`maxResults`、`context`（对称窗口）、`index`（对上一轮命中钻取） |
| `rules` | 要那份「反复踩的坑」清单 | 无参数 |

**看 `kind` 字段决定下一步**（它是给我们自我纠错用的，不是错误码）：

| `kind` | 含义 | 下一步 |
|---|---|---|
| `definition` | 命中精确定义 | 直接用 |
| `namespace` | 通配符列举 | 从 `available[]` 里挑一个精确名字再查 |
| `partial` | 找到了相近的东西（例如类成员只在父类段落里出现） | 读返回的段落，别当成「查不到」 |
| `suggestions` | 只有候选 | 从候选里挑一个再查 |
| `missing` | 确实没有 | 换关键词，或确认这个名字拼对了 |

`available: false` **不是**「你没配置」——语料必定随包交付，它表示**内置索引缺失或损坏**（交付缺陷）。
这时按 `handoff` 的指引重建或重装，**不要凭空编造 API**。

### 离线直读（没装插件时）

```
knowledge/
├── rules.json            # G3：易错点规则（上游提示词原文 + 本插件自己的规则）
├── g3-rules.md           # 同上，人类可读的 Markdown 版
├── index/api-map.jsonl   # 标识符 -> 文件路径（精确查找用，一行一条）
├── index/files.jsonl     # 完整索引（含段落正文；大文件，按行流式读，别整体载入）
├── normalized/           # 归一化正文（Markdown），路径与 source/ 对齐
├── source/               # 官方 RST 原文（不参与默认检索）
└── meta.json             # 源指纹：code/corpus commit、Blender 版本、未识别 directive 清单
```

**先读 `g3-rules.md`**（小、直接可用）。要精确查一个标识符时，在 `index/api-map.jsonl` 里查，
而不是 grep 整个 `files.jsonl`——后者是十几 MB 的单文件。

## G3：写 Blender Python 的反复踩的坑

完整清单见 `knowledge/g3-rules.md`。这几条最容易犯：

- **名字不是身份。** 中文界面下 `primitive_cube_add()` 生成的对象名是「立方体」。
  归属判定用 `as_pointer()`，不要按名字回查；名字还会自动加 `.001`。
- **相对路径落到 Blender 进程的 cwd**（实测在 `Program Files` 下），不是你的 workspace。要落盘就用插件给的绝对路径。
- **覆盖保存会被拒。** `bpy.ops.wm.save_mainfile` 与不带 `copy=True` 的 `save_as_mainfile` 同等对待。存盘走 `blender_mcp_snapshot`。
- **可写范围只有任务目录。** 越界写/删会被拒并返回 `suggested_path` 与 `handoff`——那一步需要**用户**自己完成。
- **改偏好/add-on 开关会被拒**（跨会话持久，比丢一个场景更不可逆）。
- **模式与选择不会自动就位。** 大多数 `poll()` 失败是因为当前模式不对、没有活动对象、或没有选中项：
  显式设置 `mode` / `active_object` / 选择，再调算子。
- **bmesh 要 `flush`**，否则几何改动不可见。
- **别用 `print` 传值。** 把结果赋给 `result`（dict），那是唯一的返回通道。

## 出错后怎么查

`blender_mcp_exec` 的结构化错误里 `hint` 会指向下一步；错误文本是**本地化**的（中文界面下是中文），
所以**不要**按英文串判断成因，要靠 `kind` / 算子名 / traceback 的行。

`poll()` 类失败几乎总是上下文问题：用 `blender_mcp_inspect` 看当前模式、活动对象与选中集合，
再用 `docs` 查该算子声明的前置条件。

## 版本漂移

`docs` 返回里的 `drift` 说明语料来自哪个 Blender 版本、当前会话是哪个版本：

| `drift.level` | 处置 |
|---|---|
| `none` | 直接用 |
| `minor` | 正常用，但心里知道有小版本差异 |
| `major` | **要向用户提示**「知识可能过期，建议重建索引」，不要把旧契约当成当前真相 |
| `unknown` | 不猜：语料版本或会话版本没取到 |

## 重建索引（只在维护语料时）

```sh
node buildKnowledge.js fetch     # 按 commit 拉语料（需联网）
node buildKnowledge.js build     # 归一化 + 建索引 + 写 meta.json
node buildKnowledge.js verify    # 只校验指纹，不写文件
```

`build` 会先校验源指纹，**指纹不符即中止**，不会用半份语料建出「一半新一半旧」的索引。
未识别的 RST directive 会**保留原文并登记**在 `meta.json` 的 `unparsedDirectives` 里——不会静默丢弃。
