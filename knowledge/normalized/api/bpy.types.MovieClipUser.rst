<!-- source: api/bpy.types.MovieClipUser.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MovieClipUser`

Parameters defining how a MovieClip data-block is used by another data-block

### attribute `bpy.types.MovieClipUser.frame_current`

Current frame number in movie or image sequence (in [-1048574, 1048574], default 1)

:type: int

### attribute `bpy.types.MovieClipUser.proxy_render_size`

Display preview using full resolution or different proxy resolutions (default ``'FULL'``)

:type: Literal['PROXY_25', 'PROXY_50', 'PROXY_75', 'PROXY_100', 'FULL']

### attribute `bpy.types.MovieClipUser.use_render_undistorted`

Render preview using undistorted proxy (default False)

:type: bool

### classmethod `bpy.types.MovieClipUser.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieClipUser.bl_rna_get_subclass_py`

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

- :class:`CameraBackgroundImage.clip_user`
- :class:`SpaceClipEditor.clip_user`
- :class:`UILayout.template_marker`
- :class:`UILayout.template_movieclip_information`
