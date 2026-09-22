<!-- source: api/bpy.types.UnifiedPaintSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.UnifiedPaintSettings`

Overrides for some of the active brush's settings

### attribute `bpy.types.UnifiedPaintSettings.color`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.UnifiedPaintSettings.hue_jitter`

Color jitter effect on hue (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.UnifiedPaintSettings.input_samples`

Number of input samples to average together to smooth the brush stroke (in [1, 64], default 1)

:type: int

### attribute `bpy.types.UnifiedPaintSettings.saturation_jitter`

Color jitter effect on saturation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.UnifiedPaintSettings.secondary_color`

(array of 3 items, in [0, 1], default (1.0, 1.0, 1.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.UnifiedPaintSettings.size`

Diameter of the brush (in [1, 10000], default 100)

:type: int

### attribute `bpy.types.UnifiedPaintSettings.strength`

How powerful the effect of the brush is when applied (in [0, 10], default 0.5)

:type: float

### attribute `bpy.types.UnifiedPaintSettings.unprojected_size`

Diameter of brush in Blender units (in [0.001, inf], default 0.58)

:type: float

### attribute `bpy.types.UnifiedPaintSettings.use_color_jitter`

Jitter brush color (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_locked_size`

Measure brush size relative to the view or the scene (default ``'VIEW'``)

- ``VIEW``
  View -- Measure brush size relative to the view.
- ``SCENE``
  Scene -- Measure brush size relative to the scene.

:type: Literal['VIEW', 'SCENE']

### attribute `bpy.types.UnifiedPaintSettings.use_random_press_hue`

Use pressure to modulate randomness (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_random_press_sat`

Use pressure to modulate randomness (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_random_press_val`

Use pressure to modulate randomness (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_stroke_random_hue`

Use randomness at stroke level (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_stroke_random_sat`

Use randomness at stroke level (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_stroke_random_val`

Use randomness at stroke level (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_unified_color`

Instead of per-brush color, the color is shared across brushes (default True)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_unified_input_samples`

Instead of per-brush input samples, the value is shared across brushes (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_unified_size`

Instead of per-brush size, the size is shared across brushes (default True)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_unified_strength`

Instead of per-brush strength, the strength is shared across brushes (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.use_unified_weight`

Instead of per-brush weight, the weight is shared across brushes (default False)

:type: bool

### attribute `bpy.types.UnifiedPaintSettings.value_jitter`

Color jitter effect on value (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.UnifiedPaintSettings.weight`

Weight to assign in vertex groups (in [0, 1], default 0.5)

:type: float

### classmethod `bpy.types.UnifiedPaintSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.UnifiedPaintSettings.bl_rna_get_subclass_py`

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

- :class:`Paint.unified_paint_settings`
