<!-- source: api/bpy.types.Curve.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.Curve`

:caption: Subclasses
:maxdepth: 1

bpy.types.SurfaceCurve.rst
bpy.types.TextCurve.rst
Curve data-block storing curves, splines and NURBS

### data `bpy.types.Curve.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### attribute `bpy.types.Curve.bevel_depth`

Radius of the bevel geometry, not including extrusion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Curve.bevel_factor_end`

Define where along the spline the curve geometry ends (0 for the beginning, 1 for the end) (in [0, 1], default 1.0)

:type: float

### attribute `bpy.types.Curve.bevel_factor_mapping_end`

Determine how the geometry end factor is mapped to a spline (default ``'RESOLUTION'``)

- ``RESOLUTION``
  Resolution -- Map the geometry factor to the number of subdivisions of a spline (U resolution).
- ``SEGMENTS``
  Segments -- Map the geometry factor to the length of a segment and to the number of subdivisions of a segment.
- ``SPLINE``
  Spline -- Map the geometry factor to the length of a spline.

:type: Literal['RESOLUTION', 'SEGMENTS', 'SPLINE']

### attribute `bpy.types.Curve.bevel_factor_mapping_start`

Determine how the geometry start factor is mapped to a spline (default ``'RESOLUTION'``)

- ``RESOLUTION``
  Resolution -- Map the geometry factor to the number of subdivisions of a spline (U resolution).
- ``SEGMENTS``
  Segments -- Map the geometry factor to the length of a segment and to the number of subdivisions of a segment.
- ``SPLINE``
  Spline -- Map the geometry factor to the length of a spline.

:type: Literal['RESOLUTION', 'SEGMENTS', 'SPLINE']

### attribute `bpy.types.Curve.bevel_factor_start`

Define where along the spline the curve geometry starts (0 for the beginning, 1 for the end) (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.Curve.bevel_mode`

Determine how to build the curve's bevel geometry (default ``'ROUND'``)

- ``ROUND``
  Round -- Use circle for the section of the curve's bevel geometry.
- ``OBJECT``
  Object -- Use an object for the section of the curve's bevel geometry segment.
- ``PROFILE``
  Profile -- Use a custom profile for each quarter of curve's bevel geometry.

:type: Literal['ROUND', 'OBJECT', 'PROFILE']

### attribute `bpy.types.Curve.bevel_object`

The name of the Curve object that defines the bevel shape

:type: :class:`Object` | None

### data `bpy.types.Curve.bevel_profile`

The path for the curve's custom profile (readonly)

:type: :class:`CurveProfile` | None

### attribute `bpy.types.Curve.bevel_resolution`

The number of segments in each quarter-circle of the bevel (in [0, 32], default 4)

:type: int

### attribute `bpy.types.Curve.dimensions`

Select 2D or 3D curve type (default ``'2D'``)

- ``2D``
  2D -- Clamp the Z axis of the curve.
- ``3D``
  3D -- Allow editing on the Z axis of this curve, also allows tilt and curve radius to be used.

:type: Literal['2D', '3D']

### attribute `bpy.types.Curve.eval_time`

Parametric position along the length of the curve that Objects 'following' it should be at (position is evaluated by dividing by the 'Path Length' value) (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Curve.extrude`

Length of the depth added in the local Z direction along the curve, perpendicular to its normals (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.Curve.fill_mode`

Mode of filling curve (default ``'FULL'``)

:type: Literal['FULL', 'BACK', 'FRONT', 'HALF']

### attribute `bpy.types.Curve.fill_rule`

Fill rule for Delaunay fill solver (default ``'EVEN_ODD'``)

- ``EVEN_ODD``
  Even-Odd -- Alternate inside/outside based on crossing count.
- ``NONZERO``
  Non-Zero -- Overlapping curves with the same winding direction are filled as a union.

:type: Literal['EVEN_ODD', 'NONZERO']

### attribute `bpy.types.Curve.fill_solver`

Triangulation solver for filling 2D curves (default ``'SWEEP_LINE'``)

- ``SWEEP_LINE``
  Sweep Line -- Fast without support for self-intersection.
- ``CDT``
  Delaunay -- Constrained Delaunay Triangulation (CDT), robust with support for self-intersections.

:type: Literal['SWEEP_LINE', 'CDT']

### data `bpy.types.Curve.is_editmode`

True when used in editmode (default False, readonly)

:type: bool

### data `bpy.types.Curve.materials`

(default None, readonly)

:type: :class:`IDMaterials`\ [:class:`Material`]

### attribute `bpy.types.Curve.offset`

Distance to move the curve parallel to its normals (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Curve.path_duration`

The number of frames that are needed to traverse the path, defining the maximum value for the 'Evaluation Time' setting (in [1, 1048574], default 100)

:type: int

### attribute `bpy.types.Curve.render_resolution_u`

Surface resolution in U direction used while rendering (zero uses preview resolution) (in [0, 1024], default 0)

:type: int

### attribute `bpy.types.Curve.render_resolution_v`

Surface resolution in V direction used while rendering (zero uses preview resolution) (in [0, 1024], default 0)

:type: int

### attribute `bpy.types.Curve.resolution_u`

Number of computed points in the U direction between every pair of control points (in [1, 1024], default 12)

:type: int

### attribute `bpy.types.Curve.resolution_v`

The number of computed points in the V direction between every pair of control points (in [1, 1024], default 12)

:type: int

### data `bpy.types.Curve.shape_keys`

(readonly)

:type: :class:`Key` | None

### data `bpy.types.Curve.splines`

Collection of splines in this curve data object (default None, readonly)

:type: :class:`CurveSplines`\ [:class:`Spline`]

### attribute `bpy.types.Curve.taper_object`

Curve object name that defines the taper (width)

:type: :class:`Object` | None

### attribute `bpy.types.Curve.taper_radius_mode`

Determine how the effective radius of the spline point is computed when a taper object is specified (default ``'OVERRIDE'``)

- ``OVERRIDE``
  Override -- Override the radius of the spline point with the taper radius.
- ``MULTIPLY``
  Multiply -- Multiply the radius of the spline point by the taper radius.
- ``ADD``
  Add -- Add the radius of the bevel point to the taper radius.

:type: Literal['OVERRIDE', 'MULTIPLY', 'ADD']

### attribute `bpy.types.Curve.texspace_location`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Curve.texspace_size`

(array of 3 items, in [-inf, inf], default (1.0, 1.0, 1.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Curve.twist_mode`

The type of tilt calculation for 3D Curves (default ``'MINIMUM'``)

- ``Z_UP``
  Z-Up -- Use Z-Up axis to calculate the curve twist at each point.
- ``MINIMUM``
  Minimum -- Use the least twist over the entire curve.
- ``TANGENT``
  Tangent -- Use the tangent to calculate twist.

:type: Literal['Z_UP', 'MINIMUM', 'TANGENT']

### attribute `bpy.types.Curve.twist_smooth`

Smoothing iteration for tangents (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Curve.use_auto_texspace`

Adjust active object's texture space automatically when transforming object (default True)

:type: bool

### attribute `bpy.types.Curve.use_deform_bounds`

Option for curve-deform: Use the mesh bounds to clamp the deformation (default False)

:type: bool

### attribute `bpy.types.Curve.use_fill_caps`

Fill caps for beveled curves (default False)

:type: bool

### attribute `bpy.types.Curve.use_map_taper`

Map effect of the taper object to the beveled part of the curve (default False)

:type: bool

### attribute `bpy.types.Curve.use_path`

Enable the curve to become a translation path (default False)

:type: bool

### attribute `bpy.types.Curve.use_path_clamp`

Clamp the curve path children so they cannot travel past the start/end point of the curve (default False)

:type: bool

### attribute `bpy.types.Curve.use_path_follow`

Make curve path children rotate along the path (default False)

:type: bool

### attribute `bpy.types.Curve.use_radius`

Option for paths and curve-deform: apply the curve radius to objects following it and to deformed objects (default True)

:type: bool

### attribute `bpy.types.Curve.use_stretch`

Option for curve-deform: make deformed child stretch along entire path (default False)

:type: bool

### method `bpy.types.Curve.transform`

Transform curve by a matrix

:param matrix: Matrix (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param shape_keys: Transform Shape Keys (optional)
:type shape_keys: bool

### method `bpy.types.Curve.validate_material_indices`

Validate material indices of splines or letters, return True when the curve has had invalid indices corrected (to default 0)

:return: Result
:rtype: bool

### method `bpy.types.Curve.update_gpu_tag`

update_gpu_tag

### classmethod `bpy.types.Curve.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Curve.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`ID.name`
- :class:`ID.name_full`
- :class:`ID.id_type`
- :class:`ID.session_uid`
- :class:`ID.is_evaluated`
- :class:`ID.original`
- :class:`ID.users`
- :class:`ID.use_fake_user`
- :class:`ID.use_extra_user`
- :class:`ID.is_embedded_data`
- :class:`ID.is_linked_packed`
- :class:`ID.is_missing`
- :class:`ID.is_runtime_data`
- :class:`ID.is_editable`
- :class:`ID.tag`
- :class:`ID.is_library_indirect`
- :class:`ID.library`
- :class:`ID.library_weak_reference`
- :class:`ID.asset_data`
- :class:`ID.override_library`
- :class:`ID.preview`

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
- :class:`ID.bl_system_properties_get`
- :class:`ID.rename`
- :class:`ID.evaluated_get`
- :class:`ID.copy`
- :class:`ID.asset_mark`
- :class:`ID.asset_clear`
- :class:`ID.asset_generate_preview`
- :class:`ID.override_create`
- :class:`ID.override_hierarchy_create`
- :class:`ID.user_clear`
- :class:`ID.user_remap`
- :class:`ID.make_local`
- :class:`ID.user_of_id`
- :class:`ID.animation_data_create`
- :class:`ID.animation_data_clear`
- :class:`ID.update_tag`
- :class:`ID.preview_ensure`
- :class:`ID.bl_rna_get_subclass`
- :class:`ID.bl_rna_get_subclass_py`

:columns: 2

- :mod:`bpy.context.curve`
- :class:`BlendData.curves`
- :class:`BlendDataCurves.new`
- :class:`BlendDataCurves.remove`
- :class:`Object.to_curve`
