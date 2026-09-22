<!-- source: api/bpy.types.MeshLoopTriangle.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MeshLoopTriangle`

Tessellated triangle in a Mesh data-block

### data `bpy.types.MeshLoopTriangle.area`

Area of this triangle (in [0, inf], default 0.0, readonly)

:type: float

### data `bpy.types.MeshLoopTriangle.index`

Index of this loop triangle (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.MeshLoopTriangle.loops`

Indices of mesh loops that make up the triangle (array of 3 items, in [0, inf], default (0, 0, 0), readonly)

:type: :class:`bpy_prop_array`\ [int]

### data `bpy.types.MeshLoopTriangle.material_index`

Material slot index of this triangle (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.MeshLoopTriangle.normal`

Local space unit length normal vector for this triangle (array of 3 items, in [-1, 1], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### data `bpy.types.MeshLoopTriangle.polygon_index`

Index of mesh face that the triangle is a part of (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.MeshLoopTriangle.split_normals`

Local space unit length custom normal vectors of the face corners of this triangle (multi-dimensional array of 3 * 3 items, in [-1, 1], default ((0.0, 0.0, 0.0), (0.0, 0.0, 0.0), (0.0, 0.0, 0.0)), readonly)

:type: :class:`bpy_prop_array`\ [:class:`bpy_prop_array`\ [float]]

### data `bpy.types.MeshLoopTriangle.use_smooth`

(default False, readonly)

:type: bool

### data `bpy.types.MeshLoopTriangle.vertices`

Indices of triangle vertices (array of 3 items, in [0, inf], default (0, 0, 0), readonly)

:type: :class:`bpy_prop_array`\ [int]

### data `bpy.types.MeshLoopTriangle.center`

The midpoint of the face.

(readonly)

### data `bpy.types.MeshLoopTriangle.edge_keys`

(readonly)

### classmethod `bpy.types.MeshLoopTriangle.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshLoopTriangle.bl_rna_get_subclass_py`

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

- :class:`Mesh.loop_triangles`
