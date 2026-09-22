<!-- source: api/bpy.types.DriverVariable.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.DriverVariable`

Variable from some source/target for driver relationship

### data `bpy.types.DriverVariable.is_name_valid`

Is this a valid name for a driver variable (default True, readonly)

:type: bool

### attribute `bpy.types.DriverVariable.name`

Name to use in scripted expressions/functions (no spaces or dots are allowed, and must start with a letter) (default "", never None)

:type: str

### data `bpy.types.DriverVariable.targets`

Sources of input data for evaluating this variable (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`DriverTarget`]

### attribute `bpy.types.DriverVariable.type`

Driver variable type (default ``'SINGLE_PROP'``)

- ``SINGLE_PROP``
  Single Property -- Use the value from some RNA property.
- ``TRANSFORMS``
  Transform Channel -- Final transformation value of object or bone.
- ``ROTATION_DIFF``
  Rotational Difference -- Use the angle between two bones.
- ``LOC_DIFF``
  Distance -- Distance between two bones or objects.
- ``CONTEXT_PROP``
  Context Property -- Use the value from some RNA property within the current evaluation context.

:type: Literal['SINGLE_PROP', 'TRANSFORMS', 'ROTATION_DIFF', 'LOC_DIFF', 'CONTEXT_PROP']

### classmethod `bpy.types.DriverVariable.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.DriverVariable.bl_rna_get_subclass_py`

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

- :class:`ChannelDriverVariables.new`
- :class:`ChannelDriverVariables.remove`
- :class:`Driver.variables`
