<!-- source: api/bpy.types.SpaceNodeEditorPath.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.SpaceNodeEditorPath`

Get the node tree path as a string

### data `bpy.types.SpaceNodeEditorPath.to_string`

(default "", readonly, never None)

:type: str

### method `bpy.types.SpaceNodeEditorPath.clear`

Reset the node tree path

### method `bpy.types.SpaceNodeEditorPath.start`

Set the root node tree

:param node_tree: Node Tree
:type node_tree: :class:`NodeTree` | None

### method `bpy.types.SpaceNodeEditorPath.append`

Append a node group tree to the path

:param node_tree: Node Tree, Node tree to append to the node editor path
:type node_tree: :class:`NodeTree` | None
:param node: Node, Group node linking to this node tree (optional)
:type node: :class:`Node` | None

### method `bpy.types.SpaceNodeEditorPath.pop`

Remove the last node tree from the path

### classmethod `bpy.types.SpaceNodeEditorPath.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.SpaceNodeEditorPath.bl_rna_get_subclass_py`

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

- :class:`SpaceNodeEditor.path`
