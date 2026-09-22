<!-- source: api/bpy.types.Spline.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Spline`

Element of a curve, either NURBS, Bézier or Polyline or a character with text objects

### data `bpy.types.Spline.bezier_points`

Collection of points for Bézier curves only (default None, readonly)

:type: :class:`SplineBezierPoints`\ [:class:`BezierSplinePoint`]

### data `bpy.types.Spline.character_index`

Location of this character in the text data (only for text curves) (in [0, inf], default 0, readonly)

:type: int

### attribute `bpy.types.Spline.hide`

Hide this curve in Edit mode (default False)

:type: bool

### attribute `bpy.types.Spline.material_index`

Material slot index of this curve (in [0, 32767], default 0)

:type: int

### attribute `bpy.types.Spline.order_u`

NURBS order in the U direction. Higher values make each point influence a greater area, but have worse performance. (in [2, 64], default 0)

:type: int

### attribute `bpy.types.Spline.order_v`

NURBS order in the V direction. Higher values make each point influence a greater area, but have worse performance. (in [2, 64], default 0)

:type: int

### data `bpy.types.Spline.point_count_u`

Total number points for the curve or surface in the U direction (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.Spline.point_count_v`

Total number points for the surface on the V direction (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.Spline.points`

Collection of points that make up this poly or nurbs spline (default None, readonly)

:type: :class:`SplinePoints`\ [:class:`SplinePoint`]

### attribute `bpy.types.Spline.radius_interpolation`

The type of radius interpolation for Bézier curves (default ``'LINEAR'``)

:type: Literal['LINEAR', 'CARDINAL', 'BSPLINE', 'EASE']

### attribute `bpy.types.Spline.resolution_u`

Curve or Surface subdivisions per segment (in [1, 1024], default 0)

:type: int

### attribute `bpy.types.Spline.resolution_v`

Surface subdivisions per segment (in [1, 1024], default 0)

:type: int

### attribute `bpy.types.Spline.tilt_interpolation`

The type of tilt interpolation for 3D, Bézier curves (default ``'LINEAR'``)

:type: Literal['LINEAR', 'CARDINAL', 'BSPLINE', 'EASE']

### attribute `bpy.types.Spline.type`

The interpolation type for this curve element (default ``'POLY'``)

:type: Literal['POLY', 'BEZIER', 'NURBS']

### attribute `bpy.types.Spline.use_bezier_u`

Make this nurbs curve or surface act like a Bézier spline in the U direction (default False)

:type: bool

### attribute `bpy.types.Spline.use_bezier_v`

Make this nurbs surface act like a Bézier spline in the V direction (default False)

:type: bool

### attribute `bpy.types.Spline.use_cyclic_u`

Make this curve or surface a closed loop in the U direction (default False)

:type: bool

### attribute `bpy.types.Spline.use_cyclic_v`

Make this surface a closed loop in the V direction (default False)

:type: bool

### attribute `bpy.types.Spline.use_endpoint_u`

Make this nurbs curve or surface meet the endpoints in the U direction (default False)

:type: bool

### attribute `bpy.types.Spline.use_endpoint_v`

Make this nurbs surface meet the endpoints in the V direction (default False)

:type: bool

### attribute `bpy.types.Spline.use_smooth`

Smooth the normals of the surface or beveled curve (default False)

:type: bool

### method `bpy.types.Spline.calc_length`

Calculate spline length

:param resolution: Resolution, Spline resolution to be used, 0 defaults to the resolution_u (in [0, 1024], optional)
:type resolution: int
:return: Length, Length of the polygonaly approximated spline (in [0, inf])
:rtype: float

### method `bpy.types.Spline.valid_message`

Return the message

:param direction: Direction, The direction where 0-1 maps to U-V (in [0, 1])
:type direction: int
:return: Return value, The message or an empty string when there is no error
:rtype: str

### classmethod `bpy.types.Spline.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Spline.bl_rna_get_subclass_py`

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

- :class:`Curve.splines`
- :class:`CurveSplines.active`
- :class:`CurveSplines.new`
- :class:`CurveSplines.remove`
