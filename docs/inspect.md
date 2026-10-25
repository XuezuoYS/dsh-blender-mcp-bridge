# 场景查询 `blender_mcp_inspect`

`blender_mcp_inspect` 是只读查询工具：选一个 `scope` 看某类数据，按名字/类型/集合过滤，按页取。它不依赖 Python 写代码，所以不会推撤销、不写文件、不建任务目录。

## 1. 解决什么问题

老版本固定返回「前 200 个对象 + 父级/集合/修改器/材质/面数」。3000 个对象的场景里，这既看不全（200 之后什么都没有），又很吃上下文（200 条缩进 JSON 好几万字符）。

现在默认只回答「这场景里有什么」：类型计数、集合聚合、材质/灯/相机数量、20 条样例。想找具体对象再用过滤和分页。

## 2. 参数

| 参数 | 说明 |
|---|---|
| `scope` | `summary`（默认）/ `objects` / `collections` / `materials` / `lights` / `cameras` |
| `name` | 名字 glob，如 `TJ_*`、`*Wall_?`；**区分大小写**、按原样匹配（不去首尾空格）；对对象、集合、材质、灯、相机都生效 |
| `type` | 对象类型，如 `MESH`、`LIGHT`、`EMPTY`；不区分大小写；只对 `summary` / `objects` 生效 |
| `collection` | 集合名；只对 `summary` / `objects` 生效；主集合名（`Scene Collection`）也能用 |
| `collectionDeep` | `true`（默认）时含子集合里的对象 |
| `include` | 每个对象额外带的字段，见第 6 节；默认空 |
| `limit` | 每页条数，1–200；默认 20（`summary` / `objects` / `collections`），50（`materials` / `lights` / `cameras`） |
| `offset` | 跳过多少条；翻页用返回里的 `paging.nextOffset` |

参数写错了直接报参数错误，不会发到 Blender。`type` 打错、`collection` 不存在、`name` 匹配不到都不算错：返回 0 条加一条 `hint`，里面列出场景里真实的类型和集合名。

## 3. 返回结构

所有 scope 都是同一套骨架：

```json
{
  "scope": "objects",
  "scene": "Scene",
  "totalObjects": 3174,
  "applied": { "name": "TJ_*" },
  "paging": { "totalMatched": 132, "returned": 20, "offset": 0, "nextOffset": 20, "truncated": true },
  "items": [{ "name": "TJ_Wall_01", "type": "MESH" }],
  "hint": "showing 20 of 132 from offset 0; pass offset=20 for the next page"
}
```

- `applied`：这次真正生效的过滤。`type`/`collection` 拿去查 `materials` 不会生效，也不会出现在这里（避免「以为过滤了其实没有」）。
- `paging.totalMatched`：过滤后的总数；`returned`：这一页实际给了多少；`truncated`：等价于 `nextOffset` 不为空。
- `hint`：在「还有下一页」「零命中」「offset 越过末尾」或「回复超预算被裁剪」时出现，其他情况没有。

## 4. 六种 scope 各给什么

| scope | items 里是什么 | 额外信息 |
|---|---|---|
| `summary` | 样例对象 | `summary.typeCounts`（按过滤后统计）、`summary.collections`（全场景：总数、master、unassigned、最多 10 条按递归数量排序的集合）、材质/灯/相机数据块数 |
| `objects` | 对象 | 无 |
| `collections` | 集合：`objects`（直接）、`recursive`（含子集合）、`children`、`hideRender` | 无 |
| `materials` | 材质：`users`、节点数 `nodes` | 无 |
| `lights` | 灯数据块：`type`、`energy`、`color` | 无 |
| `cameras` | 相机数据块：`type`、`lens`、`sensorWidth`、`isSceneCamera`，正交相机多一个 `orthoScale` | 无 |

`summary` 的 `typeCounts` 统计的是过滤后的对象集合，`totalObjects` 永远是全场景对象数；集合聚合永远是全场景结构，不随对象过滤变化。

渲染设置不在 `inspect` 里：用 `blender_mcp_status`（它返回引擎、分辨率、采样、格式，以及 `performance` 里的设备、降噪、色彩管理、线程）。

## 5. 分页与截断

- 顺序固定按名字排序，所以 `offset` 翻页稳定；但两次翻页之间场景如果被改过，结果会漂——场景变过就从 `offset: 0` 重来。
- 单次回复超过 60,000 字节时，插件会从 `items` 尾部往回裁（必要时再裁集合列表），把 `paging` 和 `hint` 同步成新的续读位置。60,000 是插件自己的预算，协议层的硬上限是 200,000 字节。
- 裁到一条不剩时，`truncated` 是 `false`、`nextOffset` 是 `null`，`hint` 会建议减少 `include` 或 `limit`——`truncated` 永远等价于「还有下一页」。
- 没有游标：不想让一个只读工具在服务端保存分页状态。

## 6. `include` 的成本

默认不返回这些字段，是故意的：字段越多，回复越大、Blender 侧读得越多。

| 字段 | 内容 | 说明 |
|---|---|---|
| `parent` | 父对象名或 `null` | |
| `collections` | 所在集合名列表 | 一个对象可以在多个集合里 |
| `modifiers` | 修改器类型列表 | 只要类型，不要参数 |
| `materials` | 材质槽里的材质名 | 只对网格对象有效，空的槽会跳过 |
| `meshStats` | `vertices` / `polygons` | 只对网格对象有效 |
| `transform` | `location` / `rotationMode` / `rotationEuler` / `scale` | |
| `bounds` | `dimensions` | 局部包围盒 × 缩放；**不含修改器求值后的真实边界** |
| `visibility` | `{ viewport, render }` | |
| `data` | 数据块名字 | 比如网格数据名 |

`bounds` 不用求值依赖图，3000 个对象也不会卡；想要修改器之后的真实尺寸，只能自己用 `exec` 求值。

## 7. 性能

3,174 个对象的实测场景里，Blender 侧跑一次查询：`summary` 约 4 ms，`objects` 一页约 1–2 ms。一次工具调用的往返大约 0.5 秒，主要是连接建立和 add-on 的调度间隔，不是查询本身。

实现上特意避开了 `obj.users_collection`：在这个场景里每个对象要花约 120 µs（3,174 个对象就是 380 ms）。集合统计和「对象属于哪些集合」都改成从 `collection.objects` 反向读，总开销和链接数成正比。

全字段加 `limit: 200` 属于压力用法：JSON 回复约 79 KB，会触发 60 KB 预算裁到约 150 条，模型可见文本约 2.4 万字符。日常用 `limit` 20–50 就够。

## 8. 和 `blender_mcp_exec` 的分工

- 结构查询（有哪些集合、某个前缀的对象、材质用量、灯的参数）→ `inspect`。
- 需要临时统计、自定义聚合、导出数据 → `exec` 配 `readOnly: true`。

`inspect` 永远是只读的：不推撤销、不生成快照、不写任务目录。

## 9. 例子

```json
{"tool": "blender_mcp_inspect", "args": {}}
```

```json
{"tool": "blender_mcp_inspect", "args": {"scope": "objects", "name": "TJ_*", "limit": 20}}
```

```json
{"tool": "blender_mcp_inspect", "args": {"scope": "objects", "collection": "TJ_Library", "type": "MESH", "include": ["materials", "meshStats"]}}
```

```json
{"tool": "blender_mcp_inspect", "args": {"scope": "objects", "offset": 20, "limit": 20}}
```

看灯光的亮度和颜色：

```json
{"tool": "blender_mcp_inspect", "args": {"scope": "lights"}}
```
