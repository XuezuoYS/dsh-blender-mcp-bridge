<!-- source: api/bpy.types.BrushCapabilitiesSculpt.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.BrushCapabilitiesSculpt`

Read-only indications of which brush operations are supported by the current sculpt tool

### data `bpy.types.BrushCapabilitiesSculpt.has_accumulate`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_auto_smooth`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_auto_smooth_pressure`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_color`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_direction`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_dyntopo`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_gravity`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_hardness`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_hardness_pressure`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_height`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_jitter`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_normal_radius`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_normal_weight`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_persistence`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_pinch_factor`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_plane_depth`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_plane_height`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_plane_offset`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_rake_factor`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_random_texture_angle`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_sculpt_plane`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_secondary_color`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_size_pressure`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_smooth_stroke`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_space_attenuation`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_strength_pressure`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_tilt`

(default False, readonly)

:type: bool

### data `bpy.types.BrushCapabilitiesSculpt.has_topology_rake`

(default False, readonly)

:type: bool

### classmethod `bpy.types.BrushCapabilitiesSculpt.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.BrushCapabilitiesSculpt.bl_rna_get_subclass_py`

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

- :class:`Brush.sculpt_capabilities`
