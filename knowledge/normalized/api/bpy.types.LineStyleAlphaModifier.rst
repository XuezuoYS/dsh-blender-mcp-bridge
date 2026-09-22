<!-- source: api/bpy.types.LineStyleAlphaModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`LineStyleModifier`

### class `bpy.types.LineStyleAlphaModifier`

:caption: Subclasses
:maxdepth: 1

bpy.types.LineStyleAlphaModifier_AlongStroke.rst
bpy.types.LineStyleAlphaModifier_CreaseAngle.rst
bpy.types.LineStyleAlphaModifier_Curvature_3D.rst
bpy.types.LineStyleAlphaModifier_DistanceFromCamera.rst
bpy.types.LineStyleAlphaModifier_DistanceFromObject.rst
bpy.types.LineStyleAlphaModifier_Material.rst
bpy.types.LineStyleAlphaModifier_Noise.rst
bpy.types.LineStyleAlphaModifier_Tangent.rst
Base type to define alpha transparency modifiers

### attribute `bpy.types.LineStyleAlphaModifier.name`

Name of the modifier (default "", never None)

:type: str

### classmethod `bpy.types.LineStyleAlphaModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LineStyleAlphaModifier.bl_rna_get_subclass_py`

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
- :class:`LineStyleModifier.bl_rna_get_subclass`
- :class:`LineStyleModifier.bl_rna_get_subclass_py`

:columns: 2

- :class:`FreestyleLineStyle.alpha_modifiers`
- :class:`LineStyleAlphaModifiers.new`
- :class:`LineStyleAlphaModifiers.remove`
