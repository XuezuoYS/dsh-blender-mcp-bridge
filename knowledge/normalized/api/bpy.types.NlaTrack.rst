<!-- source: api/bpy.types.NlaTrack.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.NlaTrack`

An animation layer containing Actions referenced as NLA strips

### data `bpy.types.NlaTrack.active`

NLA Track is active (default False, readonly)

:type: bool

### data `bpy.types.NlaTrack.is_override_data`

In a local override data, whether this NLA track comes from the linked reference data, or is local to the override (default True, readonly)

:type: bool

### attribute `bpy.types.NlaTrack.is_solo`

NLA Track is evaluated itself (i.e. active Action and all other NLA Tracks in the same AnimData block are disabled) (default False)

:type: bool

### attribute `bpy.types.NlaTrack.lock`

NLA Track is locked (default False)

:type: bool

### attribute `bpy.types.NlaTrack.mute`

Disable NLA Track evaluation (default False)

:type: bool

### attribute `bpy.types.NlaTrack.name`

(default "", never None)

:type: str

### attribute `bpy.types.NlaTrack.select`

NLA Track is selected (default False)

:type: bool

### data `bpy.types.NlaTrack.strips`

NLA Strips on this NLA-track (default None, readonly)

:type: :class:`NlaStrips`\ [:class:`NlaStrip`]

### classmethod `bpy.types.NlaTrack.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.NlaTrack.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.active_nla_track`
- :class:`AnimData.nla_tracks`
- :class:`NlaTracks.active`
- :class:`NlaTracks.new`
- :class:`NlaTracks.new`
- :class:`NlaTracks.remove`
