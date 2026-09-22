<!-- source: api/bpy.types.MovieTrackingCamera.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MovieTrackingCamera`

Match-moving camera data for tracking

### attribute `bpy.types.MovieTrackingCamera.brown_k1`

First coefficient of fourth order Brown-Conrady radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.brown_k2`

Second coefficient of fourth order Brown-Conrady radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.brown_k3`

Third coefficient of fourth order Brown-Conrady radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.brown_k4`

Fourth coefficient of fourth order Brown-Conrady radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.brown_p1`

First coefficient of second order Brown-Conrady tangential distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.brown_p2`

Second coefficient of second order Brown-Conrady tangential distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.distortion_model`

Distortion model used for camera lenses (default ``'POLYNOMIAL'``)

- ``POLYNOMIAL``
  Polynomial -- Radial distortion model which fits common cameras.
- ``DIVISION``
  Divisions -- Division distortion model which better represents wide-angle cameras.
- ``NUKE``
  Nuke -- Nuke distortion model.
- ``BROWN``
  Brown -- Brown-Conrady distortion model.

:type: Literal['POLYNOMIAL', 'DIVISION', 'NUKE', 'BROWN']

### attribute `bpy.types.MovieTrackingCamera.division_k1`

First coefficient of second order division distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.division_k2`

Second coefficient of second order division distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.focal_length`

Camera's focal length (in [0.0001, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.focal_length_pixels`

Camera's focal length (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.k1`

First coefficient of third order polynomial radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.k2`

Second coefficient of third order polynomial radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.k3`

Third coefficient of third order polynomial radial distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.nuke_k1`

First coefficient of second order Nuke distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.nuke_k2`

Second coefficient of second order Nuke distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.nuke_p1`

First coefficient of tangential Nuke distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.nuke_p2`

Second coefficient of tangential Nuke distortion (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.pixel_aspect`

Pixel aspect ratio (in [0.1, inf], default 1.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.principal_point`

Optical center of lens (array of 2 items, in [-1, 1], default (0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.MovieTrackingCamera.principal_point_pixels`

Optical center of lens in pixels (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.MovieTrackingCamera.sensor_width`

Width of CCD sensor in millimeters (in [0, 500], default 0.0)

:type: float

### attribute `bpy.types.MovieTrackingCamera.units`

Units used for camera focal length (default ``'PIXELS'``)

- ``PIXELS``
  px -- Use pixels for units of focal length.
- ``MILLIMETERS``
  mm -- Use millimeters for units of focal length.

:type: Literal['PIXELS', 'MILLIMETERS']

### classmethod `bpy.types.MovieTrackingCamera.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieTrackingCamera.bl_rna_get_subclass_py`

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

- :class:`MovieTracking.camera`
