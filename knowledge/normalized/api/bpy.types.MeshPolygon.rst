<!-- source: api/bpy.types.MeshPolygon.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MeshPolygon`

Polygon in a Mesh data-block

### data `bpy.types.MeshPolygon.area`

Read only area of this face (in [0, inf], default 0.0, readonly)

:type: float

### data `bpy.types.MeshPolygon.center`

Center of this face (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MeshPolygon.hide`

(default False)

:type: bool

### data `bpy.types.MeshPolygon.index`

Index of this face (in [0, inf], default 0, readonly)

:type: int

### attribute `bpy.types.MeshPolygon.loop_start`

Index of the first loop of this face (in [0, inf], default 0)

:type: int

### data `bpy.types.MeshPolygon.loop_total`

Number of loops used by this face (in [0, inf], default 0, readonly)

:type: int

### attribute `bpy.types.MeshPolygon.material_index`

Material slot index of this face (in [0, inf], default 0)

:type: int

### data `bpy.types.MeshPolygon.normal`

Local space unit length normal vector for this face (array of 3 items, in [-1, 1], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MeshPolygon.select`

(default False)

:type: bool

### attribute `bpy.types.MeshPolygon.use_smooth`

(default False)

:type: bool

### attribute `bpy.types.MeshPolygon.vertices`

Vertex indices (array of 3 items, in [0, inf], default (0, 0, 0))

:type: :class:`bpy_prop_array`\ [int]

### data `bpy.types.MeshPolygon.edge_keys`

(readonly)

### data `bpy.types.MeshPolygon.loop_indices`

(readonly)

### method `bpy.types.MeshPolygon.flip`

Invert winding of this face (flip its normal)

### classmethod `bpy.types.MeshPolygon.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshPolygon.bl_rna_get_subclass_py`

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

- :class:`Mesh.polygons`
