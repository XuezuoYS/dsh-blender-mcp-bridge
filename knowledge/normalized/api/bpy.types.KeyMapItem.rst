<!-- source: api/bpy.types.KeyMapItem.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.KeyMapItem`

Item in a Key Map

### attribute `bpy.types.KeyMapItem.active`

Activate or deactivate item (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.alt`

Alt key pressed, -1 for any state (in [-1, 1], default 0)

:type: int

### attribute `bpy.types.KeyMapItem.alt_ui`

Alt key pressed (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.any`

Any modifier keys pressed (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.ctrl`

Control key pressed, -1 for any state (in [-1, 1], default 0)

:type: int

### attribute `bpy.types.KeyMapItem.ctrl_ui`

Control key pressed (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.direction`

The direction (only applies to drag events) (default ``'ANY'``)

:type: Literal[:ref:`rna_enum_event_direction_items`]

### attribute `bpy.types.KeyMapItem.hyper`

Hyper key pressed, -1 for any state (in [-1, 1], default 0)

:type: int

### attribute `bpy.types.KeyMapItem.hyper_ui`

Hyper key pressed. An additional modifier which can be configured on Linux, typically replacing CapsLock (default False)

:type: bool

### data `bpy.types.KeyMapItem.id`

ID of the item (in [-32768, 32767], default 0, readonly)

:type: int

### attribute `bpy.types.KeyMapItem.idname`

Identifier of operator to call on input event (default "", never None)

:type: str

### data `bpy.types.KeyMapItem.is_user_defined`

Is this keymap item user defined (does not just replace a builtin item) (default False, readonly)

:type: bool

### data `bpy.types.KeyMapItem.is_user_modified`

Is this keymap item modified by the user (default False, readonly)

:type: bool

### attribute `bpy.types.KeyMapItem.key_modifier`

Regular key pressed as a modifier (default ``'NONE'``)

:type: Literal[:ref:`rna_enum_event_type_items`]

### attribute `bpy.types.KeyMapItem.map_type`

Type of event mapping (default ``'KEYBOARD'``)

:type: Literal['KEYBOARD', 'MOUSE', 'NDOF', 'TEXTINPUT', 'TIMER']

### data `bpy.types.KeyMapItem.name`

Name of operator (translated) to call on input event (default "", readonly, never None)

:type: str

### attribute `bpy.types.KeyMapItem.oskey`

Operating system key pressed, -1 for any state (in [-1, 1], default 0)

:type: int

### attribute `bpy.types.KeyMapItem.oskey_ui`

Operating system key pressed (default False)

:type: bool

### data `bpy.types.KeyMapItem.properties`

Properties to set when the operator is called (readonly)

:type: :class:`OperatorProperties` | None

### attribute `bpy.types.KeyMapItem.propvalue`

The value this event translates to in a modal keymap (default ``'NONE'``)

:type: Literal[:ref:`rna_enum_keymap_propvalue_items`]

### attribute `bpy.types.KeyMapItem.repeat`

Active on key-repeat events (when a key is held) (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.shift`

Shift key pressed, -1 for any state (in [-1, 1], default 0)

:type: int

### attribute `bpy.types.KeyMapItem.shift_ui`

Shift key pressed (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.show_expanded`

Show key map event and property details in the user interface (default False)

:type: bool

### attribute `bpy.types.KeyMapItem.type`

Type of event (default ``'NONE'``)

:type: Literal[:ref:`rna_enum_event_type_items`]

### attribute `bpy.types.KeyMapItem.value`

(default ``'NOTHING'``)

:type: Literal[:ref:`rna_enum_event_value_items`]

### method `bpy.types.KeyMapItem.compare`

compare

:param item: Item
:type item: :class:`KeyMapItem` | None
:return: Comparison result
:rtype: bool

### method `bpy.types.KeyMapItem.to_string`

to_string

:param compact: Compact, (optional)
:type compact: bool
:return: result, (never None)
:rtype: str

### classmethod `bpy.types.KeyMapItem.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.KeyMapItem.bl_rna_get_subclass_py`

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

- :class:`KeyConfigurations.find_item_from_operator`
- :class:`KeyMap.keymap_items`
- :class:`KeyMap.restore_item_to_default`
- :class:`KeyMapItem.compare`
- :class:`KeyMapItems.find_from_operator`
- :class:`KeyMapItems.find_match`
- :class:`KeyMapItems.find_match`
- :class:`KeyMapItems.from_id`
- :class:`KeyMapItems.match_event`
- :class:`KeyMapItems.new`
- :class:`KeyMapItems.new_from_item`
- :class:`KeyMapItems.new_from_item`
- :class:`KeyMapItems.new_modal`
- :class:`KeyMapItems.remove`
- :class:`UILayout.template_event_from_keymap_item`
- :class:`UILayout.template_keymap_item_properties`
