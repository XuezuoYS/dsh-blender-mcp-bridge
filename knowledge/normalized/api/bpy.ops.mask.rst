<!-- source: api/bpy.ops.mask.rst -->

### function `bpy.ops.mask.add_feather_vertex`

Add vertex to feather

:param location: Location, Location of vertex in normalized space (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.add_feather_vertex_slide`

Add new vertex to feather and slide it

:param MASK_OT_add_feather_vertex: Add Feather Vertex, Add vertex to feather (optional, :func:`bpy.ops.mask.add_feather_vertex` keyword arguments)
:type MASK_OT_add_feather_vertex: dict[str, Any]
:param MASK_OT_slide_point: Slide Point, Slide control points (optional, :func:`bpy.ops.mask.slide_point` keyword arguments)
:type MASK_OT_slide_point: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.add_vertex`

Add vertex to active spline

:param location: Location, Location of vertex in normalized space (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.add_vertex_slide`

Add new vertex and slide it

:param MASK_OT_add_vertex: Add Vertex, Add vertex to active spline (optional, :func:`bpy.ops.mask.add_vertex` keyword arguments)
:type MASK_OT_add_vertex: dict[str, Any]
:param MASK_OT_slide_point: Slide Point, Slide control points (optional, :func:`bpy.ops.mask.slide_point` keyword arguments)
:type MASK_OT_slide_point: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.copy_splines`

Copy the selected splines to the internal clipboard

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.cyclic_toggle`

Toggle cyclic for selected splines

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.delete`

Delete selected control points or splines

:param confirm: Confirm, Prompt for confirmation (optional)
:type confirm: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.duplicate`

Duplicate selected control points and segments between them

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.duplicate_move`

Duplicate mask and move

:param MASK_OT_duplicate: Duplicate Mask, Duplicate selected control points and segments between them (optional, :func:`bpy.ops.mask.duplicate` keyword arguments)
:type MASK_OT_duplicate: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.feather_weight_clear`

Reset the feather weight to zero

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.handle_type_set`

Set type of handles for selected control points

:param type: Type, Spline type (optional)
:type type: Literal['AUTO', 'VECTOR', 'ALIGNED', 'ALIGNED_DOUBLESIDE', 'FREE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.hide_view_clear`

Reveal temporarily hidden mask layers

:param select: Select, (optional)
:type select: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.hide_view_set`

Temporarily hide mask layers

:param unselected: Unselected, Hide unselected rather than selected layers (optional)
:type unselected: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.layer_move`

Move the active layer up/down in the list

:param direction: Direction, Direction to move the active layer (optional)
:type direction: Literal['UP', 'DOWN']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.layer_new`

Add new mask layer for masking

:param name: Name, Name of new mask layer (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.layer_remove`

Remove mask layer

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.move_to_layer`

Move the active spline to layer

:param target_layer_name: Name, Target Mask Layer (optional, never None)
:type target_layer_name: str
:param add_new_layer: New Layer, Move selection to a new layer (optional)
:type add_new_layer: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.new`

Create new mask

:param name: Name, Name of new mask (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.normals_make_consistent`

Recalculate the direction of selected handles

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.parent_clear`

Clear the mask's parenting

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.parent_set`

Set the mask's parenting

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.paste_splines`

Paste splines from the internal clipboard

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.primitive_circle_add`

Add new circle-shaped spline

:param size: Size, Size of new primitive (in [-inf, inf], optional)
:type size: float
:param location: Location, Location of new primitive (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.primitive_square_add`

Add new square-shaped spline

:param size: Size, Size of new primitive (in [-inf, inf], optional)
:type size: float
:param location: Location, Location of new primitive (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select`

Select spline points

:param extend: Extend, Extend selection instead of deselecting everything first (optional)
:type extend: bool
:param deselect: Deselect, Remove from selection (optional)
:type deselect: bool
:param toggle: Toggle Selection, Toggle the selection (optional)
:type toggle: bool
:param deselect_all: Deselect On Nothing, Deselect all when nothing under the cursor (optional)
:type deselect_all: bool
:param select_passthrough: Only Select Unselected, Ignore the select action when the element is already selected (optional)
:type select_passthrough: bool
:param location: Location, Location of vertex in normalized space (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_all`

Change selection of all curve points

:param action: Action, Selection action to execute (optional)

- ``TOGGLE``
  Toggle -- Toggle selection for all elements.
- ``SELECT``
  Select -- Select all elements.
- ``DESELECT``
  Deselect -- Deselect all elements.
- ``INVERT``
  Invert -- Invert selection of all elements.
:type action: Literal['TOGGLE', 'SELECT', 'DESELECT', 'INVERT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_box`

Select curve points using box selection

:param xmin: X Min, (in [-inf, inf], optional)
:type xmin: int
:param xmax: X Max, (in [-inf, inf], optional)
:type xmax: int
:param ymin: Y Min, (in [-inf, inf], optional)
:type ymin: int
:param ymax: Y Max, (in [-inf, inf], optional)
:type ymax: int
:param wait_for_input: Wait for Input, (optional)
:type wait_for_input: bool
:param mode: Mode, (optional)

- ``SET``
  Set -- Set a new selection.
- ``ADD``
  Extend -- Extend existing selection.
- ``SUB``
  Subtract -- Subtract existing selection.
:type mode: Literal['SET', 'ADD', 'SUB']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_circle`

Select curve points using circle selection

:param x: X, (in [-inf, inf], optional)
:type x: int
:param y: Y, (in [-inf, inf], optional)
:type y: int
:param radius: Radius, (in [1, inf], optional)
:type radius: int
:param wait_for_input: Wait for Input, (optional)
:type wait_for_input: bool
:param mode: Mode, (optional)

- ``SET``
  Set -- Set a new selection.
- ``ADD``
  Extend -- Extend existing selection.
- ``SUB``
  Subtract -- Subtract existing selection.
:type mode: Literal['SET', 'ADD', 'SUB']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_lasso`

Select curve points using lasso selection

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param use_smooth_stroke: Stabilize Stroke, Selection lags behind mouse and follows a smoother path (optional)
:type use_smooth_stroke: bool
:param smooth_stroke_factor: Smooth Stroke Factor, Higher values give a smoother stroke (in [0.5, 0.99], optional)
:type smooth_stroke_factor: float
:param smooth_stroke_radius: Smooth Stroke Radius, Minimum distance from last point before selection continues (in [10, 200], optional)
:type smooth_stroke_radius: int
:param mode: Mode, (optional)

- ``SET``
  Set -- Set a new selection.
- ``ADD``
  Extend -- Extend existing selection.
- ``SUB``
  Subtract -- Subtract existing selection.
:type mode: Literal['SET', 'ADD', 'SUB']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_less`

Deselect spline points at the boundary of each selection region

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_linked`

Select all curve points linked to already selected ones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_linked_pick`

(De)select all points linked to the curve under the mouse cursor

:param deselect: Deselect, (optional)
:type deselect: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.select_more`

Select more spline points connected to initial selection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.shape_key_clear`

Remove mask shape keyframe for active mask layer at the current frame

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.shape_key_feather_reset`

Reset feather weights on all selected points animation values

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.shape_key_insert`

Insert mask shape keyframe for active mask layer at the current frame

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.shape_key_rekey`

Recalculate animation data on selected points for frames selected in the dopesheet

:param location: Location, (optional)
:type location: bool
:param feather: Feather, (optional)
:type feather: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.slide_point`

Slide control points

:param slide_feather: Slide Feather, First try to slide feather instead of vertex (optional)
:type slide_feather: bool
:param is_new_point: Slide New Point, Newly created vertex is being slid (optional)
:type is_new_point: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.slide_spline_curvature`

Slide a point on the spline to define its curvature

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.mask.switch_direction`

Switch direction of selected splines

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
