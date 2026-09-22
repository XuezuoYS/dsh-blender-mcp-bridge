<!-- source: api/bpy_extras.object_utils.rst -->

### function `bpy_extras.object_utils.add_object_align_init`

Return a matrix using the operator settings and view context.

:param context: The context to use.
:type context: :class:`bpy.types.Context`
:param operator: The operator, checked for location and rotation properties.
:type operator: :class:`bpy.types.Operator` | None
:return: the matrix from the context and settings.
:rtype: :class:`mathutils.Matrix`

### function `bpy_extras.object_utils.object_data_add`

Add an object using the view context and preference to initialize the
location, rotation and layer.

:param context: The context to use.
:type context: :class:`bpy.types.Context`
:param obdata: Valid object data to be used for the new object or None.
:type obdata: :class:`bpy.types.ID` | None
:param operator: The operator, checked for location and rotation properties.
:type operator: :class:`bpy.types.Operator` | None
:param name: Optional name
:type name: str | None
:return: the newly created object in the scene.
:rtype: :class:`bpy.types.Object`

### function `bpy_extras.object_utils.object_add_grid_scale`

Return scale which should be applied on object
data to align it to grid scale.

:param context: The context.
:type context: :class:`bpy.types.Context`
:return: The grid scale.
:rtype: float

### function `bpy_extras.object_utils.object_add_grid_scale_apply_operator`

Scale an operator's distance values by the grid size.

:param operator: The operator to scale.
:type operator: :class:`bpy.types.Operator`
:param context: The context.
:type context: :class:`bpy.types.Context`

### function `bpy_extras.object_utils.world_to_camera_view`

Returns the camera space coords for a 3d point.
(also known as: normalized device coordinates - NDC).

Where (0, 0) is the bottom left and (1, 1)
is the top right of the camera frame.
values outside 0-1 are also supported.
A negative 'z' value means the point is behind the camera.

Takes shift-x/y, lens angle and sensor size into account
as well as perspective/ortho projections.

:param scene: Scene to use for frame size.
:type scene: :class:`bpy.types.Scene`
:param obj: Camera object.
:type obj: :class:`bpy.types.Object`
:param coord: World space location.
:type coord: :class:`mathutils.Vector`
:return: a vector where X and Y map to the view plane and
Z is the depth on the view axis.
:rtype: :class:`mathutils.Vector`

### function `bpy_extras.object_utils.object_report_if_active_shape_key_is_locked`

Checks if the active shape key of the specified object is locked, and reports an error if so.

If the object has no shape keys, there is nothing to lock, and the function returns False.

:param obj: Object to check.
:type obj: :class:`bpy.types.Object`
:param operator: Currently running operator to report the error through. Use None to suppress emitting the message.
:type operator: :class:`bpy.types.Operator` | None
:return: True if the shape key was locked.
:rtype: bool

### method `bpy_extras.object_utils.AddObjectHelper.align_update_callback`

Update callback for the align property, resets rotation for world alignment.

:param context: The context.
:type context: :class:`bpy.types.Context`

### classmethod `bpy_extras.object_utils.AddObjectHelper.poll`

Check the scene is not linked from a library.

:param context: The context.
:type context: :class:`bpy.types.Context`
:return: True when the scene is local (not linked from a library).
:rtype: bool
