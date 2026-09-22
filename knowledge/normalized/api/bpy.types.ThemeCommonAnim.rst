<!-- source: api/bpy.types.ThemeCommonAnim.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ThemeCommonAnim`

Shared animation theme properties

### attribute `bpy.types.ThemeCommonAnim.channel`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.channel_group`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.channel_group_active`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.channel_selected`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.channels`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.channels_sub`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.keyframe`

Color of regular keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_breakdown`

Color of breakdown keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_breakdown_selected`

Color of selected breakdown keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_extreme`

Color of extreme keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_extreme_selected`

Color of selected extreme keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_generated`

Color of generated keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_generated_selected`

Color of selected generated keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_jitter`

Color of jitter keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_jitter_selected`

Color of selected jitter keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_moving_hold`

Color of moving hold keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_moving_hold_selected`

Color of selected moving hold keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.keyframe_selected`

Color of selected keyframe (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.long_key`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.long_key_selected`

(array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.playhead`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeCommonAnim.preview_range`

Color of preview range overlay (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeCommonAnim.scene_strip_range`

Color of scene strip range overlay (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### classmethod `bpy.types.ThemeCommonAnim.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ThemeCommonAnim.bl_rna_get_subclass_py`

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

- :class:`ThemeCommon.anim`
