<!-- source: api/bpy.types.ShaderFxPixel.rst -->

base classes --- :class:`bpy_struct`, :class:`ShaderFx`

### class `bpy.types.ShaderFxPixel`

Pixelate effect

### attribute `bpy.types.ShaderFxPixel.size`

Pixel size (array of 2 items, in [1, 32767], default (0, 0))

:type: :class:`bpy_prop_array`\ [int]

### attribute `bpy.types.ShaderFxPixel.use_antialiasing`

Antialias pixels (default True)

:type: bool

### classmethod `bpy.types.ShaderFxPixel.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ShaderFxPixel.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`ShaderFx.name`
- :class:`ShaderFx.type`
- :class:`ShaderFx.show_viewport`
- :class:`ShaderFx.show_render`
- :class:`ShaderFx.show_in_editmode`
- :class:`ShaderFx.show_expanded`

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
- :class:`ShaderFx.bl_rna_get_subclass`
- :class:`ShaderFx.bl_rna_get_subclass_py`
