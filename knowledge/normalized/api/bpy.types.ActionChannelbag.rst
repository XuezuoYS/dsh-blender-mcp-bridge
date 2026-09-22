<!-- source: api/bpy.types.ActionChannelbag.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ActionChannelbag`

Collection of animation channels, typically associated with an action slot

### data `bpy.types.ActionChannelbag.fcurves`

The individual F-Curves that animate the slot (default None, readonly)

:type: :class:`ActionChannelbagFCurves`\ [:class:`FCurve`]

### data `bpy.types.ActionChannelbag.groups`

Groupings of F-Curves for display purposes, in e.g. the dopesheet and graph editor (default None, readonly)

:type: :class:`ActionChannelbagGroups`\ [:class:`ActionGroup`]

### data `bpy.types.ActionChannelbag.slot`

The Slot that the Channelbag's animation data is for (readonly)

:type: :class:`ActionSlot` | None

### data `bpy.types.ActionChannelbag.slot_handle`

(in [-inf, inf], default 0, readonly)

:type: int

### classmethod `bpy.types.ActionChannelbag.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ActionChannelbag.bl_rna_get_subclass_py`

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

- :class:`ActionChannelbags.new`
- :class:`ActionChannelbags.remove`
- :class:`ActionKeyframeStrip.channelbag`
- :class:`ActionKeyframeStrip.channelbags`
