<!-- source: api/bpy.types.Library.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.Library`

External .blend file from which data is linked

### data `bpy.types.Library.archive_libraries`

Archive libraries of packed IDs, generated (and owned) by this source library (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Library`]

### data `bpy.types.Library.archive_parent_library`

Source library from which this archive of packed IDs was generated (readonly)

:type: :class:`Library` | None

### attribute `bpy.types.Library.filepath`

Path to the library .blend file (default "", never None, blend relative ``//`` prefix supported)

:type: str

### data `bpy.types.Library.is_archive`

This library is an 'archive' storage for packed linked IDs originally linked from its 'archive parent' library. (default False, readonly)

:type: bool

### data `bpy.types.Library.is_editable`

Data-blocks in this library are editable despite being linked. Used by brush assets and their dependencies. (default False, readonly)

:type: bool

### attribute `bpy.types.Library.needs_liboverride_resync`

True if this library contains library overrides that are linked in current blendfile, and that had to be recursively resynced on load (it is recommended to open and re-save that library blendfile then) (default False)

:type: bool

### data `bpy.types.Library.packed_file`

(readonly)

:type: :class:`PackedFile` | None

### data `bpy.types.Library.parent`

(readonly)

:type: :class:`Library` | None

### data `bpy.types.Library.version`

Version of Blender the library .blend was saved with (array of 3 items, in [0, inf], default (0, 0, 0), readonly)

:type: :class:`bpy_prop_array`\ [int]

### data `bpy.types.Library.users_id`

ID data-blocks that use this library

:type: tuple[:class:`ID`, ...]

### method `bpy.types.Library.reload`

note: 
Takes ``O(n)`` time, where ``n`` is the total number of all
    linkable ID types in ``bpy.data``.

(readonly)
Reload this library and all its linked data-blocks

### classmethod `bpy.types.Library.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Library.bl_rna_get_subclass_py`

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

- :class:`BlendData.libraries`
- :class:`BlendDataLibraries.remove`
- :class:`BlendImportContextItem.source_library`
- :class:`ID.library`
- :class:`Library.archive_libraries`
- :class:`Library.archive_parent_library`
- :class:`Library.parent`
