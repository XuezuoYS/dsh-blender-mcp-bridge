<!-- source: api/bpy.ops.transform.rst -->

### function `bpy.ops.transform.bbone_resize`

Scale selected bendy bones display size

:param value: Display Size, (array of 3 items, in [-inf, inf], optional)
:type value: :class:`mathutils.Vector` | Sequence[float]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.bend`

Bend selected items between the 3D cursor and the mouse

:param value: Angle, (array of 1 items, in [-inf, inf], optional)
:type value: Sequence[float]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.create_orientation`

Create transformation orientation from selection

:param name: Name, Name of the new custom orientation (optional, never None)
:type name: str
:param use_view: Use View, Use the current view instead of the active object to create the new orientation (optional)
:type use_view: bool
:param use: Use After Creation, Select orientation after its creation (optional)
:type use: bool
:param overwrite: Overwrite Previous, Overwrite previously created orientation with same name (optional)
:type overwrite: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.delete_orientation`

Delete transformation orientation

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.edge_bevelweight`

Change the bevel weight of edges

:param value: Factor, (in [-1, 1], optional)
:type value: float
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.edge_crease`

Change the crease of edges

:param value: Factor, (in [-1, 1], optional)
:type value: float
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.edge_slide`

Slide an edge loop along a mesh

:param value: Factor, (in [-10, 10], optional)
:type value: float
:param single_side: Single Side, (optional)
:type single_side: bool
:param use_even: Even, Make the edge loop match the shape of the adjacent edge loop (optional)
:type use_even: bool
:param flipped: Flipped, When Even mode is active, flips between the two adjacent edge loops (optional)
:type flipped: bool
:param use_clamp: Clamp, Clamp within the edge extents (optional)
:type use_clamp: bool
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param correct_uv: Correct UVs, Correct UV coordinates when transforming (optional)
:type correct_uv: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.from_gizmo`

Transform selected items by mode type

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.mirror`

Mirror selected items around one or more axes

:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.push_pull`

Push/Pull selected items

:param value: Distance, (in [-inf, inf], optional)
:type value: float
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.resize`

Scale (resize) selected items

:param value: Scale, (array of 3 items, in [-inf, inf], optional)
:type value: :class:`mathutils.Vector` | Sequence[float]
:param mouse_dir_constraint: Mouse Directional Constraint, (array of 3 items, in [-inf, inf], optional)
:type mouse_dir_constraint: :class:`mathutils.Vector` | Sequence[float]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param texture_space: Edit Texture Space, Edit object data texture space (optional)
:type texture_space: bool
:param remove_on_cancel: Remove on Cancel, Remove elements on cancel (optional)
:type remove_on_cancel: bool
:param use_duplicated_keyframes: Duplicated Keyframes, Transform duplicated keyframes (optional)
:type use_duplicated_keyframes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.rotate`

Rotate selected items

:param value: Angle, (in [-inf, inf], optional)
:type value: float
:param orient_axis: Axis, (optional)
:type orient_axis: Literal[:ref:`rna_enum_axis_xyz_items`]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.rotate_normal`

Rotate custom normal of selected items

:param value: Angle, (in [-inf, inf], optional)
:type value: float
:param orient_axis: Axis, (optional)
:type orient_axis: Literal[:ref:`rna_enum_axis_xyz_items`]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.select_orientation`

Select transformation orientation

:param orientation: Orientation, Transformation orientation (optional)
:type orientation: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.seq_slide`

Slide a sequence strip in time

:param value: Offset, (array of 2 items, in [-inf, inf], optional)
:type value: :class:`mathutils.Vector` | Sequence[float]
:param use_restore_handle_selection: Restore Handle Selection, Restore handle selection after tweaking (optional)
:type use_restore_handle_selection: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param texture_space: Edit Texture Space, Edit object data texture space (optional)
:type texture_space: bool
:param remove_on_cancel: Remove on Cancel, Remove elements on cancel (optional)
:type remove_on_cancel: bool
:param use_duplicated_keyframes: Duplicated Keyframes, Transform duplicated keyframes (optional)
:type use_duplicated_keyframes: bool
:param view2d_edge_pan: Edge Pan, Enable edge panning in 2D view (optional)
:type view2d_edge_pan: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.shear`

Shear selected items along the given axis

:param angle: Angle, (in [-inf, inf], optional)
:type angle: float
:param orient_axis: Axis, (optional)
:type orient_axis: Literal[:ref:`rna_enum_axis_xyz_items`]
:param orient_axis_ortho: Axis Ortho, (optional)
:type orient_axis_ortho: Literal[:ref:`rna_enum_axis_xyz_items`]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.shrink_fatten`

Shrink/fatten selected vertices along normals

:param value: Offset, (in [-inf, inf], optional)
:type value: float
:param use_even_offset: Offset Even, Scale the offset to give more even thickness (optional)
:type use_even_offset: bool
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.skin_resize`

Scale selected vertices' skin radii

:param value: Scale, (array of 3 items, in [-inf, inf], optional)
:type value: :class:`mathutils.Vector` | Sequence[float]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: str
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: str
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.tilt`

Tilt selected control vertices of 3D curve

:param value: Angle, (in [-inf, inf], optional)
:type value: float
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.tosphere`

Move selected items outward in a spherical shape around geometric center

:param value: Factor, (in [0, 1], optional)
:type value: float
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.trackball`

Trackball style rotation of selected items

:param value: Angle, (array of 2 items, in [-inf, inf], optional)
:type value: Sequence[float]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.transform`

Transform selected items by mode type

:param mode: Mode, (optional)
:type mode: Literal[:ref:`rna_enum_transform_mode_type_items`]
:param value: Values, (array of 4 items, in [-inf, inf], optional)
:type value: :class:`mathutils.Vector` | Sequence[float]
:param orient_axis: Axis, (optional)
:type orient_axis: Literal[:ref:`rna_enum_axis_xyz_items`]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: Literal[:ref:`rna_enum_transform_orientation_items`]
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: Literal[:ref:`rna_enum_transform_orientation_items`]
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param snap_align: Align with Point Normal, (optional)
:type snap_align: bool
:param snap_normal: Normal, (array of 3 items, in [-inf, inf], optional)
:type snap_normal: :class:`mathutils.Vector` | Sequence[float]
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param texture_space: Edit Texture Space, Edit object data texture space (optional)
:type texture_space: bool
:param remove_on_cancel: Remove on Cancel, Remove elements on cancel (optional)
:type remove_on_cancel: bool
:param use_duplicated_keyframes: Duplicated Keyframes, Transform duplicated keyframes (optional)
:type use_duplicated_keyframes: bool
:param center_override: Center Override, Force using this center value (when set) (array of 3 items, in [-inf, inf], optional)
:type center_override: :class:`mathutils.Vector` | Sequence[float]
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:param use_automerge_and_split: Auto Merge & Split, Forces the use of Auto Merge and Split (optional)
:type use_automerge_and_split: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.translate`

Move selected items

:param value: Move, (array of 3 items, in [-inf, inf], optional)
:type value: :class:`mathutils.Vector` | Sequence[float]
:param orient_type: Orientation, Transformation orientation (optional)
:type orient_type: Literal[:ref:`rna_enum_transform_orientation_items`]
:param orient_matrix: Matrix, (multi-dimensional array of 3 * 3 items, in [-inf, inf], optional)
:type orient_matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param orient_matrix_type: Matrix Orientation, (optional)
:type orient_matrix_type: Literal[:ref:`rna_enum_transform_orientation_items`]
:param constraint_axis: Constraint Axis, (array of 3 items, optional)
:type constraint_axis: Sequence[bool]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param use_proportional_edit: Proportional Editing, (optional)
:type use_proportional_edit: bool
:param proportional_edit_falloff: Proportional Falloff, Falloff type for proportional editing mode (optional)
:type proportional_edit_falloff: Literal[:ref:`rna_enum_proportional_falloff_items`]
:param proportional_size: Proportional Size, (in [1e-06, inf], optional)
:type proportional_size: float
:param use_proportional_connected: Connected, (optional)
:type use_proportional_connected: bool
:param use_proportional_projected: Projected (2D), (optional)
:type use_proportional_projected: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param snap_align: Align with Point Normal, (optional)
:type snap_align: bool
:param snap_normal: Normal, (array of 3 items, in [-inf, inf], optional)
:type snap_normal: :class:`mathutils.Vector` | Sequence[float]
:param gpencil_strokes: Edit Grease Pencil, Edit selected Grease Pencil strokes (optional)
:type gpencil_strokes: bool
:param cursor_transform: Transform Cursor, (optional)
:type cursor_transform: bool
:param texture_space: Edit Texture Space, Edit object data texture space (optional)
:type texture_space: bool
:param remove_on_cancel: Remove on Cancel, Remove elements on cancel (optional)
:type remove_on_cancel: bool
:param use_duplicated_keyframes: Duplicated Keyframes, Transform duplicated keyframes (optional)
:type use_duplicated_keyframes: bool
:param view2d_edge_pan: Edge Pan, Enable edge panning in 2D view (optional)
:type view2d_edge_pan: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:param use_automerge_and_split: Auto Merge & Split, Forces the use of Auto Merge and Split (optional)
:type use_automerge_and_split: bool
:param translate_origin: Translate Origin, Translate origin instead of selection (optional)
:type translate_origin: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.vert_crease`

Change the crease of vertices

:param value: Factor, (in [-1, 1], optional)
:type value: float
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.vert_slide`

Slide a vertex along a mesh

:param value: Factor, (in [-10, 10], optional)
:type value: float
:param use_even: Even, Make the edge loop match the shape of the adjacent edge loop (optional)
:type use_even: bool
:param flipped: Flipped, When Even mode is active, flips between the two adjacent edge loops (optional)
:type flipped: bool
:param use_clamp: Clamp, Clamp within the edge extents (optional)
:type use_clamp: bool
:param direction: Slide Direction, World-space direction (array of 3 items, in [-inf, inf], optional)
:type direction: :class:`mathutils.Vector` | Sequence[float]
:param mirror: Mirror Editing, (optional)
:type mirror: bool
:param snap: Use Snapping Options, (optional)
:type snap: bool
:param snap_elements: Snap to Elements, (optional)
:type snap_elements: set[Literal[:ref:`rna_enum_snap_element_items`]]
:param use_snap_project: Project Individual Elements, (optional)
:type use_snap_project: bool
:param snap_target: Snap Base, Point on source that will snap to target (optional)
:type snap_target: Literal[:ref:`rna_enum_snap_source_items`]
:param use_snap_self: Target: Include Active, (optional)
:type use_snap_self: bool
:param use_snap_edit: Target: Include Edit, (optional)
:type use_snap_edit: bool
:param use_snap_nonedit: Target: Include Non-Edited, (optional)
:type use_snap_nonedit: bool
:param use_snap_selectable: Target: Exclude Non-Selectable, (optional)
:type use_snap_selectable: bool
:param snap_point: Point, (array of 3 items, in [-inf, inf], optional)
:type snap_point: :class:`mathutils.Vector` | Sequence[float]
:param correct_uv: Correct UVs, Correct UV coordinates when transforming (optional)
:type correct_uv: bool
:param release_confirm: Confirm on Release, Always confirm operation when releasing button (optional)
:type release_confirm: bool
:param use_accurate: Accurate, Use accurate transformation (optional)
:type use_accurate: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.vertex_random`

Randomize vertices

:param offset: Amount, Distance to offset (in [-inf, inf], optional)
:type offset: float
:param uniform: Uniform, Increase for uniform offset distance (in [0, 1], optional)
:type uniform: float
:param normal: Normal, Align offset direction to normals (in [0, 1], optional)
:type normal: float
:param seed: Random Seed, Seed for the random number generator (in [0, 10000], optional)
:type seed: int
:param wait_for_input: Wait for Input, (optional)
:type wait_for_input: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.transform.vertex_warp`

Warp vertices around the cursor

:param warp_angle: Warp Angle, Amount to warp about the cursor (in [-inf, inf], optional)
:type warp_angle: float
:param offset_angle: Offset Angle, Angle to use as the basis for warping (in [-inf, inf], optional)
:type offset_angle: float
:param min: Min, (in [-inf, inf], optional)
:type min: float
:param max: Max, (in [-inf, inf], optional)
:type max: float
:param viewmat: Matrix, (multi-dimensional array of 4 * 4 items, in [-inf, inf], optional)
:type viewmat: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param center: Center, (array of 3 items, in [-inf, inf], optional)
:type center: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
