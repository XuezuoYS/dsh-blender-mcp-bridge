<!-- source: api/bpy.types.GreasePencilTextureModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.GreasePencilTextureModifier`

Transform stroke texture coordinates Modifier

### attribute `bpy.types.GreasePencilTextureModifier.alignment_rotation`

Additional rotation applied to dots and square strokes (in [-1.5708, 1.5708], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilTextureModifier.fill_offset`

Additional offset of the fill UV (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.GreasePencilTextureModifier.fill_rotation`

Additional rotation of the fill UV (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilTextureModifier.fill_scale`

Additional scale of the fill UV (in [0.01, 100], default 1.0)

:type: float

### attribute `bpy.types.GreasePencilTextureModifier.fit_method`

(default ``'CONSTANT_LENGTH'``)

- ``CONSTANT_LENGTH``
  Constant Length -- Keep the texture at a constant length regardless of the length of each stroke.
- ``FIT_STROKE``
  Stroke Length -- Scale the texture to fit the length of each stroke.

:type: Literal['CONSTANT_LENGTH', 'FIT_STROKE']

### attribute `bpy.types.GreasePencilTextureModifier.invert_layer_filter`

Invert layer filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.invert_layer_pass_filter`

Invert layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.invert_material_filter`

Invert material filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.invert_material_pass_filter`

Invert material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.layer_pass_filter`

Layer pass filter (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilTextureModifier.material_filter`

Material used for filtering

:type: :class:`Material` | None

### attribute `bpy.types.GreasePencilTextureModifier.material_pass_filter`

Material pass (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilTextureModifier.mode`

(default ``'STROKE'``)

- ``STROKE``
  Stroke -- Manipulate only stroke texture coordinates.
- ``FILL``
  Fill -- Manipulate only fill texture coordinates.
- ``STROKE_AND_FILL``
  Stroke & Fill -- Manipulate both stroke and fill texture coordinates.

:type: Literal['STROKE', 'FILL', 'STROKE_AND_FILL']

### attribute `bpy.types.GreasePencilTextureModifier.open_influence_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.tree_node_filter`

Layer name (default "", never None)

:type: str

### attribute `bpy.types.GreasePencilTextureModifier.use_layer_group_filter`

Filter by layer group name (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.use_layer_pass_filter`

Use layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.use_material_pass_filter`

Use material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilTextureModifier.uv_offset`

Offset value to add to stroke UVs (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilTextureModifier.uv_scale`

Factor to scale the UVs (in [0, inf], default 1.0)

:type: float

### classmethod `bpy.types.GreasePencilTextureModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilTextureModifier.bl_rna_get_subclass_py`

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
