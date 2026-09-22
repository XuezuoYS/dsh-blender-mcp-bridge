<!-- source: api/bpy.types.LayerCollection.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.LayerCollection`

Layer collection

### data `bpy.types.LayerCollection.children`

Layer collection children (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`LayerCollection`]

### data `bpy.types.LayerCollection.collection`

Collection this layer collection is wrapping (readonly, never None)

:type: :class:`Collection`

### attribute `bpy.types.LayerCollection.exclude`

Exclude from view layer (default False)

:type: bool

### attribute `bpy.types.LayerCollection.hide_viewport`

Temporarily hide in viewport (default False)

:type: bool

### attribute `bpy.types.LayerCollection.holdout`

Mask out objects in collection from view layer (default False)

:type: bool

### attribute `bpy.types.LayerCollection.indirect_only`

Objects in collection only contribute indirectly (through shadows and reflections) in the view layer (default False)

:type: bool

### data `bpy.types.LayerCollection.is_visible`

Whether this collection is visible for the view layer, take into account the collection parent (default False, readonly)

:type: bool

### data `bpy.types.LayerCollection.name`

Name of this layer collection (same as its collection one) (default "", readonly, never None)

:type: str

### method `bpy.types.LayerCollection.visible_get`

Whether this collection is visible, take into account the collection parent and the viewport

:rtype: bool

### method `bpy.types.LayerCollection.has_objects`

:rtype: bool

### method `bpy.types.LayerCollection.has_selected_objects`

:param view_layer: View layer the layer collection belongs to
:type view_layer: :class:`ViewLayer` | None
:rtype: bool

### classmethod `bpy.types.LayerCollection.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LayerCollection.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.collection`
- :class:`Context.layer_collection`
- :class:`LayerCollection.children`
- :class:`ViewLayer.active_layer_collection`
- :class:`ViewLayer.layer_collection`
