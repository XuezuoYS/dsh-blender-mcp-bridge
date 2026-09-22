<!-- source: api/bpy.types.ThemeNLAEditor.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ThemeNLAEditor`

Theme settings for the NLA Editor

### attribute `bpy.types.ThemeNLAEditor.active_action`

Animation data-block has active action (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeNLAEditor.active_action_unset`

Animation data-block does not have active action (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeNLAEditor.grid`

(array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.keyframe_border`

Color of keyframe border (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeNLAEditor.keyframe_border_selected`

Color of selected keyframe border (array of 4 items, in [0, 1], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.ThemeNLAEditor.meta_strips`

Unselected Meta Strip (for grouping related strips) (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.meta_strips_selected`

Selected Meta Strip (for grouping related strips) (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.sound_strips`

Unselected Sound Strip (for timing speaker sounds) (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.sound_strips_selected`

Selected Sound Strip (for timing speaker sounds) (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### data `bpy.types.ThemeNLAEditor.space`

Settings for space (readonly, never None)

:type: :class:`ThemeSpaceGeneric`

### attribute `bpy.types.ThemeNLAEditor.strips`

Unselected Action-Clip Strip (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.strips_selected`

Selected Action-Clip Strip (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.transition_strips`

Unselected Transition Strip (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.transition_strips_selected`

Selected Transition Strip (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.tweak`

Color for strip/action being "tweaked" or edited (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.ThemeNLAEditor.tweak_duplicate`

Warning/error indicator color for strips referencing the strip being tweaked (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### classmethod `bpy.types.ThemeNLAEditor.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ThemeNLAEditor.bl_rna_get_subclass_py`

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

- :class:`Theme.nla_editor`
