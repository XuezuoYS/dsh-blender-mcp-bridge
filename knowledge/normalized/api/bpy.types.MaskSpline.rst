<!-- source: api/bpy.types.MaskSpline.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MaskSpline`

Single spline used for defining mask shape

### attribute `bpy.types.MaskSpline.offset_mode`

The method used for calculating the feather offset (default ``'EVEN'``)

- ``EVEN``
  Even -- Calculate even feather offset.
- ``SMOOTH``
  Smooth -- Calculate feather offset as a second curve.

:type: Literal['EVEN', 'SMOOTH']

### data `bpy.types.MaskSpline.points`

Collection of points (default None, readonly)

:type: :class:`MaskSplinePoints`\ [:class:`MaskSplinePoint`]

### attribute `bpy.types.MaskSpline.use_cyclic`

Make this spline a closed loop (default False)

:type: bool

### attribute `bpy.types.MaskSpline.use_fill`

Make this spline filled (default True)

:type: bool

### attribute `bpy.types.MaskSpline.use_self_intersection_check`

Prevent feather from self-intersections (default False)

:type: bool

### attribute `bpy.types.MaskSpline.weight_interpolation`

The type of weight interpolation for spline (default ``'LINEAR'``)

:type: Literal['LINEAR', 'EASE']

### classmethod `bpy.types.MaskSpline.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MaskSpline.bl_rna_get_subclass_py`

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

- :class:`MaskLayer.splines`
- :class:`MaskSplines.active`
- :class:`MaskSplines.new`
- :class:`MaskSplines.remove`
