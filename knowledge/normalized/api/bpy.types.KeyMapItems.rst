<!-- source: api/bpy.types.KeyMapItems.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.KeyMapItems`

Collection of keymap items

### method `bpy.types.KeyMapItems.new`

new

:param idname: Operator Identifier, (never None)
:type idname: str
:param type: Type
:type type: Literal[:ref:`rna_enum_event_type_items`]
:param value: Value
:type value: Literal[:ref:`rna_enum_event_value_items`]
:param any: Any, (optional)
:type any: bool
:param shift: Shift, (in [-1, 1], optional)
:type shift: int
:param ctrl: Ctrl, (in [-1, 1], optional)
:type ctrl: int
:param alt: Alt, (in [-1, 1], optional)
:type alt: int
:param oskey: OS Key, (in [-1, 1], optional)
:type oskey: int
:param hyper: Hyper, (in [-1, 1], optional)
:type hyper: int
:param key_modifier: Key Modifier, (optional)
:type key_modifier: Literal[:ref:`rna_enum_event_type_items`]
:param direction: Direction, (optional)
:type direction: Literal[:ref:`rna_enum_event_direction_items`]
:param repeat: Repeat, When set, accept key-repeat events (optional)
:type repeat: bool
:param head: At Head, Force item to be added at start (not end) of key map so that it doesn't get blocked by an existing key map item (optional)
:type head: bool
:return: Item, Added key map item
:rtype: :class:`KeyMapItem`

### method `bpy.types.KeyMapItems.new_modal`

new_modal

:param propvalue: Property Value, (never None)
:type propvalue: str
:param type: Type
:type type: Literal[:ref:`rna_enum_event_type_items`]
:param value: Value
:type value: Literal[:ref:`rna_enum_event_value_items`]
:param any: Any, (optional)
:type any: bool
:param shift: Shift, (in [-1, 1], optional)
:type shift: int
:param ctrl: Ctrl, (in [-1, 1], optional)
:type ctrl: int
:param alt: Alt, (in [-1, 1], optional)
:type alt: int
:param oskey: OS Key, (in [-1, 1], optional)
:type oskey: int
:param hyper: Hyper, (in [-1, 1], optional)
:type hyper: int
:param key_modifier: Key Modifier, (optional)
:type key_modifier: Literal[:ref:`rna_enum_event_type_items`]
:param direction: Direction, (optional)
:type direction: Literal[:ref:`rna_enum_event_direction_items`]
:param repeat: Repeat, When set, accept key-repeat events (optional)
:type repeat: bool
:return: Item, Added key map item
:rtype: :class:`KeyMapItem`

### method `bpy.types.KeyMapItems.new_from_item`

new_from_item

:param item: Item, Item to use as a reference (never None)
:type item: :class:`KeyMapItem` | None
:param head: At Head, (optional)
:type head: bool
:return: Item, Added key map item
:rtype: :class:`KeyMapItem`

### method `bpy.types.KeyMapItems.remove`

remove

:param item: Item, (never None)
:type item: :class:`KeyMapItem` | None

### method `bpy.types.KeyMapItems.from_id`

from_id

:param id: id, ID of the item (in [-inf, inf])
:type id: int
:return: Item
:rtype: :class:`KeyMapItem`

### method `bpy.types.KeyMapItems.find_from_operator`

find_from_operator

:param idname: Operator Identifier, (never None)
:type idname: str
:param properties: (optional)
:type properties: :class:`OperatorProperties` | None
:param include: Include, (optional)
:type include: set[Literal[:ref:`rna_enum_event_type_mask_items`]]
:param exclude: Exclude, (optional)
:type exclude: set[Literal[:ref:`rna_enum_event_type_mask_items`]]
:rtype: :class:`KeyMapItem`

### method `bpy.types.KeyMapItems.find_match`

find_match

:param keymap: The matching keymap
:type keymap: :class:`KeyMap` | None
:param item: The matching keymap item
:type item: :class:`KeyMapItem` | None
:return: The keymap item from this keymap which matches the keymap item from the arguments passed in
:rtype: :class:`KeyMapItem`

### method `bpy.types.KeyMapItems.match_event`

match_event

:param event: Event to match against
:type event: :class:`Event` | None
:rtype: :class:`KeyMapItem`

### classmethod `bpy.types.KeyMapItems.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.KeyMapItems.bl_rna_get_subclass_py`

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

- :class:`KeyMap.keymap_items`
