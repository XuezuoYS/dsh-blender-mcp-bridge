<!-- source: api/bpy.types.Driver.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Driver`

Driver for the value of a setting based on an external value

### attribute `bpy.types.Driver.expression`

Expression to use for Scripted Expression (default "", never None)

:type: str

### data `bpy.types.Driver.is_simple_expression`

The scripted expression can be evaluated without using the full Python interpreter (default False, readonly)

:type: bool

### attribute `bpy.types.Driver.is_valid`

Driver could not be evaluated in past, so should be skipped (default True)

:type: bool

### attribute `bpy.types.Driver.type`

Driver type (default ``'AVERAGE'``)

:type: Literal['AVERAGE', 'SUM', 'SCRIPTED', 'MIN', 'MAX']

### attribute `bpy.types.Driver.use_self`

Include a 'self' variable in the name-space, so drivers can easily reference the data being modified (object, bone, etc...) (default False)

:type: bool

### data `bpy.types.Driver.variables`

Properties acting as inputs for this driver (default None, readonly)

:type: :class:`ChannelDriverVariables`\ [:class:`DriverVariable`]

### classmethod `bpy.types.Driver.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Driver.bl_rna_get_subclass_py`

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

- :class:`FCurve.driver`
