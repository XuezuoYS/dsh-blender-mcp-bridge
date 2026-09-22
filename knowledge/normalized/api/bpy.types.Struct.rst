<!-- source: api/bpy.types.Struct.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Struct`

RNA structure definition

### data `bpy.types.Struct.base`

Struct definition this is derived from (readonly)

:type: :class:`Struct` | None

### data `bpy.types.Struct.description`

Description of the Struct's purpose (default "", readonly, never None)

:type: str

### data `bpy.types.Struct.functions`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Function`]

### data `bpy.types.Struct.identifier`

Unique name used in the code and scripting (default "", readonly, never None)

:type: str

### data `bpy.types.Struct.name`

Human readable name (default "", readonly, never None)

:type: str

### data `bpy.types.Struct.name_property`

Property that gives the name of the struct (readonly)

:type: :class:`StringProperty` | None

### data `bpy.types.Struct.nested`

Struct in which this struct is always nested, and to which it logically belongs (readonly)

:type: :class:`Struct` | None

### data `bpy.types.Struct.properties`

Properties in the struct (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Property`]

### data `bpy.types.Struct.property_tags`

Tags that properties can use to influence behavior (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`EnumPropertyItem`]

### data `bpy.types.Struct.translation_context`

Translation context of the struct's name (default "", readonly, never None)

:type: str

### classmethod `bpy.types.Struct.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Struct.bl_rna_get_subclass_py`

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

- :class:`BlenderRNA.structs`
- :class:`CollectionProperty.fixed_type`
- :class:`PointerProperty.fixed_type`
- :class:`Property.srna`
- :class:`Struct.base`
- :class:`Struct.nested`
