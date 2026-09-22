<!-- source: api/bpy.types.MaskLayers.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.MaskLayers`

Collection of layers used by mask

### attribute `bpy.types.MaskLayers.active`

Active layer in this mask

:type: :class:`MaskLayer` | None

### method `bpy.types.MaskLayers.new`

Add layer to this mask

:param name: Name, Name of new layer (optional, never None)
:type name: str
:return: New mask layer
:rtype: :class:`MaskLayer`

### method `bpy.types.MaskLayers.remove`

Remove layer from this mask

:param layer: Shape to be removed (never None)
:type layer: :class:`MaskLayer` | None

### method `bpy.types.MaskLayers.clear`

Remove all mask layers

### classmethod `bpy.types.MaskLayers.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MaskLayers.bl_rna_get_subclass_py`

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

- :class:`Mask.layers`
