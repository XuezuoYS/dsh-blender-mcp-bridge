<!-- source: api/bpy.types.SpaceProperties.rst -->

base classes --- :class:`bpy_struct`, :class:`Space`

### class `bpy.types.SpaceProperties`

Properties space data

### attribute `bpy.types.SpaceProperties.context`

(default ``'RENDER'``)

- ``TOOL``
  Tool -- Active Tool and Workspace settings.
- ``SCENE``
  Scene -- Scene Properties.
- ``RENDER``
  Render -- Render Properties.
- ``OUTPUT``
  Output -- Output Properties.
- ``VIEW_LAYER``
  View Layer -- View Layer Properties.
- ``WORLD``
  World -- World Properties.
- ``COLLECTION``
  Collection -- Collection Properties.
- ``OBJECT``
  Object -- Object Properties.
- ``CONSTRAINT``
  Constraints -- Object Constraint Properties.
- ``MODIFIER``
  Modifiers -- Modifier Properties.
- ``DATA``
  Data -- Object Data Properties.
- ``BONE``
  Bone -- Bone Properties.
- ``BONE_CONSTRAINT``
  Bone Constraints -- Bone Constraint Properties.
- ``MATERIAL``
  Material -- Material Properties.
- ``TEXTURE``
  Texture -- Texture Properties.
- ``PARTICLES``
  Particles -- Particle Properties.
- ``PHYSICS``
  Physics -- Physics Properties.
- ``SHADERFX``
  Effects -- Visual Effects Properties.
- ``STRIP``
  Strip -- Strip Properties.
- ``STRIP_MODIFIER``
  Strip Modifiers -- Strip Modifier Properties.

:type: Literal['TOOL', 'SCENE', 'RENDER', 'OUTPUT', 'VIEW_LAYER', 'WORLD', 'COLLECTION', 'OBJECT', 'CONSTRAINT', 'MODIFIER', 'DATA', 'BONE', 'BONE_CONSTRAINT', 'MATERIAL', 'TEXTURE', 'PARTICLES', 'PHYSICS', 'SHADERFX', 'STRIP', 'STRIP_MODIFIER']

### attribute `bpy.types.SpaceProperties.outliner_sync`

Change to the corresponding tab when outliner data icons are clicked (default ``'AUTO'``)

- ``ALWAYS``
  Always -- Always change tabs when clicking an icon in an outliner.
- ``NEVER``
  Never -- Never change tabs when clicking an icon in an outliner.
- ``AUTO``
  Auto -- Change tabs only when this editor shares a border with an outliner.

:type: Literal['ALWAYS', 'NEVER', 'AUTO']

### attribute `bpy.types.SpaceProperties.pin_id`

:type: :class:`ID` | None

### attribute `bpy.types.SpaceProperties.search_filter`

Live search filtering string (default "", never None)

:type: str

### attribute `bpy.types.SpaceProperties.show_properties_bone`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_bone_constraints`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_collection`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_constraints`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_data`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_effects`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_material`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_modifiers`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_object`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_output`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_particles`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_physics`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_render`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_scene`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_strip`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_strip_modifier`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_texture`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_tool`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_view_layer`

(default False)

:type: bool

### attribute `bpy.types.SpaceProperties.show_properties_world`

(default False)

:type: bool

### data `bpy.types.SpaceProperties.tab_search_results`

Whether or not each visible tab has a search result (dynamic array, default False, readonly)

:type: :class:`bpy_prop_array`\ [bool]

### attribute `bpy.types.SpaceProperties.use_pin_id`

Use the pinned context (default False)

:type: bool

### classmethod `bpy.types.SpaceProperties.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.SpaceProperties.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

### classmethod `bpy.types.SpaceProperties.draw_handler_add`

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

### classmethod `bpy.types.SpaceProperties.draw_handler_remove`

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
