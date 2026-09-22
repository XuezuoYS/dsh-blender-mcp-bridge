<!-- source: api/bpy.types.GreasePencilLengthModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.GreasePencilLengthModifier`

Stretch or shrink strokes

### attribute `bpy.types.GreasePencilLengthModifier.end_factor`

Added length to the end of each stroke relative to its length (in [-inf, inf], default 0.1)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.end_length`

Absolute added length to the end of each stroke (in [-inf, inf], default 0.1)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.invert_curvature`

Invert the curvature of the stroke's extension (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.invert_layer_filter`

Invert layer filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.invert_layer_pass_filter`

Invert layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.invert_material_filter`

Invert material filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.invert_material_pass_filter`

Invert material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.layer_pass_filter`

Layer pass filter (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilLengthModifier.material_filter`

Material used for filtering

:type: :class:`Material` | None

### attribute `bpy.types.GreasePencilLengthModifier.material_pass_filter`

Material pass (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilLengthModifier.max_angle`

Ignore points on the stroke that deviate from their neighbors by more than this angle when determining the extrapolation shape (in [0, 3.14159], default 2.96706)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.mode`

Mode to define length (default ``'RELATIVE'``)

- ``RELATIVE``
  Relative -- Length in ratio to the stroke's length.
- ``ABSOLUTE``
  Absolute -- Length in geometry space.

:type: Literal['RELATIVE', 'ABSOLUTE']

### attribute `bpy.types.GreasePencilLengthModifier.open_curvature_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.open_influence_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.open_random_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.overshoot_factor`

Defines what portion of the stroke is used for the calculation of the extension (in [0, 1], default 0.1)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.point_density`

Multiplied by Start/End for the total added point count (in [0.1, 1000], default 30.0)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.random_end_factor`

Size of random length added to the end of each stroke (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.random_offset`

Smoothly offset each stroke's random value (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.random_start_factor`

Size of random length added to the start of each stroke (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.seed`

Random seed (in [0, inf], default 0)

:type: int

### attribute `bpy.types.GreasePencilLengthModifier.segment_influence`

Factor to determine how much the length of the individual segments should influence the final computed curvature. Higher factors makes small segments influence the overall curvature less. (in [-2, 3], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.start_factor`

Added length to the start of each stroke relative to its length (in [-inf, inf], default 0.1)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.start_length`

Absolute added length to the start of each stroke (in [-inf, inf], default 0.1)

:type: float

### attribute `bpy.types.GreasePencilLengthModifier.step`

Number of frames between randomization steps (in [1, 100], default 4)

:type: int

### attribute `bpy.types.GreasePencilLengthModifier.tree_node_filter`

Layer name (default "", never None)

:type: str

### attribute `bpy.types.GreasePencilLengthModifier.use_curvature`

Follow the curvature of the stroke (default True)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.use_layer_group_filter`

Filter by layer group name (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.use_layer_pass_filter`

Use layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.use_material_pass_filter`

Use material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilLengthModifier.use_random`

Use random values over time (default False)

:type: bool

### classmethod `bpy.types.GreasePencilLengthModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilLengthModifier.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Modifier.name`
- :class:`Modifier.type`
- :class:`Modifier.show_viewport`
- :class:`Modifier.show_render`
- :class:`Modifier.show_in_editmode`
- :class:`Modifier.show_on_cage`
- :class:`Modifier.show_expanded`
- :class:`Modifier.is_active`
- :class:`Modifier.use_pin_to_last`
- :class:`Modifier.is_override_data`
- :class:`Modifier.use_apply_on_spline`
- :class:`Modifier.execution_time`
- :class:`Modifier.persistent_uid`

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
- :class:`Modifier.bl_rna_get_subclass`
- :class:`Modifier.bl_rna_get_subclass_py`
