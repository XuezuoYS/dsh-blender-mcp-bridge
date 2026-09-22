<!-- source: api/bpy.types.KeyingSetInfo.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.KeyingSetInfo`

Callback function defines for builtin Keying Sets

### attribute `bpy.types.KeyingSetInfo.bl_description`

A short description of the keying set (default "", never None)

:type: str

### attribute `bpy.types.KeyingSetInfo.bl_idname`

If this is set, the Keying Set gets a custom ID, otherwise it takes the name of the class used to define the Keying Set (for example, if the class name is "BUILTIN_KSI_location", and bl_idname is not set by the script, then bl_idname = "BUILTIN_KSI_location") (default "", never None)

:type: str

### attribute `bpy.types.KeyingSetInfo.bl_label`

(default "", never None)

:type: str

### attribute `bpy.types.KeyingSetInfo.bl_options`

Keying Set options to use when inserting keyframes (default set())

:type: set[Literal[:ref:`rna_enum_keying_flag_items`]]

### method `bpy.types.KeyingSetInfo.poll`

Test if Keying Set can be used or not

:param context: The context
:type context: :class:`Context` | None
:rtype: bool

### method `bpy.types.KeyingSetInfo.iterator`

Call generate() on the structs which have properties to be keyframed

:param context: The context
:type context: :class:`Context` | None
:param ks: Keying set this iterator runs on
:type ks: :class:`KeyingSet` | None

### method `bpy.types.KeyingSetInfo.generate`

Add Paths to the Keying Set to keyframe the properties of the given data

:param context: The context
:type context: :class:`Context` | None
:param ks: Keying set to add paths to
:type ks: :class:`KeyingSet` | None
:param data: Data to add paths from (never None)
:type data: :class:`AnyType` | None

### classmethod `bpy.types.KeyingSetInfo.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.KeyingSetInfo.bl_rna_get_subclass_py`

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

- :class:`KeyingSet.type_info`
