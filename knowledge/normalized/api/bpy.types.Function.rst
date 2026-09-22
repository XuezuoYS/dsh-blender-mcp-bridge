<!-- source: api/bpy.types.Function.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Function`

RNA function definition

### data `bpy.types.Function.description`

Description of the Function's purpose (default "", readonly, never None)

:type: str

### data `bpy.types.Function.identifier`

Unique name used in the code and scripting (default "", readonly, never None)

:type: str

### data `bpy.types.Function.is_registered`

Function is registered as callback as part of type registration (default False, readonly)

:type: bool

### data `bpy.types.Function.is_registered_optional`

Function is optionally registered as callback part of type registration (default False, readonly)

:type: bool

### data `bpy.types.Function.parameters`

Parameters for the function (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Property`]

### data `bpy.types.Function.use_self`

Function does not pass itself as an argument (becomes a static method in Python) (default False, readonly)

:type: bool

### data `bpy.types.Function.use_self_type`

Function passes itself type as an argument (becomes a class method in Python if use_self is false) (default False, readonly)

:type: bool

### classmethod `bpy.types.Function.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Function.bl_rna_get_subclass_py`

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

- :class:`Struct.functions`
