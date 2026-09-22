<!-- source: api/bpy.types.ThemeSequenceEditor.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ThemeSequenceEditor`

Theme settings for the Sequence Editor

### attribute `bpy.types.ThemeSequenceEditor.active_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.audio_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.color_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.effect_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.grid`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.image_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.keyframe_border`

Color of keyframe border (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeSequenceEditor.keyframe_border_selected`

Color of selected keyframe border (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeSequenceEditor.mask_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.meta_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.metadatabg`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.metadatatext`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.movie_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.movieclip_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.preview_back`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.row_alternate`

Overlay color on every other row (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeSequenceEditor.scene_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.selected_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.selected_text`

Text strip editing selection (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### data `bpy.types.ThemeSequenceEditor.space`

Settings for space (readonly, never None)

:type: :class:`ThemeSpaceGeneric`

### attribute `bpy.types.ThemeSequenceEditor.text_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeSequenceEditor.text_strip_cursor`

Text strip editing cursor (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeSequenceEditor.transition_strip`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### classmethod `bpy.types.ThemeSequenceEditor.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ThemeSequenceEditor.bl_rna_get_subclass_py`

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

- :class:`Theme.sequence_editor`
