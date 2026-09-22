<!-- source: api/bpy.types.Area.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Area`

Area in a subdivided screen, containing an editor

### data `bpy.types.Area.height`

Area height (in [0, 32767], default 0, readonly)

:type: int

### data `bpy.types.Area.regions`

Regions this area is subdivided in (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Region`]

### attribute `bpy.types.Area.show_menus`

Show menus in the header (default True)

:type: bool

### data `bpy.types.Area.spaces`

Spaces contained in this area, the first being the active space (NOTE: Useful for example to restore a previously used 3D view space in a certain area to get the old view orientation) (default None, readonly)

:type: :class:`AreaSpaces`\ [:class:`Space`]

### attribute `bpy.types.Area.type`

Current editor type for this area (default ``'VIEW_3D'``)

:type: Literal[:ref:`rna_enum_space_type_items`]

### attribute `bpy.types.Area.ui_type`

Current editor type for this area

:type: str

### data `bpy.types.Area.width`

Area width (in [0, 32767], default 0, readonly)

:type: int

### data `bpy.types.Area.x`

The window relative vertical location of the area (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.Area.y`

The window relative horizontal location of the area (in [-inf, inf], default 0, readonly)

:type: int

### method `bpy.types.Area.tag_redraw`

tag_redraw

### method `bpy.types.Area.header_text_set`

Set the header status text

:param text: Text, New string for the header, None clears the text
:type text: str

### classmethod `bpy.types.Area.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Area.bl_rna_get_subclass_py`

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

- :class:`Context.area`
- :class:`Screen.areas`
