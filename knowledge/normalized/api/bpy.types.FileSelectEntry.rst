<!-- source: api/bpy.types.FileSelectEntry.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.FileSelectEntry`

A file viewable in the File Browser

### data `bpy.types.FileSelectEntry.asset_data`

Asset data, valid if the file represents an asset (readonly)

:type: :class:`AssetMetaData` | None

### data `bpy.types.FileSelectEntry.name`

(default "", readonly, never None)

:type: str

### data `bpy.types.FileSelectEntry.preview_icon_id`

Unique integer identifying the preview of this file as an icon (zero means invalid) (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.FileSelectEntry.relative_path`

Path relative to the directory currently displayed in the File Browser (includes the file name) (default "", readonly, never None)

:type: str

### classmethod `bpy.types.FileSelectEntry.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.FileSelectEntry.bl_rna_get_subclass_py`

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
