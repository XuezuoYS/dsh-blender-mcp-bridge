# 并发上限与连接重试

DSH 可能把多个 Blender 调用排成并行组。Blender 官方 MCP add-on 是单线程处理请求的，而且监听队列很小，一次涌进太多连接会被直接拒绝。插件因此加了一层并发门禁，并在连接被拒时做有限重试。

## 1. 上限是多少

Blender 5.2.2 自带的 MCP add-on（1.0.3）在 `mcp_to_blender_server.py` 里写死了 `_LISTEN_BACKLOG = 5`，然后 `sock.listen(5)`。

2026-10-25 在 Windows 上实测（每轮只发 `len(bpy.data.objects)` 这种只读请求）：

| 同时连接 | 结果 |
|---|---|
| 2 / 3 / 4 / 5 | 全部成功（5 并发连跑 8 轮，40/40） |
| 6 | 每轮被拒 1 个 |
| 7 | 每轮被拒 2 个 |
| 8 | 每轮被拒 3 个 |
| 10 | 每轮被拒 5 个 |

拒绝的错误码是 `connect-refused`。把连接间隔错开 5/10/20 ms 没有帮助——add-on 每 50 ms 才 accept 一次。Windows 上队列满会直接回 `ECONNREFUSED`；Linux 上通常表现为挂起或超时，所以这个现象在 Windows 上最明显。

## 2. 插件怎么处理

- **门禁**：`blender_mcp_inspect` 和 `blender_mcp_status` 这两个可能被并行调用的读工具，共用一个先进先出的信号量；`exec` / `render` / `capture` / `snapshot` / helper 本来就被写锁串行，不占门禁槽位。
- **上限**：设置页「连接与超时 → 并发上限」，对应 `connection.json` 的 `maxConcurrentSends`，默认 **5**，可调 1–20。每次取槽位都读当前设置，改完保存立即生效。
- **等不到就失败**：排队最多 2.5 秒，超过返回 `busy` 错误，提示等待或调高上限，而不是排在长渲染后面一直等。
- **取消即释放**：调用被取消时立刻退出队列，不会占着槽位。
- **有限重试**：连接被拒时最多再试 3 次（间隔 150 ms、400 ms、900 ms，合计约 1.4 秒）。这只对 `connect-refused` 生效——连接根本没建立，请求一个字节都没发出去，重试不会重复执行代码。`response-timeout`、`closed`、`malformed` 一律不重试，因为它们意味着请求可能已经在 Blender 里跑过了。
- 为什么退避这么长：实测并发 8 时，被接受的那 5 个连接要 ~300 ms 才处理完，listen 队列在这期间一直是满的；add-on 空闲时 poll 间隔还会降到 1 秒。60/150 ms 这种短重试在实测里完全没用，1.4 秒才覆盖得住。所以**真正解决问题的是门禁，重试只是兜底**。

## 3. 怎么调

- 默认 5 正好等于 add-on 的 listen 队列容量，够用但没有余量。**如果同时还开着别的 Blender 客户端**（dsh-blender 插件、自己的脚本），建议调到 4 留一个位置。
- 调到 1 最稳，但批量查询会完全串行；调到 6 以上会重新开始出现 `connect-refused`，没必要。
- 长渲染期间 Blender 主线程被占，其他调用本来就会超时，门禁不改变这一点；这时继续用 `blender_mcp_render_status` 读任务目录即可。

## 4. 设置项文案（与页面一致）

> 同时发往 Blender 的连接数上限。Blender 5.2 实测上限 5（官方 add-on 的 listen backlog），超过会被拒绝；默认 5，同时开着其他 Blender 客户端时建议调到 4。
