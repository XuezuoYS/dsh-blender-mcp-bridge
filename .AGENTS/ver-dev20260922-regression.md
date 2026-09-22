# `ver-dev20260922` 报告：实测绕过与判据修正

> **性质**：工作记忆（判据纪律与事故复盘），不是规范。
> 仍然生效的规则在 [`../docs/contract.md`](../docs/contract.md)；本文件只记"当时怎么发现的、判据错在哪"。
>
> **来源**：一份 `20260922` 的外部实机报告（**临时文档，已按用户指示从仓库删除**；本文件是它的
> 结论提炼与判据复盘）。那次跑的是真实生产流程（建模 / 植物 / 材质 / 几何节点 /
> 灯光 / 体积雾 / 摄像机 / 动画 / 骨骼 / 合成器，137 对象），并在同一条链路上做了**主动越权攻击**。
> 被测环境：Blender 5.2.2 LTS（GUI）/ add-on `mcp` 1.0.3 / 端口 9876。

---

## 0. 用户裁决

**一切以 `20260922` 报告为准。** 因此仓库里与它冲突的旧结论一律按报告改写，
并在本节留下"旧结论当时怎么被验证的"——**被高估的结论要连着它的取证方式一起记**。

---

## 1. 实测坐实的四条越权/缺陷（P0）

| # | 载荷 | 结果 | 根因 |
|---|---|---|---|
| P0-1 | `io.open(界外, 'w')` | ❌ **ALLOWED**，文件外部创建成功 | `builtins.open` 被包裹，而 **`io.open` 是另一个绑定**，从未被包裹 |
| P0-2 | `shutil.move(界内 → 界外)`、`os.rename`、`os.replace` | ❌ **ALLOWED**，文件被搬出任务目录 | 钩子只取 `args[0]`（源），**目标实参从不校验** |
| P0-3 | `capture(target='window')` | ❌ 工具调用**永久失败**（harness 报 `invalid output: value is not lossless JSON`），但文件其实写出了 306,551 B | `restored: payload.restored ?? undefined` 产出 `undefined` **属性**（`window`/`area` 分支从不调 `_restore()`） |
| P0-4 | `bpy.data.libraries.write` / `export_scene.*` / `image.save_as` / `wm.save_homefile` | ⚠️ 静态结论，报告**未实测** | `CONTROLLED_OPS` 只列 `wm`/`preferences` 名单 |

**同批被拦的（防线成立）**：动态构造路径的 `open` / `os.makedirs` / `pathlib.write_text` /
`shutil.copyfile`（拦的是内部 `open(mode='wb')`）。

---

## 2. 判据纪律的修正（本轮最重要的一条）

### 2.1 静态审计 **推翻 2 条、坐实 2 条**

| 静态审计结论 | 实测 |
|---|---|
| `shutil.copyfile` 目标端不校验 → 可越界覆盖 | **被推翻**：`copyfile` 内部 `open(mode='wb')` 被拦 |
| `os.makedirs` "连 issue 都没有" | **被推翻**：L2 运行时拦下（只是 L1 不报） |
| `io.open` 未包裹 → 静默越界写 | **坐实** |
| rename/move/replace 只校验源实参 | **坐实** |

**结论**：**这套护栏的静态可读性差于它的实际强度。**
"照源码判断某条路径能不能绕过"**不可靠**——既会高估（以为能绕过，其实被内部调用拦了），
也会低估（以为拦得住，其实名字没包到）。
→ 因此**断言型探针**（`probeFindings.js` 那种"能失败的断言"）优先于静态阅读，
新增覆盖必须配一条会失败的用例。

### 2.2 "耗时 + 瞬时状态"不足以判定同步/异步

`docs/blender-5.2-findings.md §1` 的旧结论"`INVOKE_DEFAULT` 同步阻塞"是这样取证：
在同一个 exec 内读 `is_job_running('RENDER')` 且回读文件，两次都读到"已结束"。

**漏洞**：两种机制（同步执行 vs. 异步但恰好已跑完）**都能解释**这个观察，
当时的判据没有区分它们。后续实测给出**只有异步才成立**的观察——返回时 `RUNNING_MODAL`
且 `is_job_running=true`，并且渲染在 exec 返回**之后**写出了 `C:\tmp\Untitled.png`（72,966 B）。

→ 教训：判定"同步还是异步"必须有**排他性**观察（"返回之后才有产出" / "返回时 job 仍在跑"），
不能只用耗时与瞬时布尔量。

---

## 3. 事故复盘：异步渲染越过护栏窗口写盘

**现象**：一次 `INVOKE_DEFAULT` 起的后台渲染，在 exec 返回之后写出了用户 `render.filepath`
指向的 `C:\tmp\Untitled.png`。护栏**完全无感**——L2 钩子在每次 exec 结束时就卸掉了，
而返回体里的 `hooksUnloaded: true` 给人一种"全程覆盖"的错觉。

**为什么判据没抓到**：契约 `§9.5` 本来就写了"窗口外的异步/延迟写不受约束"，
但**工具返回体里没有一个字段把它说实**。文档里的诚实声明 ≠ 调用方看得见的诚实声明。

**处置（已落地）**：`exec` 返回体新增 `guard.window`（覆盖到哪结束）与 `guard.jobsRunning`
（窗口外仍在跑的后台任务）；检测到在跑时**不**拒绝结束本次 exec——
那会把"渲染被记错成失败"的代价加给用户，正确做法是**让它可见**。

---

## 4. 产品定位缺口（不是 bug，是取舍缺失）

报告 §4/§5 的判据是**只看模型可见文本**（两段 `systemPrompt` + 6 个 tool description +
返回字段 + `SKILL.md`）。结论：

| 引导项 | 修复前 | 处置 |
|---|---|---|
| 集合分层 / 命名规范 / 布线 / 灯光与雾的秩序 | **0 句**（137 对象、18 集合、全套前缀命名全是测试者自带的习惯） | 新增系统提示词段落「场景整洁约定」（I27） |
| **任务完成态**的交接（未保存 / Ctrl+Z / 按 F12 / 任务目录已保留） | **0 句**，只有"**被拒时**"的接管话术 | `exec.handoffHint` + `status.sessionChecklist`（I26） |

**关键区分**：**拒绝态的指引**与**完成态的指引**是两件事。前者一直有，后者此前完全缺失——
一次顺利的建模任务不会提醒模型做任何收尾汇报。

---

## 5. 实测缺口的知识库条目

报告 §8 列出 7+1 条"在 `knowledge/` 里查不到、且照旧写法会**静默失败**"的 5.2 契约，
已全部补进 `buildKnowledge.js` 的 `buildRules`（真身在生成物 `knowledge/g3-rules.md`）：

`compositor-needs-rl-render-layer`、`menu-socket-uses-display-name`、`nodesmodifier-has-no-idprops`、
`interface-defaults-do-not-propagate`、`mesh-to-points-needs-realize`、`distribute-density-is-not-per-m2`、
`camera-pitch-sign`、`instance-uses-asset-material`。

判据要求：**每条规则都要有一句"照旧写法会怎么失败"**，否则模型读到也认不出自己正踩在上面。

---

## 6. 上游建议（本仓不改）

**死 patch 行无告警**：报告发现 profile 里 `node_modules` 有指向本仓的软链、`cordis.patch.yml`
里有一条 `- id: blender-mcp-bridge`，但 `dsh.profile.bundles` / `pnpm-lock.yaml` / `.package-map.json`
里都没有它——于是插件**没有被加载**，而那条 patch 行是**指向不存在节点的死行**，
加载器不报错、用户看不到任何提示。

**这是 DSH 加载器 / `plugin_manager` 的行为，不是本插件能修的**（本插件也不应该去改用户 profile）。
建议（留给上游）：

1. 加载器对 **patch 里 `id` 不存在**的情况给一条 warning；
2. 或 `plugin_manager list_plugins` 单列"孤儿 patch 行"。

本仓的处置：只在 README 的排错表里写清"看不到工具"的**真实成因与处置**，
并把"无需重启 harness"这条错误提示删掉（实测：`install_bundle` 返回 `applied` 后同轮即可调用）。
