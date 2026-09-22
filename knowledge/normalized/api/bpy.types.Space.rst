<!-- source: api/bpy.types.Space.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Space`

:caption: Subclasses
:maxdepth: 1

bpy.types.SpaceClipEditor.rst
bpy.types.SpaceConsole.rst
bpy.types.SpaceDopeSheetEditor.rst
bpy.types.SpaceFileBrowser.rst
bpy.types.SpaceGraphEditor.rst
bpy.types.SpaceImageEditor.rst
bpy.types.SpaceInfo.rst
bpy.types.SpaceNLA.rst
bpy.types.SpaceNodeEditor.rst
bpy.types.SpaceOutliner.rst
bpy.types.SpacePreferences.rst
bpy.types.SpaceProperties.rst
bpy.types.SpaceSequenceEditor.rst
bpy.types.SpaceSpreadsheet.rst
bpy.types.SpaceTextEditor.rst
bpy.types.SpaceView3D.rst
Space data for a screen area

### attribute `bpy.types.Space.show_locked_time`

Synchronize the visible timeline range with other time-based editors (default False)

:type: bool

### attribute `bpy.types.Space.show_region_header`

(default False)

:type: bool

### data `bpy.types.Space.type`

Space data type (default ``'EMPTY'``, readonly)

:type: Literal[:ref:`rna_enum_space_type_items`]

### classmethod `bpy.types.Space.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Space.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

### classmethod `bpy.types.Space.draw_handler_add`

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

### classmethod `bpy.types.Space.draw_handler_remove`

Remove a draw handler that was added previously.

:param handler: The draw handler that should be removed.
:type handler: object
:param region_type: Region type the callback was added to.
:type region_type: str

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

- :class:`Area.spaces`
- :class:`AreaSpaces.active`
- :class:`Context.space_data`
