<!-- source: api/bpy.types.CameraDOFSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.CameraDOFSettings`

Depth of Field settings

### attribute `bpy.types.CameraDOFSettings.aperture_blades`

Number of blades in aperture for polygonal bokeh (at least 3) (in [0, 16], default 0)

:type: int

### attribute `bpy.types.CameraDOFSettings.aperture_fstop`

F-Stop ratio (lower numbers give more defocus, higher numbers give a sharper image) (in [0, inf], default 2.8)

:type: float

### attribute `bpy.types.CameraDOFSettings.aperture_ratio`

Distortion to simulate anamorphic lens bokeh (in [0.01, inf], default 1.0)

:type: float

### attribute `bpy.types.CameraDOFSettings.aperture_rotation`

Rotation of blades in aperture (in [-3.14159, 3.14159], default 0.0)

:type: float

### attribute `bpy.types.CameraDOFSettings.focus_distance`

Distance to the focus point for depth of field (in [0, inf], default 10.0)

:type: float

### attribute `bpy.types.CameraDOFSettings.focus_object`

Use this object to define the depth of field focal point

:type: :class:`Object` | None

### attribute `bpy.types.CameraDOFSettings.focus_subtarget`

Use this armature bone to define the depth of field focal point (default "", never None)

:type: str

### attribute `bpy.types.CameraDOFSettings.use_dof`

Use Depth of Field (default False)

:type: bool

### classmethod `bpy.types.CameraDOFSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.CameraDOFSettings.bl_rna_get_subclass_py`

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

- :class:`Camera.dof`
