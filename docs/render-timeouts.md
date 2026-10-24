# 渲染超时与状态文件

`blender_mcp_render` 以前只有全局的 `renderTimeoutMs`（默认 120 秒），单次调用改不了。预览够用，但 4K / 2048 samples 的成图很可能超过这个预算。现在一次渲染可以自己带预算，也可以先启动、稍后再取图。

## 三种用法

| 场景 | 调用 | 行为 |
|---|---|---|
| 普通预览 | `blender_mcp_render({ task, width, height, samples })` | 等渲染出图，预算用配置里的 `renderTimeoutMs` |
| 长渲染 | 再加 `timeoutMs`（1000–1800000，即 1 秒到 30 分钟） | 最多等这么久；超时后返回 `timeout` |
| 正式成图 | 再加 `background: true` | 约 3 秒后返回 `jobId`，不等出图；Blender 会一直忙到渲染结束 |

`background: true` 不能和 `timeoutMs` 一起用：后台启动没有“等多久”的概念，取图靠 `blender_mcp_render_status`。

## 超时之后

超时不会取消 Blender 里的渲染。调用返回 `status: "timeout"`，并带上：

- `jobId`：任务编号，也是文件名主干；
- `path`：图最终会写到哪个文件；
- `statusPath`：状态文件；
- `elapsedMs`：这次等了多少毫秒；
- `estimateSeconds`：有历史数据时给出的耗时估算。

这时不要马上再发一次渲染。先调用：

```json
{ "tool": "blender_mcp_render_status", "args": { "task": "tianyi", "jobId": "render-20261024153000123" } }
```

- 还在渲染 → `status: "running"`，过一会再问；
- 已完成 → `status: "ok"`，返回尺寸、字节、耗时，并把图片附给模型；
- 失败 → `status: "error"`，附 Blender 记下的错误。

省略 `jobId` 时看任务目录里最新的那个渲染任务。状态工具只读任务目录，**不连接 Blender**，所以 Blender 正忙着渲染时也能用。

## 状态文件

每次渲染在 `renders/` 下写一份 `<名字>.render.json`：

```json
{
  "version": 1,
  "jobId": "render-20261024153000123",
  "path": ".../renders/render-20261024153000123.png",
  "state": "running | done | failed",
  "startedAtMs": 1761288600123,
  "finishedAtMs": null,
  "width": 3840,
  "height": 1750,
  "samples": 2048,
  "engine": "CYCLES",
  "timeoutMs": 1800000,
  "background": false,
  "bytes": 0,
  "error": null
}
```

写入时机：

1. `bpy.ops.render.render(...)` 之前写 `running`；
2. 渲染结束、并且渲染设置恢复之后写 `done` 或 `failed`。

所以状态文件同时说明了两件事：渲染有没有结束，以及设置有没有恢复干净。Blender 如果中途崩溃，文件会停在 `running`——这时只能看 Blender 窗口，状态文件帮不了。

状态文件和图片都在任务目录里，不碰用户的 `.blend`，也不写别的目录。

## 耗时估算

同一个会话里，插件会记住每次完成渲染的“毫秒 /（有效像素 × 采样）”，按引擎分开（EEVEE 和 Cycles 不混用）。下一次渲染前，用这个速率折算一个大概的秒数：

- 出现在 `estimateSeconds`；
- 渲染用掉 80% 以上预算时，结果里会多一条提醒；
- 只是提醒，不是排程。第一次渲染、冷 shader 缓存、大场景都会让它不准。

## 边界与限制

- **没有百分比进度**。Blender 不把渲染进度暴露给 Python，状态工具只能说“还在跑 / 完成 / 失败”。
- **后台模式不是真正的后台**。Blender 主线程仍在渲染，窗口会卡住，只是插件不用一直等。渲染期间别的 Blender 工具都会超时，只有状态工具还能用；只在用户同意让 Blender 忙一段时间时用。
- **超时不取消渲染**。设置会在渲染结束后由 Blender 里的 `finally` 恢复；不要为了“复位”再调用一次渲染。
- **宿主也可能有自己的工具超时**。DSH 若在插件预算之前中止调用，渲染同样会继续；用 `blender_mcp_render_status` 取回即可。
- **任务目录要认得出来**。状态工具靠本会话的任务目录标记定位文件；插件重启或换了会话时，先在 Blender 空闲后调用一次 `blender_mcp_status` 刷新路径，再查渲染状态。
- **审计**：任务目录准备好之后，`blender_mcp_render` 的每次结束（`ok` / `timeout` / `running` / `error`）都会写进 `audit.jsonl`，带 `jobId`、`renderState`、`timeoutMs`、`background`。
