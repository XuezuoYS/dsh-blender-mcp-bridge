<!-- source: api/bpy.types.NodesModifierDataBlock.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.NodesModifierDataBlock.id`

:type: :class:`ID` | None

### data `bpy.types.NodesModifierDataBlock.id_name`

Name that is mapped to the referenced data-block (default "", readonly, never None)

:type: str

### data `bpy.types.NodesModifierDataBlock.id_type`

(default ``'ACTION'``, readonly)

:type: Literal[:ref:`rna_enum_id_type_items`]

### data `bpy.types.NodesModifierDataBlock.lib_name`

Used when the data block is not local to the current .blend file but is linked from some library (default "", readonly, never None)

:type: str

### classmethod `bpy.types.NodesModifierDataBlock.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.NodesModifierDataBlock.bl_rna_get_subclass_py`

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

- :class:`NodesModifierBake.data_blocks`
