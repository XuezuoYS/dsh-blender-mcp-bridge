<!-- source: api/bpy.types.XrActionMaps.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.XrActionMaps`

Collection of XR action maps

### classmethod `bpy.types.XrActionMaps.new`

new

:param xr_session_state: XR Session State, (never None)
:type xr_session_state: :class:`XrSessionState` | None
:param name: Name, (never None)
:type name: str
:param replace_existing: Replace Existing, Replace any existing actionmap with the same name
:type replace_existing: bool
:return: Action Map, Added action map
:rtype: :class:`XrActionMap`

### classmethod `bpy.types.XrActionMaps.new_from_actionmap`

new_from_actionmap

:param xr_session_state: XR Session State, (never None)
:type xr_session_state: :class:`XrSessionState` | None
:param actionmap: Action Map, Action map to use as a reference (never None)
:type actionmap: :class:`XrActionMap` | None
:return: Action Map, Added action map
:rtype: :class:`XrActionMap`

### classmethod `bpy.types.XrActionMaps.remove`

remove

:param xr_session_state: XR Session State, (never None)
:type xr_session_state: :class:`XrSessionState` | None
:param actionmap: Action Map, Removed action map (never None)
:type actionmap: :class:`XrActionMap` | None

### classmethod `bpy.types.XrActionMaps.find`

find

:param xr_session_state: XR Session State, (never None)
:type xr_session_state: :class:`XrSessionState` | None
:param name: Name, (never None)
:type name: str
:return: Action Map, The action map with the given name
:rtype: :class:`XrActionMap`

### classmethod `bpy.types.XrActionMaps.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.XrActionMaps.bl_rna_get_subclass_py`

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

- :class:`XrSessionState.actionmaps`
