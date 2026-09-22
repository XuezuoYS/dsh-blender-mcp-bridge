<!-- source: api/bpy.types.Gizmo.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Gizmo`

Collection of gizmos

### attribute `bpy.types.Gizmo.alpha`

(in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.Gizmo.alpha_highlight`

(in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.Gizmo.bl_idname`

(default "", never None)

:type: str

### attribute `bpy.types.Gizmo.color`

(array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.Gizmo.color_highlight`

(array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### data `bpy.types.Gizmo.group`

Gizmo group this gizmo is a member of (readonly)

:type: :class:`GizmoGroup` | None

### attribute `bpy.types.Gizmo.hide`

(default False)

:type: bool

### attribute `bpy.types.Gizmo.hide_keymap`

Ignore the key-map for this gizmo (default False)

:type: bool

### attribute `bpy.types.Gizmo.hide_select`

(default False)

:type: bool

### data `bpy.types.Gizmo.is_highlight`

(default False, readonly)

:type: bool

### data `bpy.types.Gizmo.is_modal`

(default False, readonly)

:type: bool

### attribute `bpy.types.Gizmo.line_width`

(in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.Gizmo.matrix_basis`

(multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)))

:type: :class:`mathutils.Matrix`

### attribute `bpy.types.Gizmo.matrix_offset`

(multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)))

:type: :class:`mathutils.Matrix`

### attribute `bpy.types.Gizmo.matrix_space`

(multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)))

:type: :class:`mathutils.Matrix`

### data `bpy.types.Gizmo.matrix_world`

(multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)), readonly)

:type: :class:`mathutils.Matrix`

### data `bpy.types.Gizmo.properties`

(readonly, never None)

:type: :class:`GizmoProperties`

### attribute `bpy.types.Gizmo.scale_basis`

(in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.Gizmo.select`

(default False)

:type: bool

### attribute `bpy.types.Gizmo.select_bias`

Depth bias used for selection (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Gizmo.use_draw_hover`

(default False)

:type: bool

### attribute `bpy.types.Gizmo.use_draw_modal`

Show while dragging (default False)

:type: bool

### attribute `bpy.types.Gizmo.use_draw_offset_scale`

Scale the offset matrix (use to apply screen-space offset) (default False)

:type: bool

### attribute `bpy.types.Gizmo.use_draw_scale`

Use scale when calculating the matrix (default True)

:type: bool

### attribute `bpy.types.Gizmo.use_draw_value`

Show an indicator for the current value while dragging (default False)

:type: bool

### attribute `bpy.types.Gizmo.use_event_handle_all`

When highlighted, do not pass events through to be handled by other keymaps (default False)

:type: bool

### attribute `bpy.types.Gizmo.use_grab_cursor`

(default False)

:type: bool

### attribute `bpy.types.Gizmo.use_operator_tool_properties`

Merge active tool properties on activation (does not overwrite existing) (default False)

:type: bool

### attribute `bpy.types.Gizmo.use_select_background`

Don't write into the depth buffer (default False)

:type: bool

### attribute `bpy.types.Gizmo.use_tooltip`

Use tooltips when hovering over this gizmo (default True)

:type: bool

### attribute `bpy.types.Gizmo.use_undo`

Push an undo step after each use of the gizmo (default False)

:type: bool

### method `bpy.types.Gizmo.draw`

:param context: (never None)
:type context: :class:`Context` | None

### method `bpy.types.Gizmo.draw_select`

:param context: (never None)
:type context: :class:`Context` | None
:param select_id: (in [0, inf], optional)
:type select_id: int

### method `bpy.types.Gizmo.test_select`

:param context: (never None)
:type context: :class:`Context` | None
:param location: Location, Region coordinates (array of 2 items, in [-inf, inf], never None)
:type location: Sequence[int]
:return: Use -1 to skip this gizmo (in [-1, inf])
:rtype: int

### method `bpy.types.Gizmo.modal`

:param context: (never None)
:type context: :class:`Context` | None
:param event: (never None)
:type event: :class:`Event` | None
:param tweak: Tweak
:type tweak: set[Literal['PRECISE', 'SNAP']]
:return: result
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### method `bpy.types.Gizmo.invoke`

:param context: (never None)
:type context: :class:`Context` | None
:param event: (never None)
:type event: :class:`Event` | None
:return: result
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### method `bpy.types.Gizmo.exit`

:param context: (never None)
:type context: :class:`Context` | None
:param cancel: Cancel, otherwise confirm
:type cancel: bool

### method `bpy.types.Gizmo.draw_preset_box`

Draw a box

:param matrix: The matrix to transform (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param select_id: ID to use when gizmo is selectable. Use -1 when not selecting., (in [-1, inf], optional)
:type select_id: int

### method `bpy.types.Gizmo.draw_preset_arrow`

Draw a box

:param matrix: The matrix to transform (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param axis: Arrow Orientation (optional)
:type axis: Literal[:ref:`rna_enum_object_axis_items`]
:param select_id: ID to use when gizmo is selectable. Use -1 when not selecting., (in [-1, inf], optional)
:type select_id: int

### method `bpy.types.Gizmo.draw_preset_circle`

Draw a box

:param matrix: The matrix to transform (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param axis: Arrow Orientation (optional)
:type axis: Literal[:ref:`rna_enum_object_axis_items`]
:param select_id: ID to use when gizmo is selectable. Use -1 when not selecting., (in [-1, inf], optional)
:type select_id: int

### method `bpy.types.Gizmo.target_set_prop`

:param target: Target property (never None)
:type target: str
:param data: Data from which to take property (never None)
:type data: :class:`AnyType` | None
:param property: Identifier of property in data (never None)
:type property: str
:param index: (in [-1, inf], optional)
:type index: int

### method `bpy.types.Gizmo.target_set_operator`

Operator to run when activating the gizmo (overrides property targets)

:param operator: Target operator (never None)
:type operator: str
:param index: Part index, (in [0, 255], optional)
:type index: int
:return: Operator properties to fill in
:rtype: :class:`OperatorProperties`

### method `bpy.types.Gizmo.target_is_valid`

:param property: Property identifier (never None)
:type property: str
:rtype: bool

### method `bpy.types.Gizmo.draw_custom_shape`

Draw a shape created form :class:`Gizmo.draw_custom_shape`.

:param shape: The cached shape to draw.
:type shape: Any
:param matrix: 4x4 matrix, when not given :class:`Gizmo.matrix_world` is used.
:type matrix: :class:`mathutils.Matrix` | None
:param select_id: The selection id.
   Only use when drawing within :class:`Gizmo.draw_select`.
:type select_id: int | None

### staticmethod `bpy.types.Gizmo.new_custom_shape`

Create a new shape that can be passed to :class:`Gizmo.draw_custom_shape`.

:param type: The type of shape to create.
:type type: Literal['POINTS', 'LINES', 'TRIS', 'LINE_STRIP']
:param verts: Sequence of 2D or 3D coordinates.
:type verts: Sequence[Sequence[float]]
:return: The newly created shape (the return type make change).
:rtype: Any

### classmethod `bpy.types.Gizmo.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Gizmo.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

### method `bpy.types.Gizmo.target_get_range`

Get the range for this target property.

:param target: Target property name.
:type target: str
:return: The range of this property (min, max).
:rtype: tuple[float, float]

### method `bpy.types.Gizmo.target_get_value`

Get the value of this target property.

:param target: Target property name.
:type target: str
:return: The value of the target property as a value or array based on the target type.
:rtype: float | tuple[float, ...]

### method `bpy.types.Gizmo.target_set_handler`

Assigns callbacks to a gizmos property.

:param target: Target property name.
:type target: str
:param get: Function that returns the value for this property (single value or sequence).
:type get: Callable[[], float | Sequence[float]]
:param set: Function that takes a single value argument and applies it.
:type set: Callable[[tuple[float, ...]], Any]
:param range: Function that returns a (min, max) tuple for gizmos that use a range. The returned value is not used.
:type range: Callable[[], tuple[float, float]] | None

### method `bpy.types.Gizmo.target_set_value`

Set the value of this target property.

:param target: Target property name.
:type target: str

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

- :class:`GizmoGroup.gizmos`
- :class:`GizmoGroup.invoke_prepare`
- :class:`Gizmos.new`
- :class:`Gizmos.remove`
