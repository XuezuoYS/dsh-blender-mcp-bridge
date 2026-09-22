<!-- source: api/bpy.types.AssetWeakReference.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.AssetWeakReference`

Weak reference to some asset

### data `bpy.types.AssetWeakReference.asset_library_identifier`

(default "", readonly, never None)

:type: str

### data `bpy.types.AssetWeakReference.asset_library_type`

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

### data `bpy.types.AssetWeakReference.relative_asset_identifier`

(default "", readonly, never None)

:type: str

### classmethod `bpy.types.AssetWeakReference.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.AssetWeakReference.bl_rna_get_subclass_py`

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

- :class:`AssetShelf.get_active_asset`
- :class:`Paint.brush_asset_reference`
