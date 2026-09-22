<!-- source: api/bpy.types.NodeLink.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.NodeLink`

Link between nodes in a node tree

### data `bpy.types.NodeLink.from_node`

(readonly)

:type: :class:`Node` | None

### data `bpy.types.NodeLink.from_socket`

(readonly)

:type: :class:`NodeSocket` | None

### data `bpy.types.NodeLink.is_hidden`

Link is hidden due to invisible sockets (default False, readonly)

:type: bool

### attribute `bpy.types.NodeLink.is_muted`

Link is muted and can be ignored (default False)

:type: bool

### attribute `bpy.types.NodeLink.is_valid`

Link is valid (default False)

:type: bool

### data `bpy.types.NodeLink.multi_input_sort_id`

Used to sort multiple links coming into the same input. The highest ID is at the top. (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.NodeLink.to_node`

(readonly)

:type: :class:`Node` | None

### data `bpy.types.NodeLink.to_socket`

(readonly)

:type: :class:`NodeSocket` | None

### method `bpy.types.NodeLink.swap_multi_input_sort_id`

Swap the order of two links connected to the same multi-input socket

:param other: Other, The other link. Must link to the same multi-input socket. (never None)
:type other: :class:`NodeLink` | None

### classmethod `bpy.types.NodeLink.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.NodeLink.bl_rna_get_subclass_py`

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

- :class:`Node.insert_link`
- :class:`Node.internal_links`
- :class:`NodeLink.swap_multi_input_sort_id`
- :class:`NodeLinks.new`
- :class:`NodeLinks.remove`
- :class:`NodeTree.links`
