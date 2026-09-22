<!-- source: api/bpy.types.UserAssetLibrary.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.UserAssetLibrary`

Settings to define a reusable library for Asset Browsers to use

### attribute `bpy.types.UserAssetLibrary.enabled`

Enable the asset library (default True)

:type: bool

### attribute `bpy.types.UserAssetLibrary.import_method`

Determine how the asset will be imported, unless overridden by the Asset Browser (default ``'PACK'``)

:type: Literal[:ref:`rna_enum_asset_import_method_items`]

### attribute `bpy.types.UserAssetLibrary.name`

Identifier (not necessarily unique) for the asset library (default "", never None)

:type: str

### attribute `bpy.types.UserAssetLibrary.path`

Path to a directory with .blend files to use as an asset library (default "", never None)

:type: str

### attribute `bpy.types.UserAssetLibrary.remote_url`

Remote URL to the asset library (default "", never None)

:type: str

### attribute `bpy.types.UserAssetLibrary.use_relative_path`

Use relative path when linking assets from this asset library (default True)

:type: bool

### data `bpy.types.UserAssetLibrary.use_remote_url`

Synchronize the asset library with a remote URL (default False, readonly)

:type: bool

### classmethod `bpy.types.UserAssetLibrary.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.UserAssetLibrary.bl_rna_get_subclass_py`

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

- :class:`AssetLibraryCollection.new`
- :class:`AssetLibraryCollection.remove`
- :class:`PreferencesFilePaths.asset_libraries`
