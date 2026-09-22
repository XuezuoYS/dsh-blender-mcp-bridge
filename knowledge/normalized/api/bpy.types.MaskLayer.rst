<!-- source: api/bpy.types.MaskLayer.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.MaskLayer`

Single layer used for masking pixels

### attribute `bpy.types.MaskLayer.alpha`

Render Opacity (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.MaskLayer.blend`

Method of blending mask layers (default ``'ADD'``)

:type: Literal['MERGE_ADD', 'MERGE_SUBTRACT', 'ADD', 'SUBTRACT', 'LIGHTEN', 'DARKEN', 'MUL', 'REPLACE', 'DIFFERENCE']

### attribute `bpy.types.MaskLayer.falloff`

Falloff type of the feather (default ``'SMOOTH'``)

:type: Literal[:ref:`rna_enum_proportional_falloff_curve_only_items`]

### attribute `bpy.types.MaskLayer.fill_solver`

Triangulation solver for filling 2D curves (default ``'CDT'``)

- ``SWEEP_LINE``
  Sweep Line -- Fast without support for self-intersection.
- ``CDT``
  Delaunay -- Constrained Delaunay Triangulation (CDT), robust with support for self-intersections.

:type: Literal['SWEEP_LINE', 'CDT']

### attribute `bpy.types.MaskLayer.hide`

Restrict visibility in the viewport (default False)

:type: bool

### attribute `bpy.types.MaskLayer.hide_render`

Restrict renderability (default False)

:type: bool

### attribute `bpy.types.MaskLayer.hide_select`

Restrict selection in the viewport (default False)

:type: bool

### attribute `bpy.types.MaskLayer.invert`

Invert the mask black/white (default False)

:type: bool

### attribute `bpy.types.MaskLayer.name`

Unique name of layer (default "", never None)

:type: str

### attribute `bpy.types.MaskLayer.select`

Layer is selected for editing in the Dope Sheet (default False)

:type: bool

### data `bpy.types.MaskLayer.splines`

Collection of splines which defines this layer (default None, readonly)

:type: :class:`MaskSplines`\ [:class:`MaskSpline`]

### attribute `bpy.types.MaskLayer.use_fill_holes`

Calculate holes when filling overlapping curves (default True)

:type: bool

### attribute `bpy.types.MaskLayer.use_fill_overlap`

Calculate self intersections and overlap before filling (only for the sweep-line solver) (default False)

:type: bool

### classmethod `bpy.types.MaskLayer.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MaskLayer.bl_rna_get_subclass_py`

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

- :class:`Mask.layers`
- :class:`MaskLayers.active`
- :class:`MaskLayers.new`
- :class:`MaskLayers.remove`
