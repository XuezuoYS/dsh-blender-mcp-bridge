# Blender 5.2 实测发现

> 本文件记录**在本机 Blender 5.2.2 LTS 上实测到的、与直觉或旧文档不符的行为**。
> 它不是契约（规则在 [`contract.md`](contract.md)），也不是交付状态（那是 [`../STATUS.md`](../STATUS.md)）。
> 这些发现是**实现的直接依据**——每一条都曾让代码静默失败，或让结论出错。
>
> 全部标注为 **实测**：都是在活动 GUI 会话 / 独立后台实例上跑出来的观察，不是推断。

---

## 1. 长任务：deferred 通道在本插件路径上**实际不可达**（最重要）

这条与契约早期对 deferred 的预期不一致，直接影响"能派什么活给这个插件"。

| 实测项 | 结果 |
|---|---|
| `bpy.ops.render.render("INVOKE_DEFAULT", write_still=True)` | **同步阻塞**：返回时 `bpy.app.is_job_running("RENDER")` 已为 `False`，函数耗时 = 整段渲染耗时（320×180/8 采样 0.24 s；1920×1080/64 采样 8.58 s） |
| `bpy.ops.render.render("INVOKE_DEFAULT", animation=True)` | 同样阻塞（3.29 s 就是实际渲染时间） |
| 裸协议下带 `check_is_finished` 的调用 | ✅ deferred **机制本身可用**（1.1 s 返回，两段读取正常） |
| `check_is_finished` 每 tick 检查的 `is_job_running("RENDER")` | 永远是 `False`（渲染已同步做完）→ **轮询立即返回"完成"** |

**结论**：`INVOKE_DEFAULT` 在 socket exec 上下文里拿不到 UI，于是退化为同步执行。
`deferredTimeoutMs` 与两段读取的机制是对的，但**在 Blender 渲染这条路径上找不到能触发它的真实长任务**；
上游自己的 `_template_deferred_tool_check_for_file_output.py` 也受限在同一处。

**对使用的直接后果**：**任何一次 `exec` 都必须控制在 `responseTimeoutMs`（默认 30 s）以内。**

| 实测预算 | 耗时 |
|---|---|
| 1920×1080 / 128 采样 + 合成器 | ≈ **17.0 s**（安全） |
| 1920×1080 / 256 采样单帧 | > 30 s（会 `response-timeout`） |

高采样出图请用 **Blender 自己的 F12**——那是真后台渲染，不受本通道约束。

---

## 2. 合成器与渲染 API（多处改名 / 改语义）

每一个都会让"照着旧写法写的代码"**静默失败或不报错地做错**。

| 项 | 旧写法（会失败） | 5.2 的正确做法 |
|---|---|---|
| 合成器挂在哪 | `scene.use_nodes = True; scene.node_tree` → **`AttributeError: 'Scene' object has no attribute 'node_tree'`** | `scene.compositing_node_group`（`NodeTree \| None`）；`use_nodes` 已弃用（恒为 True） |
| 新建合成节点组 | 期望算子自动挂上 | `bpy.ops.node.new_compositing_node_group()` **只建组、不挂到场景**，要自己从 `bpy.data.node_groups` 取回并赋值 |
| 认合成节点组 | `group.tree_type == "COMPOSITING"`（属性不存在） | 节点组的 `bl_idname == "CompositorNodeTree"` |
| `Mix` / `MixRGB` | `CompositorNodeMixRGB` → **未定义节点类型** | 已移除。替代是 `CompositorNodeAlphaOver`，但它的前景/背景语义**与直觉相反**（Fac≈0.16 时整幅画面变成泛光层——实测惨白一片） |
| `MapRange` | `CompositorNodeMapRange` → 未定义 | 合成器里没有；`ShaderNodeMapRange` 只在材质里可用 |
| 噪声 | `CompositorNodeTexNoise` → 未定义 | 合成器里没有；噪波只能来自渲染层或材质 |
| 输出 | `CompositorNodeComposite` → 未定义 | 用合成节点组自带的 `NodeGroupOutput`；另有 `CompositorNodeViewer` |
| Glare / ColorBalance 的参数 | `node.glare_type = "BLOOM"`、`node.correction_method = …` → **AttributeError** | 这些是**输入插槽**：`inputs["Type"]`、`["Quality"]`、`["Threshold"]`、`["Size"]`、`["Streaks"]`、`["Strength"]`；ColorBalance 的 `["Type"]`/`["Lift"]`/`["Gamma"]`/`["Gain"]` |
| 输出文件节点 | `node.base_path`、`node.file_slots[0].path` | `node.directory` + `node.file_name`；条目用 `file_output_items.new("RGBA", "Image")`（**socket_type 在前**，且 `"Image"` **不是**合法 socket_type） |
| 引擎枚举 | 用它判断 Cycles 是否存在 | 枚举**只列 `BLENDER_EEVEE`**，但直接赋值 `= "CYCLES"` 成功（见 §3） |

**排查手段的教训**：上表里有三条是靠**内省**（`node.bl_rna.properties` / 逐类型 `nodes.new()` 试探）
而不是查文档定位的——RST 文档只列了部分属性，`bpy.types` 的 `dir()` 又看不到运行时注册的节点类型。
**装一个实例再问它自己**是最快的路径。

---

## 3. Cycles 可用性（修正一条旧结论）

契约曾记「引擎枚举只列 `BLENDER_EEVEE`，**不可作能力判据**」——实测证实该判断正确：

| 观察 | 结果 |
|---|---|
| `bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items` | 只有 `BLENDER_EEVEE` |
| 直接 `scene.render.engine = "CYCLES"` | ✅ **成功**，`scene.cycles` 可用 |
| 设备 | `GPU`；偏好认到 `NVIDIA GeForce RTX 5060 Laptop GPU`（CUDA / OPTIX 均可用） |
| 默认采样 / 降噪 | 2048 / `OPENIMAGEDENOISE` |
| `volume_bounces` 默认 **0** | ⚠️ **必须显式调到 ≥1**，否则体积雾完全不参与光传播（表现为"雾看不见"） |
| 出图耗时 | 1280×720 / 48 采样 ≈ **3 s**；1920×1080 / 256 采样 ≈ **23.5 s** |

---

## 4. 任务目录位置：`taskRootMode` 的两个取值

| 检查 | 结果 |
|---|---|
| `blendFile`（**默认**）：任务目录在活动 `.blend` 旁边 | ✅ `<blendDir>\.dsh-blender-*` |
| `workspace`：任务目录在会话 workspace 下 | ✅ |
| 两个取值落在不同目录 | ✅ |
| 显式 `taskRoot` 覆盖 `taskRootMode` | ✅ |
| 活动工程未保存（无路径） | 回退 workspace 并 `console.warn` **说明原因**，不静默 |

**⚠️ 这决定了信任边界的位置**：它仍符合 I5（可写范围只有那一个任务目录），
但默认值下**任务目录的位置跟着工程文件走**，等于允许写工程文件所在目录下的一个子目录。
要解耦就用 `taskRootMode: workspace`。**这不是安全边界，只防误操作**（I10）。

**连带实测**：两个取值之间切换时，原先硬编码另一侧路径的脚本会立刻被护栏拒绝：
`write-outside-scope: <workspace>\…\renders | writable scope: <blendDir>\…`
——护栏在正确跟随新边界。

---

## 5. `render` 之外的两条环境事实

| 观察 | 影响 |
|---|---|
| `bpy.data.libraries.load(<当前 .blend>)` → `ValueError: Cannot load from the current blend file.` | **无法**只读地读回"磁盘上保存的设置"作基线；只能靠会话内快照 |
| `exec` 命名空间里**没有默认绑定 `bpy`** | 用户代码漏写 `import bpy` 会得到**空 `result` 且不报错**；工具描述已写明这一点 |

---

## 6. undo 栈对 Python **不可观测**

契约曾经要求"回滚前比较 undo 基线，看是否出现非本插件的栈增长（= 用户手工编辑过）"。
**这条在 5.2 上无从测量**——逐个排查能观察 undo 的途径：

| 候选 | 实测结果 |
|---|---|
| `bpy.types.Scene.undo_history` | **属性不存在**（`dir(Scene)` 里与 undo 相关的只有 `use_auto_undo`、`undo_factor`） |
| `bpy.types.WindowManager.history_active` | **属性不存在** |
| `bpy.app.memory_usage_undo` | 存在，但是**函数**（`builtin_function_or_method`）；参与减法会 `TypeError: unsupported operand type(s)` |
| `preferences.edit.undo_steps` | 可读（本机 32），是**上限**，不是当前深度 |

`memory_usage_undo()` 的**灵敏度**是决定性的那条：

| 操作 | `memory_usage_undo()` |
|---|---|
| `bpy.ops.ed.undo_push` | 991046 → **1101578**（跳变） |
| `bpy.ops.mesh.primitive_cube_add` | 不变 |
| `bpy.ops.object.delete` | 不变 |
| `obj.location` 反复写入 | 不变 |

**结论**：它只反映"插件自己 push 的那一条"，**用户的编辑不让它动**。
拿它当增长指标，检测会退化成恒假命题。

**对实现的直接后果**：

1. 任何形如"检查基线之后有没有栈增长"的代码**写出来就是假的**——
   两侧读到的都是 `None`，`possibleUserEdits` 恒为 `false`，
   而 `false` 在契约里的含义是"没有用户编辑，可以安全回滚"。**恒真的安心信号比没有信号更危险。**
2. 所以 `undoPrecheck` 只能交 `measurable: false` + `userEditsIndeterminate: true`，
   并把判定权交回调用方（规则在 [`contract.md#checkpoint-undo`](contract.md#checkpoint-undo)）。
3. 基线里**不要**记"栈深度"字段（留着它就是一条永久为假的断言）；
   `memoryUsageUndo` 可以作为"插件自己 push 过"的旁证保留，但**不得**当增长指标。
4. "先试 undo 回退"这条快路径在无法证明安全时**不得自动采用**——检查点是唯一可靠的回滚来源。
