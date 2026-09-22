<!-- source: api/bpy.types.MovieTrackingMarkers.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.MovieTrackingMarkers`

Collection of markers for movie tracking track

### method `bpy.types.MovieTrackingMarkers.find_frame`

Get marker for specified frame

:param frame: Frame, Frame number to find marker for (in [0, 1048574])
:type frame: int
:param exact: Exact, Get marker at exact frame number rather than get estimated marker (optional)
:type exact: bool
:return: Marker for specified frame
:rtype: :class:`MovieTrackingMarker`

### method `bpy.types.MovieTrackingMarkers.insert_frame`

Insert a new marker at the specified frame

:param frame: Frame, Frame number to insert marker to (in [0, 1048574])
:type frame: int
:param co: Coordinate, Place new marker at the given frame using specified in normalized space coordinates (array of 2 items, in [-1, 1], optional)
:type co: :class:`mathutils.Vector` | Sequence[float]
:return: Newly created marker
:rtype: :class:`MovieTrackingMarker`

### method `bpy.types.MovieTrackingMarkers.delete_frame`

Delete marker at specified frame

:param frame: Frame, Frame number to delete marker from (in [0, 1048574])
:type frame: int

### classmethod `bpy.types.MovieTrackingMarkers.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieTrackingMarkers.bl_rna_get_subclass_py`

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

- :class:`MovieTrackingTrack.markers`
