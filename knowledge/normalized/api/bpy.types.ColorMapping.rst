<!-- source: api/bpy.types.ColorMapping.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ColorMapping`

Color mapping settings

### attribute `bpy.types.ColorMapping.blend_color`

Blend color to mix with texture output color (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ColorMapping.blend_factor`

(in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.ColorMapping.blend_type`

Mode used to mix with texture output color (default ``'MIX'``)

:type: Literal['MIX', 'DARKEN', 'MULTIPLY', 'LIGHTEN', 'SCREEN', 'ADD', 'OVERLAY', 'SOFT_LIGHT', 'LINEAR_LIGHT', 'DIFFERENCE', 'SUBTRACT', 'DIVIDE', 'HUE', 'SATURATION', 'COLOR', 'VALUE']

### attribute `bpy.types.ColorMapping.brightness`

Adjust the brightness of the texture (in [0, 2], default 0.0)

:type: float

### data `bpy.types.ColorMapping.color_ramp`

(readonly)

:type: :class:`ColorRamp` | None

### attribute `bpy.types.ColorMapping.contrast`

Adjust the contrast of the texture (in [0, 5], default 0.0)

:type: float

### attribute `bpy.types.ColorMapping.saturation`

Adjust the saturation of colors in the texture (in [0, 2], default 0.0)

:type: float

### attribute `bpy.types.ColorMapping.use_color_ramp`

Toggle color ramp operations (default False)

:type: bool

### classmethod `bpy.types.ColorMapping.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ColorMapping.bl_rna_get_subclass_py`

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

- :class:`ShaderNodeTexBrick.color_mapping`
- :class:`ShaderNodeTexChecker.color_mapping`
- :class:`ShaderNodeTexEnvironment.color_mapping`
- :class:`ShaderNodeTexGabor.color_mapping`
- :class:`ShaderNodeTexGradient.color_mapping`
- :class:`ShaderNodeTexImage.color_mapping`
- :class:`ShaderNodeTexMagic.color_mapping`
- :class:`ShaderNodeTexNoise.color_mapping`
- :class:`ShaderNodeTexSky.color_mapping`
- :class:`ShaderNodeTexVoronoi.color_mapping`
- :class:`ShaderNodeTexWave.color_mapping`
