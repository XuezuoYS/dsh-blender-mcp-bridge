<!-- source: api/bpy.types.AssetRepresentation.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.AssetRepresentation`

Information about an entity that makes it possible for the asset system to deal with the entity as asset

### data `bpy.types.AssetRepresentation.full_library_path`

Absolute path to the .blend file containing this asset (default "", readonly, never None)

:type: str

### data `bpy.types.AssetRepresentation.full_path`

Absolute path to the .blend file containing this asset extended with the path of the asset inside the file (default "", readonly, never None)

:type: str

### data `bpy.types.AssetRepresentation.id_type`

The type of the data-block, if the asset represents one ('NONE' otherwise) (default ``'ACTION'``, readonly)

:type: Literal[:ref:`rna_enum_id_type_items`]

### data `bpy.types.AssetRepresentation.is_online`

True if this asset is accessed via internet, not stored on disk (default False, readonly)

:type: bool

### data `bpy.types.AssetRepresentation.local_id`

The local data-block this asset represents; only valid if that is a data-block in this file (readonly)

:type: :class:`ID` | None

### data `bpy.types.AssetRepresentation.metadata`

Additional information about the asset (readonly)

:type: :class:`AssetMetaData` | None

### data `bpy.types.AssetRepresentation.name`

(default "", readonly, never None)

:type: str

### data `bpy.types.AssetRepresentation.owner_asset_library`

The asset library containing this asset (readonly)

:type: :class:`AssetLibrary` | None

### classmethod `bpy.types.AssetRepresentation.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.AssetRepresentation.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.asset`
- :mod:`bpy.context.selected_assets`
- :class:`AssetShelf.asset_poll`
- :class:`AssetShelf.draw_context_menu`
- :class:`Context.asset`
