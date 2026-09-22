<!-- source: api/bpy.types.GreasePencilv3Layers.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.GreasePencilv3Layers`

Collection of Grease Pencil layers

### attribute `bpy.types.GreasePencilv3Layers.active`

Active Grease Pencil layer

:type: :class:`GreasePencilLayer` | None

### method `bpy.types.GreasePencilv3Layers.new`

Add a new Grease Pencil layer

:param name: Name, Name of the layer (never None)
:type name: str
:param set_active: Set Active, Set the newly created layer as the active layer (optional)
:type set_active: bool
:param layer_group: The layer group the new layer will be created in (use None for the main stack) (optional)
:type layer_group: :class:`GreasePencilLayerGroup` | None
:return: The newly created layer
:rtype: :class:`GreasePencilLayer`

### method `bpy.types.GreasePencilv3Layers.remove`

Remove a Grease Pencil layer

:param layer: The layer to remove (never None)
:type layer: :class:`GreasePencilLayer` | None

### method `bpy.types.GreasePencilv3Layers.move`

Move a Grease Pencil layer in the layer group or main stack

:param layer: The layer to move (never None)
:type layer: :class:`GreasePencilLayer` | None
:param type: Direction of movement
:type type: Literal['DOWN', 'UP']

### method `bpy.types.GreasePencilv3Layers.move_top`

Move a Grease Pencil layer to the top of the layer group or main stack

:param layer: The layer to move (never None)
:type layer: :class:`GreasePencilLayer` | None

### method `bpy.types.GreasePencilv3Layers.move_bottom`

Move a Grease Pencil layer to the bottom of the layer group or main stack

:param layer: The layer to move (never None)
:type layer: :class:`GreasePencilLayer` | None

### method `bpy.types.GreasePencilv3Layers.move_to_layer_group`

Move a Grease Pencil layer into a layer group

:param layer: The layer to move (never None)
:type layer: :class:`GreasePencilLayer` | None
:param layer_group: The layer group the layer will be moved into (use None for the main stack)
:type layer_group: :class:`GreasePencilLayerGroup` | None

### classmethod `bpy.types.GreasePencilv3Layers.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilv3Layers.bl_rna_get_subclass_py`

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

- :class:`GreasePencil.layers`
