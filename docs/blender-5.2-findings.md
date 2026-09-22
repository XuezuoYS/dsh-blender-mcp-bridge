# Blender 5.2 实测发现

> 本文件记录**在本机 Blender 5.2.2 LTS 上实测到的、与直觉或旧文档不符的行为**。
> 它不是契约（规则在 [`contract.md`](contract.md)），也不是交付状态（那是
> [`../.AGENTS/README.md`](../.AGENTS/README.md)）。
> 这些发现是**实现的直接依据**——每一条都曾让代码静默失败，或让结论出错。
>
> 全部标注为 **实测**：都是在活动 GUI 会话 / 独立后台实例上跑出来的观察，不是推断。

---

## 1. 渲染通道：`render` 的三个坑（**结论已按 2026-09-22 报告修订**）

> ⚠️ **本节经过一次修订**。下表同时给出**两次实测**的结果，并说明那份互相矛盾的早期结论
> 是怎么来的。**裁决：以 2026-09-22 的实测报告为准。** 修订前的版本断言
> "`INVOKE_DEFAULT` 在本通道下**同步阻塞**"，据此推出"deferred 分支实际不可达"——
> 后续实测**推翻了**它（见"两态"一段）。

### 1.1 三次调用、三种结果（**实测**）

| 调用 | 返回 | 耗时 | `Render Result` | 结论 |
|---|---|---|---|---|
| `bpy.ops.render.render()` | `FINISHED` | **0.00 s** | **0×0，无数据** | ⚠️ **静默空转**：报成功却什么都没渲染 |
| `bpy.ops.render.render(write_still=True)` | `FINISHED` | **0.88 s** | 真出图 | ✅ **唯一可靠姿势** |
| `bpy.ops.render.render('INVOKE_DEFAULT')` | `RUNNING_MODAL` | 0.03 s | 异步，`bpy.app.is_job_running('RENDER')` 为真 | 异步 |
| `bpy.ops.render.render('INVOKE_DEFAULT', write_still=True)` | `RUNNING_MODAL` | 0 s | 异步，**跨 exec 继续跑** | 异步 |

**三条硬结论**：

1. **走 socket 时唯一可靠的出图姿势是 `write_still=True`**（同步 + 直写文件）。
   不带它的 `render()` 返回 `FINISHED` 却什么都没干——这正是本插件知识库反复警告的那类
   "静默失败"，而此前**没有覆盖到渲染算子**（已补进 G3）。
2. `INVOKE_DEFAULT` 是**异步**的：它与 `deferred` 通道叠加使用会导致"一次 exec 看起来很快返回、
   渲染在你之后才落盘"。
3. 因此**任何一次 `exec` 都必须自己控制在 `responseTimeoutMs`（默认 30 s）以内**：
   `write_still=True` 是同步的，它的耗时就是真实渲染耗时。

### 1.2 关于"同步阻塞"这份被测伪的旧结论

修订前本节的表格是：`render("INVOKE_DEFAULT", write_still=True)` "**同步阻塞**：
返回时 `bpy.app.is_job_running("RENDER")` 已为 `False`，函数耗时 = 整段渲染耗时
（320×180/8 采样 0.24 s；1920×1080/64 采样 8.58 s）"。

**它当时是怎么被验证的**：探针在同一个 exec 内先读 `is_job_running` 再回读文件，
两次读到的是同一个"已经结束"的状态——**两种机制（同步执行 vs. 异步但恰好已跑完）都能解释这个观察**，
而当时的判据只取了耗时与一个瞬时布尔量，**没有区分这两种解释**。判据不够强，所以结论过硬了。

后续（2026-09-22）在活动 GUI 会话上直接观察到 `RUNNING_MODAL` + `is_job_running=true`，
并有**跨 exec 落盘**的铁证：一次 `INVOKE_DEFAULT` 起的渲染在本插件的 exec 返回**之后**
写出了 `C:\tmp\Untitled.png`（72,966 B，时间戳晚于调用）。

**教训（写进判据纪律）**：耗时与瞬时状态**不足以**判定"同步还是异步"——
必须有一个**只有异步才成立**的观察（例如"返回之后文件才出现"，或"返回时 job 仍在跑且此后仍有产出"）。
这条与 `knowledge/g3-rules.md` 的"可失败的判据"同源。

### 1.3 对使用的直接后果

| 实测预算 | 耗时 |
|---|---|
| 1920×1080 / 128 采样 + 合成器 | ≈ **17.0 s**（安全） |
| 1920×1080 / 256 采样单帧 | > 30 s（会 `response-timeout`） |

高采样出图请用 **Blender 自己的 F12**——那是真后台渲染，不受本通道约束。
若确实要在通道内起异步渲染，**必须知道护栏的覆盖窗口在 exec 返回时就结束了**：
异步任务的落盘在窗口之外，不受约束（[`contract.md#guard`](contract.md#guard) §9.5）。
本插件现在会把这件事**如实报出来**（`guard.jobsRunning` + `guard.window`）。

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

---

## 7. 合成器与几何节点的**静默失败**

以下每一条都在 2026-09-22 的实机流程里**真的踩到过**，且都是"看起来对了、其实错了"那一类：
没有任何异常，只是结果不对。它们已同步进 `knowledge/g3-rules.md`（`buildKnowledge.js` 的 `buildRules`）。

### 7.1 `scene.compositing_node_group` 的输入**不是自动喂的**

必须在组里自己放一个 `CompositorNodeRLayers` 当源。第一版只挂了 `NodeGroupInput`，
结果**渲染出空图**：3706 B vs 修好后的 556 KB。

> ⚠️ §2 的表只说了"用自带的 `NodeGroupOutput`"，**漏了源节点**——这是本节要补的第一件事。

### 7.2 菜单型输入用**显示名**，而且它是 `NodeSocketMenu`

```python
glare.inputs['Type'].default_value = 'Bloom'    # ✅ 合法值：'Bloom' / 'Ghosts' / 'Streaks' / 'Fog Glow' / …
glare.inputs['Type'].default_value = 'BLOOM'    # ❌ enum "BLOOM" not found in (...)
```

它是 `NodeSocketMenu`，**没有 `.enum_items`**——想枚举合法值不能走 `enum_items`。

### 7.3 `NodesModifier` 的 socket **不能用 `mod[key]` 写**

5.2 起该类型**不支持 IDProperties**：

```python
mod['Density']                      # ❌ 抛 "this type doesn't support IDProperties"（md.keys() 同）
mod.properties.inputs['Density']    # → IDPropertyGroup：只有 keys() / values / name，**没有 .value**
```

实测的绕法：**每个发射器一棵节点组，把参数写进接口默认值**。

### 7.4 接口默认值**不向已存在的 modifier 传播**

改了 `interface.items_tree` 里 `Density` 的 `default_value` 之后，**已经挂上该节点组的 modifier
仍然按旧值求值**——组件实例化密度纹丝不动，且**不报错**。
这条会直接害人（**静默不生效**）：要么先改接口再挂 modifier，要么重建 modifier。

### 7.5 `MeshToPoints + Instance on Points` 的结果**不在 `object.data` 里**

`evaluated_get(depsgraph).data` 读到 **0 顶点**，于是无法验证、也无法导出。
必须加一个 **`Realize Instances`** 才能把结果落成真几何。
（不知道这条会白折腾一轮——很容易误判成"节点树接错了"。）

### 7.6 `DistributePointsOnFaces` 的 `Density` 语义需要**标定**

同一表面：`Density` 从 0.037 → 0.16 得到 **57 → 220** 个点。
按"每平方米点数"的直觉估的值**差了约 40 倍**。
先用小场景标定一次再往大场景上套。

### 7.7 实例**继承资产卡片自己的材质**

`Instance on Points` 出来的叶片继承的是**被实例化对象自己的材质**（`MAT_Foliage_Cream`），
**发射器对象上的材质槽被无视**——首轮渲染里绿色灌木全部渲染成白色。

修法：在散布节点树里加一个 **`GeometryNodeSetMaterial`**。
这类 bug **只有渲染 + 肉眼看图才能发现**（`object.data` 与 `material_slots` 都是"对的"）。

---

## 8. 摄像机 `rotation_euler.x` 的符号方向

`> 90°` 才是**抬头**，`< 90°` 是**低头**（0° 平视、180° 垂直向下）。

实测踩坑：第一版取 `81°` 想"抬 9°"，实际是**低头 9°**，于是**天花板全被切掉**。
这类几何直觉错误，模型一次就会犯——写摄像机朝向时**先确认符号**，或直接用
`Vector`/`to_track_quat` 按目标点求旋转，不要手算欧拉角。
