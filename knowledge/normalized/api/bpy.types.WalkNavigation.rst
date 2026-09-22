<!-- source: api/bpy.types.WalkNavigation.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.WalkNavigation`

Walk navigation settings

### attribute `bpy.types.WalkNavigation.jump_height`

Maximum height of a jump (in [0.1, 100], default 0.4)

:type: float

### attribute `bpy.types.WalkNavigation.mouse_speed`

Speed factor for when looking around, high values mean faster mouse movement (in [0.01, 10], default 1.0)

:type: float

### attribute `bpy.types.WalkNavigation.teleport_time`

Interval of time warp when teleporting in navigation mode (in [0, 10], default 0.2)

:type: float

### attribute `bpy.types.WalkNavigation.use_gravity`

Walk with gravity, or free navigate (default False)

:type: bool

### attribute `bpy.types.WalkNavigation.use_mouse_reverse`

Reverse the vertical movement of the mouse (default False)

:type: bool

### attribute `bpy.types.WalkNavigation.view_height`

View distance from the floor when walking (in [0, 1000], default 1.6)

:type: float

### attribute `bpy.types.WalkNavigation.walk_speed`

Base speed for walking and flying (in [0.01, 100], default 2.5)

:type: float

### attribute `bpy.types.WalkNavigation.walk_speed_factor`

Multiplication factor when using the fast or slow modifiers (in [0.01, 10], default 5.0)

:type: float

### classmethod `bpy.types.WalkNavigation.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.WalkNavigation.bl_rna_get_subclass_py`

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

- :class:`PreferencesInput.walk_navigation`
