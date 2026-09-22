<!-- source: api/bpy.types.MeshLoop.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MeshLoop`

Loop in a Mesh data-block

### data `bpy.types.MeshLoop.bitangent`

Bitangent vector of this vertex for this face (must be computed beforehand using calc_tangents, use it only if really needed, slower access than bitangent_sign) (array of 3 items, in [-1, 1], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### data `bpy.types.MeshLoop.bitangent_sign`

Sign of the bitangent vector of this vertex for this face (must be computed beforehand using calc_tangents, bitangent = bitangent_sign * cross(normal, tangent)) (in [-1, 1], default 0.0, readonly)

:type: float

### attribute `bpy.types.MeshLoop.edge_index`

Edge index (in [0, inf], default 0)

:type: int

### data `bpy.types.MeshLoop.index`

Index of this loop (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.MeshLoop.normal`

The normal direction of the face corner, taking into account sharp faces, sharp edges, and custom normal data (array of 3 items, in [-1, 1], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### data `bpy.types.MeshLoop.tangent`

Local space unit length tangent vector of this vertex for this face (must be computed beforehand using calc_tangents) (array of 3 items, in [-1, 1], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MeshLoop.vertex_index`

Vertex index (in [0, inf], default 0)

:type: int

### classmethod `bpy.types.MeshLoop.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshLoop.bl_rna_get_subclass_py`

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

- :class:`Mesh.loops`
