<!-- source: api/bpy.types.OperatorStrokeElement.rst -->

base classes --- :class:`bpy_struct`, :class:`PropertyGroup`

### attribute `bpy.types.OperatorStrokeElement.is_start`

(default False)

:type: bool

### attribute `bpy.types.OperatorStrokeElement.location`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.OperatorStrokeElement.mouse`

(array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.OperatorStrokeElement.mouse_event`

(array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.OperatorStrokeElement.pressure`

Tablet pressure (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.OperatorStrokeElement.size`

Brush size in screen space (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.OperatorStrokeElement.time`

(in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.OperatorStrokeElement.x_tilt`

Pen tilt from left (-1.0) to right (+1.0) (in [-1, 1], default 0.0)

:type: float

### attribute `bpy.types.OperatorStrokeElement.y_tilt`

Pen tilt from backward (-1.0) to forward (+1.0) (in [-1, 1], default 0.0)

:type: float

### classmethod `bpy.types.OperatorStrokeElement.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.OperatorStrokeElement.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`PropertyGroup.name`

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
- :class:`PropertyGroup.bl_system_properties_get`
- :class:`PropertyGroup.bl_rna_get_subclass`
- :class:`PropertyGroup.bl_rna_get_subclass_py`
