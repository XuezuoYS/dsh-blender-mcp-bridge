<!-- source: api/bpy.types.MetaBallElements.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.MetaBallElements`

Collection of metaball elements

### data `bpy.types.MetaBallElements.active`

Last selected element (readonly)

:type: :class:`MetaElement` | None

### method `bpy.types.MetaBallElements.new`

Add a new element to the metaball

:param type: Type for the new metaball element (optional)
:type type: Literal[:ref:`rna_enum_metaelem_type_items`]
:return: The newly created metaball element
:rtype: :class:`MetaElement`

### method `bpy.types.MetaBallElements.remove`

Remove an element from the metaball

:param element: The element to remove (never None)
:type element: :class:`MetaElement` | None

### method `bpy.types.MetaBallElements.clear`

Remove all elements from the metaball

### classmethod `bpy.types.MetaBallElements.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MetaBallElements.bl_rna_get_subclass_py`

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

- :class:`MetaBall.elements`
