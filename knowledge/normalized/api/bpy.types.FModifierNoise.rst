<!-- source: api/bpy.types.FModifierNoise.rst -->

base classes --- :class:`bpy_struct`, :class:`FModifier`

### class `bpy.types.FModifierNoise`

Give randomness to the modified F-Curve

### attribute `bpy.types.FModifierNoise.blend_type`

Method of modifying the existing F-Curve (default ``'REPLACE'``)

:type: Literal['REPLACE', 'ADD', 'SUBTRACT', 'MULTIPLY']

### attribute `bpy.types.FModifierNoise.depth`

Amount of fine level detail present in the noise (in [0, 32767], default 0)

:type: int

### attribute `bpy.types.FModifierNoise.lacunarity`

Gap between successive frequencies. Depth needs to be greater than 0 for this to have an effect (in [-inf, inf], default 2.0)

:type: float

### attribute `bpy.types.FModifierNoise.offset`

Time offset for the noise effect (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.FModifierNoise.phase`

A random seed for the noise effect (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.FModifierNoise.roughness`

Amount of high frequency detail. Depth needs to be greater than 0 for this to have an effect (in [-inf, inf], default 0.5)

:type: float

### attribute `bpy.types.FModifierNoise.scale`

Scaling (in time) of the noise (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.FModifierNoise.strength`

Amplitude of the noise - the amount that it modifies the underlying curve (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.FModifierNoise.use_legacy_noise`

Use the legacy way of generating noise. Has the issue that it can produce values outside of -1/1 (default False)

:type: bool

### classmethod `bpy.types.FModifierNoise.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.FModifierNoise.bl_rna_get_subclass_py`

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
