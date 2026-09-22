<!-- source: api/bpy.types.XrActionMapItems.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.XrActionMapItems`

Collection of XR action map items

### method `bpy.types.XrActionMapItems.new`

new

:param name: Name of the action map item, (never None)
:type name: str
:param replace_existing: Replace Existing, Replace any existing item with the same name
:type replace_existing: bool
:return: Item, Added action map item
:rtype: :class:`XrActionMapItem`

### method `bpy.types.XrActionMapItems.new_from_item`

new_from_item

:param item: Item, Item to use as a reference (never None)
:type item: :class:`XrActionMapItem` | None
:return: Item, Added action map item
:rtype: :class:`XrActionMapItem`

### method `bpy.types.XrActionMapItems.remove`

remove

:param item: Item, (never None)
:type item: :class:`XrActionMapItem` | None

### method `bpy.types.XrActionMapItems.find`

find

:param name: Name, (never None)
:type name: str
:return: Item, The action map item with the given name
:rtype: :class:`XrActionMapItem`

### classmethod `bpy.types.XrActionMapItems.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.XrActionMapItems.bl_rna_get_subclass_py`

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

- :class:`XrActionMap.actionmap_items`
