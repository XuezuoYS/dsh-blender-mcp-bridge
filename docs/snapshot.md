# 快照与自动快照节奏

插件不保存用户的 `.blend`，用户靠撤销历史和任务目录里的快照回退。本文说明快照是什么、什么时候自动拍、配置怎么调。

## 1. 快照是什么

- 用 `save_as_mainfile(copy=True)` 把当前会话写成任务目录 `snapshots/` 下的一份副本；
- 不改当前文件路径，不清脏标记，不碰用户的 `.blend`；
- 文件名 `<轮次>-<序号>.blend`，只保留最新 `generations` 份（默认 3），先写新文件再删旧文件；
- 写入用插件的受信任通道，不经过用户代码的写路径。

## 2. 为什么要有自动节奏

单轮几十次 `exec` 的长任务里，只在开头有一张快照不够：中途误删、批量改坏材质、脚本跑一半失败时，撤销栈可能已经被挤出（撤销上限默认 32 步），最近的中途状态就没有可打开的快照。自动节奏就是给长任务补几个中途落脚点。

## 3. 三种节奏

| `on` | 什么时候自动拍 |
|---|---|
| `turn` | 每轮第一次写之前；删除类调用之前（由 `onDestructive` 控制） |
| `adaptive`（默认） | 每轮第一次写之前；离上次快照满 `everyWrites` 次写入之前；删除类调用之前 |
| `write` | 每次写调用之前（最费，只在需要时选） |

- 只读调用（`readOnly: true`）不拍快照；但只读调用如果真的改了场景（插件补推了撤销步），会计入写入次数。
- 显式 `blender_mcp_snapshot` 也算一次快照：会重置间隔，并把本轮标记为已覆盖，不会紧接着再自动拍一张。
- 触发判断在写锁内、发送用户代码之前完成，不会插进正在执行的 Python 调用中间。

## 4. 配置

```yaml
snapshot:
  enabled: true
  generations: 3
  on: adaptive
  everyWrites: 10
  onDestructive: true
  compress: true
  timeoutMs: 120000
```

| 键 | 默认 | 说明 |
|---|---|---|
| `enabled` | `true` | 关掉后不再自动快照；显式 `blender_mcp_snapshot` 仍可用 |
| `generations` | `3` | 保留多少份最新快照 |
| `on` | `adaptive` | `turn` / `write` / `adaptive` |
| `everyWrites` | `10` | 每多少次写入拍一张；`turn` 模式下只作为长任务提醒阈值 |
| `onDestructive` | `true` | 删除类调用前补拍一张 |
| `compress` | `true` | 快照是否压缩 |
| `timeoutMs` | `120000` | 单次快照的回复预算 |

大场景一张快照可能有十几 MB。想省磁盘就把 `on` 调回 `turn`，或把 `everyWrites` 调大。

## 5. 写入次数怎么算

- 写模式调用只要发到了 Blender 就算一次，成功、报错、被守卫拦、超时都算（场景可能已经变了，宁可保守）；
- 只读调用只在真的改了场景（撤销步被补推）或调用超时（结果未知）时算；
- 被 L1 静态策略拦下、快照失败被拒绝、参数错误的调用不算；
- 计数只在当前插件进程内累计，不落盘；会话销毁时清理。

## 6. 删除类识别

写前只看代码文本，命中这些就补拍：

- `bpy.data.<集合>.remove(`、`bpy.data.batch_remove(`、`bpy.data.orphans_purge`；
- `bpy.ops.object.delete`、`bpy.ops.mesh.delete`、`bpy.ops.outliner.orphans_purge`；
- `shutil.rmtree(`、`os.remove(`、`os.unlink(`、`os.rmdir(`。

它不解析语法：注释和字符串里的同名文本也会命中，真实的动态删除也可能漏掉。误报最多多一张快照，漏报只是少一次提前保护，都不会少撤销步。只有"距上次快照已有写入"时才补拍，避免连续两次相同状态的重复快照。

## 7. 模型能看到什么

- `exec` 结果里的 `snapshot`：路径、字节数、耗时、触发原因（`turn` / `everyWrites` / `destructive` / `write`），以及"回退要用户自己打开快照"的说明；
- `blender_mcp_status`：`snapshotPolicy` 和每个任务目录的 `writesSinceSnapshot`；
- `turn` 模式跑成长任务时，本轮会给一次提醒；
- 显式快照结果：文件名、字节数、耗时、离上次快照的写入数、被轮换掉的旧文件。

## 8. 回退

- 打开快照：在 Blender 里 File → Open，选任务目录 `snapshots/` 下的文件；
- `Ctrl+Z`：撤销最近一次写调用；
- 插件不会自动恢复快照，也不会覆盖用户的 `.blend`。

## 9. 验收对应

- 30 次写入的单轮任务，默认 `adaptive` + `everyWrites: 10` 会在首写、第 11 次、第 21 次前各拍一张；
- 自动快照在写锁内完成，不打断进行中的调用；
- 回退口径见第 8 节，工具输出里也会重复一句。
