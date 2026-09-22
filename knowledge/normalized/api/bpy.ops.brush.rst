<!-- source: api/bpy.ops.brush.rst -->

### function `bpy.ops.brush.asset_activate`

Activate a brush asset as current sculpt and paint tool

:param asset_library_type: Asset Library Type, (optional)
:type asset_library_type: Literal[:ref:`rna_enum_asset_library_type_items`]
:param asset_library_identifier: Asset Library Identifier, (optional, never None)
:type asset_library_identifier: str
:param relative_asset_identifier: Relative Asset Identifier, (optional, never None)
:type relative_asset_identifier: str
:param use_toggle: Toggle, Switch between the current and assigned brushes on consecutive uses. (optional)
:type use_toggle: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.asset_delete`

Delete the active brush asset

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.asset_edit_metadata`

Edit asset information like the catalog, preview image, tags, or author

:param catalog_path: Catalog, The asset's catalog path (optional, never None)
:type catalog_path: str
:param author: Author, (optional, never None)
:type author: str
:param description: Description, (optional, never None)
:type description: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.asset_load_preview`

Choose a preview image for the brush

:param filepath: File Path, Path to file (optional, never None)
:type filepath: str
:param hide_props_region: Hide Operator Properties, Collapse the region displaying the operator settings (optional)
:type hide_props_region: bool
:param check_existing: Check Existing, Check and warn on overwriting existing files (optional)
:type check_existing: bool
:param filter_blender: Filter .blend files, (optional)
:type filter_blender: bool
:param filter_backup: Filter backup .blend files, (optional)
:type filter_backup: bool
:param filter_image: Filter image files, (optional)
:type filter_image: bool
:param filter_movie: Filter movie files, (optional)
:type filter_movie: bool
:param filter_python: Filter Python files, (optional)
:type filter_python: bool
:param filter_font: Filter font files, (optional)
:type filter_font: bool
:param filter_sound: Filter sound files, (optional)
:type filter_sound: bool
:param filter_text: Filter text files, (optional)
:type filter_text: bool
:param filter_archive: Filter archive files, (optional)
:type filter_archive: bool
:param filter_btx: Filter btx files, (optional)
:type filter_btx: bool
:param filter_alembic: Filter Alembic files, (optional)
:type filter_alembic: bool
:param filter_usd: Filter USD files, (optional)
:type filter_usd: bool
:param filter_obj: Filter OBJ files, (optional)
:type filter_obj: bool
:param filter_volume: Filter OpenVDB volume files, (optional)
:type filter_volume: bool
:param filter_folder: Filter folders, (optional)
:type filter_folder: bool
:param filter_blenlib: Filter Blender IDs, (optional)
:type filter_blenlib: bool
:param filemode: File Browser Mode, The setting for the file browser mode to load a .blend file, a library or a special file (in [1, 9], optional)
:type filemode: int
:param show_multiview: Enable Multi-View, (optional)
:type show_multiview: bool
:param use_multiview: Use Multi-View, (optional)
:type use_multiview: bool
:param display_type: Display Type, (optional)

- ``DEFAULT``
  Default -- Automatically determine display type for files.
- ``LIST_VERTICAL``
  Short List -- Display files as short list.
- ``LIST_HORIZONTAL``
  Long List -- Display files as a detailed list.
- ``THUMBNAIL``
  Thumbnails -- Display files as thumbnails.
:type display_type: Literal['DEFAULT', 'LIST_VERTICAL', 'LIST_HORIZONTAL', 'THUMBNAIL']
:param sort_method: File sorting mode, (optional)
:type sort_method: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.asset_revert`

Revert the active brush settings to the default values from the asset library

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.asset_save`

Update the active brush asset in the asset library with current settings

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.asset_save_as`

Save a copy of the active brush asset into the default asset library, and make it the active brush

:param name: Name, Name for the new brush asset (optional, never None)
:type name: str
:param asset_library_reference: Library, Asset library used to store the new brush (optional)
:type asset_library_reference: str
:param catalog_path: Catalog, Catalog to use for the new asset (optional, never None)
:type catalog_path: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.scale_size`

Change brush size by a scalar

:param scalar: Scalar, Factor to scale brush size by (in [0, 2], optional)
:type scalar: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.stencil_control`

Control the stencil brush

:param mode: Tool, (optional)
:type mode: Literal['TRANSLATION', 'SCALE', 'ROTATION']
:param texmode: Tool, (optional)
:type texmode: Literal['PRIMARY', 'SECONDARY']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.stencil_fit_image_aspect`

When using an image texture, adjust the stencil size to fit the image aspect ratio

:param use_repeat: Use Repeat, Use repeat mapping values (optional)
:type use_repeat: bool
:param use_scale: Use Scale, Use texture scale values (optional)
:type use_scale: bool
:param mask: Modify Mask Stencil, Modify either the primary or mask stencil (optional)
:type mask: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.brush.stencil_reset_transform`

Reset the stencil transformation to the default

:param mask: Modify Mask Stencil, Modify either the primary or mask stencil (optional)
:type mask: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
