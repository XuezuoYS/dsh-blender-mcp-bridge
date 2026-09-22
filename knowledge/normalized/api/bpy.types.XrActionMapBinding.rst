<!-- source: api/bpy.types.XrActionMapBinding.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.XrActionMapBinding`

Binding in an XR action map item

### attribute `bpy.types.XrActionMapBinding.axis0_region`

Action execution region for the first input axis (default ``'ANY'``)

- ``ANY``
  Any -- Use any axis region for operator execution.
- ``POSITIVE``
  Positive -- Use positive axis region only for operator execution.
- ``NEGATIVE``
  Negative -- Use negative axis region only for operator execution.

:type: Literal['ANY', 'POSITIVE', 'NEGATIVE']

### attribute `bpy.types.XrActionMapBinding.axis1_region`

Action execution region for the second input axis (default ``'ANY'``)

- ``ANY``
  Any -- Use any axis region for operator execution.
- ``POSITIVE``
  Positive -- Use positive axis region only for operator execution.
- ``NEGATIVE``
  Negative -- Use negative axis region only for operator execution.

:type: Literal['ANY', 'POSITIVE', 'NEGATIVE']

### data `bpy.types.XrActionMapBinding.component_paths`

OpenXR component paths (default None, readonly)

:type: :class:`XrComponentPaths`\ [:class:`XrComponentPath`]

### attribute `bpy.types.XrActionMapBinding.name`

Name of the action map binding (default "", never None)

:type: str

### attribute `bpy.types.XrActionMapBinding.pose_location`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.XrActionMapBinding.pose_rotation`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Euler`

### attribute `bpy.types.XrActionMapBinding.profile`

OpenXR interaction profile path (default "", never None)

:type: str

### attribute `bpy.types.XrActionMapBinding.threshold`

Input threshold for button/axis actions (in [0, 1], default 0.0)

:type: float

### classmethod `bpy.types.XrActionMapBinding.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.XrActionMapBinding.bl_rna_get_subclass_py`

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

- :class:`XrActionMapBindings.find`
- :class:`XrActionMapBindings.new`
- :class:`XrActionMapBindings.new_from_binding`
- :class:`XrActionMapBindings.new_from_binding`
- :class:`XrActionMapBindings.remove`
- :class:`XrActionMapItem.bindings`
- :class:`XrSessionState.action_binding_create`
