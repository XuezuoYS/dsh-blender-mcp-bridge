<!-- source: api/bpy.types.XrSessionState.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.XrSessionState`

Runtime state information about the VR session

### data `bpy.types.XrSessionState.actionmaps`

(default None, readonly)

:type: :class:`XrActionMaps`\ [:class:`XrActionMap`]

### attribute `bpy.types.XrSessionState.active_actionmap`

(in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.XrSessionState.navigation_location`

Location offset to apply to base pose when determining viewer location (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.XrSessionState.navigation_rotation`

Rotation offset to apply to base pose when determining viewer rotation (array of 4 items, in [-inf, inf], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`mathutils.Quaternion`

### attribute `bpy.types.XrSessionState.navigation_scale`

Navigation scale multiplier applied when determining viewer scale (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.XrSessionState.selected_actionmap`

(in [-inf, inf], default 0)

:type: int

### data `bpy.types.XrSessionState.viewer_pose_location`

Last known location of the viewer pose (center between the eyes) in world space (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Vector`

### data `bpy.types.XrSessionState.viewer_pose_rotation`

Last known rotation of the viewer pose (center between the eyes) in world space (array of 4 items, in [-inf, inf], default (0.0, 0.0, 0.0, 0.0), readonly)

:type: :class:`mathutils.Quaternion`

### data `bpy.types.XrSessionState.viewer_scale`

Viewer XR scale factor, computed from the navigation scale, view scale session setting, and active scene unit scale (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.XrSessionState.viewfinder`

Viewfinder State (readonly)

:type: :class:`XrViewfinderState` | None

### classmethod `bpy.types.XrSessionState.is_running`

Query if the VR session is currently running

:param context: (never None)
:type context: :class:`Context` | None
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.reset_to_base_pose`

Force resetting of position and rotation deltas

:param context: (never None)
:type context: :class:`Context` | None

### classmethod `bpy.types.XrSessionState.action_set_create`

Create a VR action set

:param context: (never None)
:type context: :class:`Context` | None
:param actionmap: (never None)
:type actionmap: :class:`XrActionMap` | None
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.action_create`

Create a VR action

:param context: (never None)
:type context: :class:`Context` | None
:param actionmap: (never None)
:type actionmap: :class:`XrActionMap` | None
:param actionmap_item: (never None)
:type actionmap_item: :class:`XrActionMapItem` | None
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.action_binding_create`

Create a VR action binding

:param context: (never None)
:type context: :class:`Context` | None
:param actionmap: (never None)
:type actionmap: :class:`XrActionMap` | None
:param actionmap_item: (never None)
:type actionmap_item: :class:`XrActionMapItem` | None
:param actionmap_binding: (never None)
:type actionmap_binding: :class:`XrActionMapBinding` | None
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.active_action_set_set`

Set the active VR action set

:param context: (never None)
:type context: :class:`Context` | None
:param action_set: Action Set, Action set name (never None)
:type action_set: str
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.controller_pose_actions_set`

Set the actions that determine the VR controller poses

:param context: (never None)
:type context: :class:`Context` | None
:param action_set: Action Set, Action set name (never None)
:type action_set: str
:param grip_action: Grip Action, Name of the action representing the controller grips (never None)
:type grip_action: str
:param aim_action: Aim Action, Name of the action representing the controller aims (never None)
:type aim_action: str
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.action_state_get`

Get the current state of a VR action

:param context: (never None)
:type context: :class:`Context` | None
:param action_set_name: Action Set, Action set name (never None)
:type action_set_name: str
:param action_name: Action, Action name (never None)
:type action_name: str
:param user_path: User Path, OpenXR user path (never None)
:type user_path: str
:return: Action State, Current state of the VR action. Second float value is only set for 2D vector type actions. (array of 2 items, in [-inf, inf], never None)
:rtype: :class:`bpy_prop_array`\ [float]

### classmethod `bpy.types.XrSessionState.haptic_action_apply`

Apply a VR haptic action

:param context: (never None)
:type context: :class:`Context` | None
:param action_set_name: Action Set, Action set name (never None)
:type action_set_name: str
:param action_name: Action, Action name (never None)
:type action_name: str
:param user_path: User Path, Optional OpenXR user path. If not set, the action will be applied to all paths. (never None)
:type user_path: str
:param duration: Duration, Haptic duration in seconds. 0.0 is the minimum supported duration. (in [0, inf])
:type duration: float
:param frequency: Frequency, Frequency of the haptic vibration in hertz. 0.0 specifies the OpenXR runtime's default frequency. (in [0, inf])
:type frequency: float
:param amplitude: Amplitude, Haptic amplitude, ranging from 0.0 to 1.0 (in [0, 1])
:type amplitude: float
:return: Result
:rtype: bool

### classmethod `bpy.types.XrSessionState.haptic_action_stop`

Stop a VR haptic action

:param context: (never None)
:type context: :class:`Context` | None
:param action_set_name: Action Set, Action set name (never None)
:type action_set_name: str
:param action_name: Action, Action name (never None)
:type action_name: str
:param user_path: User Path, Optional OpenXR user path. If not set, the action will be stopped for all paths. (never None)
:type user_path: str

### classmethod `bpy.types.XrSessionState.controller_grip_location_get`

Get the last known controller grip location in world space

:param context: (never None)
:type context: :class:`Context` | None
:param index: Index, Controller index (in [0, 255])
:type index: int
:return: Location, Controller grip location (array of 3 items, in [-inf, inf], never None)
:rtype: :class:`mathutils.Vector`

### classmethod `bpy.types.XrSessionState.controller_grip_rotation_get`

Get the last known controller grip rotation (quaternion) in world space

:param context: (never None)
:type context: :class:`Context` | None
:param index: Index, Controller index (in [0, 255])
:type index: int
:return: Rotation, Controller grip quaternion rotation (array of 4 items, in [-inf, inf], never None)
:rtype: :class:`mathutils.Quaternion`

### classmethod `bpy.types.XrSessionState.controller_aim_location_get`

Get the last known controller aim location in world space

:param context: (never None)
:type context: :class:`Context` | None
:param index: Index, Controller index (in [0, 255])
:type index: int
:return: Location, Controller aim location (array of 3 items, in [-inf, inf], never None)
:rtype: :class:`mathutils.Vector`

### classmethod `bpy.types.XrSessionState.controller_aim_rotation_get`

Get the last known controller aim rotation (quaternion) in world space

:param context: (never None)
:type context: :class:`Context` | None
:param index: Index, Controller index (in [0, 255])
:type index: int
:return: Rotation, Controller aim quaternion rotation (array of 4 items, in [-inf, inf], never None)
:rtype: :class:`mathutils.Quaternion`

### classmethod `bpy.types.XrSessionState.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.XrSessionState.bl_rna_get_subclass_py`

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

- :class:`WindowManager.xr_session_state`
- :class:`XrActionMaps.find`
- :class:`XrActionMaps.new`
- :class:`XrActionMaps.new_from_actionmap`
- :class:`XrActionMaps.remove`
