<!-- source: api/bpy.types.MotionPath.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MotionPath`

Cache of the world-space positions of an element over a frame range

### attribute `bpy.types.MotionPath.color`

Custom color for motion path before the current frame (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.MotionPath.color_post`

Custom color for motion path after the current frame (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### data `bpy.types.MotionPath.frame_end`

End frame of the stored range (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.MotionPath.frame_start`

Starting frame of the stored range (in [-inf, inf], default 0, readonly)

:type: int

### attribute `bpy.types.MotionPath.is_modified`

Path is being edited (default False)

:type: bool

### data `bpy.types.MotionPath.length`

Number of frames cached (in [-inf, inf], default 0, readonly)

:type: int

### attribute `bpy.types.MotionPath.line_thickness`

Line thickness for motion path (in [1, 6], default 0)

:type: int

### attribute `bpy.types.MotionPath.lines`

Use straight lines between keyframe points (default False)

:type: bool

### data `bpy.types.MotionPath.points`

Cached positions per frame (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`MotionPathVert`]

### data `bpy.types.MotionPath.use_bone_head`

For PoseBone paths, use the bone head location when calculating this path (default False, readonly)

:type: bool

### attribute `bpy.types.MotionPath.use_custom_color`

Use custom color for this motion path (default False)

:type: bool

### classmethod `bpy.types.MotionPath.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MotionPath.bl_rna_get_subclass_py`

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

- :class:`Object.motion_path`
- :class:`PoseBone.motion_path`
