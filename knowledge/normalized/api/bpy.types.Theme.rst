<!-- source: api/bpy.types.Theme.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Theme`

User interface styling and color settings

### data `bpy.types.Theme.bone_color_sets`

(default None, readonly, never None)

:type: :class:`bpy_prop_collection`\ [:class:`ThemeBoneColorSet`]

### data `bpy.types.Theme.clip_editor`

(readonly, never None)

:type: :class:`ThemeClipEditor`

### data `bpy.types.Theme.collection_color`

(default None, readonly, never None)

:type: :class:`bpy_prop_collection`\ [:class:`ThemeCollectionColor`]

### data `bpy.types.Theme.common`

Theme properties shared by different editors (readonly, never None)

:type: :class:`ThemeCommon`

### data `bpy.types.Theme.console`

(readonly, never None)

:type: :class:`ThemeConsole`

### data `bpy.types.Theme.dopesheet_editor`

(readonly, never None)

:type: :class:`ThemeDopeSheet`

### data `bpy.types.Theme.file_browser`

(readonly, never None)

:type: :class:`ThemeFileBrowser`

### attribute `bpy.types.Theme.filepath`

The path to the preset loaded into this theme (if any) (default "", never None)

:type: str

### data `bpy.types.Theme.graph_editor`

(readonly, never None)

:type: :class:`ThemeGraphEditor`

### data `bpy.types.Theme.image_editor`

(readonly, never None)

:type: :class:`ThemeImageEditor`

### data `bpy.types.Theme.info`

(readonly, never None)

:type: :class:`ThemeInfo`

### attribute `bpy.types.Theme.name`

Name of the theme (default "Default", never None)

:type: str

### data `bpy.types.Theme.nla_editor`

(readonly, never None)

:type: :class:`ThemeNLAEditor`

### data `bpy.types.Theme.node_editor`

(readonly, never None)

:type: :class:`ThemeNodeEditor`

### data `bpy.types.Theme.outliner`

(readonly, never None)

:type: :class:`ThemeOutliner`

### data `bpy.types.Theme.preferences`

(readonly, never None)

:type: :class:`ThemePreferences`

### data `bpy.types.Theme.properties`

(readonly, never None)

:type: :class:`ThemeProperties`

### data `bpy.types.Theme.regions`

Theme properties for common editor regions (readonly, never None)

:type: :class:`ThemeRegions`

### data `bpy.types.Theme.sequence_editor`

(readonly, never None)

:type: :class:`ThemeSequenceEditor`

### data `bpy.types.Theme.spreadsheet`

(readonly, never None)

:type: :class:`ThemeSpreadsheet`

### data `bpy.types.Theme.statusbar`

(readonly, never None)

:type: :class:`ThemeStatusBar`

### data `bpy.types.Theme.strip_color`

(default None, readonly, never None)

:type: :class:`bpy_prop_collection`\ [:class:`ThemeStripColor`]

### data `bpy.types.Theme.text_editor`

(readonly, never None)

:type: :class:`ThemeTextEditor`

### attribute `bpy.types.Theme.theme_area`

(default ``'USER_INTERFACE'``)

:type: Literal['USER_INTERFACE', 'STYLE', 'REGIONS', 'COMMON', 'VIEW_3D', 'DOPESHEET_EDITOR', 'FILE_BROWSER', 'GRAPH_EDITOR', 'IMAGE_EDITOR', 'INFO', 'CLIP_EDITOR', 'NODE_EDITOR', 'NLA_EDITOR', 'OUTLINER', 'PREFERENCES', 'PROPERTIES', 'CONSOLE', 'SPREADSHEET', 'STATUSBAR', 'TEXT_EDITOR', 'TOPBAR', 'SEQUENCE_EDITOR', 'BONE_COLOR_SETS']

### data `bpy.types.Theme.topbar`

(readonly, never None)

:type: :class:`ThemeTopBar`

### data `bpy.types.Theme.user_interface`

(readonly, never None)

:type: :class:`ThemeUserInterface`

### data `bpy.types.Theme.view_3d`

(readonly, never None)

:type: :class:`ThemeView3D`

### classmethod `bpy.types.Theme.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Theme.bl_rna_get_subclass_py`

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

- :class:`Preferences.themes`
