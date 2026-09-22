<!-- source: api/bpy.types.KeyConfigurations.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.KeyConfigurations`

Collection of KeyConfigs

### attribute `bpy.types.KeyConfigurations.active`

Active key configuration (preset)

:type: :class:`KeyConfig` | None

### data `bpy.types.KeyConfigurations.addon`

Key configuration that can be extended by add-ons, and is added to the active configuration when handling events (readonly)

:type: :class:`KeyConfig` | None

### data `bpy.types.KeyConfigurations.default`

Default builtin key configuration (readonly)

:type: :class:`KeyConfig` | None

### data `bpy.types.KeyConfigurations.user`

Final key configuration that combines keymaps from the active and add-on configurations, and can be edited by the user (readonly)

:type: :class:`KeyConfig` | None

### method `bpy.types.KeyConfigurations.new`

new

:param name: Name, (never None)
:type name: str
:return: Key Configuration, Added key configuration
:rtype: :class:`KeyConfig`

### method `bpy.types.KeyConfigurations.remove`

remove

:param keyconfig: Key Configuration, Removed key configuration (never None)
:type keyconfig: :class:`KeyConfig` | None

### method `bpy.types.KeyConfigurations.find_item_from_operator`

find_item_from_operator

:param idname: Operator Identifier, (never None)
:type idname: str
:param context: context, (optional)
:type context: Literal[:ref:`rna_enum_operator_context_items`]
:param properties: (optional)
:type properties: :class:`OperatorProperties` | None
:param include: Include, (optional)
:type include: set[Literal[:ref:`rna_enum_event_type_mask_items`]]
:param exclude: Exclude, (optional)
:type exclude: set[Literal[:ref:`rna_enum_event_type_mask_items`]]
:return:
   ``keymap``, :class:`KeyMap`

   ``item``, :class:`KeyMapItem`

:rtype: tuple[:class:`KeyMap`, :class:`KeyMapItem`]

### method `bpy.types.KeyConfigurations.update`

update

:param keep_properties: Keep Properties, Operator properties are kept to allow the operators to be registered again in the future (optional)
:type keep_properties: bool

### classmethod `bpy.types.KeyConfigurations.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.KeyConfigurations.bl_rna_get_subclass_py`

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

- :class:`WindowManager.keyconfigs`
