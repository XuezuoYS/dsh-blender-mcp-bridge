<!-- source: api/bpy.types.MovieTracking.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MovieTracking`

Match-moving data for tracking

### attribute `bpy.types.MovieTracking.active_object_index`

Index of active object (in [-inf, inf], default 0)

:type: int

### data `bpy.types.MovieTracking.camera`

(readonly)

:type: :class:`MovieTrackingCamera` | None

### data `bpy.types.MovieTracking.dopesheet`

(readonly)

:type: :class:`MovieTrackingDopesheet` | None

### data `bpy.types.MovieTracking.objects`

Collection of objects in this tracking data object (default None, readonly)

:type: :class:`MovieTrackingObjects`\ [:class:`MovieTrackingObject`]

### data `bpy.types.MovieTracking.plane_tracks`

Collection of plane tracks in this tracking data object. Deprecated, use objects[name].plane_tracks (default None, readonly)

:type: :class:`MovieTrackingPlaneTracks`\ [:class:`MovieTrackingPlaneTrack`]

### data `bpy.types.MovieTracking.reconstruction`

(readonly)

:type: :class:`MovieTrackingReconstruction` | None

### data `bpy.types.MovieTracking.settings`

(readonly)

:type: :class:`MovieTrackingSettings` | None

### data `bpy.types.MovieTracking.stabilization`

(readonly)

:type: :class:`MovieTrackingStabilization` | None

### data `bpy.types.MovieTracking.tracks`

Collection of tracks in this tracking data object. Deprecated, use objects[name].tracks (default None, readonly)

:type: :class:`MovieTrackingTracks`\ [:class:`MovieTrackingTrack`]

### classmethod `bpy.types.MovieTracking.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieTracking.bl_rna_get_subclass_py`

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

- :class:`MovieClip.tracking`
