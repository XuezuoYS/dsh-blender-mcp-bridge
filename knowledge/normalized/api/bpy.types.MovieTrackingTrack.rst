<!-- source: api/bpy.types.MovieTrackingTrack.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MovieTrackingTrack`

Match-moving track data for tracking

### attribute `bpy.types.MovieTrackingTrack.annotation`

Annotation data for this track

:type: :class:`Annotation` | None

### data `bpy.types.MovieTrackingTrack.average_error`

Average error of re-projection (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.MovieTrackingTrack.bundle`

Position of bundle reconstructed from this track (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MovieTrackingTrack.color`

Color of the track in the Movie Clip Editor and the 3D viewport after a solve (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.MovieTrackingTrack.correlation_min`

Minimal value of correlation between matched pattern and reference that is still treated as successful tracking (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingTrack.frames_limit`

Every tracking cycle, this number of frames are tracked (in [0, 32767], default 0)

:type: int

### data `bpy.types.MovieTrackingTrack.has_bundle`

True if track has a valid bundle (default False, readonly)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.hide`

Track is hidden (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.lock`

Track is locked and all changes to it are disabled (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.margin`

Distance from image boundary at which marker stops tracking (in [0, 300], default 0)

:type: int

### data `bpy.types.MovieTrackingTrack.markers`

Collection of markers in track (default None, readonly)

:type: :class:`MovieTrackingMarkers`\ [:class:`MovieTrackingMarker`]

### attribute `bpy.types.MovieTrackingTrack.motion_model`

Default motion model to use for tracking (default ``'Loc'``)

- ``Perspective``
  Perspective -- Search for markers that are perspectively deformed (homography) between frames.
- ``Affine``
  Affine -- Search for markers that are affine-deformed (t, r, k, and skew) between frames.
- ``LocRotScale``
  Location, Rotation & Scale -- Search for markers that are translated, rotated, and scaled between frames.
- ``LocScale``
  Location & Scale -- Search for markers that are translated and scaled between frames.
- ``LocRot``
  Location & Rotation -- Search for markers that are translated and rotated between frames.
- ``Loc``
  Location -- Search for markers that are translated between frames.

:type: Literal['Perspective', 'Affine', 'LocRotScale', 'LocScale', 'LocRot', 'Loc']

### attribute `bpy.types.MovieTrackingTrack.name`

Unique name of track (default "", never None)

:type: str

### attribute `bpy.types.MovieTrackingTrack.offset`

Offset of track from the parenting point (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MovieTrackingTrack.pattern_match`

Track pattern from given frame when tracking marker to next frame (default ``'KEYFRAME'``)

- ``KEYFRAME``
  Keyframe -- Track pattern from keyframe to next frame.
- ``PREV_FRAME``
  Previous frame -- Track pattern from current frame to next frame.

:type: Literal['KEYFRAME', 'PREV_FRAME']

### attribute `bpy.types.MovieTrackingTrack.select`

Track is selected (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.select_anchor`

Track's anchor point is selected (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.select_pattern`

Track's pattern area is selected (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.select_search`

Track's search area is selected (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_alpha_preview`

Apply track's mask on displaying preview (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_blue_channel`

Use blue channel from footage for tracking (default True)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_brute`

Use a brute-force translation only pre-track before refinement (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_custom_color`

Use custom color instead of theme-defined (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_grayscale_preview`

Display what the tracking algorithm sees in the preview (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_green_channel`

Use green channel from footage for tracking (default True)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_mask`

Use a Grease Pencil data-block as a mask to use only specified areas of pattern when tracking (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_normalization`

Normalize light intensities while tracking (slower) (default False)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.use_red_channel`

Use red channel from footage for tracking (default True)

:type: bool

### attribute `bpy.types.MovieTrackingTrack.weight`

Influence of this track on a final solution (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingTrack.weight_stab`

Influence of this track on 2D stabilization (in [0, 1], default 0.0)

:type: float

### classmethod `bpy.types.MovieTrackingTrack.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieTrackingTrack.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.selected_movieclip_tracks`
- :class:`MovieTracking.tracks`
- :class:`MovieTrackingObject.tracks`
- :class:`MovieTrackingObjectPlaneTracks.active`
- :class:`MovieTrackingObjectTracks.active`
- :class:`MovieTrackingObjectTracks.new`
- :class:`MovieTrackingStabilization.rotation_tracks`
- :class:`MovieTrackingStabilization.tracks`
- :class:`MovieTrackingTracks.active`
- :class:`MovieTrackingTracks.new`
- :class:`UILayout.template_marker`
