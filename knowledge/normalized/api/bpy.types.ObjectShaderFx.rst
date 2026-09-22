<!-- source: api/bpy.types.ObjectShaderFx.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.ObjectShaderFx`

Collection of object effects

### method `bpy.types.ObjectShaderFx.new`

Add a new shader fx

:param name: New name for the effect (never None)
:type name: str
:param type: Effect type to add
:type type: Literal[:ref:`rna_enum_object_shaderfx_type_items`]
:return: Newly created effect
:rtype: :class:`ShaderFx`

### method `bpy.types.ObjectShaderFx.remove`

Remove an existing effect from the object

:param shader_fx: Effect to remove (never None)
:type shader_fx: :class:`ShaderFx` | None

### method `bpy.types.ObjectShaderFx.clear`

Remove all effects from the object

### classmethod `bpy.types.ObjectShaderFx.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ObjectShaderFx.bl_rna_get_subclass_py`

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
