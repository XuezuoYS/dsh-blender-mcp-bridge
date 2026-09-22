<!-- source: api/bpy.types.SceneGpencil.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.SceneGpencil`

Render settings

### attribute `bpy.types.SceneGpencil.aa_samples`

Number of supersampling anti-aliasing samples per pixel for final render (in [1, inf], default 8)

:type: int

### attribute `bpy.types.SceneGpencil.antialias_threshold`

Threshold for edge detection algorithm (higher values might over-blur some part of the image) (in [0, inf], default 1.0)

:type: float

### attribute `bpy.types.SceneGpencil.antialias_threshold_render`

Threshold for edge detection algorithm (higher values might over-blur some part of the image). Only applies to final render (in [0, inf], default 0.25)

:type: float

### attribute `bpy.types.SceneGpencil.motion_blur_steps`

Controls accuracy of motion blur, more steps result in longer render time. Only used when Motion Blur is enabled. Set to 0 to disable motion blur for Grease Pencil (in [0, inf], default 8)

:type: int

### classmethod `bpy.types.SceneGpencil.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.SceneGpencil.bl_rna_get_subclass_py`

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

- :class:`Scene.grease_pencil_settings`
