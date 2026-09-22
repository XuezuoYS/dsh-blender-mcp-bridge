<!-- source: api/bpy.types.ColorManagedInputColorspaceSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ColorManagedInputColorspaceSettings`

Input color space settings

### attribute `bpy.types.ColorManagedInputColorspaceSettings.is_data`

Treat image as non-color data without color management, like normal or displacement maps (default False)

:type: bool

### attribute `bpy.types.ColorManagedInputColorspaceSettings.name`

Color space in the image file, to convert to and from when saving and loading the image (default ``'NONE'``)

:type: Literal[:ref:`rna_enum_color_space_convert_default_items`]

### classmethod `bpy.types.ColorManagedInputColorspaceSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ColorManagedInputColorspaceSettings.bl_rna_get_subclass_py`

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

- :class:`Image.colorspace_settings`
- :class:`ImageStrip.colorspace_settings`
- :class:`MovieClip.colorspace_settings`
- :class:`MovieStrip.colorspace_settings`
- :class:`ImageFormatSettings.linear_colorspace_settings`
