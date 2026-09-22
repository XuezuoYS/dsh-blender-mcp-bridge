<!-- source: api/bpy.types.SpaceConsole.rst -->

base classes --- :class:`bpy_struct`, :class:`Space`

### class `bpy.types.SpaceConsole`

Interactive Python console

### attribute `bpy.types.SpaceConsole.font_size`

Font size to use for displaying the text (in [1, 256], default 0)

:type: int

### data `bpy.types.SpaceConsole.history`

Command history (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ConsoleLine`]

### attribute `bpy.types.SpaceConsole.language`

Command line prompt language (default "", never None)

:type: str

### attribute `bpy.types.SpaceConsole.prompt`

Command line prompt (default "", never None)

:type: str

### data `bpy.types.SpaceConsole.scrollback`

Command output (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ConsoleLine`]

### attribute `bpy.types.SpaceConsole.select_end`

(in [0, inf], default 0)

:type: int

### attribute `bpy.types.SpaceConsole.select_start`

(in [0, inf], default 0)

:type: int

### classmethod `bpy.types.SpaceConsole.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.SpaceConsole.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

### classmethod `bpy.types.SpaceConsole.draw_handler_add`

Add a new draw handler to this space type.
It will be called every time the specified region in the space type will be drawn.
Note: All arguments are positional only for now.

:param callback:
   A function that will be called when the region is drawn.
   It gets the specified arguments as input, it's return value is ignored.
:type callback: Callable[..., Any]
:param args: Arguments that will be passed to the callback.
:type args: tuple[Any, ...]
:param region_type: The region type the callback draws in; usually ``WINDOW``. (:class:`bpy.types.Region.type`)
:type region_type: str
:param draw_type: Usually ``POST_PIXEL`` for 2D drawing and ``POST_VIEW`` for 3D drawing. In some cases ``PRE_VIEW`` can be used. ``BACKDROP`` can be used for backdrops in the node editor.
:type draw_type: str
:return: Handler that can be removed later on.
:rtype: object

### classmethod `bpy.types.SpaceConsole.draw_handler_remove`

Remove a draw handler that was added previously.

:param handler: The draw handler that should be removed.
:type handler: object
:param region_type: Region type the callback was added to.
:type region_type: str

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Space.type`
- :class:`Space.show_locked_time`
- :class:`Space.show_region_header`

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
- :class:`Space.bl_rna_get_subclass`
- :class:`Space.bl_rna_get_subclass_py`
- :class:`Space.draw_handler_add`
- :class:`Space.draw_handler_remove`
