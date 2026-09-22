<!-- source: api/bpy.types.AnnotationLayer.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.AnnotationLayer`

Collection of related sketches

### data `bpy.types.AnnotationLayer.active_frame`

Frame currently being displayed for this layer (readonly)

:type: :class:`AnnotationFrame` | None

### attribute `bpy.types.AnnotationLayer.annotation_hide`

Set annotation Visibility (default False)

:type: bool

### attribute `bpy.types.AnnotationLayer.annotation_onion_after_color`

Base color for ghosts after the active frame (array of 3 items, in [0, 1], default (0.25, 0.1, 1.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.AnnotationLayer.annotation_onion_after_range`

Maximum number of frames to show after current frame (in [-1, 120], default 0)

:type: int

### attribute `bpy.types.AnnotationLayer.annotation_onion_before_color`

Base color for ghosts before the active frame (array of 3 items, in [0, 1], default (0.302, 0.851, 0.302))

:type: :class:`mathutils.Color`

### attribute `bpy.types.AnnotationLayer.annotation_onion_before_range`

Maximum number of frames to show before current frame (in [-1, 120], default 0)

:type: int

### attribute `bpy.types.AnnotationLayer.annotation_onion_use_custom_color`

Use custom colors for onion skinning instead of the theme (default False)

:type: bool

### attribute `bpy.types.AnnotationLayer.annotation_opacity`

Annotation Layer Opacity (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.AnnotationLayer.color`

Color for all strokes in this layer (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### data `bpy.types.AnnotationLayer.frames`

Sketches for this layer on different frames (default None, readonly)

:type: :class:`AnnotationFrames`\ [:class:`AnnotationFrame`]

### attribute `bpy.types.AnnotationLayer.info`

Layer name (default "", never None)

:type: str

### data `bpy.types.AnnotationLayer.is_ruler`

This is a special ruler layer (default False, readonly)

:type: bool

### attribute `bpy.types.AnnotationLayer.lock`

Protect layer from further editing and/or frame changes (default False)

:type: bool

### attribute `bpy.types.AnnotationLayer.lock_frame`

Lock current frame displayed by layer (default False)

:type: bool

### attribute `bpy.types.AnnotationLayer.select`

Layer is selected for editing in the Dope Sheet (default False)

:type: bool

### attribute `bpy.types.AnnotationLayer.show_in_front`

Make the layer display in front of objects (default True)

:type: bool

### attribute `bpy.types.AnnotationLayer.thickness`

Thickness of annotation strokes (in [1, 10], default 0)

:type: int

### attribute `bpy.types.AnnotationLayer.use_annotation_onion_skinning`

Display annotation onion skins before and after the current frame (default False)

:type: bool

### classmethod `bpy.types.AnnotationLayer.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.AnnotationLayer.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.active_annotation_layer`
- :class:`Annotation.layers`
- :class:`AnnotationLayers.new`
- :class:`AnnotationLayers.remove`
