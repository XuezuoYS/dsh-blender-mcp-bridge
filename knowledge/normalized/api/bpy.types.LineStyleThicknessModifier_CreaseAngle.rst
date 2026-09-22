<!-- source: api/bpy.types.LineStyleThicknessModifier_CreaseAngle.rst -->

base classes --- :class:`bpy_struct`, :class:`LineStyleModifier`, :class:`LineStyleThicknessModifier`

### class `bpy.types.LineStyleThicknessModifier_CreaseAngle`

Line thickness based on the angle between two adjacent faces

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.angle_max`

Maximum angle to modify thickness (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.angle_min`

Minimum angle to modify thickness (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.blend`

Specify how the modifier value is blended into the base value (default ``'MIX'``)

:type: Literal['MIX', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'DIFFERENCE', 'MINIMUM', 'MAXIMUM']

### data `bpy.types.LineStyleThicknessModifier_CreaseAngle.curve`

Curve used for the curve mapping (readonly)

:type: :class:`CurveMapping` | None

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.expanded`

True if the modifier tab is expanded (default False)

:type: bool

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.influence`

Influence factor by which the modifier changes the property (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.invert`

Invert the fade-out direction of the linear mapping (default False)

:type: bool

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.mapping`

Select the mapping type (default ``'LINEAR'``)

- ``LINEAR``
  Linear -- Use linear mapping.
- ``CURVE``
  Curve -- Use curve mapping.

:type: Literal['LINEAR', 'CURVE']

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.thickness_max`

Maximum thickness (in [0, 10000], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.thickness_min`

Minimum thickness (in [0, 10000], default 0.0)

:type: float

### data `bpy.types.LineStyleThicknessModifier_CreaseAngle.type`

Type of the modifier (default ``'ALONG_STROKE'``, readonly)

:type: Literal[:ref:`rna_enum_linestyle_thickness_modifier_type_items`]

### attribute `bpy.types.LineStyleThicknessModifier_CreaseAngle.use`

Enable or disable this modifier during stroke rendering (default False)

:type: bool

### classmethod `bpy.types.LineStyleThicknessModifier_CreaseAngle.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LineStyleThicknessModifier_CreaseAngle.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`LineStyleThicknessModifier.name`

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
- :class:`LineStyleModifier.bl_rna_get_subclass`
- :class:`LineStyleModifier.bl_rna_get_subclass_py`
- :class:`LineStyleThicknessModifier.bl_rna_get_subclass`
- :class:`LineStyleThicknessModifier.bl_rna_get_subclass_py`
