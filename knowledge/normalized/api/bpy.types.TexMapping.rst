<!-- source: api/bpy.types.TexMapping.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.TexMapping`

Texture coordinate mapping settings

### attribute `bpy.types.TexMapping.mapping`

(default ``'FLAT'``)

- ``FLAT``
  Flat -- Map X and Y coordinates directly.
- ``CUBE``
  Cube -- Map using the normal vector.
- ``TUBE``
  Tube -- Map with Z as central axis.
- ``SPHERE``
  Sphere -- Map with Z as central axis.

:type: Literal['FLAT', 'CUBE', 'TUBE', 'SPHERE']

### attribute `bpy.types.TexMapping.mapping_x`

(default ``'NONE'``)

:type: Literal['NONE', 'X', 'Y', 'Z']

### attribute `bpy.types.TexMapping.mapping_y`

(default ``'NONE'``)

:type: Literal['NONE', 'X', 'Y', 'Z']

### attribute `bpy.types.TexMapping.mapping_z`

(default ``'NONE'``)

:type: Literal['NONE', 'X', 'Y', 'Z']

### attribute `bpy.types.TexMapping.max`

Maximum value for clipping (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.TexMapping.min`

Minimum value for clipping (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.TexMapping.rotation`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Euler`

### attribute `bpy.types.TexMapping.scale`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.TexMapping.translation`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.TexMapping.use_max`

Whether to use maximum clipping value (default False)

:type: bool

### attribute `bpy.types.TexMapping.use_min`

Whether to use minimum clipping value (default False)

:type: bool

### attribute `bpy.types.TexMapping.vector_type`

Type of vector that the mapping transforms (default ``'POINT'``)

:type: Literal[:ref:`rna_enum_mapping_type_items`]

### classmethod `bpy.types.TexMapping.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.TexMapping.bl_rna_get_subclass_py`

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

- :class:`ShaderNodeTexBrick.texture_mapping`
- :class:`ShaderNodeTexChecker.texture_mapping`
- :class:`ShaderNodeTexEnvironment.texture_mapping`
- :class:`ShaderNodeTexGabor.texture_mapping`
- :class:`ShaderNodeTexGradient.texture_mapping`
- :class:`ShaderNodeTexImage.texture_mapping`
- :class:`ShaderNodeTexMagic.texture_mapping`
- :class:`ShaderNodeTexNoise.texture_mapping`
- :class:`ShaderNodeTexSky.texture_mapping`
- :class:`ShaderNodeTexVoronoi.texture_mapping`
- :class:`ShaderNodeTexWave.texture_mapping`
