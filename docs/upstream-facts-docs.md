# 上游离线文档知识层取证（`lab/blender_mcp`）

> 本文只回答**上游事实**。所有结论标注来源类别：**实测**（本机跑出来的数字）/ **源码**（上游文件与行号）/ **文档**（上游自带文档、注释、README）/ **规范**（外部许可或标准原文）。
> 「我们该不该照做」一律集中在 §10，只写观察与取舍建议，不代替决策。
>
> 📌 **本文里的 `§N` 指的是这份契约文档 v2.0 的旧编号，且已冻结**——它们是取证当时的坐标，不是现行章节。
> 换算表见 [`contract.md#appendix-oldrefs`](contract.md#appendix-oldrefs)；
> 需要"现在这条规则在哪"时查 [`contract.md`](../contract.md)，需要"当时为什么这么定"时查 [`HISTORY.md`](HISTORY.md)。

---

## 0. 取证方法与证据基线

### 0.1 取数路径（全部为只读下载）

| 项 | 值 | 来源类别 |
|---|---|---|
| 仓库 | `https://projects.blender.org/lab/blender_mcp`（Forgejo） | 实测 |
| 下载方式 | 本机 Python 3.14.6 + `urllib`，带 `User-Agent`，走 Forgejo `/api/v1` 与 `/archive/<ref>.zip` | 实测 |
| 代码基线 | `main` HEAD = `ff54e4d8f6b0`（committer date `2026-09-11T21:35:31+10:00`） | 实测 |
| 语料基线 | 同上 `main` HEAD；`data/api/index.rst` 第 2 行标题为 **`Blender 5.2 Python API Documentation`** | 实测 |
| 本地镜像 | `.tmp-blmcp/upstream/files2/`（78 个源文件，扁平名 `<路径>__<文件名>`）；`.tmp-blmcp/corpus/data/`（4,621 个语料文件） | — |
| 解析库 | `docutils 0.23`（从 PyPI 直接取 `py3-none-any.whl` 解包；本机 `pip` 在沙箱下不可用） | 实测 |
| 运行方式 | 只跑上游**未修改**的 `rst_parse_docs.py` / `rst_doc_search.py` / `tools/*.py`；仅补一个空的 `blmcp/__init__.py` 与 `mcp.server.fastmcp` / `mcp.types` 的最小替身（上游 `blmcp/__init__.py` 需要 `mcp`+`pyyaml`，与本主题无关） | 实测 |

**沙箱限制（影响可复现性，必须记住）**：
- `iter_doctrees_for_paths(jobs=0)`（ProcessPool）在本机被拒：`PermissionError [WinError 5]`。所以**多进程加速路径未实测**，只实测了 `jobs=1` 串行。
- 上游 `tests/test_rst_parse.py` 的 `test_iter_doctrees_*` 默认走 `jobs=0`，本机需把 `os.cpu_count()` 固定为 1 才能跑到断言；`tests/test_rst_search.py` 需把 `tempfile.TemporaryDirectory` 的清理路径放宽（沙箱拒绝其 `chmod`/`scandir`）。这两处都是**环境适配**，不改变被测逻辑。

### 0.2 版本归属更正（重要）

任务简报里写「版本 v1.0.3」。实测结果：**代码确实等价于 v1.0.3，但语料不是**。

| 对比项 | `v1.0.3` tag（`2cea8d566dde`，2026-09-11 09:55 +02:00） | `main` HEAD（`ff54e4d8f6b0`，晚约 11.5 小时） | 来源类别 |
|---|---|---|---|
| 两者之间的提交 | — | 恰好 1 个：`Update 5.2: manual & API` | 实测（`/compare/v1.0.3...main` → `total_commits=1`） |
| 语料 `.rst` 数 / 字节 | **4,279 / 15,253,971** | **4,508 / 16,039,148** | 实测 |
| `api/` `.rst` 数 / 字节 | 2,062 / 9,759,377 | 2,150 / 10,293,766 | 实测 |
| `manual/` `.rst` 数 / 字节 | 2,217 / 5,494,594 | 2,358 / 5,745,382 | 实测 |
| API 文档版本标签 | `Blender 5.1 Python API Documentation` | `Blender 5.2 Python API Documentation` | 实测 |
| `mcp/manifest.json` 的 `version` | `1.0.3` | `1.0.2`（**回退了**） | 实测（两个 ref 各取一次 `contents`） |
| `mcp/pyproject.toml` 的 `version` | `1.0.3` | `1.0.2` | 实测（git blob sha 不同） |
| `mcp/blmcp/tools_helpers/rst_parse_docs.py` | sha `ba874becfe` | 同 | 实测（git blob sha 相同） |
| `mcp/blmcp/tools_helpers/rst_doc_search.py` | sha `10a1142b34` | 同 | 实测 |
| `mcp/blmcp/tools/{get_python_api_docs,search_api_docs,search_manual_docs}.py` | 同 | 同 | 实测 |
| `tests/test_rst_parse.py`、`tests/test_rst_search.py` | 同 | 同 | 实测 |
| `_misc/update_reference_manual.py` | — | 加了 `exclude_files = {conf.py}` 的跳过逻辑 | 实测（unified diff） |
| `data/` 下内容不同的文件数 | 2,328（含改名/新增，`main` 比 tag 多 230 个 `data` 文件） | | 实测 |

**结论（源码 + 实测）**：本文所有**代码层面**结论对 `v1.0.3` 与 `main` 同时成立；所有**语料规模**数字（4,508 / 16,039,148）是 `main`（Blender **5.2**）的数字，**不是 v1.0.3（Blender 5.1）的**。`THIRD_PARTY_NOTICES.md` 若只写「v1.0.3」而语料取自 `main`，则版本声明与实际内容不符。

---

## 1. 语料结构

### 1.1 目录组织与命名

| 事实 | 证据 | 来源类别 |
|---|---|---|
| 语料根：`mcp/blmcp/data/`，其下 `api/`、`manual/`、`prompts.yml` | `mcp/blmcp/data/`；`mcp/pyproject.toml:22-30`（`package-data` 只声明这三项） | 源码 |
| `api/` 是**扁平**的：文件名 = 点分 Python 标识符 + `.rst`（`bpy.types.Scene.rst`） | 实测：`api/` 根 1,940 个 `.rst`，其中 1,911 个文件名含 >1 个点 | 实测 |
| `api/` 只有两个子目录：`bpy_types_enum_items/`（210 个 `.rst`）与 `examples/`（112 个 `.py`） | 实测 `os.listdir`；`api` 深度直方图 `{0: 1940, 1: 322}` | 实测 |
| `api/examples/*.py` 命名 = `<点分标识符>.<序号>.py`，与 RST 同目录、由 `.. literalinclude::` 引用（`aud.0.py`、`bpy.app.handlers.0.py`、`mathutils.Vector.0.py`） | 实测文件名列表；`_misc/update_reference_api.py:21-38` 把 `../examples/` 改写成 `./examples/` | 源码 + 实测 |
| `api/bpy_types_enum_items/*_items.rst` 是**枚举项**页面，命名 `<enum>_items.rst`（`bake_target_items.rst` …），不在 `bpy.` 命名空间里 | 实测文件名；检索实测命中 `api/bpy_types_enum_items/bake_target_items.rst` | 实测 |
| `manual/` 忠实镜像官方手册的目录树：22 个顶层条目，深度 0–6，**370 个 `index.rst`** | 实测：顶层为 `addons/ advanced/ animation/ compositing/ contribute/ editors/ files/ getting_started/ glossary/ grease_pencil/ interface/ modeling/ movie_clip/ physics/ render/ scene_layout/ sculpt_paint/ troubleshooting/ video_editing/` + `copyright.rst` + `index.rst` + `versions.rst` | 实测 |
| `manual/` 里**没有**非 `.rst` 文件（本快照）；`update_reference_manual.py` 虽复制 `.py`，但语料里 0 个 | 实测：`manual` 非 rst 文件数 = 0 | 实测 |
| `api/index.rst` 与 `manual/index.rst` 存在；`bpy_types_enum_items/index.rst` 也存在 | 实测 | 实测 |
| 目录组织规则**没有代码强制**：`iter_rst_paths()` 只是 `os.walk` + 过滤 `.rst` | `mcp/blmcp/tools_helpers/rst_doc_search.py:172-194` | 源码 |

### 1.2 单个 RST 的典型结构

**API 页（`api/`）**——实测样本 `api/bpy.types.SpaceConsole.rst`（4,317 B）：

```
SpaceConsole(Space)            <- 标题行（纯文本，非 directive）
=================              <- '=' 下划线

.. currentmodule:: bpy.types   <- 模块上下文

base classes --- :class:`bpy_struct`, :class:`Space`   <- 纯散文 + :class: role

.. class:: SpaceConsole(Space)  <- API 定义 directive
   Interactive Python console   <- 缩进正文
   .. attribute:: font_size     <- 嵌套定义 directive
```

**手册页（`manual/`）**——实测样本 `manual/movie_clip/masking/index.rst`：

```
.. _bpy.types.Mask:            <- 交叉引用标签
.. _bpy.ops.mask:

###########                    <- overline + underline 标题
  Masking
###########

.. toctree::                   <- 导航
   :maxdepth: 2
   introduction.rst
```

**directive 使用频次（全 4,508 文件，实测统计）**：

| directive | 次数 | directive | 次数 |
|---|---|---|---|
| `hlist` | 4,243 | `index` | 846 |
| `function` | 2,821 | `note` | 640 |
| `figure` | 1,964 | `toctree` | 584 |
| `class` | 1,853 | `list-table` | 368 |
| `currentmodule` | 1,787 | `seealso` | 283 |
| `reference` | 1,517 | `tip` | 263 |
| `include` | 245 | `code-block` | 138 |
| `module` | 133 | `data` | 113 |
| `rubric` | 109 | `literalinclude` | 86 |
| `warning` | 71 | `peertube` | 63 |
| `hint` | 53 | `important` | 47 |
| `container` | 28 | `todo` | 21 |
| `parsed-literal` | 13 | `highlight` | 12 |
| `admonition` | 9 | `code` | 6 |
| `math` | 5 | `only` | 3 |
| `details` | 45（出现在 15 个文件里，见 §2.4） | | |

**section 下划线字符频次（实测）**：`=` 6,642 / `-` 6,360 / `*` 3,721 / `#` 910 / `^` 326 / `+` 61 / `"` 7 / `~` 1。

**role 使用频次（实测，前 6）**：`:class:` 113,565 / `:ref:` 6,192 / `:doc:` 3,643 / `:kbd:` 3,487 / `:bl-icon:` 1,945 / `:menuselection:` 1,806。

**代码块**（实测，区分「行首」与「任意缩进处」）：

| 写法 | 行首出现 | 任意位置出现 |
|---|---|---|
| `.. code-block::` | 138 | 183（45 处在缩进内） |
| `.. literalinclude::` | 86 | 109（23 处在缩进内） |
| `.. code::` | 6 | 6 |

另有大量 `::` 字面块（docutils `literal_block`）。三种写法都不是缺口：`code-block` 走 stub 表的 `_directive_ignore`（内容保留成一段），`literalinclude` 走 `_DirectiveLiteralInclude`（保留 `:lines:` 等选项），**`code` 是 docutils 内建**（实测 `.. code:: python` 在 `strict=True` 下正常解析成 `literal_block`）。
同一实测也确认 `rubric`（109 处）、`list-table`（368 处）、`figure`（1,964 处）、`container`（28 处）都是 docutils 内建，**不是**缺口。→ 全语料**唯一**的未知 directive 是 `.. details::`（见 §2.4）。

**API 页的标题层级**：`=` 用于**文件级标题**（实测样本 `SpaceConsole(Space)`），`-`/`*`/`#` 用于正文小节；类成员大量用**缩进 directive**（`.. attribute::`）而非标题，因此 section 栈在 `api/` 页面里通常只有 1 层。

---

## 2. RST 解析（`rst_parse_docs.py`，872 行）

### 2.1 用不用 docutils

**用，而且是唯一的解析路径。** 没有任何自写 RST 词法分析器。

- `import docutils` / `docutils.parsers.rst` / `docutils.utils` / `directives, roles`：`rst_parse_docs.py:41-44`
- 入口 `_rst_to_doctree(text, filename, *, strict=False)`：`rst_parse_docs.py:347-351`（`docutils.parsers.rst.Parser()` + `docutils.utils.new_document()`）
- 模块 docstring 自述「Parses RST with docutils, registering stub directives and roles so the Sphinx-style Blender docs loads cleanly. The stub code is taken from the Blender User Manuals: `./tools/check_source/check_spelling.py`」：`rst_parse_docs.py:5-19`（**文档**）
- 依赖声明未固定版本：`mcp/pyproject.toml:10-14` 只写 `"docutils"`。（实测用的 0.23，与上游声明的版本范围不冲突，但**上游未锁版本** → 见 §9 存疑）

### 2.2 stub 注册表（解析器「理解」哪些语法）

`_register_stubs()`：`rst_parse_docs.py:190-299`，**模块 import 时执行一次**（`:299`）。三档处置：

| 档位 | 实现 | directive 名单 | 行为 |
|---|---|---|---|
| **保留（API 定义）** | `_DirectivePreserve`（`:89-113`） | `attribute, class, classmethod, currentmodule, data, decorator, exception, function, method, module, property, staticmethod`（`:198-212`） | 生成 `container`，`container["directive_name"] = name`，第一个子节点是 `literal_block(".. name:: <args>")`，**内容递归 `nested_parse`** → 嵌套 `.. attribute::` 仍可寻址 |
| **保留（显式选项）** | `_DirectiveLiteralInclude`（`:116-170`） | `literalinclude`（`:216`） | 继承上者，但把 `:lines:`/`:language:`/`:dedent:` 等 18 个 option 重新序列化进签名块（`:126-147`），保证后续从 doctree 反扫 `literalinclude` 时不丢 `:lines:` |
| **保留正文、丢签名** | `_directive_ignore`（`:59-73`） | `admonition, attention, caution, code-block, danger, deprecated, error, hint, important, note, reference, seealso, tip, versionadded, versionchanged, warning`（`:220-240`） | 返回 `doctest_block`（内容保留成一段） |
| **整体丢弃** | `_directive_ignore_recursive`（`:76-86`） | `autoclass, automodule, autosummary, contents, glossary, highlight, hlist, include, index, only, parsed-literal, peertube, raw, sectionauthor, toctree, todo, todolist, vimeo, youtube`（`:243-264`） | 返回 `[]`（子树消失） |
| **role 保留可见文本** | `_RoleIgnore` + `_role_ignore`（`:173-187`），`roles.register_local_role`（`:296`） | `abbr, attr, bl-icon, class, const, data, doc, exc, file, func, guilabel, kbd, math, menuselection, meth, mod, ref, term`（`:276-296`） | 保留 role 内文本（`:class:`bpy.types.BlendData` 里的标识符变成可检索文本） |

`syntax_highlight=False`、`line_length_limit=10_000_000`、`report_level=5`、`halt_level=3 if strict else 5`、每次调用新建 `StringIO` 警告流：`_default_settings()` `rst_parse_docs.py:306-344`。

### 2.3 输出形状

`__all__`（`rst_parse_docs.py:21-31`）就是公开 API 面：

| 函数 | 签名 | 返回 | 来源 |
|---|---|---|---|
| `data_dir()` | `() -> str` | `<repo>/mcp/blmcp/data` | `:49-53` |
| `split_paragraphs_for_path(path)` | `-> list[str]` | **段落字符串列表**；标题被合并进其后的第一个内容节点（标题不单独占位） | `:489-507` |
| `split_paragraphs_from_text(path, mtime, text)` | `-> list[str]` | 同上，复用调用方已读文本 | `:472-486` |
| `split_paragraphs_with_sections_for_path(path)` | `-> list[tuple[str, tuple[str, ...]]]` | **（段落文本，section 标题栈）** = 面包屑 | `:642-659` |
| `split_paragraphs_with_sections_from_text(path, mtime, text)` | 同上 | | `:623-639` |
| `iter_doctrees_for_paths(paths, *, jobs=0, strict=False)` | `-> Iterator[tuple[str, doctree]]` | 原始 doctree（调用方自行遍历） | `:713-738` |
| `doctree_for_path(path)` | `-> doctree` | 单文件 doctree | `:796-801` |
| `find_definition_in_doctree(doctree, name)` | `-> str \| None` | 渲染后的 RST 块（签名行 + 正文段落，`\n\n` 连接） | `:770-793` |
| `list_doctree_definitions(doctree)` | `-> list[str]` | **排序去重**的顶层 API 定义标识符（module/currentmodule 被过滤） | `:818-847` |

内部关键函数：`_walk_paragraphs`（`:391-445`，判段规则）、`_walk_paragraphs_with_sections`（`:514-597`，带栈版本）、`_container_signature_name`（`:745-767`，从签名块按 `:: ` 与 `(` 切出标识符）、`_find_definition`（`:850-872`，递归匹配）、`_DEFINITION_DIRECTIVES`（`:804-815`，10 个名字，**不含 `module`/`currentmodule`**）。

**「段落」的定义（源码 `:391-445`）**：不是 RST 段落，而是**可寻址单元**——散文段落、directive 块（作为一个单元）、literal/doctest 块、列表项各算一段。`system_message` 节点被丢弃（`:420-421`）。遍历结束后残留的孤立标题会作为最后一段输出（`:444-445`）。

### 2.4 解析覆盖缺口（实测，**这是我们要自己处理的部分**）

| 事实 | 证据 | 来源类别 |
|---|---|---|
| 语料里有 `.. details::`（**未注册**）：15 个文件、45 处 | 实测 `files containing '.. details::': 15`；清单：`api/blf.types.rst`、`api/bmesh.types.rst`、`api/bpy.props.rst`、`api/bpy.types.ContextTempOverride.rst`、`api/bpy.types.GeometrySet.rst`、`api/bpy.types.bpy_prop.rst`、`api/bpy.types.bpy_prop_array.rst`、`api/bpy.types.bpy_prop_collection.rst`、`api/bpy.types.bpy_struct.rst`、`api/bpy.utils.previews.rst`、`api/bpy_extras.anim_utils.rst`、`api/gpu.types.rst`、`api/idprop.types.rst`、`api/imbuf.types.rst`、`api/mathutils.rst` | 实测 |
| **非 strict 模式**：文本不丢（作为一段原始块保留），但内部的 `.. method:: __enter__` **不会被解析成定义**，`list_doctree_definitions` 看不到它们 | 实测：`api/blf.types.rst` 段落 3 段，含 `__enter__` / `__exit__` / `Special Methods`；`list_doctree_definitions` 只返回 `['BLFImBufContext']`。手动把 `details` 注册为 `_DirectivePreserve` 后段落变成 6 段 | 实测 |
| **strict 模式直接抛错**：上游自己的 `tests/test_rst_parse.py` 断言「语料里没有未知 directive/role」，**在 5.2 语料上失败** | 实测：`SystemMessage: .../api/blf.types.rst:13: (ERROR/3) Unknown directive type "details"`；`tests/test_rst_parse.py:77-92`（`strict=True`）、`:106-116` | 源码 + 实测 |
| 上游测试实测结果：`test_rst_parse.py` **7 个测试，1 个 error**（就是 `test_iter_doctrees_api_docs`）；`tests/test_rst_search.py` **53 个测试全部通过** | 实测（见 §0.1 沙箱适配说明） | 实测 |
| `manual/` 在 strict 下**无**未知 directive（只有 api 失败） | 实测 | 实测 |

**推论（源码）**：`strict=True` 只在测试里用，生产路径 `split_paragraphs_from_text`（`:483`）与 `doctree_for_path`（`:801`）都是 `strict=False`，因此生产上永不报错，代价是**静默地不解析未注册的 directive**。这意味着上游解析器的覆盖缺口会**累积**（5.1→5.2 就多出一个 `details`）。

### 2.5 缓存

| 事实 | 证据 |
|---|---|
| 两个**进程内** LRU：`_PARAGRAPH_CACHE`（段落）与 `_PARAGRAPH_SECTION_CACHE`（段落+section），键均为 `(path, mtime)`，上限 `_PARAGRAPH_CACHE_MAX = 8192` | `rst_parse_docs.py:453-469`、`:600-620`；实测 `CACHE_MAX = 8192` |
| 缓存**不落盘**、不跨进程；`ProcessPoolExecutor` worker 各自冷启动 | `:674-710` |
| 4,508 个文件 < 8,192 → 一次全量检索后两个缓存都能装下整个语料 | 实测（4,508 < 8,192） |

---

## 3. 检索算法（`rst_doc_search.py`，503 行）

### 3.1 是否持久化索引

**没有索引文件，每次查询现建。** 证据：

- 模块 `__all__` 只有 `SEARCH_TOOL_DESCRIPTION, iter_rst_paths, search, with_doc`（`rst_doc_search.py:14-19`）——没有任何建索引/加载索引的 API。
- `search()` 每次调用都 `iter_rst_paths(scope)` 走一遍 `os.walk`（`:279`），并对**每个文件** `os.stat` + `open` + 全量 `read`（`:283-285`）来累积 document frequency。
- 文档字符串明说：「Document frequencies are computed per query from one corpus walk (**no cache**)」——`rst_doc_search.py:227`（**文档**，与源码一致）。
- 实测佐证：同一进程内连续两次同一查询，第二次仍需 **0.346–0.378 s**（只省掉段落解析，省不掉全语料读盘）。

### 3.2 索引/数据结构（每次查询在内存里现建）

无倒排表。每次查询构造：

| 结构 | 内容 | 行号 |
|---|---|---|
| `patterns` | 每个 query token 编译成 1 个大小写不敏感正则，按需加 `\b` | `:139-156`、`:267` |
| `n_files` | 该 scope 成功读到的文件数 | `:274,288` |
| `per_token_df` | 每个 token 的**文档频率**（文件级，不是段落级） | `:275,302-304` |
| `pre_hits` | `list[(rel, 段落下标, 该文件的段落列表, 每 token 出现次数)]` | `:276-278,330` |
| `idfs` | 平滑 IDF | `:339-342` |
| `query_bonus_tokens` | 把 query token 按 `[-_./\s]+` 再切，子 token → 所属整 token 的 IDF（冲突取大） | `:350-356` |

**段落匹配面（match surface）**：`body + 去扩展名的相对路径 + " > ".join(section_stack)`（`:289-329`）。**AND over tokens**，任意顺序、任意间距，**不支持正则/短语**（`SEARCH_TOOL_DESCRIPTION:44-50`）。

**两层过滤**：
1. **文件级预筛** `:308-312`：所有 token 必须在 `body` 或 `path` 中至少命中一次，否则跳过整个文件（不解析）。实测预筛极狠：`api` scope 下 `IntProperty` → **3/2150** 文件、`bpy.ops.mesh` → **2/2150**；`manual` scope 下 `subdivision surface` → **43/2358**。
2. **段落级 AND** `:324-329`：每个 token 必须命中 body / path / title 三者之一。

### 3.3 打分公式（源码，逐项）

```
tfidf_score = Σ_i  count_i(段落) × idf_i                                 # :365
idf_i       = ln( (n_files + 1) / (df_i + 1) ) + 1                       # :339-342 平滑，恒 ≥1
path_bonus  = 10  × Σ_{ (q,idf) ∈ queryBonusTokens 且 q ∈ 该文件路径组件 }  idf   # :373-379
title_bonus = 15  × Σ_{ title ∈ section_stack } Σ_{ (q,idf) ∈ queryBonusTokens 且 q ∈ title 词 }  idf  # :388-395
score       = round(tfidf_score + path_bonus + title_bonus)              # :433-434 只在折叠完成后 round 一次
```

- `queryBonusTokens`：把每个 query token 按 `_WORD_SEP_RE = r"[-_./\s]+"` 再切（`api/bpy.data` → `{api, bpy, data}`），子 token → 所属整 token 的 idf，**冲突取大**（`:350-356`）。
- `path_bonus` 每个**文件**只算一次并复用到该文件的所有 hit（`:366-368`，`rel != last_file` 才重算）。
- `title_bonus` 每层标题**各算一次**（同一词出现在多层会累加）（`:380-395`）。
- 权重常量：`_PATH_MATCH_WEIGHT = 10`（`:103`）、`_TITLE_MATCH_WEIGHT = 15`（`:111`）、`_DRILL_IN_MIN_CONTEXT = 3`（`:120`）。
- 排序：`hits.sort(key=lambda h: -h["score"])`，Python 稳定排序 → 同分保持遍历序（`:437`）。
- 折叠：若 `rel == last_file` 且 `idx <= last_idx + 2*context` 且 `section_stack == last_section`，则并入上一个 hit（分数相加、`text` 不扩）（`:396-408`）。**section 一变就新起一个 hit** → 面包屑与 title bonus 严格对应簇范围。
- `score` 在返回时是 **int**（`:433-434`）。

### 3.4 截断/上限/参数校验

| 行为 | 代码 | 实测 |
|---|---|---|
| `max_results = max(1, max_results)`（**不报错**，静默抬到 1） | `:262` | — |
| `truncated = len(hits) > max_results`，超出则 `hits[:max_results]` | `:439-441` | `max_results=20` 时 `"truncated": true` |
| `context < 0` → `ValueError("context must be non-negative")` | `:260-261` | 实测抛 `ValueError` |
| `scope` 不在 `{"api","manual"}` → `ValueError("scope must be one of: api, manual")` | `:183-184` | 实测抛 `ValueError` |
| 查询全部由 stop-word 组成 → `{"hits": [], "truncated": False}` | `:263-265` | 实测 `"the a of to"` → 空 |
| 无命中 → `{"hits": [], "truncated": False}` | `:332-333` | 实测 `"zzzznotpresent"` → 空 |
| `index` 传越界 → `{"hits": [], "truncated": False}`（**不报错**） | `:459-460` | 实测 `index=99` → 空 |
| `index` 命中 → `{"hits":[单个 hit], "truncated": False}`，`text` 扩到 section 内至少 3 段、`max(3, context)`，**不越出 `section_stack` 前缀** | `:449-498` | 实测 `index=0` → `n=1`，字段 `['breadcrumb','index','path','score','text']` |
| 内部字段 `_seed_idx` 从公开响应剥除 | `:497,501-502` | 实测字段列表无 `_seed_idx` |

**stop-word 表**（`:130-136`，**39 个**，实测 `len == 39`）：`a an and any are as at be by can do does for from how if in is it its not of on or that the this to was were what when where which why will with you your`。只作用于**查询侧**，语料正文不动。

**正则加词边界**：token 首/尾是 `\w` 时加 `\b`（`:152-155`）→ `obj` 不会命中 `object`；`bpy.data` 仍可命中（`.` 天然是边界）。测试 `TestWordBoundaryMatching`（`tests/test_rst_search.py:1136-1214`）。

### 3.5 「我们自己在 Node 侧重实现需要复刻哪几个步骤」

按 `search()` 的控制流，**最小可复刻清单**（每步给上游行号）：

1. `iter_rst_paths(scope)`：`os.walk` + 只收 `.rst`，`rel` **一律正斜杠**、按 `(dir, file)` 排序（`:172-194`，Windows 归一化在 `:159-169`）。
2. query 切分（空白）→ 去 39 个 stop-word → 全空则短路（`:263-265`）。
3. 每 token 编译 CI 正则 + 首尾 `\b`（`:139-156`）。
4. 一次全语料扫描，逐文件记 `n_files` 与 `df`（文件级：body 或 path 命中即计），并做文件级预筛（`:279-312`）。
5. 仅对通过预筛的文件做**段落 + section 栈**切分（`:313-315`）→ 这一步是唯一需要 RST 解析的地方。
6. 段落级 AND（body 计数 > 0 或 path 命中或 title 命中）（`:316-330`）。
7. 平滑 IDF（`:339-342`）；query 子 token → IDF 映射（`:350-356`）。
8. 逐 pre_hit 算 `tfidf + path_bonus(10×) + title_bonus(15×)`，按 `(file, idx, section_stack)` 折叠（`:363-428`）。
9. `round` → 降序稳定排序 → 截断 → 重新编号 `index`（`:433-447`）。
10. `index` 钻取：按 section 前缀扩窗（`:449-498`）。
11. 返回 `{"hits":[{path,text,breadcrumb,index,score}], "truncated":bool}`。

**不必复刻**的：docutils 全量语义、`_TITLE_MATCH_WEIGHT` 之类的具体数值（是调参产物，非契约）、`process pool`。

---

## 4. 工具契约（三个知识工具）

> 全部为 `@mcp.tool(annotations=ToolAnnotations(..., readOnlyHint=True))`。**注意**：`readOnlyHint` 是上游自述，本插件不采信任何上游 hint（I9）。

### 4.1 `get_python_api_docs`

- 注册：`mcp/blmcp/tools/get_python_api_docs.py:363-370`；docstring 即 MCP 描述（`:371-421`）。
- 参数：**只有一个** `identifier: str`（无默认值，`inspect.signature` 实测 `(identifier: str) -> dict[str, object]`）。
- 只读 `data/api/`（`api_path = os.path.join(data_dir(), "api")`，`:422`）；**没有**对应 `manual` 的取正文工具。
- 常量：`_SUMMARY_CHAR_THRESHOLD = 32 * 1024`（`:40`）；`_DOC_EXT = ".rst"`（`:24`）。

**分派顺序与返回形状（源码 `:425-518`）**：

| `kind` | `found` | 触发条件 | 额外字段 |
|---|---|---|---|
| `namespace` | `true` | `identifier == "*"` → `_list_top_level_modules()`；`X.*` → `_list_direct_child_identifiers(X)` | `submodules: list[str]` |
| `exact` | `true` | `<identifier>.rst` 存在且 ≤32 KB | `content: str`（原文）、`examples: [{path, content}]` |
| `exact`（超限） | `true` | 同上但 >32 KB | `content` 换成摘要（首行 `File too large to inline (N KB, threshold 32 KB); definitions listed below. Query individual members as \`id.<name>\`:` + `- <name>` 列表）、`examples: []` |
| `namespace` | `true` | 无 `<identifier>.rst` 但有 `<identifier>.<child>.rst` | `submodules` |
| `definition` | `true` | 从右往左剥组件，找到父 RST 且 `find_definition_in_doctree(doctree, tail)` 命中 | `content`（渲染块，**含 `.. function:: IntProperty(` 这类签名行**）、`examples` |
| `partial` | `false` | 父 RST 找到了但 tail 没定义（**立刻返回，不再往上剥**） | `parent: str`、`available: list[str]`、`submodules: list[str]`（按 tail 字符子集过滤 + `difflib.SequenceMatcher` 相似度降序） |
| `suggestions` | `false` | 之前都不中，但 identifier 作为**点分组件**出现在别的文件里 | `suggestions: list[str]`（按深度分桶，**短前缀命中会剪掉后代**） |
| `missing` | `false` | 都不中 | 无 |

**实测（`main` 语料，工具函数直调）**：

| 输入 | kind | 附加 |
|---|---|---|
| `*` | `namespace` | 10 项：`bl_math blf bmesh bpy bpy_extras gpu gpu_extras idprop imbuf mathutils` |
| `bpy.*` | `namespace` | 9 项：`bpy.app bpy.context bpy.data bpy.msgbus bpy.ops bpy.path bpy.props bpy.types bpy.utils` |
| `bpy.props` | `exact` | 43 KB → 摘要，`content` 341 B |
| `bpy.ops.object` | `exact` | **148 KB** → 摘要，`content` 5,473 B，耗时 0.147 s |
| `bpy.props.IntProperty` | `definition` | `content` 3,905 B |
| `bpy.ops.object.delete` | `definition` | `content` 352 B |
| `bmesh.types.BMesh.faces` | `definition` | `content` 90 B（`bmesh.types.BMesh.rst` 不存在 → 剥到 `bmesh.types` + tail `BMesh.faces`，命中） |
| `mathutils.Vector.dot` | `definition` | `content` 202 B |
| `app` | `suggestions` | 1 项 `['bpy.app']`（`bpy.app.handlers` 等后代被剪掉） |
| `bpy.types.Scne` | `partial` | `parent=bpy.types`，`available=[]`，`submodules=285` |
| `bpy.types.Scene.frame_current` | **`partial`** | `parent=bpy.types.Scene`，`available=['Scene']`，`submodules=[]` |
| `bpy.types.Object.location` / `bpy.types.Mesh.vertices` / `bpy.types.Scene.render` / `bpy.types.Scene.render.fps` | **`partial`** | 同上形状 |
| `bpy.nope` | `missing` | 无 content 键 |
| `bpy.app.handlers` | `exact` | `content` 9,587 B + **`examples` 3 条**：`examples/bpy.app.handlers.{0,1,2}.py`，第一条内容以 `import bpy` 开头（`.. literalinclude::` 的 `:lines:` 已生效） |
| `bpy.app` | `exact` | `content` 11,915 B，`examples` **0 条**（该页无 `literalinclude`） |

**这不是「did you mean」字段，而是三种不同的降级 kind**：`suggestions`（名字是别处的组件）、`partial`（父页存在、成员名不对，附 `available` + 近邻 `submodules`）。**没有** `did_you_mean`、没有 `error`、没有 `isError`。

**⚠️ 实测发现的行为缺口（源码 + 实测）**：`get_python_api_docs("bpy.types.Scene.frame_current")` 返回 `partial` 而**不是** `definition`，尽管同一文件上 `find_definition_in_doctree(doctree, "Scene.frame_current")` **能**命中（实测 149 B）。
原因（源码 `:476-504` + `:850-872`）：`_find_definition` 只在**当前层**寻找名字等于 `parts[0]` 的 directive container；对非 container 子节点才用**完整 parts** 递归。因此
- 深 1（`bpy.props.IntProperty`，顶层 directive）→ 通过；
- 深 2 且**存在同名 per-class 文件**（`bpy.types.Scene.rst` 存在）→ 剥 1 层得到 `tail="frame_current"`，在 `Scene.rst` 里 `frame_current` 是**类内嵌套**而非顶层 → `None` → **立刻**返回 `partial`（不再尝试剥第 2 层）。
- 深 2 但**不存在 per-class 文件**（`bmesh.types.BMesh.rst` 不存在）→ 剥到 `prefix="bmesh.types"`、`tail="BMesh.faces"` → 命中。
上层 `tests/test_mcp_server.py:742-1041` 只覆盖了 `bpy.props.IntProperty` 与 `bpy.ops.object`，**没有覆盖类成员的深 2 路径**，所以这个缺口在上游测试里是盲区。**声明**：这是当前 `main`（=v1.0.3 代码 + 1 个语料提交）的行为；我未逐版本回溯该缺口何时引入。

### 4.2 `search_api_docs` / `search_manual_docs`

- 注册：`search_api_docs.py:20-43`、`search_manual_docs.py:20-43`，两个文件结构完全相同，只差 `scope` 与 `scope_name`。
- 参数（`inspect.signature` 实测）：
  - `query: str`（必填）
  - `max_results: int = 20`
  - `context: int = 0`（**对称**窗口，两侧各 `context` 段）
  - `index: int | None = None`
- 返回：`{"hits": [{"path": str, "text": str, "breadcrumb": str, "index": int, "score": int}], "truncated": bool}`
  - `path` 相对 `data/`，**正斜杠**，含 `api/` 或 `manual/` 前缀（实测 `api/bpy.ops.mesh.rst`）。
  - `breadcrumb`：`" > "` 连接的 section 路径；无 section 时是 **空字符串**（`:415-417`）。
  - `text`：命中段落 + `context` 段（`:409-413`）；钻取模式下扩到 section 内。
- 工具的**描述文本**由 `SEARCH_TOOL_DESCRIPTION.format(scope_name=...)` 通过 `@with_doc` 注入 `__doc__`（`rst_doc_search.py:31-58,61-75`；`search_api_docs.py:27`、`search_manual_docs.py:27`）。`scope_name` 分别为 `"Python API reference"` 与 `"user manual"`。
- 实测响应体积（`max_results=20`）：api `bpy.ops.mesh` 14,367 B / api `how to bake` 16,607 B / api `IntProperty` 8,411 B / manual `subdivision surface` 12,024 B。→ **单次响应 8–17 KB≈2–4K token**。

### 4.3 上游测试对契约的锁定

`tests/test_mcp_server.py:742-1041`（`TestGetPythonAPIDocs`）逐 kind 断言：`bpy.app → exact`、`* → namespace` 且 `index/change_log/info_overview` 被过滤、`bpy.* → namespace` 且**只要直接子级**、`bmesh.*` 强制 namespace、`bpy → namespace`、`app → suggestions`、`bpy.props.IntProperty → definition`、`this.module.doesnt.exist → missing` 且**无 `content` 键**、`bpy.props.IntegerProperty → partial`、`bpy.ops.object → exact`（摘要含 `- delete` 行）、`bpy.types.Scne → partial`（`submodules[0] == "bpy.types.Scene"`）、`bpy.app.handlers → examples` 3 条且第一条以 `import bpy` 开头。搜索契约由 `tests/test_mcp_server.py:270-319` 锁定。**（源码）**

---

## 5. 规模与成本（全部实测）

### 5.1 语料规模（`main` = Blender **5.2**）

| 项 | 值 |
|---|---|
| `api/` 文件数 / 字节 | **2,150** / **10,293,766** |
| `manual/` 文件数 / 字节 | **2,358** / **5,745,382** |
| **`.rst` 合计** | **4,508** / **16,039,148** |
| `api/examples/*.py` | 112 / 184,547 |
| `data/prompts.yml` | 1 / 6,235 |
| `data/` 合计 | 4,621 / 16,229,930 |

（`v1.0.3` / Blender 5.1 对照：4,279 / 15,253,971；api 2,062 / 9,759,377；manual 2,217 / 5,494,594。）

**文件体积分布（`.rst`，实测）**：最大 **`api/bpy.ops.object.rst` 151,917 B（148 KB）**；其后 `bpy.ops.mesh.rst` 113,093、`bpy.ops.wm.rst` 103,512、`bpy.ops.node.rst` 93,180、`bpy.ops.sequencer.rst` 82,085、`bmesh.ops.rst` 71,454。`>32 KB` 的 **26 个**；`>8 KB` 的 **270 个**；`<1 KB` 的 **1,172 个**；中位数 **2,642 B**。

### 5.2 解析成本（实测，`docutils 0.23`，Python 3.14.6，Windows，本机 SSD，单进程）

| 操作 | 时间 |
|---|---|
| `iter_rst_paths` 枚举 4,508 个路径 | **0.064 s** |
| `iter_doctrees_for_paths(jobs=1)` 解析全部 4,508 个文件 | **35.54 s**（≈ **7.9 ms/文件**） |
| `split_paragraphs_with_sections_for_path` 单遍全量（api+manual） | **32.80 s**（api 18.59 + manual 14.21） |
| `split_paragraphs_for_path` **且** `split_paragraphs_with_sections_for_path` 各跑一遍（两个独立缓存 → 每文件解析 2 次）+ 统计 | **70.19 s** |
| `iter_doctrees_for_paths(jobs=0)`（多进程） | **未实测**：沙箱 `PermissionError [WinError 5]` |
| 最慢单文件 | `manual/contribute/manual/guides/icons.rst` 0.366 s（4 段）、`api/mathutils.rst` 0.262 s（515 段）、`api/bpy.ops.object.rst` 0.231 s（251 段） |

### 5.3 归一化产物体积（实测）

| 产物 | 全量 | api | manual |
|---|---|---|---|
| 段落数 | **56,340** | 29,865 | 26,475 |
| 段落正文原始字节（纯文本，UTF-8） | **10,147,325 B（9.7 MiB）** | 5,448,960 | 4,698,365 |
| `JSON{path: [段落]}` | **10,889,855 B** | — | — |
| `JSON{path: [(段落, section栈)]}`（带面包屑） | **12,966,875 B（12.4 MiB）** | 6,945,241 | 6,021,634 |

**压缩比**：16,039,148 B 原文 → 10,147,325 B 纯段落正文（**0.63×**）→ 12,966,875 B 带面包屑 JSON（**0.81×**）。即：**归一化省不到四成字节**，主要来自丢掉的缩进、空行与 RST 标记；被 `_directive_ignore_recursive` 整体丢弃的导航类 directive（`hlist` 4,243 处、`toctree` 584 处等）对字节量的贡献**我未单独计量**（存疑，见 §9-8）。

### 5.4 检索成本（实测，冷进程）

| scope | query | 冷耗时 | 命中数 | `truncated` | 响应字节 | 实际解析文件数 / 总文件 |
|---|---|---|---|---|---|---|
| api | `bpy.ops.mesh` | **0.494 s** | 20 | true | 14,367 | **2 / 2150** |
| api | `how to bake` | **1.148 s** | 20 | true | 16,607 | — |
| api | `IntProperty` | **0.393 s** | 18 | false | 8,411 | **3 / 2150** |
| manual | `subdivision surface` | **1.216 s** | 20 | true | 12,024 | **43 / 2358** |
| manual | `Geometry Nodes Separate XYZ` | **0.753 s** | 1 | false | 1,730 | — |
| manual | `subdivision surface`（同进程第二次） | **0.378 s** | 20 | true | — | — |
| api | `IntProperty`（同进程第二次） | **0.346 s** | 18 | true | — | — |

**成本归因（实测 + 源码）**：瓶颈是**每次查询把整个 scope 的 16 MB 全部读一遍**（`:283-285`）来算 DF，而不是解析。段落解析被预筛压到 2–43 个文件，几乎免费。**热缓存只省解析、不省读盘**（第二次仍 0.35 s）。

### 5.5 上游有没有性能测试 / 缓存基准

- `Makefile:87-98` 的 `test` / `test_rst_parse` / `test_rst_search` 目标里**没有** performance 标记、没有计时断言（**源码**）。
- 唯一带性能数字的是注释：`rst_parse_docs.py:729-730` 声称 doctree 跨进程 pickle「benchmarked at ~7x faster than re-parsing in the destination」（**文档**，我**未复核**，因为多进程在本机不可用）。
- `rst_parse_docs.py:322-323` 声称「Per-call cost is a few microseconds and is dominated by the parse itself」（**文档**）。

---

## 6. 许可

### 6.1 仓库级

| 事实 | 证据 | 来源类别 |
|---|---|---|
| 仓库根**没有** `LICENSE` / `COPYING` / `NOTICE` 文件 | 实测：`main` tree 根条目只有 `.gitignore Makefile _misc addon chat_client mcp readme.md readme_local_llm.rst readme_tools.rst tests` | 实测 |
| 许可声明只在 `mcp/manifest.json`：`"license": "GPL-3.0-or-later"` | `mcp/manifest.json:25` | 源码 |
| MCPB manifest 还声明 `"version": "1.0.2"`（`main`）/ `1.0.3`（tag）、`"server": {"type": "uv", "entry_point": "blmcp/__init__.py"}`、`"repository": {"url": "https://projects.blender.org/lab/blender_mcp"}` | `mcp/manifest.json:4,14-24,34-37` | 源码 |
| 每个 `.py` 源文件首两行是 `# SPDX-FileCopyrightText: 2026 Blender Authors` / `# SPDX-License-Identifier: GPL-3.0-or-later` | 实测（我读过的 8 个源文件全部如此）；`mcp/blmcp/tools_helpers/rst_parse_docs.py:1-3` | 源码 + 实测 |
| Forgejo 仓库元数据里 `license` 字段为 `null` | 实测 `/api/v1/repos/lab/blender_mcp` | 实测 |

### 6.2 两份语料的来源与许可

**`data/api/`（Blender Python API 参考）**

| 事实 | 证据 | 来源类别 |
|---|---|---|
| 语料从「a Blender API reference build」拷贝而来；脚本只校验 `<api_dir>/bpy.app.rst` 存在，并从 `<api_dir>/../examples` 拷 `*.py` | `_misc/update_reference_api.py:8,41-66,86-94` | 源码 |
| 唯一的内容改写：把 `.. literalinclude:: ../examples/` 改成 `./examples/` | `_misc/update_reference_api.py:21-38` | 源码 |
| 脚本里**没有**任何上游 URL / commit / 分支 / 版本记录 | 通读 `_misc/update_reference_api.py`（103 行） | 源码 |
| 语料自带版本标签：`Blender 5.2 Python API Documentation`（`main`）/ `5.1`（v1.0.3） | `mcp/blmcp/data/api/index.rst` 第 1–3 行（overline / 标题 / underline） | 实测 |
| **`.rst` 文件正文首 8 行里没有任何许可/SPDX/来源声明** | 实测：全 4,508 文件扫首 8 行，`spdx` 命中 0、`license` 命中 3、`gpl|gfdl` 命中 6（都在 `manual/copyright.rst`、`manual/getting_started/about/license.rst` 等少数页） | 实测 |
| 该目录是**生成物**：脚本称之为「a Blender API reference build」，并要求其中存在 `bpy.app.rst`，示例放在 `<api_dir>/../examples`（`_misc/update_reference_api.py:41-66`）。**具体由哪个仓库/目标生成，脚本未写**；「Sphinx 构建产物」是**推断**（RST 里全是 Sphinx 专有 directive 与 role），**未核实生成命令** | `_misc/update_reference_api.py:8,41-66,86-94`（源码）+ 推断 | 源码 + 存疑 |
| **推断的上游许可**：Blender Python API 文档随 Blender 源码分发，Blender 本体是 GPL（见下条手册页的原文声明）。**但仓库内没有逐文件或目录级声明**——精确的上游许可结论**存疑**（见 §9-1） | — | 存疑 |

**`data/manual/`（Blender 用户手册）**

| 事实 | 证据 | 来源类别 |
|---|---|---|
| 从「a Blender manual checkout」的 `manual/` 子目录拷贝 `.rst` 与 `.py`（本快照实际只有 `.rst`） | `_misc/update_reference_manual.py:9,28-63` | 源码 |
| `main` 版额外跳过 `manual/conf.py`；`v1.0.3` 版**不跳过**（唯一代码差异） | `_misc/update_reference_manual.py:46-49,56-58`；v1.0.3 diff | 源码 + 实测 |
| 脚本里同样**没有**上游 URL / commit / 版本记录 | 通读 `_misc/update_reference_manual.py`（70 行） | 源码 |
| 语料内**自带上游署名与许可原文**：`data/manual/copyright.rst` 声明「Except where otherwise noted, the content of the Blender Manual is available under a Creative Commons Attribution-ShareAlike 4.0 International License or any later version. Excluded from the CC-BY-SA license are any logos, trademarks, icons, source code and Python scripts used in this manual.」并要求署名 **"Blender Documentation Team"** + 超链接 | `mcp/blmcp/data/manual/copyright.rst:1-14` | 规范（许可原文）+ 实测 |
| 同一文件还声明「Blender itself is released under the GNU General Public License」并指向 `blender.org/about/license` | 同上 `:6-7` | 规范 |
| 因此 `data/manual/` 的实际许可 = **CC-BY-SA-4.0**（内容），**排除**其中的 logo/商标/图标/源码/Python 脚本 | `data/manual/copyright.rst:9-12` | 规范 |

### 6.3 `_misc/check_license.py` 的 `_SKIP_DIRS` 只跳过 `data/api` 意味着什么

源码：

- `_SCAN_DIRS = ("mcp", "addon", "chat_client")`（`:17-21`）
- `_SKIP_DIRS = (os.path.join("mcp", "blmcp", "data", "api"),)`（`:24-26`）
- 跳过判定：`dirpath_rel == d or dirpath_rel.startswith(d + os.sep)`（`:41`）
- 检查内容：**只查 `.py`**，且只查**第一行**是否含 `SPDX`（`:44-51`）

由此可得（源码 + 实测）：

1. **这是「本仓库自己写的 Python 文件必须有 SPDX 头」的检查，不是许可合规检查**。它不审 RST，也不写任何 attribution。
2. 唯一被豁免的是 `mcp/blmcp/data/api/` 这一整棵子树。该子树下**唯一的 `.py` 文件**就是 `data/api/examples/*.py`（实测 112 个）。→ 豁免的实质是：**从 Blender API 参考构建里整体拷来的示例脚本，本仓库不主张署名、也不加自己的 SPDX 头**。
3. `data/manual/` 虽然在 `_SCAN_DIRS` 之内，但**实测 0 个 `.py`**，所以它事实上也没被这条检查覆盖到；`data/manual/**/*.rst` 从来不在检查范围内。
4. **对署名义务的含义**：`_SKIP_DIRS` **不构成任何许可声明或豁免**。它只是「不给自己拷来的第三方样例贴自己的版权行」。因此我们**不能**把它读成「`data/api` 无许可约束」或「`data/api` 与 `data/manual` 许可相同」——它只是说明了「这部分不是 Blender Authors 原创」。真正有约束力的声明在 `data/manual/copyright.rst`（CC-BY-SA-4.0）和 `manifest.json` 的仓库级 `GPL-3.0-or-later`。

### 6.4 我们的分发义务相关（只列上游事实，不替决策）

- 上游**没有** `LICENSE` 全文文件，只有 `manifest.json` 的字段 + 逐 `.py` 的 SPDX 头 → 若我们照抄「逐文件 SPDX」这一做法，**只能覆盖我们自己新写的文件**（语料是被改写的第三方内容，加我们的 SPDX 头反而错误）。
- `data/manual/copyright.rst` 里的**署名要求是明确的、可执行的**（「attribute the "Blender Documentation Team" and include a hyperlink (online) or URL (in print)」）→ 可逐条落实。
- `data/api` 与 `data/prompts.yml` 在上游只有**仓库级** GPL-3.0-or-later 声明，**没有**可照抄的逐文件声明。

---

## 7. 供 `contract.md` 直接引用的可粘贴事实表

### 7.1 语料指纹（建议原样进 `knowledge/meta.json` 与 §9.5）

| 字段 | 值 | 来源 |
|---|---|---|
| `sourceRepo` | `https://projects.blender.org/lab/blender_mcp` | 实测 |
| `sourceRevision`（代码） | `v1.0.3` = tag `2cea8d566dde`；`main` HEAD = `ff54e4d8f6b0`（= v1.0.3 + 1 提交） | 实测 |
| `corpusRevision`（语料） | 取 `main` 快照；blender 版本标签 **5.2** | 实测 |
| `blenderVersion` | `5.2`（`data/api/index.rst` 标题） | 实测 |
| `fileCount`（`data/**/*.rst`） | **4,508** | 实测 |
| `totalBytes`（`data/**/*.rst`） | **16,039,148** | 实测 |
| `apiFiles` / `apiBytes` | **2,150** / **10,293,766** | 实测 |
| `manualFiles` / `manualBytes` | **2,358** / **5,745,382** | 实测 |
| `examplePyFiles` / `examplePyBytes` | 112 / 184,547（**不在 `pyproject.toml` 的 `package-data` 里**） | 实测 + 源码 |
| `promptsYmlBytes` | 6,235 | 实测 |

### 7.2 知识库粒度相关（对应 §9.3 的 G1/G2/G3）

| 事实 | 值 | 来源 |
|---|---|---|
| G1 契约来源（`api/`）规模 | 2,150 文件 / 10.3 MB / 29,865 段 | 实测 |
| G1 可直接引用的定义数 | `_DEFINITION_DIRECTIVES` 只认 10 种 directive；`bpy.types.Scene.rst` 顶层定义 1 个（`Scene`），`bmesh.types.rst` 21 个 | 源码 + 实测 |
| G1 深 2 成员（`bpy.types.Scene.frame_current`）在上游**不可寻址** | 返回 `partial`，不是 `definition` | 实测 |
| G2 语义来源（`manual/`）规模 | 2,358 文件 / 5.7 MB / 26,475 段；370 个 `index.rst` | 实测 |
| G3 来源（`prompts.yml`） | 6,235 B / 123 行，含 `initial_instructions` 单键（YAML 字符串） | 实测 |

### 7.3 成本基线（对应 §9.5「预处理成本」）

| 指标 | 实测值 |
|---|---|
| 全量 RST 解析一遍（单进程，docutils 0.23） | **35.5 s** |
| 生成「段落 + 面包屑」产物一遍 | **32.8 s** |
| 归一化正文体积（纯段落文本） | **10,147,325 B ≈ 9.7 MiB**（16,039,148 B → **0.63×**） |
| 归一化 + 面包屑 JSON 体积 | **12,966,875 B ≈ 12.4 MiB**（**0.81×**） |
| 段落总数 | **56,340** |
| 文件体积中位 / 最慢单文件解析 | 中位 **2,642 B**；最慢 `api/bpy.ops.object.rst` **0.231 s**（251 段） |
| 上游单次检索（冷，4,508 文件） | **0.39–1.22 s**；其中**读全部 16 MB 是主要成本** |
| 上游单次检索（同进程第二次） | 0.35–0.38 s（只省解析，不省读盘） |
| 上游单次检索实际解析的文件数 | **2–43 个 / 2,150–2,358** |
| 上游单次响应体积（`max_results=20`） | 8.4–16.6 KB（≈2–4K token） |
| 上游 32 KB 单页内联上限 | `_SUMMARY_CHAR_THRESHOLD = 32*1024`，超限降级为定义清单 |

### 7.4 工具契约（对应 §9.6 的 mode 映射）

| 上游工具 | 参数（名/类型/默认） | 返回顶层键 | 「找不到」表现 |
|---|---|---|---|
| `get_python_api_docs` | `identifier: str` | `kind, found, identifier` + 按 kind（`content`/`examples`/`submodules`/`parent`/`available`/`suggestions`） | `kind ∈ {partial, suggestions, missing}` 且 `found: false`；**不报 `isError`** |
| `search_api_docs` | `query: str, max_results: int = 20, context: int = 0, index: int \| None = None` | `hits[], truncated` | `hits: []`, `truncated: false` |
| `search_manual_docs` | 同上 | 同上 | 同上 |
| hit 字段 | — | `path, text, breadcrumb, index, score`（`score` 为 int） | — |

### 7.5 许可（对应 §14.5）

| 语料 | 上游来源（脚本可证） | 许可（语料内可证） | 逐文件声明 | 署名要求 |
|---|---|---|---|---|
| `data/api/` | 「a Blender API reference build」的产物；`<api_dir>/../examples` 的 `*.py` | 仓库级 `GPL-3.0-or-later`（`manifest.json:25`）；**API 文档自身许可未见明确声明**（存疑） | **无** | 无可照抄的原文 |
| `data/manual/` | 「a Blender manual checkout」的 `manual/` | 语料自证 **CC-BY-SA-4.0**，排除 logo/商标/图标/源码/Python 脚本（`data/manual/copyright.rst:9-12`） | **无**（只有 `copyright.rst` 一页） | **明确**：署名 "Blender Documentation Team" + 超链接 |
| `data/prompts.yml` | Blender Authors | 仓库级 `GPL-3.0-or-later` | 无 | 无 |
| 仓库整体 | — | `GPL-3.0-or-later`；**根无 `LICENSE` 文件** | `.py` 首行 SPDX（豁免 `data/api/` 整棵子树） | — |

---

## 8. 对 `contract.md` 现有条文的更正 / 补充

| DESIGN 位置 | 现有写法 | 取证结论 | 类型 |
|---|---|---|---|
| §14.4「来源与版本声明」 | 「版本（v1.0.3）」 | 我们量的语料是 `main`（= v1.0.3 + `Update 5.2`），Blender **5.2**；v1.0.3 的语料是 Blender **5.1**、4,279 文件。**两者不能混写。** | 更正 |
| §9.5 / 各处「4,508 / 16,039,148」 | 未标 ref | 数字正确，但必须注明 `ref=main`（`ff54e4d8f6b0`）、blender 5.2 | 补充 |
| §9.5.5「上游用 `docutils` 解析 RST；本插件在 Node 侧做够用的行式解析」 | 判断 | 成立。补一条**具体风险**：上游的 stub 注册表**已经跟不上语料**（5.2 新增 `.. details::`，15 文件 45 处未注册），说明「够用」需要**显式声明未识别 directive 的处置**，且要**能随语料版本变化重扫**。 | 补充 |
| §9.6 mode `api` ↔ `get_python_api_docs` | 等价映射 | 映射成立，但**不要照抄深 2 成员解析**：上游对 `bpy.types.Scene.frame_current` 返回 `partial` 而非 `definition`（实测）。我们要么修好，要么明确回避。 | 补充 |
| §9.6 返回形状 | 已定字段 | 与上游**形状相似但不同**（上游是 `kind/found` 分派，没有 `status/available/drift/indexed`）。上游有两个可直接借鉴的名字：`truncated`（与上游同名同义）、`breadcrumb`（同名同义）、`path`/`score`/`index`（同名同义）。**`kind` 与 `found` 建议一并沿用**，因为它们承载「找到了但形状不同」的语义，比单一 `error` 更能让模型继续往下查。 | 观察 |
| §14.4「逐文件 SPDX 标识（与上游 `_misc/check_license.py` 同规）」 | 已定 | 上游同规的**真实范围**是「本仓库原创 `.py` 的首行 SPDX」，并**豁免 `data/api/` 整棵子树**。语料是第三方内容，给它加我方 SPDX 头不成立。 | 更正 |
| §14.5「`data/api/` … 按仓库许可整体署名」 | 已定 | 上游仓库级声明只有 `manifest.json` 的 `"license"` 字段，**没有 `LICENSE` 全文文件**。整体署名仍可行，但「照抄上游做法」无对象可照抄。 | 补充 |
| §14.5「`data/manual/` … 其上游来源是 CC-BY-SA-4.0」 | 已定 | **已由语料自证**：`data/manual/copyright.rst:9-14` 原文，且**署名文案可直接照抄**（"Blender Documentation Team" + 超链接）。 | 确认 |
| §12.1 / §14.6 `package.json` `files` | — | 上游 `pyproject.toml` 的 `package-data` **只声明 `data/api/**/*.rst` 与 `data/manual/**/*.rst` 与 `data/prompts.yml`**，遗漏了 `data/api/examples/*.py`；若我们照抄这条声明形状，示例代码会缺。**（未构建 wheel 验证，见 §9）** | 参考 |

---

## 9. 存疑与未核实（明确不猜）

1. **`data/api/` 的精确上游许可与 ref**：`_misc/update_reference_api.py` 只接受一个本地目录参数，不记录 URL/commit/分支。我只能证明它是「a Blender API reference build」的产物（要求 `bpy.app.rst`、`<api_dir>/../examples`）；「Sphinx 构建」是**推断**（RST 里全是 Sphinx 专有 directive/role），**未核实生成命令或来源仓库**。仓库级 `manifest.json` 声明 `GPL-3.0-or-later`，但**这不自动等于**该生成文档的许可条款。**未核实**。
2. **`data/manual/` 的上游 ref**：同上，脚本只接受本地目录。语料内的 `copyright.rst` 能证明**许可**（CC-BY-SA-4.0），**不能**证明 commit。**未核实**。
3. **`data/api/examples/*.py` 是否随上游 sdist/wheel 分发**：`pyproject.toml:22-30` 的 `package-data` 只列 `.rst`，树里也没有 `MANIFEST.in`。按声明推断示例不会进包，但**我未构建 wheel 验证**（本机 `pip`/`build` 不可用）。**存疑**。
4. **多进程解析的真实加速**：`jobs=0` 在本机沙箱被拒（`WinError 5`），只有 `rst_parse_docs.py:729-730` 的注释声称「~7x」，**我未复核**。
5. **`main` vs `v1.0.3` 的 manifest 版本回退原因**：`main` HEAD 的 `manifest.json` 与 `pyproject.toml` 写 `1.0.2`，而更早的 `v1.0.3` tag 写 `1.0.3`；两 ref 之间只有 1 个提交（`Update 5.2: manual & API`）。可确定「版本字符串被这个提交改了」，但**为什么**改回去、是否有 force-push，**未核实**。
6. **`.. details::` 在上游是不是有意的**：`mcp/blmcp/data/api/blf.types.rst:13` 等 15 个文件用了它，stub 注册表没有它，上游自己的 strict 测试会失败。**我未查到上游是否有对应 issue/修复计划**（不联网检索上游 issue）。**存疑**。
7. **深 2 成员解析缺口的历史**：我只测了当前 `main`（等价 v1.0.3 代码）。**未逐版本回溯**该缺口何时引入，也未检查上游 issue。
8. **`hlist`（4,243 次）被整体丢弃的影响**：`hlist` 只用于排版，丢弃在语义上应无害；但我**未逐条核对**丢弃 `hlist`/`toctree`/`index` 是否让某些文件的正文内容整体消失。`manual` 侧 `only::` 与 `include::` 也被丢弃（`_directive_ignore_recursive`），**可能漏掉整段内容**——**未逐一量化**。
9. **未实测项**：`get_python_api_docs` / `search_*` 的 MCP 层（stdio/JSON-RPC 封装、`ToolAnnotations` 传播）我没有跑真 server（无 `mcp` SDK）。工具函数层是直调测的。**工具契约结论限函数层。**
10. **`prompts.yml` 的完整语义**：我读了全文（123 行）；但它是否还有除 `initial_instructions` 之外的键、以及各键如何被 server 消费，只从 `mcp/blmcp/__init__.py:55-60` 看到 `prompts["initial_instructions"]` 一处。**其余键未核实。**

---

## 10. 「上游这么做」与「我们要不要照做」（只写观察与取舍，不替决策）

### 10.1 值得沿用的

| 上游做法 | 观察 | 对 DESIGN 的落点 |
|---|---|---|
| **两层过滤**：文件级 AND 预筛 → 段落级 AND | 实测把解析量从 2,150 压到 **2–3** 个文件。这是上游检索能在 0.4 s 内跑完的直接原因。我们若在 Node 侧做，这条是**最省事也最有效的** | §9.5 |
| **match surface = body + path + title** | 让 `"bpy.props IntProperty"` 这种「一半靠文件名」的自然查询能命中（`tests/test_rst_search.py:1021-1043` 有锁定测试）。我们没有理由不要 | §9.5 |
| **标题合并进首段**（标题不单独占段落位） | 避免检索结果里出现「只有标题、没有内容」的命中 | §9.5 |
| **`breadcrumb` 字段**（`" > "` 连接 section 栈，无 section 时为空串） | 字段名与语义都可以直接沿用（与 §9.6 已定的 `breadcrumb` 一致） | §9.6 |
| **`truncated` 布尔 + `index` 回传做钻取** | 「先给有界列表，再按 index 展开」的两段式交互，正好对应我们「有界摘录 + 来源路径」的 I19 | §9.6 |
| **超限降级为定义清单**（>32 KB 不内联，改列顶层定义名 + 一句「用 `<id>.<name>` 继续查」） | 实测 `bpy.ops.object.rst` 151,917 B（148 KB）→ 摘要 5,473 B，**降 ≈28×**。这是 `maxCharsPerHit` 的一个**已验证的具体形状** | §9.5 |
| **kind 化的「找不到」**：`suggestions` / `partial` + `available` / `missing` 三档 | 比单一 `notFound` 更能让模型自我纠错（`partial` 还会按字符子集 + 相似度给出近邻）。注意**不是** `did_you_mean` 字段 | §9.6 |

### 10.2 需要改掉或不该照搬的

| 上游做法 | 观察 | 我们的约束 |
|---|---|---|
| **每次查询重读整个语料**（16 MB，0.35 s 起） | 上游没有索引文件（源码 `rst_doc_search.py:227` 自述 no cache）。我们有**预构建索引**的设计（用户已定 D2），这条路本来就比上游更贵一次、更快每次 —— **但**要意识到：上游「无索引」并不慢，因为预筛把解析压到近乎零，**慢的是 I/O**。所以**如果我们只做「段落正文 + 面包屑」落盘而不做倒排/DF 预计算，检索延迟不会比上游好**（还是每次读 12.4 MB） | §9.5 |
| **把预计算（DF/IDF）绑在每次查询里** | IDF 依赖 `n_files` 与语料级 `df`，**在语料固定时是常量**，完全可以随索引落盘。这是上游因为「无索引」而不得不现算的部分 | §9.5 |
| **docutils 语义** | 上游的 stub 表已经跟不上语料（`details` 15 文件未注册，strict 测试失败）。照搬需要跟着上游的 directive 列表走；而我们**不引入 Python 依赖**（已定），所以只能「行式解析 + 显式声明未识别 directive 的处置」 | §9.5 |
| **`process pool` 并行** | 上游用它把 35.5 s 摊到多核。我们在 Node 侧建索引是一次性构建（还是分发预构建？）——若是**预构建随仓库分发**，「构建要几秒」不是用户可见成本；若是**装后自建**，35 s 级别就值得认真权衡 | §9.5 |
| **把 `readOnlyHint: true` 当真** | 上游三个知识工具都标 `readOnlyHint=True`。我们**不采信上游 hint**（I9），字段名可以复用，路由依据必须自持 | §9.6 / I9 |
| **`*` / `X.*` 作为发现入口** | 实测 `*` 只返回 10 个顶层模块、`bpy.*` 9 个。这个「通配符 = 列举」的语义很省 token，但也**容易和 `search` 混淆**。要不要保留 `*` 是我们自己的决定 | §9.6 |
| **单页 32 KB 内联上限** | 实测语料里 **>32 KB 只有 26 个文件**（0.58%），`api/bpy.ops.object.rst` 148 KB 最大。也就是说 32 KB 这条线对绝大多数查询**不触发**。若我们把 `maxCharsPerHit` 定得比 32 KB 小很多，触发频率会完全不同 —— **数值不可照抄，需要按我们的 token 预算重定** | §9.5 / §9.6 |
| **`data/api/examples/*.py` 示例随文档返回** | `_collect_examples` 把 `.. literalinclude::` 指向的 `.py` 正文内联进 `examples[]`（实测 `bpy.app.handlers` 返回 3 条、第一条以 `import bpy` 开头；上游测试还额外断言 `ast.parse` 可通过，`tests/test_mcp_server.py:1018-1021`）。这是上游**独有**的高价值形状（G1 契约 + 可运行示例）。但 `pyproject.toml` 的 `package-data` **没声明** `.py`（§9 存疑 3）；我们是否内联示例是独立的取舍 | §9.3 / §9.5 |
| **`data/manual/` 的 `index.rst`（370 个）参与检索** | 上游不过滤，`index.rst` 也会作为普通文件被搜到。导航页在检索里通常是噪声 | §9.5 |

### 10.3 与我们已定不变量直接相关的事实

| 不变量 | 上游事实 |
|---|---|
| I19「返回有界摘录 + 来源路径，不是整份数据」 | 上游 `get_python_api_docs` 有 32 KB 单页上限与摘要降级；`search_*` 有 `max_results`（默认 20）与 `truncated`。**上游已经有这个形状**，可直接对齐字段名 `path`/`breadcrumb`/`score`/`truncated` |
| I21「语料版本指纹必须落盘且漂移可见」 | 上游**没有**版本指纹，只在 `api/index.rst` 标题里写了 `Blender 5.2`；`manifest.json` 的版本号与语料版本**不同步**（`main` 说 1.0.2，语料是 5.2；v1.0.3 说 1.0.3，语料是 5.1）。→ **上游的版本号不能当语料版本用** |
| I22「索引构建可复现，源指纹不符即中止」 | 上游 `update_reference_*.py` 是**直接 `rmtree` 全量覆盖**（`update_reference_api.py:68-69`、`update_reference_manual.py:43-44`），没有指纹、没有校验、没有回滚。**我们已定的要求比上游严**，无先例可抄 |
| I17「数据缺失时明确报不可用」 | 上游**没有**这个分支：`search()` 在语料缺失时返回 `{"hits": [], "truncated": false}`（空结果与「没找到」无法区分）；`get_python_api_docs` 会落到 `missing`。→ **「不可用」是我们自己新增的语义** |
| I9「不采信上游 readOnlyHint」 | 上游三工具全部 `readOnlyHint=True`（`get_python_api_docs.py:364-369`、`search_api_docs.py:21-26`、`search_manual_docs.py:21-26`） |
| §9.5.5「不引入 Python 依赖」 | 上游**强依赖** `docutils`（`pyproject.toml:11`，未锁版本；`rst_parse_docs.py:41-44`）。我们的行式解析器需要自己维护一份「未识别 directive 清单」，因为上游这份清单已经被证明会滞后 |

---

## 附：本机取证脚本清单（均在 `.tmp-blmcp/`，随该目录一起清理）

| 脚本 | 用途 |
|---|---|
| `.tmp-blmcp/dl.py` / `dl_corpus.py` | 经 Forgejo API / archive 下载源文件与语料 |
| `.tmp-blmcp/setup_run.py` | 搭最小 upstream 运行沙盒（`.tmp-blmcp/run/`） |
| `.tmp-blmcp/bench.py` | `parse` / `search` / `tools` 三种计时与契约探测 |
| `.tmp-blmcp/probe_struct.py` | directive / role / 下划线频次 |
| `.tmp-blmcp/probe_headers.py` | 许可头扫描、目录与命名规律 |
| `.tmp-blmcp/probe_versions.py` / `probe_v103_vs_main.py` / `probe_v103_corpus.py` | tag/ref 与版本归属比对 |
| `.tmp-blmcp/probe_scene.py` / `probe_contract.py` | 嵌套定义解析缺口、工具分支实测 |
| `.tmp-blmcp/probe_strict.py` / `probe_details.py` | strict 失败清单、`.. details::` 内容丢失验证 |
| `.tmp-blmcp/probe_scale.py` / `probe_final.py` | 分 scope 规模、pre-filter、warm/cold、边界行为 |
| `.tmp-blmcp/run_unittest.py` | 跑上游 `tests/test_rst_parse.py` 与 `tests/test_rst_search.py`（含沙箱环境适配） |
