<!-- source: api/bpy.types.CameraBackgroundImage.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.CameraBackgroundImage`

Image and settings for display in the 3D View background

### attribute `bpy.types.CameraBackgroundImage.alpha`

Image opacity to blend the image against the background color (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.CameraBackgroundImage.clip`

Movie clip displayed and edited in this space

:type: :class:`MovieClip` | None

### data `bpy.types.CameraBackgroundImage.clip_user`

Parameters defining which frame of the movie clip is displayed (readonly, never None)

:type: :class:`MovieClipUser`

### attribute `bpy.types.CameraBackgroundImage.display_depth`

Display under or over everything (default ``'BACK'``)

:type: Literal['BACK', 'FRONT']

### attribute `bpy.types.CameraBackgroundImage.frame_method`

How the image fits in the camera frame (default ``'FIT'``)

:type: Literal['STRETCH', 'FIT', 'CROP']

### attribute `bpy.types.CameraBackgroundImage.image`

Image displayed and edited in this space

:type: :class:`Image` | None

### data `bpy.types.CameraBackgroundImage.image_user`

Parameters defining which layer, pass and frame of the image is displayed (readonly, never None)

:type: :class:`ImageUser`

### data `bpy.types.CameraBackgroundImage.is_override_data`

In a local override camera, whether this background image comes from the linked reference camera, or is local to the override (default True, readonly)

:type: bool

### attribute `bpy.types.CameraBackgroundImage.offset`

(array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.CameraBackgroundImage.rotation`

Rotation for the background image (ortho view only) (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.CameraBackgroundImage.scale`

Scale the background image (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.CameraBackgroundImage.show_background_image`

Show this image as background (default True)

:type: bool

### attribute `bpy.types.CameraBackgroundImage.show_expanded`

Show the details in the user interface (default False)

:type: bool

### attribute `bpy.types.CameraBackgroundImage.show_on_foreground`

Show this image in front of objects in viewport (default False)

:type: bool

### attribute `bpy.types.CameraBackgroundImage.source`

Data source used for background (default ``'IMAGE'``)

:type: Literal['IMAGE', 'MOVIE_CLIP']

### attribute `bpy.types.CameraBackgroundImage.use_camera_clip`

Use movie clip from active scene camera (default False)

:type: bool

### attribute `bpy.types.CameraBackgroundImage.use_flip_x`

Flip the background image horizontally (default False)

:type: bool

### attribute `bpy.types.CameraBackgroundImage.use_flip_y`

Flip the background image vertically (default False)

:type: bool

### classmethod `bpy.types.CameraBackgroundImage.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.CameraBackgroundImage.bl_rna_get_subclass_py`

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

- :class:`Camera.background_images`
- :class:`CameraBackgroundImages.new`
- :class:`CameraBackgroundImages.remove`
