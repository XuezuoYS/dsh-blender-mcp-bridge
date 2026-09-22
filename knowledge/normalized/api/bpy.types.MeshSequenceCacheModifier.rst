<!-- source: api/bpy.types.MeshSequenceCacheModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.MeshSequenceCacheModifier`

Cache Mesh

### attribute `bpy.types.MeshSequenceCacheModifier.cache_file`

:type: :class:`CacheFile` | None

### attribute `bpy.types.MeshSequenceCacheModifier.object_path`

Path to the object in the Alembic archive used to lookup geometric data (default "", never None)

:type: str

### attribute `bpy.types.MeshSequenceCacheModifier.read_data`

Data to read from the cache (default {``'ATTRIBUTES'``, ``'COLOR'``, ``'POLY'``, ``'UV'``, ``'VERT'``})

:type: set[Literal['VERT', 'POLY', 'UV', 'COLOR', 'ATTRIBUTES']]

### attribute `bpy.types.MeshSequenceCacheModifier.use_vertex_interpolation`

Allow interpolation of vertex positions (default True)

:type: bool

### attribute `bpy.types.MeshSequenceCacheModifier.velocity_scale`

Multiplier used to control the magnitude of the velocity vectors for time effects (in [0, inf], default 1.0)

:type: float

### classmethod `bpy.types.MeshSequenceCacheModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshSequenceCacheModifier.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Modifier.name`
- :class:`Modifier.type`
- :class:`Modifier.show_viewport`
- :class:`Modifier.show_render`
- :class:`Modifier.show_in_editmode`
- :class:`Modifier.show_on_cage`
- :class:`Modifier.show_expanded`
- :class:`Modifier.is_active`
- :class:`Modifier.use_pin_to_last`
- :class:`Modifier.is_override_data`
- :class:`Modifier.use_apply_on_spline`
- :class:`Modifier.execution_time`
- :class:`Modifier.persistent_uid`

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
- :class:`Modifier.bl_rna_get_subclass`
- :class:`Modifier.bl_rna_get_subclass_py`
