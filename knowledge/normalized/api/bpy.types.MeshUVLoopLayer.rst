<!-- source: api/bpy.types.MeshUVLoopLayer.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.MeshUVLoopLayer.active`

Set the map as active for display and editing (default False)

:type: bool

### attribute `bpy.types.MeshUVLoopLayer.active_clone`

Set the map as active for cloning (default False)

:type: bool

### attribute `bpy.types.MeshUVLoopLayer.active_render`

Set the UV map as active for rendering (default False)

:type: bool

### data `bpy.types.MeshUVLoopLayer.data`

Deprecated, use 'uv', 'vertex_select', 'edge_select' or 'pin' properties instead (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`MeshUVLoop`]

### attribute `bpy.types.MeshUVLoopLayer.name`

Name of UV map (default "", never None)

:type: str

### data `bpy.types.MeshUVLoopLayer.pin`

UV pinned state in the UV editor (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`BoolAttributeValue`]

### data `bpy.types.MeshUVLoopLayer.uv`

UV coordinates on face corners (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Float2AttributeValue`]

### method `bpy.types.MeshUVLoopLayer.pin_ensure`

pin_ensure

:return: The boolean attribute
:rtype: :class:`BoolAttribute`

### classmethod `bpy.types.MeshUVLoopLayer.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshUVLoopLayer.bl_rna_get_subclass_py`

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

- :class:`Mesh.uv_layer_clone`
- :class:`Mesh.uv_layer_stencil`
- :class:`Mesh.uv_layers`
- :class:`UVLoopLayers.active`
- :class:`UVLoopLayers.active_render`
- :class:`UVLoopLayers.new`
- :class:`UVLoopLayers.remove`
