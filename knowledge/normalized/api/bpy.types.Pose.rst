<!-- source: api/bpy.types.Pose.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Pose`

A collection of pose channels, including settings for animating bones

### data `bpy.types.Pose.animation_visualization`

Animation data for this data-block (readonly, never None)

:type: :class:`AnimViz`

### data `bpy.types.Pose.bones`

Individual pose bones for the armature (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`PoseBone`]

### data `bpy.types.Pose.ik_param`

Parameters for IK solver (readonly)

:type: :class:`IKParam` | None

### attribute `bpy.types.Pose.ik_solver`

Selection of IK solver for IK chain (default ``'LEGACY'``)

- ``LEGACY``
  Standard -- Original IK solver.
- ``ITASC``
  iTaSC -- Multi constraint, stateful IK solver.

:type: Literal['LEGACY', 'ITASC']

### attribute `bpy.types.Pose.use_auto_ik`

Add temporary IK constraints while grabbing bones in Pose Mode (default False)

:type: bool

### attribute `bpy.types.Pose.use_mirror_relative`

Apply relative transformations in X-mirror mode (not supported with Auto IK) (default False)

:type: bool

### attribute `bpy.types.Pose.use_mirror_x`

Apply changes to matching bone on opposite side of X-Axis (default False)

:type: bool

### classmethod `bpy.types.Pose.apply_pose_from_action`

Apply the given action to this pose by evaluating it at a specific time. Only updates the pose of selected bones, or all bones if none are selected.

:param action: Action, The Action containing the pose
:type action: :class:`Action` | None
:param evaluation_time: Evaluation Time, Time at which the given action is evaluated to obtain the pose (in [-inf, inf], optional)
:type evaluation_time: float

### classmethod `bpy.types.Pose.blend_pose_from_action`

Blend the given action into this pose by evaluating it at a specific time. Only updates the pose of selected bones, or all bones if none are selected.

:param action: Action, The Action containing the pose
:type action: :class:`Action` | None
:param blend_factor: Blend Factor, How much the given Action affects the final pose (in [0, 1], optional)
:type blend_factor: float
:param evaluation_time: Evaluation Time, Time at which the given action is evaluated to obtain the pose (in [-inf, inf], optional)
:type evaluation_time: float

### classmethod `bpy.types.Pose.backup_create`

Create a backup of the current pose. Only those bones that are animated in the Action are backed up. The object owns the backup, and each object can have only one backup at a time. When you no longer need it, it must be freed use ``backup_clear()``.

:param action: Action, An Action with animation data for the bones. Only the animated bones will be included in the backup.
:type action: :class:`Action` | None

### classmethod `bpy.types.Pose.backup_restore`

Restore the previously made pose backup. This can be called multiple times. See ``Pose.backup_create()`` for more info.

:return: ``True`` when the backup was restored, ``False`` if there was no backup to restore
:rtype: bool

### classmethod `bpy.types.Pose.backup_clear`

Free a previously made pose backup. See ``Pose.backup_create()`` for more info.

### classmethod `bpy.types.Pose.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Pose.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`

:columns: 2

- :class:`bpy_struct.as_pointer`
- :class:`bpy_struct.driver_add`
- :class:`bpy_struct.driver_remove`
- :class:`bpy_struct.get`
- :class:`bpy_struct.id_properties_clear`
- :class:`bpy_struct.id_properties_ensure`
- :class:`bpy_struct.id_properties_ui`
- :class:`bpy_struct.is_property_hidden`
- :class:`bpy_struct.is_property_overridable_library`
- :class:`bpy_struct.is_property_readonly`
- :class:`bpy_struct.is_property_set`
- :class:`bpy_struct.items`
- :class:`bpy_struct.keyframe_delete`
- :class:`bpy_struct.keyframe_insert`
- :class:`bpy_struct.keys`
- :class:`bpy_struct.path_from_id`
- :class:`bpy_struct.path_from_module`
- :class:`bpy_struct.path_resolve`
- :class:`bpy_struct.pop`
- :class:`bpy_struct.property_overridable_library_set`
- :class:`bpy_struct.property_unset`
- :class:`bpy_struct.rna_ancestors`
- :class:`bpy_struct.type_recast`
- :class:`bpy_struct.values`

:columns: 2

- :class:`Object.pose`
