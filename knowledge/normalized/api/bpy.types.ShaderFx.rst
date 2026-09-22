<!-- source: api/bpy.types.ShaderFx.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ShaderFx`

:caption: Subclasses
:maxdepth: 1

bpy.types.ShaderFxBlur.rst
bpy.types.ShaderFxColorize.rst
bpy.types.ShaderFxFlip.rst
bpy.types.ShaderFxGlow.rst
bpy.types.ShaderFxPixel.rst
bpy.types.ShaderFxRim.rst
bpy.types.ShaderFxShadow.rst
bpy.types.ShaderFxSwirl.rst
bpy.types.ShaderFxWave.rst
Effect affecting the Grease Pencil object

### attribute `bpy.types.ShaderFx.name`

Effect name (default "", never None)

:type: str

### attribute `bpy.types.ShaderFx.show_expanded`

Set effect expansion in the user interface (default False)

:type: bool

### attribute `bpy.types.ShaderFx.show_in_editmode`

Display effect in Edit mode (default False)

:type: bool

### attribute `bpy.types.ShaderFx.show_render`

Use effect during render (default False)

:type: bool

### attribute `bpy.types.ShaderFx.show_viewport`

Display effect in viewport (default False)

:type: bool

### data `bpy.types.ShaderFx.type`

(default ``'FX_BLUR'``, readonly)

:type: Literal[:ref:`rna_enum_object_shaderfx_type_items`]

### classmethod `bpy.types.ShaderFx.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ShaderFx.bl_rna_get_subclass_py`

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

- :class:`Object.shader_effects`
- :class:`ObjectShaderFx.new`
- :class:`ObjectShaderFx.remove`
