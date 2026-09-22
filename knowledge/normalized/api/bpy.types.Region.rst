<!-- source: api/bpy.types.Region.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Region`

Region in a subdivided screen area

### attribute `bpy.types.Region.active_panel_category`

The current active panel category, may be Null if the region does not support this feature (NOTE: these categories are generated at runtime, so list may be empty at initialization, before any drawing took place) (default ``'UNSUPPORTED'``)

:type: Literal[:ref:`rna_enum_region_panel_category_items`]

### data `bpy.types.Region.alignment`

Alignment of the region within the area (default ``'NONE'``, readonly)

- ``NONE``
  None -- Don't use any fixed alignment, fill available space.
- ``TOP``
  Top.
- ``BOTTOM``
  Bottom.
- ``LEFT``
  Left.
- ``RIGHT``
  Right.
- ``HORIZONTAL_SPLIT``
  Horizontal Split.
- ``VERTICAL_SPLIT``
  Vertical Split.
- ``FLOAT``
  Float -- Region floats on screen, does not use any fixed alignment.
- ``QUAD_SPLIT``
  Quad Split -- Region is split horizontally and vertically.

:type: Literal['NONE', 'TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'HORIZONTAL_SPLIT', 'VERTICAL_SPLIT', 'FLOAT', 'QUAD_SPLIT']

### data `bpy.types.Region.data`

Region specific data (the type depends on the region type) (readonly)

:type: :class:`AnyType` | None

### data `bpy.types.Region.height`

Region height (in [0, 32767], default 0, readonly)

:type: int

### data `bpy.types.Region.type`

Type of this region (default ``'WINDOW'``, readonly)

:type: Literal[:ref:`rna_enum_region_type_items`]

### data `bpy.types.Region.view2d`

2D view of the region (readonly, never None)

:type: :class:`View2D`

### data `bpy.types.Region.width`

Region width (in [0, 32767], default 0, readonly)

:type: int

### data `bpy.types.Region.x`

The window relative vertical location of the region (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.Region.y`

The window relative horizontal location of the region (in [-inf, inf], default 0, readonly)

:type: int

### method `bpy.types.Region.tag_redraw`

tag_redraw

### method `bpy.types.Region.tag_refresh_ui`

tag_refresh_ui

### classmethod `bpy.types.Region.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Region.bl_rna_get_subclass_py`

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

- :class:`Area.regions`
- :class:`Context.region`
- :class:`Context.region_popup`
