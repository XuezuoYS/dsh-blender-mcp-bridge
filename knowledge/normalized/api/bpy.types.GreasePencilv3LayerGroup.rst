<!-- source: api/bpy.types.GreasePencilv3LayerGroup.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.GreasePencilv3LayerGroup`

Collection of Grease Pencil layers

### attribute `bpy.types.GreasePencilv3LayerGroup.active`

Active Grease Pencil layer group

:type: :class:`GreasePencilLayerGroup` | None

### method `bpy.types.GreasePencilv3LayerGroup.new`

Add a new Grease Pencil layer group

:param name: Name, Name of the layer group (never None)
:type name: str
:param parent_group: The parent layer group the new group will be created in (use None for the main stack) (optional)
:type parent_group: :class:`GreasePencilLayerGroup` | None
:return: The newly created layer group
:rtype: :class:`GreasePencilLayerGroup`

### method `bpy.types.GreasePencilv3LayerGroup.remove`

Remove a new Grease Pencil layer group

:param layer_group: The layer group to remove (never None)
:type layer_group: :class:`GreasePencilLayerGroup` | None
:param keep_children: Keep the children nodes of the group and only delete the group itself (optional)
:type keep_children: bool

### method `bpy.types.GreasePencilv3LayerGroup.move`

Move a layer group in the parent layer group or main stack

:param layer_group: The layer group to move (never None)
:type layer_group: :class:`GreasePencilLayerGroup` | None
:param type: Direction of movement
:type type: Literal['DOWN', 'UP']

### method `bpy.types.GreasePencilv3LayerGroup.move_top`

Move a layer group to the top of the parent layer group or main stack

:param layer_group: The layer group to move (never None)
:type layer_group: :class:`GreasePencilLayerGroup` | None

### method `bpy.types.GreasePencilv3LayerGroup.move_bottom`

Move a layer group to the bottom of the parent layer group or main stack

:param layer_group: The layer group to move (never None)
:type layer_group: :class:`GreasePencilLayerGroup` | None

### method `bpy.types.GreasePencilv3LayerGroup.move_to_layer_group`

Move a layer group into a parent layer group

:param layer_group: The layer group to move (never None)
:type layer_group: :class:`GreasePencilLayerGroup` | None
:param parent_group: The parent layer group the layer group will be moved into (use None for the main stack)
:type parent_group: :class:`GreasePencilLayerGroup` | None

### classmethod `bpy.types.GreasePencilv3LayerGroup.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilv3LayerGroup.bl_rna_get_subclass_py`

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

- :class:`GreasePencil.layer_groups`
