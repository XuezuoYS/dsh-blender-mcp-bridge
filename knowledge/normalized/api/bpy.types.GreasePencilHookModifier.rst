<!-- source: api/bpy.types.GreasePencilHookModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.GreasePencilHookModifier`

Hook modifier to modify the location of stroke points

### attribute `bpy.types.GreasePencilHookModifier.center`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### data `bpy.types.GreasePencilHookModifier.custom_curve`

Custom curve to apply effect (readonly)

:type: :class:`CurveMapping` | None

### attribute `bpy.types.GreasePencilHookModifier.falloff_radius`

If not zero, the distance from the hook where influence ends (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilHookModifier.falloff_type`

(default ``'SMOOTH'``)

:type: Literal['NONE', 'CURVE', 'SMOOTH', 'SPHERE', 'ROOT', 'INVERSE_SQUARE', 'SHARP', 'LINEAR', 'CONSTANT']

### attribute `bpy.types.GreasePencilHookModifier.invert_layer_filter`

Invert layer filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.invert_layer_pass_filter`

Invert layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.invert_material_filter`

Invert material filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.invert_material_pass_filter`

Invert material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.invert_vertex_group`

Invert vertex group weights (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.layer_pass_filter`

Layer pass filter (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilHookModifier.material_filter`

Material used for filtering

:type: :class:`Material` | None

### attribute `bpy.types.GreasePencilHookModifier.material_pass_filter`

Material pass (in [0, 100], default 0)

:type: int

### attribute `bpy.types.GreasePencilHookModifier.matrix_inverse`

Reverse the transformation between this object and its target (multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((1.0, 0.0, 0.0, 0.0), (0.0, 1.0, 0.0, 0.0), (0.0, 0.0, 1.0, 0.0), (0.0, 0.0, 0.0, 1.0)))

:type: :class:`mathutils.Matrix`

### attribute `bpy.types.GreasePencilHookModifier.object`

Parent Object for hook, also recalculates and clears offset

:type: :class:`Object` | None

### attribute `bpy.types.GreasePencilHookModifier.open_falloff_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.open_influence_panel`

(default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.strength`

Relative force of the hook (in [0, 1], default 0.5)

:type: float

### attribute `bpy.types.GreasePencilHookModifier.subtarget`

Name of Parent Bone for hook (if applicable), also recalculates and clears offset (default "", never None)

:type: str

### attribute `bpy.types.GreasePencilHookModifier.tree_node_filter`

Layer name (default "", never None)

:type: str

### attribute `bpy.types.GreasePencilHookModifier.use_custom_curve`

Use a custom curve to define a factor along the strokes (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.use_falloff_uniform`

Compensate for non-uniform object scale (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.use_layer_group_filter`

Filter by layer group name (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.use_layer_pass_filter`

Use layer pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.use_material_pass_filter`

Use material pass filter (default False)

:type: bool

### attribute `bpy.types.GreasePencilHookModifier.vertex_group_name`

Vertex group name for modulating the deform (default "", never None)

:type: str

### classmethod `bpy.types.GreasePencilHookModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilHookModifier.bl_rna_get_subclass_py`

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
