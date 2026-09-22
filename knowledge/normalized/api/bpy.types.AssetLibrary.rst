<!-- source: api/bpy.types.AssetLibrary.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.AssetLibrary`

Container for asset catalogs and assets

### data `bpy.types.AssetLibrary.is_editable`

Assets and catalogs in this library can be edited from the current Blender instance (default False, readonly)

:type: bool

### data `bpy.types.AssetLibrary.type`

(default ``'ALL'``, readonly)

- ``ALL``
  All Libraries -- Show assets from all of the listed asset libraries.
- ``LOCAL``
  Current File -- Show the assets currently available in this Blender session.
- ``ESSENTIALS``
  Essentials -- Show basic building blocks and utilities coming with Blender.
- ``ONLINE_ESSENTIALS``
  Online Essentials -- Show additional building blocks and utilities available online.
- ``CUSTOM``
  Custom -- Show assets from the asset libraries configured in the Preferences.

:type: Literal['ALL', 'LOCAL', 'ESSENTIALS', 'ONLINE_ESSENTIALS', 'CUSTOM']

### classmethod `bpy.types.AssetLibrary.online_assets_url`

online_assets_url

:return: URL, Remote location of the Online Essentials library (never None)
:rtype: str

### classmethod `bpy.types.AssetLibrary.online_assets_cache_path`

online_assets_cache_path

:return: Path, Local location of the Online Essentials library's disk cache (never None)
:rtype: str

### classmethod `bpy.types.AssetLibrary.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.AssetLibrary.bl_rna_get_subclass_py`

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

- :class:`AssetRepresentation.owner_asset_library`
