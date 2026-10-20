# 已知问题与改进建议

> 来源：2026-10-19 的 13 轮实机建模（DSH `0.2.1-rc.2` + Blender `5.2.2 LTS` + mcp `1.0.3`）。
> 场景：从零建芦苇与枫树，反复重建骨架、散布叶片、调材质和机位，中途崩过一次会话。
> 下面每条都对应真实发生过的现象，不是推测。

## P0 崩溃被报成普通超时

**现象**：Blender 崩溃后，`exec` 返回 `status: timeout`，提示"代码可能还在 Blender 里跑"。

**为什么难判断**：`lib/protocol.js` 有 `socket.on('close')`，本来能报"连接已关闭"；但 Windows 的崩溃对话框会让进程挂住、socket 不关，于是 30 秒的 `responseTimer` 先超时。

**影响**：模型和用户都会以为任务还在跑，不会去看崩溃日志。

**建议**：超时后做一次轻量存活探测（重连 + 一次 ping）。

- 探不通 → 报 `blender-unreachable`，附崩溃日志路径 `%TEMP%\<文件名>.crash.txt`
- 探得通 → 保持现在的 timeout 语义

## P1 Python 异常的 traceback 被吞

**现象**：`IndexError`、`ValueError` 只显示一行 message，没有文件名和行号。

**原因**：`lib/tools.js` 的 `renderExec` 只打印 `error.message`，而 `envelope.traceback` 早就存进结果里了。

**建议**：在 Error 行下面补 3–5 帧 traceback（`文件:行号` 就够）。

## P1 exec 没有单次超时覆盖

**现象**：重活（4 万叶片、整棵骨架重建）单次要 10–20 秒，离 30 秒默认超时很近。

**原因**：`exec` 固定用全局 `responseTimeoutMs`；`helper` 有 `timeoutMs`（上限 10 分钟），`render` 有独立的 120 秒。

**建议**：给 `blender_mcp_exec` 加可选 `timeoutMs`，和 helper 同规格。

## P1 长会话把撤销栈冲掉

**现象**：13 轮里做了 40+ 次 `exec`，Blender 撤销栈只有 32 步，早期步骤被挤出去，用户回不到中途版本。这里的 32 是偏好里的撤销上限，不是当前历史条数；`status` 现在把它标成 `undo limit`。

**建议**：提供 batch——一次调用跑多段脚本，只压一个撤销步；或者按"轮"合并。

## P2 自动保存恢复后 task root 静默切换

**现象**：崩溃重启后 Blender 打开的是 `%TEMP%\..._autosave.blend`，task root 跟着变，产物被拆到两个目录。

**建议**：检测到 `.blend` 路径变化时，在 `status` 和首次 `exec` 里加一条 warning。

## P2 快照列表（部分解决）

**现状**：`status` 现在显示每个任务目录的快照数量、最新快照名和修改时间；完整文件列表仍未返回。

**建议**：需要时再补只读的文件名/大小列表。

## P2 几个小便利

| 项 | 现状 | 建议 |
|---|---|---|
| `render` 尺寸 | 必须显式传 width/height/samples | 省略时用当前场景设置 |
| 审计日志 | 单轮 68 KB；已按 2 MB 轮转，默认只存代码 sha256 | 需要原文时显式开 `audit.storeCode` |
| 崩溃恢复指引 | 只在 README 里写 | 工具输出里也提一句 |

## 建议的实施顺序

1. P0 存活探测（改动最小，收益最大）
2. P1 traceback 显示
3. P1 exec 超时
4. 其余按需

## 明确不是插件的问题

- Skin 修改器在非法网格上崩溃（我传了 `-1` 的边索引），是 Blender 的健壮性缺陷；插件按约定报了 timeout。
- 自动保存恢复后几何节点组丢失，是 Blender 清理"无使用者数据块"的行为。
