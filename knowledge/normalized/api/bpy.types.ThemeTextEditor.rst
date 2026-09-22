<!-- source: api/bpy.types.ThemeTextEditor.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ThemeTextEditor`

Theme settings for the Text Editor

### attribute `bpy.types.ThemeTextEditor.cursor`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.line_numbers`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.line_numbers_background`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.selected_text`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### data `bpy.types.ThemeTextEditor.space`

Settings for space (readonly, never None)

:type: :class:`ThemeSpaceGeneric`

### attribute `bpy.types.ThemeTextEditor.syntax_builtin`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_comment`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_numbers`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_preprocessor`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_reserved`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_special`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_string`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeTextEditor.syntax_symbols`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### classmethod `bpy.types.ThemeTextEditor.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ThemeTextEditor.bl_rna_get_subclass_py`

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

- :class:`Theme.text_editor`
