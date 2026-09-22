<!-- source: api/bpy.types.LoopColors.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.LoopColors`

Collection of vertex colors

### attribute `bpy.types.LoopColors.active`

Active vertex color layer

:type: :class:`MeshLoopColorLayer` | None

### attribute `bpy.types.LoopColors.active_index`

Active vertex color index (in [0, inf], default 0)

:type: int

### method `bpy.types.LoopColors.new`

Add a vertex color layer to Mesh

:param name: Vertex color name (optional, never None)
:type name: str
:param do_init: Whether new layer's data should be initialized by copying current active one (optional)
:type do_init: bool
:return: The newly created layer
:rtype: :class:`MeshLoopColorLayer`

### method `bpy.types.LoopColors.remove`

Remove a vertex color layer

:param layer: The layer to remove (never None)
:type layer: :class:`MeshLoopColorLayer` | None

### classmethod `bpy.types.LoopColors.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LoopColors.bl_rna_get_subclass_py`

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

- :class:`Mesh.vertex_colors`
