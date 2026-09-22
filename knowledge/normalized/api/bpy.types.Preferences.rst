<!-- source: api/bpy.types.Preferences.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Preferences`

Global preferences

### attribute `bpy.types.Preferences.active_section`

Preferences (default ``'INTERFACE'``)

:type: Literal[:ref:`rna_enum_preference_section_items`]

### data `bpy.types.Preferences.addons`

(default None, readonly)

:type: :class:`Addons`\ [:class:`Addon`]

### attribute `bpy.types.Preferences.app_template`

(default "", never None)

:type: str

### data `bpy.types.Preferences.apps`

Preferences that work only for apps (readonly, never None)

:type: :class:`PreferencesApps`

### data `bpy.types.Preferences.asset_libraries`

Setup for custom and builtin asset libraries (readonly, never None)

:type: :class:`PreferencesAssetLibraries`

### data `bpy.types.Preferences.autoexec_paths`

(default None, readonly)

:type: :class:`PathCompareCollection`\ [:class:`PathCompare`]

### data `bpy.types.Preferences.edit`

Settings for interacting with Blender data (readonly, never None)

:type: :class:`PreferencesEdit`

### data `bpy.types.Preferences.experimental`

Settings for features that are still early in their development stage (readonly, never None)

:type: :class:`PreferencesExperimental`

### data `bpy.types.Preferences.extensions`

Settings for extensions (readonly, never None)

:type: :class:`PreferencesExtensions`

### data `bpy.types.Preferences.filepaths`

Default paths for external files (readonly, never None)

:type: :class:`PreferencesFilePaths`

### data `bpy.types.Preferences.inputs`

Settings for input devices (readonly, never None)

:type: :class:`PreferencesInput`

### attribute `bpy.types.Preferences.is_dirty`

Preferences have changed (default False)

:type: bool

### data `bpy.types.Preferences.keymap`

Shortcut setup for keyboards and other input devices (readonly, never None)

:type: :class:`PreferencesKeymap`

### attribute `bpy.types.Preferences.show_hidden_ids`

Show data-blocks with dot-prefixed names in search menus (default False)

:type: bool

### data `bpy.types.Preferences.studio_lights`

(default None, readonly)

:type: :class:`StudioLights`\ [:class:`StudioLight`]

### data `bpy.types.Preferences.system`

Graphics driver and operating system settings (readonly, never None)

:type: :class:`PreferencesSystem`

### data `bpy.types.Preferences.themes`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Theme`]

### data `bpy.types.Preferences.ui_styles`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ThemeStyle`]

### attribute `bpy.types.Preferences.use_preferences_save`

Save preferences on exit when modified (unless factory settings have been loaded) (default True)

:type: bool

### attribute `bpy.types.Preferences.use_recent_searches`

Sort the recently searched items at the top (default True)

:type: bool

### data `bpy.types.Preferences.version`

Version of Blender the userpref.blend was saved with (array of 3 items, in [0, inf], default (0, 0, 0), readonly)

:type: :class:`bpy_prop_array`\ [int]

### data `bpy.types.Preferences.view`

Preferences related to viewing data (readonly, never None)

:type: :class:`PreferencesView`

### classmethod `bpy.types.Preferences.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Preferences.bl_rna_get_subclass_py`

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

- :class:`Context.preferences`
