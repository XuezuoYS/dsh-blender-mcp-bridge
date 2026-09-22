<!-- source: api/bpy.types.EnumPropertyItem.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.EnumPropertyItem`

Definition of a choice in an RNA enum property

### data `bpy.types.EnumPropertyItem.description`

Description of the item's purpose (default "", readonly, never None)

:type: str

### data `bpy.types.EnumPropertyItem.icon`

Icon of the item (default ``'NONE'``, readonly)

:type: Literal[:ref:`rna_enum_icon_items`]

### data `bpy.types.EnumPropertyItem.identifier`

Unique name used in the code and scripting (default "", readonly, never None)

:type: str

### data `bpy.types.EnumPropertyItem.name`

Human readable name (default "", readonly, never None)

:type: str

### data `bpy.types.EnumPropertyItem.value`

Value of the item (in [0, inf], default 0, readonly)

:type: int

### classmethod `bpy.types.EnumPropertyItem.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.EnumPropertyItem.bl_rna_get_subclass_py`

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

- :class:`EnumProperty.enum_items`
- :class:`EnumProperty.enum_items_static`
- :class:`EnumProperty.enum_items_static_ui`
- :class:`KeyMap.modal_event_values`
- :class:`Struct.property_tags`
