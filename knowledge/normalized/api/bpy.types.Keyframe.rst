<!-- source: api/bpy.types.Keyframe.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Keyframe`

Bézier curve point with two handles defining a Keyframe on an F-Curve

### attribute `bpy.types.Keyframe.amplitude`

Amount to boost elastic bounces for 'elastic' easing (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.Keyframe.back`

Amount of overshoot for 'back' easing (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Keyframe.co`

Coordinates of the control point (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Keyframe.co_ui`

Coordinates of the control point. Note: Changing this value also updates the handles similar to using the graph editor transform operator (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Keyframe.easing`

Which ends of the segment between this and the next keyframe easing interpolation is applied to (default ``'AUTO'``)

:type: Literal[:ref:`rna_enum_beztriple_interpolation_easing_items`]

### attribute `bpy.types.Keyframe.handle_left`

Coordinates of the left handle (before the control point) (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Keyframe.handle_left_type`

Handle types (default ``'FREE'``)

:type: Literal[:ref:`rna_enum_keyframe_handle_type_items`]

### attribute `bpy.types.Keyframe.handle_right`

Coordinates of the right handle (after the control point) (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Keyframe.handle_right_type`

Handle types (default ``'FREE'``)

:type: Literal[:ref:`rna_enum_keyframe_handle_type_items`]

### attribute `bpy.types.Keyframe.interpolation`

Interpolation method to use for segment of the F-Curve from this Keyframe until the next Keyframe (default ``'CONSTANT'``)

:type: Literal[:ref:`rna_enum_beztriple_interpolation_mode_items`]

### attribute `bpy.types.Keyframe.period`

Time between bounces for elastic easing (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Keyframe.select_control_point`

Control point selection status (default False)

:type: bool

### attribute `bpy.types.Keyframe.select_left_handle`

Left handle selection status (default False)

:type: bool

### attribute `bpy.types.Keyframe.select_right_handle`

Right handle selection status (default False)

:type: bool

### attribute `bpy.types.Keyframe.type`

Type of keyframe (for visual purposes only) (default ``'KEYFRAME'``)

:type: Literal[:ref:`rna_enum_beztriple_keyframe_type_items`]

### classmethod `bpy.types.Keyframe.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Keyframe.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.selected_editable_keyframes`
- :class:`FCurve.keyframe_points`
- :class:`FCurveKeyframePoints.insert`
- :class:`FCurveKeyframePoints.remove`
