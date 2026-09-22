<!-- source: api/bpy.types.KeyingSet.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.KeyingSet`

Settings that should be keyframed together

### attribute `bpy.types.KeyingSet.bl_description`

A short description of the keying set (default "", never None)

:type: str

### attribute `bpy.types.KeyingSet.bl_idname`

If this is set, the Keying Set gets a custom ID, otherwise it takes the name of the class used to define the Keying Set (for example, if the class name is "BUILTIN_KSI_location", and bl_idname is not set by the script, then bl_idname = "BUILTIN_KSI_location") (default "", never None)

:type: str

### attribute `bpy.types.KeyingSet.bl_label`

(default "", never None)

:type: str

### data `bpy.types.KeyingSet.is_path_absolute`

Keying Set defines specific paths/settings to be keyframed (i.e. is not reliant on context info) (default False, readonly)

:type: bool

### data `bpy.types.KeyingSet.paths`

Keying Set Paths to define settings that get keyframed together (default None, readonly)

:type: :class:`KeyingSetPaths`\ [:class:`KeyingSetPath`]

### data `bpy.types.KeyingSet.type_info`

Callback function defines for built-in Keying Sets (readonly)

:type: :class:`KeyingSetInfo` | None

### attribute `bpy.types.KeyingSet.use_insertkey_needed`

Only insert keyframes where they're needed in the relevant F-Curves (default False)

:type: bool

### attribute `bpy.types.KeyingSet.use_insertkey_override_needed`

Override default setting to only insert keyframes where they're needed in the relevant F-Curves (default False)

:type: bool

### attribute `bpy.types.KeyingSet.use_insertkey_override_visual`

Override default setting to insert keyframes based on 'visual transforms' (default False)

:type: bool

### attribute `bpy.types.KeyingSet.use_insertkey_visual`

Insert keyframes based on 'visual transforms' (default False)

:type: bool

### method `bpy.types.KeyingSet.refresh`

Refresh Keying Set to ensure that it is valid for the current context (call before each use of one)

### classmethod `bpy.types.KeyingSet.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.KeyingSet.bl_rna_get_subclass_py`

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

- :class:`KeyingSetInfo.generate`
- :class:`KeyingSetInfo.iterator`
- :class:`KeyingSets.active`
- :class:`KeyingSets.new`
- :class:`KeyingSetsAll.active`
- :class:`Scene.keying_sets`
- :class:`Scene.keying_sets_all`
