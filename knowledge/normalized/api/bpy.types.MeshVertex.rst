<!-- source: api/bpy.types.MeshVertex.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MeshVertex`

Vertex in a Mesh data-block

### attribute `bpy.types.MeshVertex.co`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### data `bpy.types.MeshVertex.groups`

Weights for the vertex groups this vertex is member of (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`VertexGroupElement`]

### attribute `bpy.types.MeshVertex.hide`

(default False)

:type: bool

### data `bpy.types.MeshVertex.index`

Index of this vertex (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.MeshVertex.normal`

Vertex Normal (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MeshVertex.select`

(default False)

:type: bool

### data `bpy.types.MeshVertex.undeformed_co`

For meshes with modifiers applied, the coordinate of the vertex with no deforming modifiers applied, as used for generated texture coordinates (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### classmethod `bpy.types.MeshVertex.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshVertex.bl_rna_get_subclass_py`

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

- :class:`Mesh.vertices`
