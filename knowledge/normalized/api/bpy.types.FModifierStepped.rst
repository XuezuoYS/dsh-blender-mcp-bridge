<!-- source: api/bpy.types.FModifierStepped.rst -->

base classes --- :class:`bpy_struct`, :class:`FModifier`

### class `bpy.types.FModifierStepped`

Hold each interpolated value from the F-Curve for several frames without changing the timing

### attribute `bpy.types.FModifierStepped.frame_end`

Frame that modifier's influence ends (if applicable) (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.FModifierStepped.frame_offset`

Reference number of frames before frames get held (use to get hold for '1-3' vs '5-7' holding patterns) (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.FModifierStepped.frame_start`

Frame that modifier's influence starts (if applicable) (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.FModifierStepped.frame_step`

Number of frames to hold each value (in [-inf, inf], default 2.0)

:type: float

### attribute `bpy.types.FModifierStepped.use_frame_end`

Restrict modifier to only act before its 'end' frame (default False)

:type: bool

### attribute `bpy.types.FModifierStepped.use_frame_start`

Restrict modifier to only act after its 'start' frame (default False)

:type: bool

### classmethod `bpy.types.FModifierStepped.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.FModifierStepped.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`FModifier.name`
- :class:`FModifier.type`
- :class:`FModifier.show_expanded`
- :class:`FModifier.mute`
- :class:`FModifier.is_valid`
- :class:`FModifier.active`
- :class:`FModifier.use_restricted_range`
- :class:`FModifier.frame_start`
- :class:`FModifier.frame_end`
- :class:`FModifier.blend_in`
- :class:`FModifier.blend_out`
- :class:`FModifier.use_influence`
- :class:`FModifier.influence`

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
- :class:`FModifier.bl_rna_get_subclass`
- :class:`FModifier.bl_rna_get_subclass_py`
