<!-- source: api/bpy.types.SequencerPreviewOverlay.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.SequencerPreviewOverlay.composition_guide_color`

Color and alpha for compositional guide overlays (array of 4 items, in [0, inf], default (0.5, 0.5, 0.5, 1.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.SequencerPreviewOverlay.show_annotation`

Show annotations for this view (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_center`

Display center composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_center_diagonal`

Display diagonal center composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_golden`

Display golden ratio composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_golden_tria_a`

Display golden triangle A composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_golden_tria_b`

Display golden triangle B composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_guides`

Display composition guides over the preview (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_harmony_tri_a`

Display harmony A composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_harmony_tri_b`

Display harmony B composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_composition_thirds`

Display rule of thirds composition guide (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_cursor`

(default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_image_outline`

(default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_metadata`

Show metadata of first visible strip (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_safe_areas`

Show TV title safe and action safe areas in preview (default False)

:type: bool

### attribute `bpy.types.SequencerPreviewOverlay.show_safe_center`

Show safe areas to fit content in a different aspect ratio (default False)

:type: bool

### classmethod `bpy.types.SequencerPreviewOverlay.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.SequencerPreviewOverlay.bl_rna_get_subclass_py`

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

- :class:`SpaceSequenceEditor.preview_overlay`
