<!-- source: api/bpy.types.NodeGeometryBakeItem.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.NodeGeometryBakeItem.attribute_domain`

Domain where the field is captured if it is not already an attribute-field (default ``'POINT'``)

:type: Literal[:ref:`rna_enum_attribute_domain_items`]

### data `bpy.types.NodeGeometryBakeItem.color`

Color of the corresponding socket type in the node editor (array of 4 items, in [0, inf], default (0.0, 0.0, 0.0, 0.0), readonly)

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.NodeGeometryBakeItem.is_attribute`

Bake item is an attribute stored on a geometry (default False)

:type: bool

### attribute `bpy.types.NodeGeometryBakeItem.name`

(default "", never None)

:type: str

### attribute `bpy.types.NodeGeometryBakeItem.socket_type`

(default ``'FLOAT'``)

:type: Literal[:ref:`rna_enum_node_socket_data_type_items`]

### classmethod `bpy.types.NodeGeometryBakeItem.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.NodeGeometryBakeItem.bl_rna_get_subclass_py`

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

- :class:`GeometryNodeBake.bake_items`
- :class:`NodeGeometryBakeItems.new`
- :class:`NodeGeometryBakeItems.remove`
