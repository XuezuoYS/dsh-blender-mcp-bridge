<!-- source: api/bpy.types.XrEventData.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.XrEventData`

XR Data for Window Manager Event

### data `bpy.types.XrEventData.action`

XR action name (default "", readonly, never None)

:type: str

### data `bpy.types.XrEventData.action_set`

XR action set name (default "", readonly, never None)

:type: str

### data `bpy.types.XrEventData.bimanual`

Whether bimanual interaction is occurring (default False, readonly)

:type: bool

### data `bpy.types.XrEventData.controller_location`

Location of the action's corresponding controller aim in world space (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### data `bpy.types.XrEventData.controller_location_other`

Controller aim location of the other user path for bimanual actions (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### data `bpy.types.XrEventData.controller_rotation`

Rotation of the action's corresponding controller aim in world space (array of 4 items, in [-inf, inf], default (0.0, 0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Quaternion`

### data `bpy.types.XrEventData.controller_rotation_other`

Controller aim rotation of the other user path for bimanual actions (array of 4 items, in [-inf, inf], default (0.0, 0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Quaternion`

### data `bpy.types.XrEventData.float_threshold`

Input threshold for float/2D vector actions (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.XrEventData.state`

XR action values corresponding to type (array of 2 items, in [-inf, inf], default (0.0, 0.0), readonly)

:type: :class:`bpy_prop_array`\ [float]

### data `bpy.types.XrEventData.state_other`

State of the other user path for bimanual actions (array of 2 items, in [-inf, inf], default (0.0, 0.0), readonly)

:type: :class:`bpy_prop_array`\ [float]

### data `bpy.types.XrEventData.type`

XR action type (default ``'FLOAT'``, readonly)

- ``FLOAT``
  Float -- Float action, representing either a digital or analog button.
- ``VECTOR2D``
  Vector2D -- 2D float vector action, representing a thumbstick or trackpad.
- ``POSE``
  Pose -- 3D pose action, representing a controller's location and rotation.
- ``VIBRATION``
  Vibration -- Haptic vibration output action, to be applied with a duration, frequency, and amplitude.

:type: Literal['FLOAT', 'VECTOR2D', 'POSE', 'VIBRATION']

### data `bpy.types.XrEventData.user_path`

User path of the action. E.g. "/user/hand/left" (default "", readonly, never None)

:type: str

### data `bpy.types.XrEventData.user_path_other`

Other user path, for bimanual actions. E.g. "/user/hand/right" (default "", readonly, never None)

:type: str

### classmethod `bpy.types.XrEventData.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.XrEventData.bl_rna_get_subclass_py`

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

- :class:`Event.xr`
