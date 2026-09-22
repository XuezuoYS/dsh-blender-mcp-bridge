<!-- source: api/bpy.types.MovieClip.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.MovieClip`

MovieClip data-block referencing an external movie file

### data `bpy.types.MovieClip.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### attribute `bpy.types.MovieClip.annotation`

Annotation data for this movie clip

:type: :class:`Annotation` | None

### data `bpy.types.MovieClip.colorspace_settings`

Input color space settings (readonly)

:type: :class:`ColorManagedInputColorspaceSettings` | None

### attribute `bpy.types.MovieClip.display_aspect`

Display Aspect for this clip, does not affect rendering (array of 2 items, in [0.1, inf], default (1.0, 1.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MovieClip.filepath`

Filename of the movie or sequence file (default "", never None, blend relative ``//`` prefix supported)

:type: str

### data `bpy.types.MovieClip.fps`

Detected frame rate of the movie clip in frames per second (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.MovieClip.frame_duration`

Detected duration of movie clip in frames (in [-inf, inf], default 0, readonly)

:type: int

### attribute `bpy.types.MovieClip.frame_offset`

Offset of footage first frame relative to its file name (affects only how footage is loading, does not change data associated with a clip) (in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.MovieClip.frame_start`

Global scene frame number at which this movie starts playing (affects all data associated with a clip) (in [-inf, inf], default 1)

:type: int

### data `bpy.types.MovieClip.proxy`

(readonly)

:type: :class:`MovieClipProxy` | None

### data `bpy.types.MovieClip.size`

Width and height in pixels, zero when image data cannot be loaded (array of 2 items, in [-inf, inf], default (0, 0), readonly)

:type: :class:`bpy_prop_array`\ [int]

### data `bpy.types.MovieClip.source`

Where the clip comes from (default ``'SEQUENCE'``, readonly)

- ``SEQUENCE``
  Image Sequence -- Multiple image files, as a sequence.
- ``MOVIE``
  Movie File -- Movie file.

:type: Literal['SEQUENCE', 'MOVIE']

### data `bpy.types.MovieClip.tracking`

(readonly)

:type: :class:`MovieTracking` | None

### attribute `bpy.types.MovieClip.use_proxy`

Use a preview proxy for this clip (default False)

:type: bool

### attribute `bpy.types.MovieClip.use_proxy_custom_directory`

Create proxy images in a custom directory (default is movie location) (default False)

:type: bool

### method `bpy.types.MovieClip.metadata`

Retrieve metadata of the movie file

:return: Dict-like object containing the metadata
:rtype: :class:`IDPropertyWrapPtr`

### classmethod `bpy.types.MovieClip.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieClip.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.edit_movieclip`
- :class:`BlendData.movieclips`
- :class:`BlendDataMovieClips.load`
- :class:`BlendDataMovieClips.remove`
- :class:`CameraBackgroundImage.clip`
- :class:`CameraSolverConstraint.clip`
- :class:`CompositorNodeKeyingScreen.clip`
- :class:`CompositorNodeMovieClip.clip`
- :class:`CompositorNodeMovieDistortion.clip`
- :class:`CompositorNodePlaneTrackDeform.clip`
- :class:`CompositorNodeStabilize.clip`
- :class:`CompositorNodeTrackPos.clip`
- :class:`FollowTrackConstraint.clip`
- :class:`MovieClipStrip.clip`
- :class:`ObjectSolverConstraint.clip`
- :class:`Scene.active_clip`
- :class:`SpaceClipEditor.clip`
- :class:`StripsMeta.new_clip`
- :class:`StripsTopLevel.new_clip`
