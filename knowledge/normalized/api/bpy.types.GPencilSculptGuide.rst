<!-- source: api/bpy.types.GPencilSculptGuide.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.GPencilSculptGuide`

Guides for drawing

### attribute `bpy.types.GPencilSculptGuide.angle`

Direction of lines (in [-6.28319, 6.28319], default 0.0)

:type: float

### attribute `bpy.types.GPencilSculptGuide.angle_snap`

Angle snapping (in [-6.28319, 6.28319], default 0.0)

:type: float

### attribute `bpy.types.GPencilSculptGuide.location`

Custom reference point for guides (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.GPencilSculptGuide.reference_object`

Object used for reference point

:type: :class:`Object` | None

### attribute `bpy.types.GPencilSculptGuide.reference_point`

Type of speed guide (default ``'CURSOR'``)

- ``CURSOR``
  Cursor -- Use cursor as reference point.
- ``CUSTOM``
  Custom -- Use custom reference point.
- ``OBJECT``
  Object -- Use object as reference point.

:type: Literal['CURSOR', 'CUSTOM', 'OBJECT']

### attribute `bpy.types.GPencilSculptGuide.spacing`

Guide spacing (in [0, inf], default 20.0)

:type: float

### attribute `bpy.types.GPencilSculptGuide.type`

Type of speed guide (default ``'CIRCULAR'``)

- ``CIRCULAR``
  Circular -- Use single point to create rings.
- ``RADIAL``
  Radial -- Use single point as direction.
- ``PARALLEL``
  Parallel -- Parallel lines.
- ``GRID``
  Grid -- Grid allows horizontal and vertical lines.
- ``ISO``
  Isometric -- Grid allows isometric and vertical lines.

:type: Literal['CIRCULAR', 'RADIAL', 'PARALLEL', 'GRID', 'ISO']

### attribute `bpy.types.GPencilSculptGuide.use_guide`

Enable speed guides (default False)

:type: bool

### attribute `bpy.types.GPencilSculptGuide.use_snapping`

Enable snapping to guides angle or spacing options (default False)

:type: bool

### classmethod `bpy.types.GPencilSculptGuide.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GPencilSculptGuide.bl_rna_get_subclass_py`

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

- :class:`GPencilSculptSettings.guide`
