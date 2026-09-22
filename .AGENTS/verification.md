# 验证门禁

> 两档门禁：**入库测试**（`test/`，离线可跑）与**本地探针**（`diagnostics/`，需实机 Blender，不入库）。

## 1. 入库测试（`pnpm test`，不需要 Blender）

`test/` 由原 `diagnostics/checkRepo.js` 与 `diagnostics/auditCorpus.js` 迁入，
改用 `node:test`；这两者查的是"完整性/一致性"，属于随时可跑的回归门禁。

| 命令 | 覆盖 | 判据 |
|---|---|---|
| `pnpm check` | `tsc --noEmit -p jsconfig.json`：`index.js` + `lib/**` + `buildKnowledge.js` + `test/**` | **0 诊断**；`index.js` 不得再出现整文件 `@ts-nocheck` |
| `pnpm test` | `test/repo.test.js`（R1–R9，13 项）、`test/corpus.test.js`（A–E，15 项） | 28/28 通过 |

`pnpm typecheck` 是 `pnpm check` 的别名（旧文档/旧习惯仍可用）。

**判据纪律**：改完门禁要用**注入验证它会失败**（例如故意加一个死配置键、故意去掉一个注释锚点）。
绿色本身不是证据——"永远绿"的门禁等于没有门禁。

## 2. 本地探针（`diagnostics/`，需要开着 add-on 的 Blender）

`.gitignore` 整体忽略 `diagnostics/`：**它们是设计期/实现期取证脚本，不属于交付物**，
官方仓库不含它们，因此文档里的验证章节只在本地开发时可用。

```sh
node diagnostics/probePreflight.js        # 可用性预检（没有 Blender 时其余探针 SKIP）
node diagnostics/probeEndToEnd.js         # 真的注册工具并逐个调用（30 项）
node diagnostics/probeFindings.js         # 审计发现的逐条回归（41 项，含"探针不留场景残留"）
node diagnostics/probeGuard.js            # L2 机制层（18 项，含蓄意篡改）
node diagnostics/probeCapabilities.js     # 工具面压测（16 项，含故意越界以验证拦截）
node diagnostics/probeSettingsGuard.js    # 设置漂移检测 + 提示词段落（11 项）
node diagnostics/probeTransport.js        # 帧格式与超时（14 项）
node diagnostics/probeTaskRoot.js         # taskRootMode 各分支（活动工程未保存时少一条）
```

两条实测须知：

- **`probeCapabilities` 的"exec 只读"用例要求活动场景至少有一个物体**（断言 `result.n > 0`）。
  空场景下它会误报 FAIL——那是判据依赖场景，不是实现缺陷；用非空场景复跑即为 16/16。
- 探针会自动跳过无 Blender 的环境：**环境缺失与被测能力失败是两件事**，
  混在一起会让"探针红了"这句话失去意义。

## 3. 验收顺序（改动落盘后）

1. `pnpm check` → 0 诊断；
2. `pnpm test` → 全绿；
3. 有 Blender 时跑上面的探针；
4. 实机确认行为：一次 `exec(mutating:true)` 的任务目录出现在**活动 `.blend` 同级**，
   且 `status.existingTaskDirs` 能列出同级既有工作目录、**不创建任何目录**；
5. `blender_mcp_status` 的设置漂移为空（探针跑完必须与开局一致）。
