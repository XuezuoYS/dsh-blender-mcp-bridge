<!-- source: api/bpy.types.LineStyleThicknessModifier_Calligraphy.rst -->

base classes --- :class:`bpy_struct`, :class:`LineStyleModifier`, :class:`LineStyleThicknessModifier`

### class `bpy.types.LineStyleThicknessModifier_Calligraphy`

Change line thickness so that stroke looks like made with a calligraphic pen

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.blend`

Specify how the modifier value is blended into the base value (default ``'MIX'``)

:type: Literal['MIX', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'DIFFERENCE', 'MINIMUM', 'MAXIMUM']

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.expanded`

True if the modifier tab is expanded (default False)

:type: bool

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.influence`

Influence factor by which the modifier changes the property (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.orientation`

Angle of the main direction (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.thickness_max`

Maximum thickness in the main direction (in [0, 10000], default 0.0)

:type: float

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.thickness_min`

Minimum thickness in the direction perpendicular to the main direction (in [0, 10000], default 0.0)

:type: float

### data `bpy.types.LineStyleThicknessModifier_Calligraphy.type`

Type of the modifier (default ``'ALONG_STROKE'``, readonly)

:type: Literal[:ref:`rna_enum_linestyle_thickness_modifier_type_items`]

### attribute `bpy.types.LineStyleThicknessModifier_Calligraphy.use`

Enable or disable this modifier during stroke rendering (default False)

:type: bool

### classmethod `bpy.types.LineStyleThicknessModifier_Calligraphy.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LineStyleThicknessModifier_Calligraphy.bl_rna_get_subclass_py`

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
