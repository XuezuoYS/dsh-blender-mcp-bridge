<!-- source: api/bpy.types.Header.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Header`

Editor header containing UI elements

### attribute `bpy.types.Header.bl_idname`

If this is set, the header gets a custom ID, otherwise it takes the name of the class used to define the header; for example, if the class name is "OBJECT_HT_hello", and bl_idname is not set by the script, then bl_idname = "OBJECT_HT_hello" (default "", never None)

:type: str

### attribute `bpy.types.Header.bl_region_type`

The region where the header is going to be used in (defaults to header region) (default ``'HEADER'``)

:type: Literal[:ref:`rna_enum_region_type_items`]

### attribute `bpy.types.Header.bl_space_type`

The space where the header is going to be used in (default ``'EMPTY'``)

:type: Literal[:ref:`rna_enum_space_type_items`]

### data `bpy.types.Header.layout`

Structure of the header in the UI (readonly)

:type: :class:`UILayout` | None

### method `bpy.types.Header.draw`

Draw UI elements into the header UI layout

:param context: The context
:type context: :class:`Context` | None

### classmethod `bpy.types.Header.append`

Append a draw function to this menu,
takes the same arguments as the menus draw function

:param draw_func: Draw function to append.
:type draw_func: Callable[[Self, :class:`Context`], None]

### classmethod `bpy.types.Header.is_extended`

Test if any draw function has been added via :meth:`append` or :meth:`prepend`.

:return: True when at least one draw function has been added.
:rtype: bool

### classmethod `bpy.types.Header.prepend`

Prepend a draw function to this menu, takes the same arguments as
the menus draw function

:param draw_func: Draw function to prepend.
:type draw_func: Callable[[Self, :class:`Context`], None]

### classmethod `bpy.types.Header.remove`

Remove a draw function that has been added to this menu.

:param draw_func: Draw function previously registered via :meth:`append` or :meth:`prepend`.
:type draw_func: Callable[[Self, :class:`Context`], None]

### classmethod `bpy.types.Header.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Header.bl_rna_get_subclass_py`

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
