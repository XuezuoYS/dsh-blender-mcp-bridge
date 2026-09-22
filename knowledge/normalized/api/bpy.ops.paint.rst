<!-- source: api/bpy.ops.paint.rst -->

### function `bpy.ops.paint.add_simple_uvs`

Add cube map UVs on mesh

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.add_texture_paint_slot`

Add a paint slot

:param type: Material Layer Type, Material layer type of new paint slot (optional)
:type type: Literal['BASE_COLOR', 'SPECULAR', 'ROUGHNESS', 'METALLIC', 'NORMAL', 'BUMP', 'DISPLACEMENT']
:param slot_type: Slot Type, Type of new paint slot (optional)
:type slot_type: Literal['IMAGE', 'COLOR_ATTRIBUTE']
:param name: Name, Name for new paint slot source (optional, never None)
:type name: str
:param color: Color, Default fill color (array of 4 items, in [0, inf], optional)
:type color: Sequence[float]
:param width: Width, Image width (in [1, inf], optional)
:type width: int
:param height: Height, Image height (in [1, inf], optional)
:type height: int
:param alpha: Alpha, Create an image with an alpha channel (optional)
:type alpha: bool
:param generated_type: Generated Type, Fill the image with a grid for UV map testing (optional)
:type generated_type: Literal[:ref:`rna_enum_image_generated_type_items`]
:param float: 32-bit Float, Create image with 32-bit floating-point bit depth (optional)
:type float: bool
:param tiled: Tiled, Create a tiled image (optional)
:type tiled: bool
:param domain: Domain, Type of element that attribute is stored on (optional)
:type domain: Literal[:ref:`rna_enum_color_attribute_domain_items`]
:param data_type: Data Type, Type of data stored in attribute (optional)
:type data_type: Literal[:ref:`rna_enum_color_attribute_type_items`]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.brush_colors_flip`

Swap primary and secondary brush colors

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_select_all`

Change selection for all faces

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

### function `bpy.ops.paint.face_select_hide`

Hide selected faces

:param unselected: Unselected, Hide unselected rather than selected objects (optional)
:type unselected: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_select_less`

Deselect Faces connected to existing selection

:param face_step: Face Step, Also deselect faces that only touch on a corner (optional)
:type face_step: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_select_linked`

Select linked faces

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_select_linked_pick`

Select linked faces under the cursor

:param deselect: Deselect, Deselect rather than select items (optional)
:type deselect: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_select_loop`

Select face loop under the cursor

:param select: Select, If false, faces will be deselected (optional)
:type select: bool
:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_select_more`

Select Faces connected to existing selection

:param face_step: Face Step, Also select faces that only touch on a corner (optional)
:type face_step: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.face_vert_reveal`

Reveal hidden faces and vertices

:param select: Select, Specifies whether the newly revealed geometry should be selected (optional)
:type select: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.grab_clone`

Move the clone source image

:param delta: Delta, Delta offset of clone image in 0.0 to 1.0 coordinates (array of 2 items, in [-inf, inf], optional)
:type delta: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.hide_show`

Hide/show some vertices

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
:param action: Visibility Action, Whether to hide or show vertices (optional)

- ``HIDE``
  Hide -- Hide vertices.
- ``SHOW``
  Show -- Show vertices.
:type action: Literal['HIDE', 'SHOW']
:param area: Visibility Area, Which vertices to hide or show (optional)

- ``OUTSIDE``
  Outside -- Hide or show vertices outside the selection.
- ``Inside``
  Inside -- Hide or show vertices inside the selection.
:type area: Literal['OUTSIDE', 'Inside']
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.hide_show_all`

Hide/show all vertices

:param action: Visibility Action, Whether to hide or show vertices (optional)

- ``HIDE``
  Hide -- Hide vertices.
- ``SHOW``
  Show -- Show vertices.
:type action: Literal['HIDE', 'SHOW']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.hide_show_lasso_gesture`

Hide/show some vertices

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param use_smooth_stroke: Stabilize Stroke, Selection lags behind mouse and follows a smoother path (optional)
:type use_smooth_stroke: bool
:param smooth_stroke_factor: Smooth Stroke Factor, Higher values give a smoother stroke (in [0.5, 0.99], optional)
:type smooth_stroke_factor: float
:param smooth_stroke_radius: Smooth Stroke Radius, Minimum distance from last point before selection continues (in [10, 200], optional)
:type smooth_stroke_radius: int
:param action: Visibility Action, Whether to hide or show vertices (optional)

- ``HIDE``
  Hide -- Hide vertices.
- ``SHOW``
  Show -- Show vertices.
:type action: Literal['HIDE', 'SHOW']
:param area: Visibility Area, Which vertices to hide or show (optional)

- ``OUTSIDE``
  Outside -- Hide or show vertices outside the selection.
- ``Inside``
  Inside -- Hide or show vertices inside the selection.
:type area: Literal['OUTSIDE', 'Inside']
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.hide_show_line_gesture`

Hide/show some vertices

:param xstart: X Start, (in [-inf, inf], optional)
:type xstart: int
:param xend: X End, (in [-inf, inf], optional)
:type xend: int
:param ystart: Y Start, (in [-inf, inf], optional)
:type ystart: int
:param yend: Y End, (in [-inf, inf], optional)
:type yend: int
:param flip: Flip, (optional)
:type flip: bool
:param cursor: Cursor, Mouse cursor style to use during the modal operator (in [0, inf], optional)
:type cursor: int
:param action: Visibility Action, Whether to hide or show vertices (optional)

- ``HIDE``
  Hide -- Hide vertices.
- ``SHOW``
  Show -- Show vertices.
:type action: Literal['HIDE', 'SHOW']
:param area: Visibility Area, Which vertices to hide or show (optional)

- ``OUTSIDE``
  Outside -- Hide or show vertices outside the selection.
- ``Inside``
  Inside -- Hide or show vertices inside the selection.
:type area: Literal['OUTSIDE', 'Inside']
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:param use_limit_to_segment: Limit to Segment, Apply the gesture action only to the area that is contained within the segment without extending its effect to the entire line (optional)
:type use_limit_to_segment: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.hide_show_masked`

Hide/show all masked vertices above a threshold

:param action: Visibility Action, Whether to hide or show vertices (optional)

- ``HIDE``
  Hide -- Hide vertices.
- ``SHOW``
  Show -- Show vertices.
:type action: Literal['HIDE', 'SHOW']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.hide_show_polyline_gesture`

Hide/show some vertices

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param action: Visibility Action, Whether to hide or show vertices (optional)

- ``HIDE``
  Hide -- Hide vertices.
- ``SHOW``
  Show -- Show vertices.
:type action: Literal['HIDE', 'SHOW']
:param area: Visibility Area, Which vertices to hide or show (optional)

- ``OUTSIDE``
  Outside -- Hide or show vertices outside the selection.
- ``Inside``
  Inside -- Hide or show vertices inside the selection.
:type area: Literal['OUTSIDE', 'Inside']
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.image_from_view`

Make an image from biggest 3D view for reprojection

:param filepath: File Path, Name of the file (optional, never None)
:type filepath: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.image_paint`

Paint a stroke into the image

:param stroke: Stroke, (optional)
:type stroke: :class:`bpy_prop_collection`\ [:class:`OperatorStrokeElement`] | None
:param mode: Stroke Mode, Action taken when a paint stroke is made (optional)

- ``NORMAL``
  Regular -- Apply brush normally.
- ``INVERT``
  Invert -- Invert action of brush for duration of stroke.
:type mode: Literal['NORMAL', 'INVERT']
:param brush_toggle: Temporary Brush Toggle Type, Brush to use for duration of stroke (optional)

- ``None``
  None -- Apply brush normally.
- ``SMOOTH``
  Smooth -- Switch to smooth brush for duration of stroke.
- ``ERASE``
  Erase -- Switch to erase brush for duration of stroke.
- ``MASK``
  Mask -- Switch to mask brush for duration of stroke.
:type brush_toggle: Literal['None', 'SMOOTH', 'ERASE', 'MASK']
:param pen_flip: Pen Flip, Whether a tablet's eraser mode is being used (optional)
:type pen_flip: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.mask_box_gesture`

Mask within a rectangle defined by the cursor

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
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:param mode: Mode, (optional)

- ``VALUE``
  Value -- Set mask to the level specified by the 'value' property.
- ``VALUE_INVERSE``
  Value Inverted -- Set mask to the level specified by the inverted 'value' property.
- ``INVERT``
  Invert -- Invert the mask.
:type mode: Literal['VALUE', 'VALUE_INVERSE', 'INVERT']
:param value: Value, Mask level to use when mode is 'Value'; zero means no masking and one is fully masked (in [0, 1], optional)
:type value: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.mask_flood_fill`

Fill the whole mask with a given value, or invert its values

:param mode: Mode, (optional)

- ``VALUE``
  Value -- Set mask to the level specified by the 'value' property.
- ``VALUE_INVERSE``
  Value Inverted -- Set mask to the level specified by the inverted 'value' property.
- ``INVERT``
  Invert -- Invert the mask.
:type mode: Literal['VALUE', 'VALUE_INVERSE', 'INVERT']
:param value: Value, Mask level to use when mode is 'Value'; zero means no masking and one is fully masked (in [0, 1], optional)
:type value: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.mask_lasso_gesture`

Mask within a shape defined by the cursor

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param use_smooth_stroke: Stabilize Stroke, Selection lags behind mouse and follows a smoother path (optional)
:type use_smooth_stroke: bool
:param smooth_stroke_factor: Smooth Stroke Factor, Higher values give a smoother stroke (in [0.5, 0.99], optional)
:type smooth_stroke_factor: float
:param smooth_stroke_radius: Smooth Stroke Radius, Minimum distance from last point before selection continues (in [10, 200], optional)
:type smooth_stroke_radius: int
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:param mode: Mode, (optional)

- ``VALUE``
  Value -- Set mask to the level specified by the 'value' property.
- ``VALUE_INVERSE``
  Value Inverted -- Set mask to the level specified by the inverted 'value' property.
- ``INVERT``
  Invert -- Invert the mask.
:type mode: Literal['VALUE', 'VALUE_INVERSE', 'INVERT']
:param value: Value, Mask level to use when mode is 'Value'; zero means no masking and one is fully masked (in [0, 1], optional)
:type value: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.mask_line_gesture`

Mask to one side of a line defined by the cursor

:param xstart: X Start, (in [-inf, inf], optional)
:type xstart: int
:param xend: X End, (in [-inf, inf], optional)
:type xend: int
:param ystart: Y Start, (in [-inf, inf], optional)
:type ystart: int
:param yend: Y End, (in [-inf, inf], optional)
:type yend: int
:param flip: Flip, (optional)
:type flip: bool
:param cursor: Cursor, Mouse cursor style to use during the modal operator (in [0, inf], optional)
:type cursor: int
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:param use_limit_to_segment: Limit to Segment, Apply the gesture action only to the area that is contained within the segment without extending its effect to the entire line (optional)
:type use_limit_to_segment: bool
:param mode: Mode, (optional)

- ``VALUE``
  Value -- Set mask to the level specified by the 'value' property.
- ``VALUE_INVERSE``
  Value Inverted -- Set mask to the level specified by the inverted 'value' property.
- ``INVERT``
  Invert -- Invert the mask.
:type mode: Literal['VALUE', 'VALUE_INVERSE', 'INVERT']
:param value: Value, Mask level to use when mode is 'Value'; zero means no masking and one is fully masked (in [0, 1], optional)
:type value: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.mask_polyline_gesture`

Mask within a shape defined by the cursor

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param use_front_faces_only: Front Faces Only, Affect only faces facing towards the view (optional)
:type use_front_faces_only: bool
:param mode: Mode, (optional)

- ``VALUE``
  Value -- Set mask to the level specified by the 'value' property.
- ``VALUE_INVERSE``
  Value Inverted -- Set mask to the level specified by the inverted 'value' property.
- ``INVERT``
  Invert -- Invert the mask.
:type mode: Literal['VALUE', 'VALUE_INVERSE', 'INVERT']
:param value: Value, Mask level to use when mode is 'Value'; zero means no masking and one is fully masked (in [0, 1], optional)
:type value: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.project_image`

Project an edited render from the active camera back onto the object

:param image: Image, (optional)
:type image: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.sample_color`

Use the mouse to sample a color in the image

:param location: Location, (array of 2 items, in [0, inf], optional)
:type location: Sequence[int]
:param merged: Sample Merged, Sample the output display color (optional)
:type merged: bool
:param palette: Add to Palette, (optional)
:type palette: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.texture_paint_toggle`

Toggle texture paint mode in 3D view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_all`

Change selection for all vertices

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

### function `bpy.ops.paint.vert_select_hide`

Hide selected vertices

:param unselected: Unselected, Hide unselected rather than selected vertices (optional)
:type unselected: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_less`

Deselect Vertices connected to existing selection

:param face_step: Face Step, Also deselect faces that only touch on a corner (optional)
:type face_step: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_linked`

Select linked vertices

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_linked_pick`

Select linked vertices under the cursor

:param select: Select, Whether to select or deselect linked vertices under the cursor (optional)
:type select: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_loop`

Select vertex loop under the cursor

:param select: Select, If false, vertices will be deselected (optional)
:type select: bool
:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_more`

Select Vertices connected to existing selection

:param face_step: Face Step, Also select faces that only touch on a corner (optional)
:type face_step: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vert_select_ungrouped`

Select vertices without a group

:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_brightness_contrast`

Adjust vertex color brightness/contrast

:param brightness: Brightness, (in [-100, 100], optional)
:type brightness: float
:param contrast: Contrast, (in [-100, 100], optional)
:type contrast: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_dirt`

Generate a dirt map gradient based on cavity

:param blur_strength: Blur Strength, Blur strength per iteration (in [0.01, 1], optional)
:type blur_strength: float
:param blur_iterations: Blur Iterations, Number of times to blur the colors (higher blurs more) (in [0, 40], optional)
:type blur_iterations: int
:param clean_angle: Highlight Angle, Less than 90 limits the angle used in the tonal range (in [0, 3.14159], optional)
:type clean_angle: float
:param dirt_angle: Dirt Angle, Less than 90 limits the angle used in the tonal range (in [0, 3.14159], optional)
:type dirt_angle: float
:param dirt_only: Dirt Only, Don't calculate cleans for convex areas (optional)
:type dirt_only: bool
:param normalize: Normalize, Normalize the colors, increasing the contrast (optional)
:type normalize: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/vertexpaint_dirt.py\:182 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/vertexpaint_dirt.py#L182>`__

### function `bpy.ops.paint.vertex_color_from_weight`

Convert active weight into gray scale vertex colors

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_hsv`

Adjust vertex color Hue/Saturation/Value

:param h: Hue, (in [0, 1], optional)
:type h: float
:param s: Saturation, (in [0, 2], optional)
:type s: float
:param v: Value, (in [0, 2], optional)
:type v: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_invert`

Invert RGB values

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_levels`

Adjust levels of vertex colors

:param offset: Offset, Value to add to colors (in [-1, 1], optional)
:type offset: float
:param gain: Gain, Value to multiply colors by (in [0, inf], optional)
:type gain: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_set`

Fill the active vertex color layer with the current paint color

:param use_alpha: Affect Alpha, Set color completely opaque instead of reusing existing alpha (optional)
:type use_alpha: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_color_smooth`

Smooth colors across vertices

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_paint`

Paint a stroke in the active color attribute layer

:param stroke: Stroke, (optional)
:type stroke: :class:`bpy_prop_collection`\ [:class:`OperatorStrokeElement`] | None
:param mode: Stroke Mode, Action taken when a paint stroke is made (optional)

- ``NORMAL``
  Regular -- Apply brush normally.
- ``INVERT``
  Invert -- Invert action of brush for duration of stroke.
:type mode: Literal['NORMAL', 'INVERT']
:param brush_toggle: Temporary Brush Toggle Type, Brush to use for duration of stroke (optional)

- ``None``
  None -- Apply brush normally.
- ``SMOOTH``
  Smooth -- Switch to smooth brush for duration of stroke.
- ``ERASE``
  Erase -- Switch to erase brush for duration of stroke.
- ``MASK``
  Mask -- Switch to mask brush for duration of stroke.
:type brush_toggle: Literal['None', 'SMOOTH', 'ERASE', 'MASK']
:param pen_flip: Pen Flip, Whether a tablet's eraser mode is being used (optional)
:type pen_flip: bool
:param override_location: Override Location, Override the given "location" array by recalculating object space positions from the provided "mouse_event" positions (optional)
:type override_location: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.vertex_paint_toggle`

Toggle the vertex paint mode in 3D view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.visibility_filter`

Edit the visibility of the current mesh

:param action: Action, (optional)

- ``GROW``
  Grow Visibility -- Grow the visibility by one face based on mesh topology.
- ``SHRINK``
  Shrink Visibility -- Shrink the visibility by one face based on mesh topology.
:type action: Literal['GROW', 'SHRINK']
:param iterations: Iterations, Number of times that the filter is going to be applied (in [1, 100], optional)
:type iterations: int
:param auto_iteration_count: Auto Iteration Count, Use an automatic number of iterations based on the number of vertices of the sculpt (optional)
:type auto_iteration_count: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.visibility_invert`

Invert the visibility of all vertices

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_from_bones`

Set the weights of the groups matching the attached armature's bones that have "Deform" option enabled, using the distance between the vertices and the bones

:param type: Type, Method to use for assigning weights (optional)

- ``AUTOMATIC``
  Automatic -- Automatic weights from bones.
- ``ENVELOPES``
  From Envelopes -- Weights from envelopes with user defined radius.
:type type: Literal['AUTOMATIC', 'ENVELOPES']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_gradient`

Draw a line to apply a weight gradient to selected vertices

:param type: Type, (optional)
:type type: Literal['LINEAR', 'RADIAL']
:param xstart: X Start, (in [-inf, inf], optional)
:type xstart: int
:param xend: X End, (in [-inf, inf], optional)
:type xend: int
:param ystart: Y Start, (in [-inf, inf], optional)
:type ystart: int
:param yend: Y End, (in [-inf, inf], optional)
:type yend: int
:param flip: Flip, (optional)
:type flip: bool
:param cursor: Cursor, Mouse cursor style to use during the modal operator (in [0, inf], optional)
:type cursor: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_paint`

Paint a stroke in the current vertex group's weights

:param stroke: Stroke, (optional)
:type stroke: :class:`bpy_prop_collection`\ [:class:`OperatorStrokeElement`] | None
:param mode: Stroke Mode, Action taken when a paint stroke is made (optional)

- ``NORMAL``
  Regular -- Apply brush normally.
- ``INVERT``
  Invert -- Invert action of brush for duration of stroke.
:type mode: Literal['NORMAL', 'INVERT']
:param brush_toggle: Temporary Brush Toggle Type, Brush to use for duration of stroke (optional)

- ``None``
  None -- Apply brush normally.
- ``SMOOTH``
  Smooth -- Switch to smooth brush for duration of stroke.
- ``ERASE``
  Erase -- Switch to erase brush for duration of stroke.
- ``MASK``
  Mask -- Switch to mask brush for duration of stroke.
:type brush_toggle: Literal['None', 'SMOOTH', 'ERASE', 'MASK']
:param pen_flip: Pen Flip, Whether a tablet's eraser mode is being used (optional)
:type pen_flip: bool
:param override_location: Override Location, Override the given "location" array by recalculating object space positions from the provided "mouse_event" positions (optional)
:type override_location: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_paint_toggle`

Toggle weight paint mode in 3D view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_sample`

Use the mouse to sample a weight in the 3D view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_sample_group`

Select one of the vertex groups available under current mouse position

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.paint.weight_set`

Fill the active vertex group with the current paint weight

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
