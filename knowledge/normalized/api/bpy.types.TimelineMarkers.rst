<!-- source: api/bpy.types.TimelineMarkers.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.TimelineMarkers`

Collection of timeline markers

### method `bpy.types.TimelineMarkers.new`

Add a timeline marker

:param name: New name for the marker (not unique) (never None)
:type name: str
:param frame: The frame for the new marker (in [-1048574, 1048574], optional)
:type frame: int
:return: Newly created timeline marker
:rtype: :class:`TimelineMarker`

### method `bpy.types.TimelineMarkers.remove`

Remove a timeline marker

:param marker: Timeline marker to remove (never None)
:type marker: :class:`TimelineMarker` | None

### method `bpy.types.TimelineMarkers.clear`

Remove all timeline markers

### classmethod `bpy.types.TimelineMarkers.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.TimelineMarkers.bl_rna_get_subclass_py`

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

- :class:`Scene.timeline_markers`
