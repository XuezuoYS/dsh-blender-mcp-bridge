<!-- source: api/bpy.types.CacheFile.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### attribute `bpy.types.CacheFile.active_index`

(in [0, inf], default 0)

:type: int

### data `bpy.types.CacheFile.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### attribute `bpy.types.CacheFile.filepath`

Path to external displacements file (default "", never None, blend relative ``//`` prefix supported)

:type: str

### attribute `bpy.types.CacheFile.forward_axis`

(default ``'POS_X'``)

:type: Literal[:ref:`rna_enum_object_axis_items`]

### attribute `bpy.types.CacheFile.frame`

The time to use for looking up the data in the cache file, or to determine which file to use in a file sequence (in [-1.04857e+06, 1.04857e+06], default 0.0)

:type: float

### attribute `bpy.types.CacheFile.frame_offset`

Subtracted from the current frame to use for looking up the data in the cache file, or to determine which file to use in a file sequence (in [-1.04857e+06, 1.04857e+06], default 0.0)

:type: float

### attribute `bpy.types.CacheFile.is_sequence`

Whether the cache is separated in a series of files (default False)

:type: bool

### data `bpy.types.CacheFile.layers`

Layers of the cache (default None, readonly)

:type: :class:`CacheFileLayers`\ [:class:`CacheFileLayer`]

### data `bpy.types.CacheFile.object_paths`

Paths of the objects inside the Alembic archive (default None, readonly)

:type: :class:`CacheObjectPaths`\ [:class:`CacheObjectPath`]

### attribute `bpy.types.CacheFile.override_frame`

Whether to use a custom frame for looking up data in the cache file, instead of using the current scene frame (default False)

:type: bool

### attribute `bpy.types.CacheFile.scale`

Value by which to enlarge or shrink the object with respect to the world's origin (only applicable through a Transform Cache constraint) (in [0.0001, 1000], default 1.0)

:type: float

### attribute `bpy.types.CacheFile.up_axis`

(default ``'POS_X'``)

:type: Literal[:ref:`rna_enum_object_axis_items`]

### attribute `bpy.types.CacheFile.velocity_name`

Name of the Alembic attribute used for generating motion blur data (default "", never None)

:type: str

### attribute `bpy.types.CacheFile.velocity_unit`

Define how the velocity vectors are interpreted with regard to time, 'frame' means the delta time is 1 frame, 'second' means the delta time is 1 / FPS (default ``'FRAME'``)

:type: Literal[:ref:`rna_enum_velocity_unit_items`]

### classmethod `bpy.types.CacheFile.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.CacheFile.bl_rna_get_subclass_py`

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

- :class:`BlendData.cache_files`
- :class:`MeshSequenceCacheModifier.cache_file`
- :class:`TransformCacheConstraint.cache_file`
