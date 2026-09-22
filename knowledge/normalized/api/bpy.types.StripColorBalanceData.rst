<!-- source: api/bpy.types.StripColorBalanceData.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.StripColorBalanceData`

:caption: Subclasses
:maxdepth: 1

bpy.types.StripColorBalance.rst
Color balance parameters for a sequence strip and its modifiers

### attribute `bpy.types.StripColorBalanceData.correction_method`

(default ``'LIFT_GAMMA_GAIN'``)

- ``LIFT_GAMMA_GAIN``
  Lift/Gamma/Gain.
- ``OFFSET_POWER_SLOPE``
  Offset/Power/Slope (ASC-CDL) -- ASC-CDL standard color correction.

:type: Literal['LIFT_GAMMA_GAIN', 'OFFSET_POWER_SLOPE']

### attribute `bpy.types.StripColorBalanceData.gain`

Color balance gain (highlights) (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.StripColorBalanceData.gamma`

Color balance gamma (midtones) (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.StripColorBalanceData.invert_gain`

Invert the gain color (default False)

:type: bool

### attribute `bpy.types.StripColorBalanceData.invert_gamma`

Invert the gamma color (default False)

:type: bool

### attribute `bpy.types.StripColorBalanceData.invert_lift`

Invert the lift color (default False)

:type: bool

### attribute `bpy.types.StripColorBalanceData.invert_offset`

Invert the offset color (default False)

:type: bool

### attribute `bpy.types.StripColorBalanceData.invert_power`

Invert the power color (default False)

:type: bool

### attribute `bpy.types.StripColorBalanceData.invert_slope`

Invert the slope color (default False)

:type: bool

### attribute `bpy.types.StripColorBalanceData.lift`

Color balance lift (shadows) (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.StripColorBalanceData.offset`

Correction for entire tonal range (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.StripColorBalanceData.power`

Correction for midtones (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.StripColorBalanceData.slope`

Correction for highlights (array of 3 items, in [0, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### classmethod `bpy.types.StripColorBalanceData.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.StripColorBalanceData.bl_rna_get_subclass_py`

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

- :class:`ColorBalanceModifier.color_balance`
