<!-- source: api/bpy.types.LineStyleGeometryModifier_2DOffset.rst -->

base classes --- :class:`bpy_struct`, :class:`LineStyleModifier`, :class:`LineStyleGeometryModifier`

### class `bpy.types.LineStyleGeometryModifier_2DOffset`

Add two-dimensional offsets to stroke backbone geometry

### attribute `bpy.types.LineStyleGeometryModifier_2DOffset.end`

Displacement that is applied from the end of the stroke (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LineStyleGeometryModifier_2DOffset.expanded`

True if the modifier tab is expanded (default False)

:type: bool

### attribute `bpy.types.LineStyleGeometryModifier_2DOffset.start`

Displacement that is applied from the beginning of the stroke (in [-inf, inf], default 0.0)

:type: float

### data `bpy.types.LineStyleGeometryModifier_2DOffset.type`

Type of the modifier (default ``'2D_OFFSET'``, readonly)

:type: Literal[:ref:`rna_enum_linestyle_geometry_modifier_type_items`]

### attribute `bpy.types.LineStyleGeometryModifier_2DOffset.use`

Enable or disable this modifier during stroke rendering (default False)

:type: bool

### attribute `bpy.types.LineStyleGeometryModifier_2DOffset.x`

Displacement that is applied to the X coordinates of stroke vertices (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LineStyleGeometryModifier_2DOffset.y`

Displacement that is applied to the Y coordinates of stroke vertices (in [-inf, inf], default 0.0)

:type: float

### classmethod `bpy.types.LineStyleGeometryModifier_2DOffset.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LineStyleGeometryModifier_2DOffset.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`LineStyleGeometryModifier.name`

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
- :class:`LineStyleGeometryModifier.bl_rna_get_subclass`
- :class:`LineStyleGeometryModifier.bl_rna_get_subclass_py`
