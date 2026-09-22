<!-- source: api/bpy.ops.screen.rst -->

### function `bpy.ops.screen.actionzone`

Handle area action zones for mouse actions/gestures

:param modifier: Modifier, Modifier state (in [0, 2], optional)
:type modifier: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.animation_cancel`

Cancel animation, returning to the original frame

:param restore_frame: Restore Frame, Restore the frame when animation was initialized (optional)
:type restore_frame: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.animation_pause`

Pause animation, stopping at the current frame

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.animation_play`

Play animation

:param reverse: Play in Reverse, Animation is played backwards (optional)
:type reverse: bool
:param sync: Sync, Drop frames to maintain framerate (optional)
:type sync: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.animation_step`

Step through animation by position

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_close`

Close selected area

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_dupli`

Duplicate selected area into new window

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_join`

Join selected areas into new window

:param source_xy: Source location, (array of 2 items, in [-inf, inf], optional)
:type source_xy: Sequence[int]
:param target_xy: Target location, (array of 2 items, in [-inf, inf], optional)
:type target_xy: Sequence[int]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_move`

Move selected area edges

:param x: X, (in [-inf, inf], optional)
:type x: int
:param y: Y, (in [-inf, inf], optional)
:type y: int
:param delta: Delta, (in [-inf, inf], optional)
:type delta: int
:param snap: Snapping, Enable snapping (optional)
:type snap: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_options`

Operations for splitting and merging

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_split`

Split selected area into new windows

:param direction: Direction, (optional)
:type direction: Literal['HORIZONTAL', 'VERTICAL']
:param factor: Factor, (in [0, 1], optional)
:type factor: float
:param cursor: Cursor, (array of 2 items, in [-inf, inf], optional)
:type cursor: Sequence[int]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.area_swap`

Swap selected areas screen positions

:param cursor: Cursor, (array of 2 items, in [-inf, inf], optional)
:type cursor: Sequence[int]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.back_to_previous`

Revert back to the original screen layout, before fullscreen area overlay

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.delete`

Delete active screen

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.drivers_editor_show`

Show drivers editor in a separate window

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.edge_merge`

Merge aligned area edges

:param cursor: Cursor, (array of 2 items, in [-inf, inf], optional)
:type cursor: Sequence[int]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.frame_jump`

Jump to first/last frame in frame range

:param end: Last Frame, Jump to the last frame of the frame range (optional)
:type end: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.frame_offset`

Move current frame forward/backward by a given number

:param delta: Delta, (in [-inf, inf], optional)
:type delta: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.header_toggle_menus`

Expand or collapse the header pull-down menus

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.info_log_show`

Show info log in a separate window

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.keyframe_jump`

Jump to previous/next keyframe

:param next: Next Keyframe, (optional)
:type next: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.marker_jump`

Jump to previous/next marker

:param next: Next Marker, (optional)
:type next: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.new`

Add a new screen

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.quadview_size`

Resize Quad View areas

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.redo_last`

Display parameters for last action performed

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.region_blend`

Blend in and out overlapping region

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.region_context_menu`

Display region context menu

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.region_flip`

Toggle the region's alignment (left/right or top/bottom)

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.region_quadview`

Split selected area into camera, front, right, and top views

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.region_scale`

Scale selected area

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.region_toggle`

Hide or unhide the region

:param region_type: Region Type, Type of the region to toggle (optional)
:type region_type: Literal[:ref:`rna_enum_region_type_items`]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.repeat_history`

Display menu for previous actions performed

:param index: Index, (in [0, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.repeat_last`

Repeat last action

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.screen_full_area`

Toggle display selected area as fullscreen/maximized

:param use_hide_panels: Hide Panels, Hide all the panels (Focus Mode) (optional)
:type use_hide_panels: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.screen_set`

Cycle through available screens

:param delta: Delta, (in [-1, 1], optional)
:type delta: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.screenshot`

Capture a picture of the whole Blender window

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

### function `bpy.ops.screen.screenshot_area`

Capture a picture of an editor

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

### function `bpy.ops.screen.space_context_cycle`

Cycle through the editor context by activating the next/previous one

:param direction: Direction, Direction to cycle through (optional)
:type direction: Literal['PREV', 'NEXT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.space_type_set_or_cycle`

Set the space type or cycle subtype

:param space_type: Type, (optional)
:type space_type: Literal[:ref:`rna_enum_space_type_items`]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.spacedata_cleanup`

Remove unused settings for invisible editors

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.time_jump`

Jump forward/backward by a given number of frames or seconds

:param backward: Backwards, Jump backwards in time (optional)
:type backward: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.userpref_show`

Edit user preferences and system settings

:param section: Section to activate in the Preferences (optional)
:type section: Literal[:ref:`rna_enum_preference_section_items`]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.screen.workspace_cycle`

Cycle through workspaces

:param direction: Direction, Direction to cycle through (optional)
:type direction: Literal['PREV', 'NEXT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
