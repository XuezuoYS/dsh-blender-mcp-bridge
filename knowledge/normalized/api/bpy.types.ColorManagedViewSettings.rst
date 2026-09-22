<!-- source: api/bpy.types.ColorManagedViewSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ColorManagedViewSettings`

Color management settings used for displaying images on the display

### data `bpy.types.ColorManagedViewSettings.curve_mapping`

Color curve mapping applied before display transform (readonly)

:type: :class:`CurveMapping` | None

### attribute `bpy.types.ColorManagedViewSettings.exposure`

Exposure (stops) applied before display transform, multiplying by 2^exposure (in [-32, 32], default 0.0)

:type: float

### attribute `bpy.types.ColorManagedViewSettings.gamma`

Additional gamma encoding after display transform, for output with custom gamma (in [0, 5], default 1.0)

:type: float

### data `bpy.types.ColorManagedViewSettings.is_hdr`

The display and view transform supports high dynamic range colors (default False, readonly)

:type: bool

### attribute `bpy.types.ColorManagedViewSettings.look`

Additional transform applied before view transform for artistic needs (default ``'NONE'``)

- ``NONE``
  None -- Do not modify image in an artistic manner.

:type: Literal['NONE']

### data `bpy.types.ColorManagedViewSettings.support_emulation`

The display and view transform supports automatic emulation for another display device, using the display color spaces mechanism in OpenColorIO v2 configurations (default False, readonly)

:type: bool

### attribute `bpy.types.ColorManagedViewSettings.use_curve_mapping`

Use RGB curved for pre-display transformation (default False)

:type: bool

### attribute `bpy.types.ColorManagedViewSettings.use_white_balance`

Perform chromatic adaption from a different white point (default False)

:type: bool

### attribute `bpy.types.ColorManagedViewSettings.view_transform`

View used when converting image to a display space (default ``'NONE'``)

- ``NONE``
  None -- Do not perform any color transform on display, use old non-color managed technique for display.

:type: Literal['NONE']

### attribute `bpy.types.ColorManagedViewSettings.white_balance_temperature`

Color temperature of the scene's white point (in [1800, 100000], default 6500.0)

:type: float

### attribute `bpy.types.ColorManagedViewSettings.white_balance_tint`

Color tint of the scene's white point (the default of 10 matches daylight) (in [-500, 500], default 10.0)

:type: float

### attribute `bpy.types.ColorManagedViewSettings.white_balance_whitepoint`

The color which gets mapped to white (automatically converted to/from temperature and tint) (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### classmethod `bpy.types.ColorManagedViewSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ColorManagedViewSettings.bl_rna_get_subclass_py`

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

- :class:`CompositorNodeConvertToDisplay.view_settings`
- :class:`ImageFormatSettings.view_settings`
- :class:`Scene.view_settings`
