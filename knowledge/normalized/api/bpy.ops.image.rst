<!-- source: api/bpy.ops.image.rst -->

### function `bpy.ops.image.add_render_slot`

Add a new render slot

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.change_frame`

Interactively change the current frame number

:param frame: Frame, (in [-1048574, 1048574], optional)
:type frame: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.clear_render_border`

Clear the boundaries of the render region and disable render region

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.clear_render_slot`

Clear the currently selected render slot

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.clipboard_copy`

Copy the image to the clipboard

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.clipboard_paste`

Paste new image from the clipboard

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.convert_to_mesh_plane`

Convert selected reference images to textured mesh plane

:param interpolation: Interpolation, Texture interpolation (optional)

- ``Linear``
  Linear -- Linear interpolation.
- ``Closest``
  Closest -- No interpolation (sample closest texel).
- ``Cubic``
  Cubic -- Cubic interpolation.
- ``Smart``
  Smart -- Bicubic when magnifying, else bilinear (OSL only).
:type interpolation: Literal['Linear', 'Closest', 'Cubic', 'Smart']
:param extension: Extension, How the image is extrapolated past its original bounds (optional)

- ``CLIP``
  Clip -- Clip to image size and set exterior pixels as transparent.
- ``EXTEND``
  Extend -- Extend by repeating edge pixels of the image.
- ``REPEAT``
  Repeat -- Cause the image to repeat horizontally and vertically.
:type extension: Literal['CLIP', 'EXTEND', 'REPEAT']
:param use_auto_refresh: Auto Refresh, Always refresh image on frame changes (optional)
:type use_auto_refresh: bool
:param relative: Relative Paths, Use relative file paths (optional)
:type relative: bool
:param shader: Shader, Node shader to use (optional)

- ``PRINCIPLED``
  Principled -- Principled shader.
- ``SHADELESS``
  Shadeless -- Only visible to camera and reflections.
- ``EMISSION``
  Emission -- Emission shader.
:type shader: Literal['PRINCIPLED', 'SHADELESS', 'EMISSION']
:param emit_strength: Emission Strength, Strength of emission (in [0, inf], optional)
:type emit_strength: float
:param use_transparency: Use Alpha, Use alpha channel for transparency (optional)
:type use_transparency: bool
:param render_method: Render Method, (optional)

- ``DITHERED``
  Dithered -- Allows for grayscale hashed transparency, and compatible with render passes and ray-tracing. Also known as deferred rendering..
- ``BLENDED``
  Blended -- Allows for colored transparency, but incompatible with render passes and ray-tracing. Also known as forward rendering..
:type render_method: Literal['DITHERED', 'BLENDED']
:param use_backface_culling: Backface Culling, Use backface culling to hide the back side of faces (optional)
:type use_backface_culling: bool
:param show_transparent_back: Show Backface, Render multiple transparent layers (may introduce transparency sorting problems) (optional)
:type show_transparent_back: bool
:param overwrite_material: Overwrite Material, Overwrite existing material with the same name (optional)
:type overwrite_material: bool
:param name_from: Name After, Name for new mesh object and material (optional)

- ``OBJECT``
  Source Object -- Name after object source with a suffix.
- ``IMAGE``
  Source Image -- Name from loaded image.
:type name_from: Literal['OBJECT', 'IMAGE']
:param delete_ref: Delete Reference Object, Delete empty image object once mesh plane is created (optional)
:type delete_ref: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/image_as_planes.py\:1133 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/image_as_planes.py#L1133>`__

### function `bpy.ops.image.curves_point_set`

Set black point or white point for curves

:param point: Point, Set black point or white point for curves (optional)
:type point: Literal['BLACK_POINT', 'WHITE_POINT']
:param size: Sample Size, (in [1, 128], optional)
:type size: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.cycle_render_slot`

Cycle through all non-void render slots

:param reverse: Cycle in Reverse, (optional)
:type reverse: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.external_edit`

Edit image in an external application

:param filepath: filepath, (optional, never None)
:type filepath: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/image.py\:54 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/image.py#L54>`__

### function `bpy.ops.image.file_browse`

Open an image file browser, hold Shift to open the file, Alt to browse containing directory

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
:type sort_method: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.flip`

Flip the image

:param use_flip_x: Horizontal, Flip the image horizontally (optional)
:type use_flip_x: bool
:param use_flip_y: Vertical, Flip the image vertically (optional)
:type use_flip_y: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.import_as_mesh_planes`

Create mesh plane(s) from image files with the appropriate aspect ratio

:param interpolation: Interpolation, Texture interpolation (optional)

- ``Linear``
  Linear -- Linear interpolation.
- ``Closest``
  Closest -- No interpolation (sample closest texel).
- ``Cubic``
  Cubic -- Cubic interpolation.
- ``Smart``
  Smart -- Bicubic when magnifying, else bilinear (OSL only).
:type interpolation: Literal['Linear', 'Closest', 'Cubic', 'Smart']
:param extension: Extension, How the image is extrapolated past its original bounds (optional)

- ``CLIP``
  Clip -- Clip to image size and set exterior pixels as transparent.
- ``EXTEND``
  Extend -- Extend by repeating edge pixels of the image.
- ``REPEAT``
  Repeat -- Cause the image to repeat horizontally and vertically.
:type extension: Literal['CLIP', 'EXTEND', 'REPEAT']
:param use_auto_refresh: Auto Refresh, Always refresh image on frame changes (optional)
:type use_auto_refresh: bool
:param relative: Relative Paths, Use relative file paths (optional)
:type relative: bool
:param shader: Shader, Node shader to use (optional)

- ``PRINCIPLED``
  Principled -- Principled shader.
- ``SHADELESS``
  Shadeless -- Only visible to camera and reflections.
- ``EMISSION``
  Emission -- Emission shader.
:type shader: Literal['PRINCIPLED', 'SHADELESS', 'EMISSION']
:param emit_strength: Emission Strength, Strength of emission (in [0, inf], optional)
:type emit_strength: float
:param use_transparency: Use Alpha, Use alpha channel for transparency (optional)
:type use_transparency: bool
:param render_method: Render Method, (optional)

- ``DITHERED``
  Dithered -- Allows for grayscale hashed transparency, and compatible with render passes and ray-tracing. Also known as deferred rendering..
- ``BLENDED``
  Blended -- Allows for colored transparency, but incompatible with render passes and ray-tracing. Also known as forward rendering..
:type render_method: Literal['DITHERED', 'BLENDED']
:param use_backface_culling: Backface Culling, Use backface culling to hide the back side of faces (optional)
:type use_backface_culling: bool
:param show_transparent_back: Show Backface, Render multiple transparent layers (may introduce transparency sorting problems) (optional)
:type show_transparent_back: bool
:param overwrite_material: Overwrite Material, Overwrite existing material with the same name (optional)
:type overwrite_material: bool
:param filepath: File Path, Filepath used for importing the file (optional, never None)
:type filepath: str
:param align: Align, (optional)

- ``WORLD``
  World -- Align the new object to the world.
- ``VIEW``
  View -- Align the new object to the view.
- ``CURSOR``
  3D Cursor -- Use the 3D cursor orientation for the new object.
:type align: Literal['WORLD', 'VIEW', 'CURSOR']
:param location: Location, (array of 3 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:param rotation: Rotation, (array of 3 items, in [-inf, inf], optional)
:type rotation: :class:`mathutils.Euler` | Sequence[float]
:param files: files, (optional)
:type files: :class:`bpy_prop_collection`\ [:class:`OperatorFileListElement`] | None
:param directory: directory, (optional, never None)
:type directory: str
:param filter_image: filter_image, (optional)
:type filter_image: bool
:param filter_movie: filter_movie, (optional)
:type filter_movie: bool
:param filter_folder: filter_folder, (optional)
:type filter_folder: bool
:param force_reload: Force Reload, Force reload the image if it is already opened elsewhere in Blender (optional)
:type force_reload: bool
:param image_sequence: Detect Image Sequences, Import sequentially numbered images as an animated image sequence instead of separate planes (optional)
:type image_sequence: bool
:param offset: Offset Planes, Offset planes from each other. If disabled, multiple planes will be created at the same location (optional)
:type offset: bool
:param offset_axis: Offset Direction, How planes are oriented relative to each others' local axis (optional)

- ``+X``
  +X -- Side by Side to the Left.
- ``+Y``
  +Y -- Side by Side, Downward.
- ``+Z``
  +Z -- Stacked Above.
- ``-X``
  -X -- Side by Side to the Right.
- ``-Y``
  -Y -- Side by Side, Upward.
- ``-Z``
  -Z -- Stacked Below.
:type offset_axis: Literal['+X', '+Y', '+Z', '-X', '-Y', '-Z']
:param offset_amount: Offset Distance, Set distance between each plane (in [-inf, inf], optional)
:type offset_amount: float
:param align_axis: Align, How to align the planes (optional)

- ``+X``
  +X -- Facing positive X.
- ``+Y``
  +Y -- Facing positive Y.
- ``+Z``
  +Z -- Facing positive Z.
- ``-X``
  -X -- Facing negative X.
- ``-Y``
  -Y -- Facing negative Y.
- ``-Z``
  -Z -- Facing negative Z.
- ``CAM``
  Face Camera -- Facing camera.
- ``CAM_AX``
  Camera's Main Axis -- Facing the camera's dominant axis.
:type align_axis: Literal['+X', '+Y', '+Z', '-X', '-Y', '-Z', 'CAM', 'CAM_AX']
:param prev_align_axis: prev_align_axis, (optional)

- ``+X``
  +X -- Facing positive X.
- ``+Y``
  +Y -- Facing positive Y.
- ``+Z``
  +Z -- Facing positive Z.
- ``-X``
  -X -- Facing negative X.
- ``-Y``
  -Y -- Facing negative Y.
- ``-Z``
  -Z -- Facing negative Z.
- ``CAM``
  Face Camera -- Facing camera.
- ``CAM_AX``
  Camera's Main Axis -- Facing the camera's dominant axis.
- ``NONE``
  Undocumented.
:type prev_align_axis: Literal['+X', '+Y', '+Z', '-X', '-Y', '-Z', 'CAM', 'CAM_AX', 'NONE']
:param align_track: Track Camera, Add a constraint to make the planes track the camera (optional)
:type align_track: bool
:param size_mode: Size Mode, Method for computing the plane size (optional)

- ``ABSOLUTE``
  Absolute -- Use absolute size.
- ``CAMERA``
  Scale to Camera Frame -- Scale to fit or fill the camera frame.
- ``DPI``
  Pixels per Inch -- Scale based on pixels per inch.
- ``DPBU``
  Pixels per Blender Unit -- Scale based on pixels per Blender Unit.
:type size_mode: Literal['ABSOLUTE', 'CAMERA', 'DPI', 'DPBU']
:param fill_mode: Scale, Method to scale the plane with the camera frame (optional)

- ``FILL``
  Fill -- Fill camera frame, spilling outside the frame.
- ``FIT``
  Fit -- Fit entire image within the camera frame.
:type fill_mode: Literal['FILL', 'FIT']
:param height: Height, Height of the created plane (in [0.001, inf], optional)
:type height: float
:param factor: Definition, Number of pixels per inch or Blender Unit (in [1, inf], optional)
:type factor: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/image_as_planes.py\:857 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/image_as_planes.py#L857>`__

### function `bpy.ops.image.invert`

Invert image's channels

:param invert_r: Red, Invert red channel (optional)
:type invert_r: bool
:param invert_g: Green, Invert green channel (optional)
:type invert_g: bool
:param invert_b: Blue, Invert blue channel (optional)
:type invert_b: bool
:param invert_a: Alpha, Invert alpha channel (optional)
:type invert_a: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.match_movie_length`

Set the image's frame range to match the video's duration

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.new`

Create a new image

:param name: Name, Image data-block name (optional, never None)
:type name: str
:param width: Width, Image width (in [1, inf], optional)
:type width: int
:param height: Height, Image height (in [1, inf], optional)
:type height: int
:param color: Color, Default fill color (array of 4 items, in [0, inf], optional)
:type color: Sequence[float]
:param alpha: Alpha, Create an image with an alpha channel (optional)
:type alpha: bool
:param generated_type: Generated Type, Fill the image with a grid for UV map testing (optional)
:type generated_type: Literal[:ref:`rna_enum_image_generated_type_items`]
:param float: 32-bit Float, Create image with 32-bit floating-point bit depth (optional)
:type float: bool
:param use_stereo_3d: Stereo 3D, Create an image with left and right views (optional)
:type use_stereo_3d: bool
:param tiled: Tiled, Create a tiled image (optional)
:type tiled: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.open`

Open image

:param allow_path_tokens: Allow the path to contain substitution tokens (optional)
:type allow_path_tokens: bool
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
:type sort_method: str
:param use_sequence_detection: Detect Sequences, Automatically detect animated sequences in selected images (based on file names) (optional)
:type use_sequence_detection: bool
:param use_udim_detecting: Detect UDIMs, Detect selected UDIM files and load all matching tiles (optional)
:type use_udim_detecting: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.open_images`

Undocumented, consider `contributing <https://developer.blender.org/>`__.

:param directory: directory, (optional, never None)
:type directory: str
:param files: files, (optional)
:type files: :class:`bpy_prop_collection`\ [:class:`OperatorFileListElement`] | None
:param relative_path: Relative Path, (optional)
:type relative_path: bool
:param use_sequence_detection: Detect Sequence, (optional)
:type use_sequence_detection: bool
:param use_udim_detection: Detect UDIM, (optional)
:type use_udim_detection: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/image.py\:238 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/image.py#L238>`__

### function `bpy.ops.image.pack`

Pack an image as embedded data into the .blend file

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.project_apply`

Project edited image back onto the object

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/image.py\:192 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/image.py#L192>`__

### function `bpy.ops.image.project_edit`

Edit a snapshot of the 3D Viewport in an external image editor

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/image.py\:122 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/image.py#L122>`__

### function `bpy.ops.image.read_viewlayers`

Read all the current scene's view layers from cache, as needed

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.reload`

Reload current image from disk

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.remove_render_slot`

Remove the current render slot

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.render_border`

Set the boundaries of the render region and enable render region

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

### function `bpy.ops.image.replace`

Replace current image by another one from disk

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
:type sort_method: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.resize`

Resize the image

:param size: Size, (array of 2 items, in [1, inf], optional)
:type size: Sequence[int]
:param all_udims: All UDIM Tiles, Scale all the image's UDIM tiles (optional)
:type all_udims: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.rotate_orthogonal`

Rotate the image

:param degrees: Degrees, Amount of rotation in degrees (90, 180, 270) (optional)

- ``90``
  90 Degrees -- Rotate 90 degrees clockwise.
- ``180``
  180 Degrees -- Rotate 180 degrees clockwise.
- ``270``
  270 Degrees -- Rotate 270 degrees clockwise.
:type degrees: Literal['90', '180', '270']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.sample`

Use mouse to sample a color in current image

:param size: Sample Size, (in [1, 128], optional)
:type size: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.sample_line`

Sample a line and show it in Scope panels

:param xstart: X Start, (in [-inf, inf], optional)
:type xstart: int
:param xend: X End, (in [-inf, inf], optional)
:type xend: int
:param ystart: Y Start, (in [-inf, inf], optional)
:type ystart: int
:param yend: Y End, (in [-inf, inf], optional)
:type yend: int
:param flip: Flip, (optional)
:type flip: bool
:param cursor: Cursor, Mouse cursor style to use during the modal operator (in [0, inf], optional)
:type cursor: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.save`

Save the image with current name and settings

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.save_all_modified`

Save all modified images

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.save_as`

Save the image with another name and/or settings

:param save_as_render: Save As Render, Save image with render color management.For display image formats like PNG, apply view and display transform.For intermediate image formats like OpenEXR, use the default render output color space(optional)
:type save_as_render: bool
:param copy: Copy, Create a new image file without modifying the current image in Blender (optional)
:type copy: bool
:param allow_path_tokens: Allow the path to contain substitution tokens (optional)
:type allow_path_tokens: bool
:param filepath: File Path, Path to file (optional, never None)
:type filepath: str
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
:type sort_method: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.save_sequence`

Save a sequence of images

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.tile_add`

Adds a tile to the image

:param number: Number, UDIM number of the tile (in [1001, 2000], optional)
:type number: int
:param count: Count, How many tiles to add (in [1, inf], optional)
:type count: int
:param label: Label, Optional tile label (optional, never None)
:type label: str
:param fill: Fill, Fill new tile with a generated image (optional)
:type fill: bool
:param color: Color, Default fill color (array of 4 items, in [0, inf], optional)
:type color: Sequence[float]
:param generated_type: Generated Type, Fill the image with a grid for UV map testing (optional)
:type generated_type: Literal[:ref:`rna_enum_image_generated_type_items`]
:param width: Width, Image width (in [1, inf], optional)
:type width: int
:param height: Height, Image height (in [1, inf], optional)
:type height: int
:param float: 32-bit Float, Create image with 32-bit floating-point bit depth (optional)
:type float: bool
:param alpha: Alpha, Create an image with an alpha channel (optional)
:type alpha: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.tile_fill`

Fill the current tile with a generated image

:param color: Color, Default fill color (array of 4 items, in [0, inf], optional)
:type color: Sequence[float]
:param generated_type: Generated Type, Fill the image with a grid for UV map testing (optional)
:type generated_type: Literal[:ref:`rna_enum_image_generated_type_items`]
:param width: Width, Image width (in [1, inf], optional)
:type width: int
:param height: Height, Image height (in [1, inf], optional)
:type height: int
:param float: 32-bit Float, Create image with 32-bit floating-point bit depth (optional)
:type float: bool
:param alpha: Alpha, Create an image with an alpha channel (optional)
:type alpha: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.tile_remove`

Removes a tile from the image

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.unpack`

Save an image packed in the .blend file to disk

:param method: Method, How to unpack (optional)
:type method: Literal[:ref:`rna_enum_unpack_method_items`]
:param id: Image Name, Image data-block name to unpack (optional, never None)
:type id: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_all`

View the entire image

:param fit_view: Fit View, Fit frame to the viewport (optional)
:type fit_view: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_center_cursor`

Center the view so that the cursor is in the middle of the view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_cursor_center`

Set 2D cursor to center view location

:param fit_view: Fit View, Fit frame to the viewport (optional)
:type fit_view: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_ndof`

Use a 3D mouse device to pan/zoom the view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_pan`

Pan the view

:param offset: Offset, Offset in floating-point units, 1.0 is the width and height of the image (array of 2 items, in [-inf, inf], optional)
:type offset: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_selected`

View all selected UVs

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_zoom`

Zoom in/out the image

:param factor: Factor, Zoom factor, values higher than 1.0 zoom in, lower values zoom out (in [-inf, inf], optional)
:type factor: float
:param use_cursor_init: Use Mouse Position, Allow the initial mouse position to be used (optional)
:type use_cursor_init: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_zoom_border`

Zoom in the view to the nearest item contained in the border

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
:param zoom_out: Zoom Out, (optional)
:type zoom_out: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_zoom_in`

Zoom in the image (centered around 2D cursor)

:param location: Location, Cursor location in screen coordinates (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_zoom_out`

Zoom out the image (centered around 2D cursor)

:param location: Location, Cursor location in screen coordinates (array of 2 items, in [-inf, inf], optional)
:type location: :class:`mathutils.Vector` | Sequence[float]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.image.view_zoom_ratio`

Set zoom ratio of the view

:param ratio: Ratio, Zoom ratio, 1.0 is 1:1, higher is zoomed in, lower is zoomed out (in [-inf, inf], optional)
:type ratio: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
