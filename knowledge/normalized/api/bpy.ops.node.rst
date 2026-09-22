<!-- source: api/bpy.ops.node.rst -->

### function `bpy.ops.node.activate_viewer`

Activate selected viewer node in compositor and geometry nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_closure_zone`

Add a Closure zone

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:param offset: Offset, Offset of nodes from the cursor when added (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:857 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L857>`__

### function `bpy.ops.node.add_collection`

Add a collection info node to the current node editor

:param name: Name, Name of the data-block to use by the operator (optional, never None)
:type name: str
:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_color`

Add a color node to the current node editor

:param color: Color, Source color (array of 4 items, in [0, inf], optional)
:type color: Sequence[float]
:param gamma: Gamma Corrected, The source color is gamma corrected (optional)
:type gamma: bool
:param has_alpha: Has Alpha, The source color contains an Alpha component (optional)
:type has_alpha: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_empty_group`

Add a group node with an empty group

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:730 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L730>`__

### function `bpy.ops.node.add_foreach_geometry_element_zone`

Add a For Each Geometry Element zone that allows executing nodes e.g. for each vertex separately

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:param offset: Offset, Offset of nodes from the cursor when added (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:857 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L857>`__

### function `bpy.ops.node.add_group`

Add an existing node group to the current node editor

:param name: Name, Name of the data-block to use by the operator (optional, never None)
:type name: str
:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:param show_datablock_in_node: Show the data-block selector in the node, (optional)
:type show_datablock_in_node: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_group_asset`

Add a node group asset to the active node tree

:param asset_library_type: Asset Library Type, (optional)
:type asset_library_type: Literal[:ref:`rna_enum_asset_library_type_items`]
:param asset_library_identifier: Asset Library Identifier, (optional, never None)
:type asset_library_identifier: str
:param relative_asset_identifier: Relative Asset Identifier, (optional, never None)
:type relative_asset_identifier: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_group_input_node`

Add a Group Input node with selected sockets to the current node editor

:param only_selected_sockets: Only Selected Sockets, Include only selected sockets/panels in the added group input node (optional)
:type only_selected_sockets: bool
:param all_panel_contents: All Panel Contents, Include sockets in all selected panels, even if they have a panel toggle (optional)
:type all_panel_contents: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_image`

Add a image/movie file as node to the current node editor

:param filepath: File Path, Path to file (optional, never None)
:type filepath: str
:param directory: Directory, Directory of the file (optional, never None)
:type directory: str
:param files: Files, (optional)
:type files: :class:`bpy_prop_collection`\ [:class:`OperatorFileListElement`] | None
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
:param relative_path: Relative Path, Select the file relative to the blend file (optional)
:type relative_path: bool
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

- ``DEFAULT``
  Default -- Automatically determine sort method for files.
- ``FILE_SORT_ALPHA``
  Name -- Sort the file list alphabetically.
- ``FILE_SORT_EXTENSION``
  Extension -- Sort the file list by extension/type.
- ``FILE_SORT_TIME``
  Modified Date -- Sort files by modification time.
- ``FILE_SORT_SIZE``
  Size -- Sort files by size.
- ``ASSET_CATALOG``
  Asset Catalog -- Sort the asset list so that assets in the same catalog are kept together. Within a single catalog, assets are ordered by name. The catalogs are in order of the flattened catalog hierarchy..
:type sort_method: Literal['', 'DEFAULT', 'FILE_SORT_ALPHA', 'FILE_SORT_EXTENSION', 'FILE_SORT_TIME', 'FILE_SORT_SIZE', 'ASSET_CATALOG']
:param name: Name, Name of the data-block to use by the operator (optional, never None)
:type name: str
:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_import_node`

Add an import node to the node tree

:param directory: Directory, Directory of the file (optional, never None)
:type directory: str
:param files: Files, (optional)
:type files: :class:`bpy_prop_collection`\ [:class:`OperatorFileListElement`] | None
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_mask`

Add a mask node to the current node editor

:param name: Name, Name of the data-block to use by the operator (optional, never None)
:type name: str
:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_material`

Add a material node to the current node editor

:param name: Name, Name of the data-block to use by the operator (optional, never None)
:type name: str
:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_node`

Add a node to the active tree

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:param type: Node Type, Node type (optional, never None)
:type type: str
:param visible_output: Output Name, If provided, all outputs that are named differently will be hidden (optional, never None)
:type visible_output: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:566 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L566>`__

### function `bpy.ops.node.add_object`

Add an object info node to the current node editor

:param name: Name, Name of the data-block to use by the operator (optional, never None)
:type name: str
:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_repeat_zone`

Add a repeat zone that allows executing nodes a dynamic number of times

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:param offset: Offset, Offset of nodes from the cursor when added (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:857 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L857>`__

### function `bpy.ops.node.add_reroute`

Add a reroute node

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param cursor: Cursor, (in [0, inf], optional)
:type cursor: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.add_simulation_zone`

Add simulation zone input and output nodes to the active tree

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:param offset: Offset, Offset of nodes from the cursor when added (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:857 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L857>`__

### function `bpy.ops.node.add_typed_bundle`

Add a Combine Bundle node with a type input

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:798 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L798>`__

### function `bpy.ops.node.add_zone`

Undocumented, consider `contributing <https://developer.blender.org/>`__.

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param use_transform: Use Transform, Start transform operator after inserting the node (optional)
:type use_transform: bool
:param offset: Offset, Offset of nodes from the cursor when added (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:param input_node_type: Input Node, Specifies the input node used by the created zone (optional, never None)
:type input_node_type: str
:param output_node_type: Output Node, Specifies the output node used by the created zone (optional, never None)
:type output_node_type: str
:param add_default_geometry_link: Add Geometry Link, When enabled, create a link between geometry sockets in this zone (optional)
:type add_default_geometry_link: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:857 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L857>`__

### function `bpy.ops.node.attach`

Attach active node to a frame

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.backimage_fit`

Fit the background image to the view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.backimage_move`

Move node backdrop

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.backimage_sample`

Use mouse to sample background image

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.backimage_zoom`

Zoom in/out the background image

:param factor: Factor, (in [0, 10], optional)
:type factor: float
:param use_mouse_pos: Use Mouse Position, Zoom to mouse position (optional)
:type use_mouse_pos: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.bake_node_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.bake_node_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.bake_node_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.capture_attribute_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.capture_attribute_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.capture_attribute_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.clear_viewer_border`

Clear the boundaries for viewer operations

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.clipboard_copy`

Copy the selected nodes to the internal clipboard

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.clipboard_paste`

Paste nodes from the internal clipboard to the active node tree

:param offset: Location, The 2D view location for the center of the new nodes, or unchanged if not set (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_input_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_input_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_input_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_output_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_output_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_output_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_to_list_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_to_list_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.closure_to_list_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.collapse_hide_unused_toggle`

Toggle collapsed nodes and hide unused sockets

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1123 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1123>`__

### function `bpy.ops.node.combine_bundle_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.combine_bundle_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.combine_bundle_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.connect_to_output`

Connect active node to the active output node of the node tree

:param run_in_geometry_nodes: Run in Geometry Nodes Editor, (optional)
:type run_in_geometry_nodes: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/connect_to_output.py\:251 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/connect_to_output.py#L251>`__

### function `bpy.ops.node.cryptomatte_layer_add`

Add a new input layer to a Cryptomatte node

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.cryptomatte_layer_remove`

Remove layer from a Cryptomatte node

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.deactivate_viewer`

Deactivate selected viewer node in geometry nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.default_group_width_set`

Set the width based on the parent group node in the current context

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.delete`

Remove selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.delete_copy_reconnect`

Copy nodes to clipboard, remove and reconnect them.

:param NODE_OT_clipboard_copy: Copy to Clipboard, Copy the selected nodes to the internal clipboard (optional, :func:`bpy.ops.node.clipboard_copy` keyword arguments)
:type NODE_OT_clipboard_copy: dict[str, Any]
:param NODE_OT_delete_reconnect: Delete with Reconnect, Remove nodes and reconnect nodes as if deletion was muted (optional, :func:`bpy.ops.node.delete_reconnect` keyword arguments)
:type NODE_OT_delete_reconnect: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.delete_reconnect`

Remove nodes and reconnect nodes as if deletion was muted

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.detach`

Detach selected nodes from parents

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.detach_translate_attach`

Detach nodes, move and attach to frame

:param NODE_OT_detach: Detach Nodes, Detach selected nodes from parents (optional, :func:`bpy.ops.node.detach` keyword arguments)
:type NODE_OT_detach: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:param NODE_OT_attach: Attach Nodes, Attach active node to a frame (optional, :func:`bpy.ops.node.attach` keyword arguments)
:type NODE_OT_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.duplicate`

Duplicate selected nodes

:param keep_inputs: Keep Inputs, Keep the input links to duplicated nodes (optional)
:type keep_inputs: bool
:param linked: Linked, Duplicate node but not node trees, linking to the original data (optional)
:type linked: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.duplicate_compositing_modifier_node_group`

Duplicate the currently assigned compositing node group.

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.duplicate_compositing_node_group`

Duplicate the currently assigned compositing node group.

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.duplicate_move`

Duplicate selected nodes and move them

:param NODE_OT_duplicate: Duplicate Nodes, Duplicate selected nodes (optional, :func:`bpy.ops.node.duplicate` keyword arguments)
:type NODE_OT_duplicate: dict[str, Any]
:param NODE_OT_translate_attach: Move and Attach, Move nodes and attach to frame (optional, :func:`bpy.ops.node.translate_attach` keyword arguments)
:type NODE_OT_translate_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.duplicate_move_keep_inputs`

Duplicate selected nodes keeping input links and move them

:param NODE_OT_duplicate: Duplicate Nodes, Duplicate selected nodes (optional, :func:`bpy.ops.node.duplicate` keyword arguments)
:type NODE_OT_duplicate: dict[str, Any]
:param NODE_OT_translate_attach: Move and Attach, Move nodes and attach to frame (optional, :func:`bpy.ops.node.translate_attach` keyword arguments)
:type NODE_OT_translate_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.duplicate_move_linked`

Duplicate selected nodes, but not their node trees, and move them

:param NODE_OT_duplicate: Duplicate Nodes, Duplicate selected nodes (optional, :func:`bpy.ops.node.duplicate` keyword arguments)
:type NODE_OT_duplicate: dict[str, Any]
:param NODE_OT_translate_attach: Move and Attach, Move nodes and attach to frame (optional, :func:`bpy.ops.node.translate_attach` keyword arguments)
:type NODE_OT_translate_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.enum_definition_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.enum_definition_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.enum_definition_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.evaluate_closure_input_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.evaluate_closure_input_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.evaluate_closure_input_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.evaluate_closure_output_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.evaluate_closure_output_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.evaluate_closure_output_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.field_to_grid_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.field_to_grid_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.field_to_grid_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.field_to_list_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.field_to_list_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.field_to_list_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.file_output_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.file_output_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.file_output_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.find_node`

Search for a node by name and focus and select it

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_generation_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_generation_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_generation_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_input_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_input_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_input_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_main_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_main_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.foreach_geometry_element_zone_main_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.format_string_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.format_string_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.format_string_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.geometry_nodes_viewer_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.geometry_nodes_viewer_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.geometry_nodes_viewer_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.gltf_settings_node_operator`

Add a node to the active tree for glTF export

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `addons_core/io_scene_gltf2/blender/com/gltf2_blender_ui.py\:34 <https://projects.blender.org/blender/blender/src/branch/main/scripts/addons_core/io_scene_gltf2/blender/com/gltf2_blender_ui.py#L34>`__

### function `bpy.ops.node.group_edit`

Edit node group

:param exit: Exit, (optional)
:type exit: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.group_enter_exit`

Enter or exit node group based on cursor location

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.group_insert`

Insert selected nodes into a node group

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.group_make`

Make group from selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.group_separate`

Separate selected nodes from the node group

:param type: Type, (optional)

- ``COPY``
  Copy -- Copy to parent node tree, keep group intact.
- ``MOVE``
  Move -- Move to parent node tree, remove from group.
:type type: Literal['COPY', 'MOVE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.group_ungroup`

Ungroup selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.hide_socket_toggle`

Toggle unused node socket display

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.hide_toggle`

Toggle collapsing of selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.index_switch_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.index_switch_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.index_switch_item_remove`

Remove active item

:param index: Index, Index to remove (in [0, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.insert_offset`

Automatically offset nodes on insertion

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.interface_item_duplicate`

Add a copy of the active item to the interface

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1312 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1312>`__

### function `bpy.ops.node.interface_item_make_panel_toggle`

Make the active boolean socket a toggle for its parent panel

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1391 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1391>`__

### function `bpy.ops.node.interface_item_new`

Add a new item to the interface

:param item_type: Item Type, Type of the item to create (optional)
:type item_type: Literal['INPUT', 'OUTPUT', 'PANEL']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1215 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1215>`__

### function `bpy.ops.node.interface_item_new_panel_toggle`

Add a checkbox to the currently selected panel

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1280 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1280>`__

### function `bpy.ops.node.interface_item_remove`

Remove selected items from the interface

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1331 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1331>`__

### function `bpy.ops.node.interface_item_unlink_panel_toggle`

Make the panel toggle a stand-alone socket

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1437 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1437>`__

### function `bpy.ops.node.join`

Attach selected nodes to a new common frame

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.join_named`

Create a new frame node around the selected nodes and name it immediately

:param NODE_OT_join: Join Nodes in Frame, Attach selected nodes to a new common frame (optional, :func:`bpy.ops.node.join` keyword arguments)
:type NODE_OT_join: dict[str, Any]
:param WM_OT_call_panel: Call Panel, Open a predefined panel (optional, :func:`bpy.ops.wm.call_panel` keyword arguments)
:type WM_OT_call_panel: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.join_nodes`

Merge selected group input nodes into one if possible

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.link`

Use the mouse to create a link between two nodes

:param detach: Detach, Detach and redirect existing links (optional)
:type detach: bool
:param drag_start: Drag Start, The position of the mouse cursor at the start of the operation (array of 2 items, in [-6, 6], optional)
:type drag_start: Sequence[float]
:param inside_padding: Inside Padding, Inside distance in UI units from the edge of the region within which to start panning (in [0, 100], optional)
:type inside_padding: float
:param outside_padding: Outside Padding, Outside distance in UI units from the edge of the region at which to stop panning (in [0, 100], optional)
:type outside_padding: float
:param speed_ramp: Speed Ramp, Width of the zone in UI units where speed increases with distance from the edge (in [0, 100], optional)
:type speed_ramp: float
:param max_speed: Max Speed, Maximum speed in UI units per second (in [0, 10000], optional)
:type max_speed: float
:param delay: Delay, Delay in seconds before maximum speed is reached (in [0, 10], optional)
:type delay: float
:param zoom_influence: Zoom Influence, Influence of the zoom factor on scroll speed (in [0, 1], optional)
:type zoom_influence: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.link_drag_operation_test`

Run a node link-drag operation for testing

:param find_link_operations: Find Link Operations, Write link operation names for the context socket the "link_operation_names" property of the node tree (optional)
:type find_link_operations: bool
:param link_operation_index: Link Operation Index, Link operation to execute on the context socket (in [-1, inf], optional)
:type link_operation_index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.link_make`

Make a link between selected output and input sockets

:param replace: Replace, Replace socket connections with the new links (optional)
:type replace: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.link_viewer`

Link to viewer node

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.links_cut`

Use the mouse to cut (remove) some links

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param cursor: Cursor, (in [0, inf], optional)
:type cursor: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.links_detach`

Remove all links to selected nodes, and try to connect neighbor nodes together

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.links_mute`

Use the mouse to mute links

:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param cursor: Cursor, (in [0, inf], optional)
:type cursor: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.move_detach_links`

Move a node to detach links

:param NODE_OT_links_detach: Detach Links, Remove all links to selected nodes, and try to connect neighbor nodes together (optional, :func:`bpy.ops.node.links_detach` keyword arguments)
:type NODE_OT_links_detach: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.move_detach_links_release`

Move a node to detach links

:param NODE_OT_links_detach: Detach Links, Remove all links to selected nodes, and try to connect neighbor nodes together (optional, :func:`bpy.ops.node.links_detach` keyword arguments)
:type NODE_OT_links_detach: dict[str, Any]
:param NODE_OT_translate_attach: Move and Attach, Move nodes and attach to frame (optional, :func:`bpy.ops.node.translate_attach` keyword arguments)
:type NODE_OT_translate_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.mute_toggle`

Toggle muting of selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.new_compositing_node_group`

Create a new compositing node group and initialize it with default nodes

:param name: Name, (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.new_compositor_sequencer_node_group`

Create a new compositor node group for sequencer

:param name: Name, (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.new_geometry_node_group_assign`

Create a new geometry node group and assign it to the active modifier

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/geometry_nodes.py\:325 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/geometry_nodes.py#L325>`__

### function `bpy.ops.node.new_geometry_node_group_tool`

Create a new geometry node group for a tool

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/geometry_nodes.py\:351 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/geometry_nodes.py#L351>`__

### function `bpy.ops.node.new_geometry_nodes_modifier`

Create a new modifier with a new geometry node group

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/geometry_nodes.py\:299 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/geometry_nodes.py#L299>`__

### function `bpy.ops.node.new_node_tree`

Create a new node tree

:param type: Tree Type, (optional)
:type type: str
:param name: Name, (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.node_color_preset_add`

Add or remove a Node Color Preset

:param name: Name, Name of the preset, used to make the path name (optional, never None)
:type name: str
:param remove_name: remove_name, (optional)
:type remove_name: bool
:param remove_active: remove_active, (optional)
:type remove_active: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/presets.py\:119 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/presets.py#L119>`__

### function `bpy.ops.node.node_copy_color`

Copy color to all selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.options_toggle`

Toggle option buttons display for selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.parent_set`

Attach selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.preview_toggle`

Toggle preview display for selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.read_viewlayers`

Read all render layers of all used scenes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.render_changed`

Render current scene, when input node's layer has been changed

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.repeat_zone_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.repeat_zone_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.repeat_zone_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.resize`

Resize a node

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.sample_attribute_items_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.sample_attribute_items_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.sample_attribute_items_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select`

Select the node under the cursor

:param extend: Extend, Extend selection instead of deselecting everything first (optional)
:type extend: bool
:param deselect: Deselect, Remove from selection (optional)
:type deselect: bool
:param toggle: Toggle Selection, Toggle the selection (optional)
:type toggle: bool
:param deselect_all: Deselect On Nothing, Deselect all when nothing under the cursor (optional)
:type deselect_all: bool
:param select_passthrough: Only Select Unselected, Ignore the select action when the element is already selected (optional)
:type select_passthrough: bool
:param location: Location, Mouse location (array of 2 items, in [-inf, inf], optional)
:type location: Sequence[int]
:param socket_select: Socket Select, (optional)
:type socket_select: bool
:param clear_viewer: Clear Viewer, Deactivate geometry nodes viewer when clicking in empty space (optional)
:type clear_viewer: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_all`

(De)select all nodes

:param action: Action, Selection action to execute (optional)

- ``TOGGLE``
  Toggle -- Toggle selection for all elements.
- ``SELECT``
  Select -- Select all elements.
- ``DESELECT``
  Deselect -- Deselect all elements.
- ``INVERT``
  Invert -- Invert selection of all elements.
:type action: Literal['TOGGLE', 'SELECT', 'DESELECT', 'INVERT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_box`

Use box selection to select nodes

:param tweak: Tweak, Only activate when mouse is not over a node (useful for tweak gesture) (optional)
:type tweak: bool
:param xmin: X Min, (in [-inf, inf], optional)
:type xmin: int
:param xmax: X Max, (in [-inf, inf], optional)
:type xmax: int
:param ymin: Y Min, (in [-inf, inf], optional)
:type ymin: int
:param ymax: Y Max, (in [-inf, inf], optional)
:type ymax: int
:param wait_for_input: Wait for Input, (optional)
:type wait_for_input: bool
:param mode: Mode, (optional)

- ``SET``
  Set -- Set a new selection.
- ``ADD``
  Extend -- Extend existing selection.
- ``SUB``
  Subtract -- Subtract existing selection.
:type mode: Literal['SET', 'ADD', 'SUB']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_circle`

Use circle selection to select nodes

:param x: X, (in [-inf, inf], optional)
:type x: int
:param y: Y, (in [-inf, inf], optional)
:type y: int
:param radius: Radius, (in [1, inf], optional)
:type radius: int
:param wait_for_input: Wait for Input, (optional)
:type wait_for_input: bool
:param mode: Mode, (optional)

- ``SET``
  Set -- Set a new selection.
- ``ADD``
  Extend -- Extend existing selection.
- ``SUB``
  Subtract -- Subtract existing selection.
:type mode: Literal['SET', 'ADD', 'SUB']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_grouped`

Select nodes with similar properties

:param extend: Extend, Extend selection instead of deselecting everything first (optional)
:type extend: bool
:param type: Type, (optional)
:type type: Literal['TYPE', 'COLOR', 'PREFIX', 'SUFFIX']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_lasso`

Select nodes using lasso selection

:param tweak: Tweak, Only activate when mouse is not over a node (useful for tweak gesture) (optional)
:type tweak: bool
:param path: Path, (optional)
:type path: :class:`bpy_prop_collection`\ [:class:`OperatorMousePath`] | None
:param use_smooth_stroke: Stabilize Stroke, Selection lags behind mouse and follows a smoother path (optional)
:type use_smooth_stroke: bool
:param smooth_stroke_factor: Smooth Stroke Factor, Higher values give a smoother stroke (in [0.5, 0.99], optional)
:type smooth_stroke_factor: float
:param smooth_stroke_radius: Smooth Stroke Radius, Minimum distance from last point before selection continues (in [10, 200], optional)
:type smooth_stroke_radius: int
:param mode: Mode, (optional)

- ``SET``
  Set -- Set a new selection.
- ``ADD``
  Extend -- Extend existing selection.
- ``SUB``
  Subtract -- Subtract existing selection.
:type mode: Literal['SET', 'ADD', 'SUB']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_link_viewer`

Select node and link it to a viewer node

:param NODE_OT_select: Select, Select the node under the cursor (optional, :func:`bpy.ops.node.select` keyword arguments)
:type NODE_OT_select: dict[str, Any]
:param NODE_OT_link_viewer: Link to Viewer Node, Link to viewer node (optional, :func:`bpy.ops.node.link_viewer` keyword arguments)
:type NODE_OT_link_viewer: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_linked_from`

Select nodes linked from the selected ones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_linked_to`

Select nodes linked to the selected ones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.select_same_type_step`

Activate and view same node type, step by step

:param prev: Previous, (optional)
:type prev: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.separate_bundle_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.separate_bundle_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.separate_bundle_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.shader_script_update`

Update shader script node with new sockets and options from the script

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.simulation_zone_item_add`

Add item below active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:param show_dialog: Show Dialog, Show a dialog to edit the initial properties (optional)
:type show_dialog: bool
:param init_from_active: Init from Active, Instead of using the provided name or type, copy the state of the active item (optional)
:type init_from_active: bool
:param socket_type: Socket Type, Type of the new socket item (optional)
:type socket_type: Literal[:ref:`rna_enum_node_socket_data_type_items`]
:param item_name: Item Name, Name of the new socket item (optional, never None)
:type item_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.simulation_zone_item_move`

Move active item

:param direction: Direction, Move direction (optional)
:type direction: Literal['UP', 'DOWN']
:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.simulation_zone_item_remove`

Remove active item

:param node_identifier: Node Identifier, Optional identifier of the node to operate on (in [0, inf], optional)
:type node_identifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.sockets_sync`

Update sockets to match what is actually used

:param node_name: Node Name, (optional, never None)
:type node_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.swap_empty_group`

Replace active node with an empty group

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:766 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L766>`__

### function `bpy.ops.node.swap_group_asset`

Swap selected nodes with the specified node group asset

:param asset_library_type: Asset Library Type, (optional)
:type asset_library_type: Literal[:ref:`rna_enum_asset_library_type_items`]
:param asset_library_identifier: Asset Library Identifier, (optional, never None)
:type asset_library_identifier: str
:param relative_asset_identifier: Relative Asset Identifier, (optional, never None)
:type relative_asset_identifier: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.swap_node`

Replace the selected nodes with the specified type

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param type: Node Type, Node type (optional, never None)
:type type: str
:param visible_output: Output Name, If provided, all outputs that are named differently will be hidden (optional, never None)
:type visible_output: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:645 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L645>`__

### function `bpy.ops.node.swap_typed_bundle`

Swap existing node with a Combine Bundle node with a type input

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:811 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L811>`__

### function `bpy.ops.node.swap_zone`

Undocumented, consider `contributing <https://developer.blender.org/>`__.

:param settings: Settings, Settings to be applied on the newly created node (optional)
:type settings: :class:`bpy_prop_collection`\ [:class:`NodeSetting`] | None
:param offset: Offset, Offset of nodes from the cursor when added (array of 2 items, in [-inf, inf], optional)
:type offset: Sequence[float]
:param input_node_type: Input Node, Specifies the input node used by the created zone (optional, never None)
:type input_node_type: str
:param output_node_type: Output Node, Specifies the output node used by the created zone (optional, never None)
:type output_node_type: str
:param add_default_geometry_link: Add Geometry Link, When enabled, create a link between geometry sockets in this zone (optional)
:type add_default_geometry_link: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:975 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L975>`__

### function `bpy.ops.node.test_inlining_shader_nodes`

Create a new inlined shader node tree as is consumed by renderers

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.toggle_viewer`

Toggle selected viewer node in compositor and geometry nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.translate_attach`

Move nodes and attach to frame

:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:param NODE_OT_attach: Attach Nodes, Attach active node to a frame (optional, :func:`bpy.ops.node.attach` keyword arguments)
:type NODE_OT_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.translate_attach_remove_on_cancel`

Move nodes and attach to frame

:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:param NODE_OT_attach: Attach Nodes, Attach active node to a frame (optional, :func:`bpy.ops.node.attach` keyword arguments)
:type NODE_OT_attach: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.tree_path_parent`

Go to parent node tree

:param parent_tree_index: Parent Index, Parent index in context path (in [-inf, inf], optional)
:type parent_tree_index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1159 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1159>`__

### function `bpy.ops.node.view_all`

Resize view so you can see all nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.view_selected`

Resize view so you can see selected nodes

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.viewer_border`

Set the boundaries for viewer operations (Not implemented)

:param xmin: X Min, (in [-inf, inf], optional)
:type xmin: int
:param xmax: X Max, (in [-inf, inf], optional)
:type xmax: int
:param ymin: Y Min, (in [-inf, inf], optional)
:type ymin: int
:param ymax: Y Max, (in [-inf, inf], optional)
:type ymax: int
:param wait_for_input: Wait for Input, (optional)
:type wait_for_input: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.node.viewer_shortcut_get`

Toggle a specific viewer node using 1,2,..,9 keys

:param viewer_index: Viewer Index, Index corresponding to the shortcut, e.g. number key 1 corresponds to index 1 etc.. (in [-inf, inf], optional)
:type viewer_index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1551 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1551>`__

### function `bpy.ops.node.viewer_shortcut_set`

Create a viewer shortcut for the selected node by pressing ctrl+1,2,..9

:param viewer_index: Viewer Index, Index corresponding to the shortcut, e.g. number key 1 corresponds to index 1 etc.. (in [-inf, inf], optional)
:type viewer_index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/node.py\:1491 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/node.py#L1491>`__
