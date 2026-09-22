<!-- source: api/bpy.types.GreasePencilEnvelopeModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.GreasePencilEnvelopeModifier`

Envelope stroke effect modifier

### attribute `bpy.types.GreasePencilEnvelopeModifier.invert_layer_filter`

Invert layer filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.invert_layer_pass_filter`

Invert layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.invert_material_filter`

Invert material filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.invert_material_pass_filter`

Invert material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.invert_vertex_group`

Invert vertex group weights (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.layer_pass_filter`

Layer pass filter (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilEnvelopeModifier.mat_nr`

The material to use for the new strokes (in [-1, 32767], default -1)

:type: int

### attribute `bpy.types.GreasePencilEnvelopeModifier.material_filter`

Material used for filtering

:type: :class:`Material` | None

### attribute `bpy.types.GreasePencilEnvelopeModifier.material_pass_filter`

Material pass (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilEnvelopeModifier.mode`

Algorithm to use for generating the envelope (default ``'SEGMENTS'``)

- ``DEFORM``
  Deform -- Deform the stroke to best match the envelope shape.
- ``SEGMENTS``
  Segments -- Add segments to create the envelope. Keep the original stroke..
- ``FILLS``
  Fills -- Add fill segments to create the envelope. Don't keep the original stroke..

:type: Literal['DEFORM', 'SEGMENTS', 'FILLS']

### attribute `bpy.types.GreasePencilEnvelopeModifier.open_influence_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.skip`

The number of generated segments to skip to reduce complexity (in [0, inf], default 0)

:type: int

### attribute `bpy.types.GreasePencilEnvelopeModifier.spread`

The number of points to skip to create straight segments (in [1, inf], default 10)

:type: int

### attribute `bpy.types.GreasePencilEnvelopeModifier.strength`

Multiplier for the strength of the new strokes (in [0, inf], default 1.0)

:type: float

### attribute `bpy.types.GreasePencilEnvelopeModifier.thickness`

Multiplier for the thickness of the new strokes (in [0, inf], default 1.0)

:type: float

### attribute `bpy.types.GreasePencilEnvelopeModifier.tree_node_filter`

Layer name (default "", never None)

:type: str

### attribute `bpy.types.GreasePencilEnvelopeModifier.use_layer_group_filter`

Filter by layer group name (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.use_layer_pass_filter`

Use layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.use_material_pass_filter`

Use material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilEnvelopeModifier.vertex_group_name`

Vertex group name for modulating the deform (default "", never None)

:type: str

### classmethod `bpy.types.GreasePencilEnvelopeModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilEnvelopeModifier.bl_rna_get_subclass_py`

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
