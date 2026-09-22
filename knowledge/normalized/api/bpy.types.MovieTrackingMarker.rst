<!-- source: api/bpy.types.MovieTrackingMarker.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MovieTrackingMarker`

Match-moving marker data for tracking

### attribute `bpy.types.MovieTrackingMarker.co`

Marker position at frame in normalized coordinates (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MovieTrackingMarker.frame`

Frame number marker is keyframed on (in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.MovieTrackingMarker.is_keyed`

Whether the position of the marker is keyframed or tracked (default True)

:type: bool

### attribute `bpy.types.MovieTrackingMarker.mute`

Is marker muted for current frame (default False)

:type: bool

### data `bpy.types.MovieTrackingMarker.pattern_bound_box`

Pattern area bounding box in normalized coordinates (multi-dimensional array of 2 * 2 items, in [-inf, inf], default ((0.0, 0.0), (0.0, 0.0)), readonly)

:type: :class:`bpy_prop_array`\ [:class:`bpy_prop_array`\ [float]]

### attribute `bpy.types.MovieTrackingMarker.pattern_corners`

Array of coordinates which represents pattern's corners in normalized coordinates relative to marker position (multi-dimensional array of 4 * 2 items, in [-inf, inf], default ((0.0, 0.0), (0.0, 0.0), (0.0, 0.0), (0.0, 0.0)))

:type: :class:`bpy_prop_array`\ [:class:`bpy_prop_array`\ [float]]

### attribute `bpy.types.MovieTrackingMarker.search_max`

Right-bottom corner of search area in normalized coordinates relative to marker position (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MovieTrackingMarker.search_min`

Left-bottom corner of search area in normalized coordinates relative to marker position (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### classmethod `bpy.types.MovieTrackingMarker.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieTrackingMarker.bl_rna_get_subclass_py`

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

- :class:`MovieTrackingMarkers.find_frame`
- :class:`MovieTrackingMarkers.insert_frame`
- :class:`MovieTrackingTrack.markers`
