# G3 规则：写 Blender Python 时反复踩的坑

> 本文件由 `node buildKnowledge.js build` 生成，**不要手改**（改 `buildKnowledge.js` 的 `buildRules`）。
> 内容 = 上游官方注入提示词原文 + 本插件自己的规则（见 docs/contract.md#knowledge-granularity）。

## 官方在连接时注入的「易错点小抄」原文

来源：`lab/blender_mcp: mcp/blmcp/data/prompts.yml`

# Prompts configuration for Blender MCP Server.
# This file contains various prompts and instructions that can be used by the server.

initial_instructions: |
  You have access to Blender tools to interact with a Blender scene directly.
  Blender must be running with the MCP add-on enabled and connected.

  IMPORTANT: Respect existing structure and naming conventions.
  NEVER assume missing values - inspect the scene first.
  Do not destructively modify objects without confirmation.

  # Bundled Manuals

  Reference documentation is bundled alongside this server as plain-text RST files.
  Search and read them directly with standard text tools (grep, file read, etc.):
    * `data/api/` - Blender Python API reference (RST files per module/class).
      Consult when writing or debugging `bpy` code: operator signatures, type
      properties, enum values, etc.
    * `data/manual/` - Blender user manual (RST files mirroring the official manual structure).
      Consult for conceptual explanations, workflow guidance, and feature overviews.

  # Executing Code

  The `execute_blender_code` tool runs Python code via `bpy` in the connected Blender instance.

  The `execute_blender_code` tool is a last resort, if there are other tools that provide
  the functionality you need, use those instead.

  Prefer operators (`bpy.ops`) for standard actions (adding primitives, applying modifiers,
  setting origins) - they handle defaults and context. Use the data API (`bpy.data`) for
  precise control or to avoid side effects.

  Many operators depend on the current mode (Object, Edit, Sculpt, etc.) and which objects
  are active/selected. Verify or set the mode first - wrong mode either fails or silently
  does nothing.

  The **active object** and **selection** are distinct. Many operators require both.
  Set them explicitly - do not assume the current state. Operators change selection and
  active state as a side effect, so re-set both between sequential operator calls on
  different objects.

  Update the dependency graph after changes before reading computed properties
  (world matrices, modifier results, etc.).

  In edit mode, access mesh geometry through the bmesh API, not the regular mesh data API.
  Flush bmesh changes back to the mesh - forgetting this silently loses all edits.

  Return structured data (dicts, lists) from executed code, not print output.

  # Scene & Data Structure

  Blender uses a datablock system - objects and their underlying data (meshes, materials,
  cameras, etc.) are separate entities.

  Hierarchy:
    * **Scene** - top-level container. A .blend can have multiple.
    * **View Layer** - controls collection visibility/selectability.
    * **Collection** - organizational tree. Objects live in collections; can be nested;
      objects can belong to multiple collections.
    * **Object** - has a transform (location, rotation, scale) and references underlying data
      (Mesh, Curve, Camera, etc.). Multiple objects can share the same data (linked duplicates).
    * **Datablocks** - the actual data: geometry, materials, textures, etc.

  Key concepts:
    * Objects and data are separate - deleting one does not delete the other.
    * Orphaned datablocks (zero users) are purged on save/reload or manual purge.
    * Objects created via the data API must be linked to a collection to appear in a scene.
    * Shared data: check user count before modifying a datablock - editing a shared mesh
      affects all objects referencing it. Make single-user first if needed.
    * In most cases file assets:
      * Images, Fonts, Sounds, other `.blend` files -  corraspond to a data-block.

  Visibility has three independent states:
    * **Viewport hidden** - still fully scriptable.
    * **Disabled in view layer** - excluded; may be inaccessible to view-layer-dependent operators.
    * **Disabled for render** - skipped during render, otherwise normal.
  Check these when objects seem "missing" or operators skip them.

  Blender defaults to meters. Check scene unit settings before creating dimensioned objects.

  Exploring scenes:
    * Walk the collection hierarchy for an overview first.
    * Don't dump entire scenes - inspect progressively for large scenes.
    * Check object types, parenting, modifiers, and materials before making changes.

  # Object Types & Creation

  Object types: Mesh, Curve, Surface, Metaball, Text (Font), Armature, Lattice,
  Empty, Camera, Light, Light Probe, Grease Pencil.

  Creating objects:
    * Operators for standard primitives - handle defaults and collection linking.
    * Data API for procedural/batch creation - avoids side effects (selection changes, etc.).
    * Always link new objects to a collection.
    * Names auto-append `.001`, `.002` on collision - capture references immediately
      after creation, never look up by assumed name.

  Delete with unlinking enabled to cleanly remove from all collections.

  Prefer non-destructive workflows: modifiers over direct mesh edits where possible,
  keeping changes adjustable. Apply or edit directly only when final or unavoidable.

  # Transformations & Coordinate Spaces

  Location, rotation, and scale are in local space (parent-relative, or world if unparented).

  Rotation mode determines which property to use (Euler, Quaternion, Axis-Angle).
  Always check rotation mode first - writing to the wrong property is silently ignored.

  Coordinate spaces:
    * **World** - global. Use the world matrix for reliable positions.
    * **Local** - relative to parent. Location/rotation/scale operate here.
    * **Object** - the object's own system. Mesh vertices are in object space;
      multiply by world matrix for world positions.

  Strategies:
    * The origin is the reference point for location; vertices are relative to it.
    * Apply transforms (especially scale) before geometry-dependent operations
      (booleans, physics) - non-uniform scale causes unexpected results.
    * Set the parent inverse matrix when parenting to preserve visual position.
    * Use the world matrix for world-space reads, not manual composition of
      location/rotation/scale.
    * The 3D cursor is a persistent world-space reference used by many operations.

## name-is-not-identity

来源：`dsh-blender-mcp-bridge: docs/contract.md`

名字不是身份：中文界面下 primitive_cube_add() 生成的对象名是「立方体」。归属判定必须用连接时记录的 as_pointer()，不要按名字回查（I2）。

## relative-paths-land-in-blender-cwd

来源：`dsh-blender-mcp-bridge: docs/contract.md`

相对路径会落到 Blender 进程自己的 cwd（实测在 Program Files 下），不是你的 workspace。要落盘就用插件返回的绝对路径。

## overwrite-save-is-refused

来源：`dsh-blender-mcp-bridge: docs/contract.md`

覆盖保存会被拒（bpy.ops.wm.save_mainfile 与不带 copy=True 的 save_as_mainfile 同等对待）。要存盘请走 blender_mcp_snapshot。

## out-of-scope-writes-are-refused

来源：`dsh-blender-mcp-bridge: docs/contract.md`

可写范围只有任务目录 .dsh-blender-{task}/。越界写/删会被 L1 或 L2 拒绝，并返回 suggested_path 与 handoff——那一步需要用户自己在 Blender 或系统里完成。

## checkpoint-before-write

来源：`dsh-blender-mcp-bridge: docs/contract.md`

标记 mutating=true 的调用会先落检查点；检查点写盘失败时**整次调用被拒绝**，不会「无备份继续」。

## screenshots-land-in-task-dir

来源：`dsh-blender-mcp-bridge: docs/contract.md`

截图落在任务目录 renders/ 下，返回里有路径与字节数。socket exec 下没有 UI 上下文：viewport 与 area 目标通常不可用，window 可用。

## preferences-writes-are-refused

来源：`dsh-blender-mcp-bridge: docs/contract.md`

改动 Blender 偏好、add-on 开关、脚本自动执行会被拒（跨会话持久，比丢一个场景更不可逆）。需要用户自己在偏好设置里改。

## guard-is-not-a-sandbox

来源：`dsh-blender-mcp-bridge: docs/contract.md`

这套拦截只防误操作，不是沙箱：动态构造、importlib.reload、ctypes 都可以绕过，而且经此通道执行的代码有与 Blender 同等的网络能力。

## localized-node-names

来源：`dsh-blender-mcp-bridge: docs/contract.md`

按**显示名**取节点会静默失效：本机界面是中文，`nodes.get("Principled BSDF")` 返回 None，赋值被跳过而脚本不报错，结果是材质全用默认灰。按 `bl_idname == "ShaderNodeBsdfPrincipled"` 取，语言无关。同类问题也适用于 `bpy.ops` 面板与偏好项的显示名。

## restore-after-probe

来源：`dsh-blender-mcp-bridge: docs/contract.md`

任何"临时改渲染设置再还原"的探测，如果还原点是在改动**之后**读取的，就会留下中间态（例如分辨率停在 960x540）。要么在改动前先取值，要么在收尾时显式钉回目标设置。

## session-id-decides-scope

来源：`dsh-blender-mcp-bridge: docs/contract.md`

任务目录按会话隔离：调用方换了 sessionId，就会落到 `.dsh-blender-<task>-2`，L2 护栏的 allowRoot 随之改变，之前建的目录反而"越界"。跨多次调用驱动同一场景时，会话 id 必须全程一致。

## render-needs-write-still

来源：`dsh-blender-mcp-bridge: docs/contract.md`

`bpy.ops.render.render()` **不带 `write_still=True` 会静默空转**：返回 `FINISHED`、耗时 0.00 s，而 `Render Result` 是 0×0 无数据——看起来成功，其实什么都没渲染。唯一可靠的出图姿势是 `bpy.ops.render.render(write_still=True)`（同步 + 直写文件）。另外 `render("INVOKE_DEFAULT")` 是**异步**的（返回 `RUNNING_MODAL`，渲染可能在你的 exec 返回**之后**才落盘），不要依赖它"同步做完"。

## compositor-needs-rl-render-layer

来源：`dsh-blender-mcp-bridge: docs/contract.md`

`scene.compositing_node_group` 的输入**不是自动喂的**：必须在组里自己放一个 `CompositorNodeRLayers` 当源。只挂 `NodeGroupInput` 会渲染出**空图**（实测 3.7 KB vs 修好后的 556 KB），而且不报任何错。

## menu-socket-uses-display-name

来源：`dsh-blender-mcp-bridge: docs/contract.md`

菜单型输入的合法值是**显示名**，不是常量名：`Glare.inputs["Type"].default_value = "Bloom"` 对，传 `"BLOOM"` 会报 `enum "BLOOM" not found in (...)`。而且它是 `NodeSocketMenu`，**没有 `.enum_items`**，想枚举合法值不能走那条路。

## nodesmodifier-has-no-idprops

来源：`dsh-blender-mcp-bridge: docs/contract.md`

`NodesModifier` 的 socket **不能用 `mod[key]` 写**（5.2 起该类型不支持 IDProperties，`md.keys()` 直接抛 "this type doesn't support IDProperties"）；`mod.properties.inputs[identifier]` 返回的是 `IDPropertyGroup`（只有 `keys()` / `values` / `name`），**也没有 `.value`**。绕法：每个发射器一棵节点组，把参数写进**接口默认值**。

## interface-defaults-do-not-propagate

来源：`dsh-blender-mcp-bridge: docs/contract.md`

改了节点组 `interface.items_tree` 里某个接口的 `default_value` **不会传播**到已经挂上该组的 modifier——它仍按旧值求值，而且**不报错**（静默不生效）。要么先调接口再挂 modifier，要么重建 modifier。

## mesh-to-points-needs-realize

来源：`dsh-blender-mcp-bridge: docs/contract.md`

`GeometryNodeMeshToPoints` + `Instance on Points` 的结果**不在 `object.data` 里**：`evaluated_get(depsgraph).data` 读到 0 顶点，于是既不能验证也不能导出。必须加一个 `Realize Instances` 节点才能把结果落成真几何（否则很容易误判成"节点树接错了"）。

## distribute-density-is-not-per-m2

来源：`dsh-blender-mcp-bridge: docs/contract.md`

`DistributePointsOnFaces` 的 `Density` 不是"每平方米点数"：同一表面 Density 从 0.037 → 0.16 只得到 57 → 220 个点，按 m² 直觉估的值会差约 40 倍。先用小场景标定一次再往大场景套，别按直觉填数。

## camera-pitch-sign

来源：`dsh-blender-mcp-bridge: docs/contract.md`

摄像机 `rotation_euler.x` 的符号：**> 90° 才是抬头**，< 90° 是低头（0° 平视）。取 81° 想"抬 9°"实际是**低头 9°**，天花板会被整片切掉。要么确认符号，要么用 `to_track_quat` 按目标点求旋转，不要手算欧拉角。

## instance-uses-asset-material

来源：`dsh-blender-mcp-bridge: docs/contract.md`

`Instance on Points` 出来的实例继承的是**被实例化对象自己的材质**，发射器对象上的材质槽被无视：把绿色灌木渲成一片白就是这么来的。要在散布节点树里加 `GeometryNodeSetMaterial`。这类错误**只有渲染并看图**才能发现——`object.data` 与 `material_slots` 看上去都是对的。

