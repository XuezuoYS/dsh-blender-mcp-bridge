<!-- source: api/bpy.types.MeshStatVis.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.MeshStatVis.distort_max`

Maximum angle to display (in [0, 3.14159], default 0.785398)

:type: float

### attribute `bpy.types.MeshStatVis.distort_min`

Minimum angle to display (in [0, 3.14159], default 0.0872665)

:type: float

### attribute `bpy.types.MeshStatVis.overhang_axis`

(default ``'NEG_Z'``)

:type: Literal[:ref:`rna_enum_object_axis_items`]

### attribute `bpy.types.MeshStatVis.overhang_max`

Maximum angle to display (in [0, 3.14159], default 0.785398)

:type: float

### attribute `bpy.types.MeshStatVis.overhang_min`

Minimum angle to display (in [0, 3.14159], default 0.0)

:type: float

### attribute `bpy.types.MeshStatVis.sharp_max`

Maximum angle to display (in [-3.14159, 3.14159], default 3.14159)

:type: float

### attribute `bpy.types.MeshStatVis.sharp_min`

Minimum angle to display (in [-3.14159, 3.14159], default 1.5708)

:type: float

### attribute `bpy.types.MeshStatVis.thickness_max`

Maximum for measuring thickness (in [0, 1000], default 0.1)

:type: float

### attribute `bpy.types.MeshStatVis.thickness_min`

Minimum for measuring thickness (in [0, 1000], default 0.0)

:type: float

### attribute `bpy.types.MeshStatVis.thickness_samples`

Number of samples to test per face (in [1, 32], default 1)

:type: int

### attribute `bpy.types.MeshStatVis.type`

Type of data to visualize/check (default ``'OVERHANG'``)

:type: Literal['OVERHANG', 'THICKNESS', 'INTERSECT', 'DISTORT', 'SHARP']

### classmethod `bpy.types.MeshStatVis.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MeshStatVis.bl_rna_get_subclass_py`

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

- :class:`ToolSettings.statvis`
