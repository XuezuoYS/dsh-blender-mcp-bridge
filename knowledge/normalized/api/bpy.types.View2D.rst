<!-- source: api/bpy.types.View2D.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.View2D`

Scroll and zoom for a 2D region

### method `bpy.types.View2D.region_to_view`

Transform region coordinates to 2D view

:param x: x, Region x coordinate (in [-inf, inf])
:type x: float
:param y: y, Region y coordinate (in [-inf, inf])
:type y: float
:return: Result, View coordinates (array of 2 items, in [-inf, inf])
:rtype: :class:`bpy_prop_array`\ [float]

### method `bpy.types.View2D.view_to_region`

Transform 2D view coordinates to region

:param x: x, 2D View x coordinate (in [-inf, inf])
:type x: float
:param y: y, 2D View y coordinate (in [-inf, inf])
:type y: float
:param clip: Clip, Clip coordinates to the visible region (optional)
:type clip: bool
:return: Result, Region coordinates (array of 2 items, in [-inf, inf])
:rtype: :class:`bpy_prop_array`\ [int]

### classmethod `bpy.types.View2D.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.View2D.bl_rna_get_subclass_py`

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

- :class:`Region.view2d`
