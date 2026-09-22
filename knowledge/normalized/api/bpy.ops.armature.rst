<!-- source: api/bpy.ops.armature.rst -->

### function `bpy.ops.armature.align`

Align selected bones to the active bone (or to their parent)

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.assign_to_collection`

Assign all selected bones to a collection, or unassign them, depending on whether the active bone is already assigned or not

:param collection_index: Collection Index, Index of the collection to assign selected bones to. When the operator should create a new bone collection, use new_collection_name to define the collection name, and set this parameter to the parent index of the new bone collection (in [-1, inf], optional)
:type collection_index: int
:param new_collection_name: Name, Name of a to-be-added bone collection. Only pass this if you want to create a new bone collection and assign the selected bones to it. To assign to an existing collection, do not include this parameter and use collection_index (optional, never None)
:type new_collection_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.autoside_names`

Automatically renames the selected bones according to which side of the target axis they fall on

:param type: Axis, Axis to tag names with (optional)

- ``XAXIS``
  X-Axis -- Left/Right.
- ``YAXIS``
  Y-Axis -- Front/Back.
- ``ZAXIS``
  Z-Axis -- Top/Bottom.
:type type: Literal['XAXIS', 'YAXIS', 'ZAXIS']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.bone_primitive_add`

Add a new bone located at the 3D cursor

:param name: Name, Name of the newly created bone (optional, never None)
:type name: str
:param space: Space, Co-ordinate system the new bone will be created in (optional)

- ``OBJECT``
  Object -- The newly created bone will use Object Space co-ordinate system.
- ``WORLD``
  World -- The newly created bone will use World Space co-ordinate system.
:type space: Literal['OBJECT', 'WORLD']
:param align: Align, Initial orientation of the new bone (optional)

- ``UP``
  Up -- Make the bone visually point upwards so the long axis is aligned with the World/Object positive Z axis (depending on the choice above).
- ``AXES``
  Axes -- Align the new bone to match the axes of the World/Object (depending on the choice above).
- ``3D_CURSOR``
  3D Cursor -- Align new bone to match the axes of the 3D cursor.
- ``3D_VIEW``
  Viewport -- Align new bone to match the axes of the 3D viewport.
:type align: Literal['UP', 'AXES', '3D_CURSOR', '3D_VIEW']
:param length: Length, Length of the new bone (in [0.001, inf], optional)
:type length: float
:param use_deform: Deform, Enable bone to deform geometry (optional)
:type use_deform: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.calculate_roll`

Automatically fix alignment of select bones' axes

:param type: Type, (optional)
:type type: Literal['POS_X', 'POS_Z', 'GLOBAL_POS_X', 'GLOBAL_POS_Y', 'GLOBAL_POS_Z', 'NEG_X', 'NEG_Z', 'GLOBAL_NEG_X', 'GLOBAL_NEG_Y', 'GLOBAL_NEG_Z', 'ACTIVE', 'VIEW', 'CURSOR']
:param axis_flip: Flip Axis, Negate the alignment axis (optional)
:type axis_flip: bool
:param axis_only: Shortest Rotation, Ignore the axis direction, use the shortest rotation to align (optional)
:type axis_only: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.click_extrude`

Create a new bone going from the last selected joint to the mouse position

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_add`

Add a new bone collection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_assign`

Add selected bones to the chosen bone collection

:param name: Bone Collection, Name of the bone collection to assign this bone to; empty to assign to the active bone collection (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_create_and_assign`

Create a new bone collection and assign all selected bones

:param name: Bone Collection, Name of the bone collection to create (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_deselect`

Deselect bones of active Bone Collection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_move`

Change position of active Bone Collection in list of Bone collections

:param direction: Direction, Direction to move the active Bone Collection towards (optional)
:type direction: Literal['UP', 'DOWN']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_remove`

Remove the active bone collection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_remove_unused`

Remove all bone collections that have neither bones nor children. This is done recursively, so bone collections that only have unused children are also removed

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/anim.py\:619 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/anim.py#L619>`__

### function `bpy.ops.armature.collection_select`

Select bones in active Bone Collection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_show_all`

Show all bone collections

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/anim.py\:574 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/anim.py#L574>`__

### function `bpy.ops.armature.collection_unassign`

Remove selected bones from the active bone collection

:param name: Bone Collection, Name of the bone collection to unassign this bone from; empty to unassign from the active bone collection (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_unassign_named`

Unassign the named bone from this bone collection

:param name: Bone Collection, Name of the bone collection to unassign this bone from; empty to unassign from the active bone collection (optional, never None)
:type name: str
:param bone_name: Bone Name, Name of the bone to unassign from the collection; empty to use the active bone (optional, never None)
:type bone_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.collection_unsolo_all`

Clear the 'solo' setting on all bone collections

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/anim.py\:597 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/anim.py#L597>`__

### function `bpy.ops.armature.copy_bone_color_to_selected`

Copy the bone color of the active bone to all selected bones

:param bone_type: Type, (optional)

- ``EDIT``
  Bone -- Copy Bone colors from the active bone to all selected bones.
- ``POSE``
  Pose Bone -- Copy Pose Bone colors from the active pose bone to all selected pose bones.
:type bone_type: Literal['EDIT', 'POSE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/anim.py\:493 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/anim.py#L493>`__

### function `bpy.ops.armature.delete`

Remove selected bones from the armature

:param confirm: Confirm, Prompt for confirmation (optional)
:type confirm: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.dissolve`

Dissolve selected bones from the armature

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.duplicate`

Make copies of the selected bones within the same armature

:param do_flip_names: Flip Names, Try to flip names of the bones, if possible, instead of adding a number extension (optional)
:type do_flip_names: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.duplicate_move`

Make copies of the selected bones within the same armature and move them

:param ARMATURE_OT_duplicate: Duplicate Selected Bone(s), Make copies of the selected bones within the same armature (optional, :func:`bpy.ops.armature.duplicate` keyword arguments)
:type ARMATURE_OT_duplicate: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.duplicate_rename`

Make copies of the selected bones within the same armature and replace a part of their name

:param do_flip_names: Flip Names, Try to flip names of the bones, if possible, instead of adding a number extension (optional)
:type do_flip_names: bool
:param search: Search, A part of the current bone name that will be replaced (optional, never None)
:type search: str
:param replace: Replace, The substitute to be inserted into the place of the given search term. If left empty the search term will be removed (optional, never None)
:type replace: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.extrude`

Create new bones from the selected joints

:param forked: Forked, (optional)
:type forked: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.extrude_forked`

Create new bones from the selected joints and move them

:param ARMATURE_OT_extrude: Extrude, Create new bones from the selected joints (optional, :func:`bpy.ops.armature.extrude` keyword arguments)
:type ARMATURE_OT_extrude: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.extrude_move`

Create new bones from the selected joints and move them

:param ARMATURE_OT_extrude: Extrude, Create new bones from the selected joints (optional, :func:`bpy.ops.armature.extrude` keyword arguments)
:type ARMATURE_OT_extrude: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.fill`

Add bone between selected joint(s) and/or 3D cursor

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.flip_names`

Flips (and corrects) the axis suffixes of the names of selected bones

:param do_strip_numbers: Strip Numbers, Try to remove right-most dot-number from flipped names.Warning: May result in incoherent naming in some cases(optional)
:type do_strip_numbers: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.hide`

Tag selected bones to not be visible in Edit Mode

:param unselected: Unselected, Hide unselected rather than selected (optional)
:type unselected: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.move_to_collection`

Move bones to a collection

:param collection_index: Collection Index, Index of the collection to move selected bones to. When the operator should create a new bone collection, do not include this parameter and pass new_collection_name (in [-1, inf], optional)
:type collection_index: int
:param new_collection_name: Name, Name of a to-be-added bone collection. Only pass this if you want to create a new bone collection and move the selected bones to it. To move to an existing collection, do not include this parameter and use collection_index (optional, never None)
:type new_collection_name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.parent_clear`

Remove the parent-child relationship between selected bones and their parents

:param type: Clear Type, What way to clear parenting (optional)
:type type: Literal['CLEAR', 'DISCONNECT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.parent_set`

Set the active bone as the parent of the selected bones

:param type: Parent Type, Type of parenting (optional)
:type type: Literal['CONNECTED', 'OFFSET']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.reveal`

Reveal all bones hidden in Edit Mode

:param select: Select, (optional)
:type select: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.roll_clear`

Clear roll for selected bones

:param roll: Roll, (in [-6.28319, 6.28319], optional)
:type roll: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_all`

Toggle selection status of all bones

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

### function `bpy.ops.armature.select_hierarchy`

Select immediate parent/children of selected bones

:param direction: Direction, (optional)
:type direction: Literal['PARENT', 'CHILD']
:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_less`

Deselect those bones at the boundary of each selection region

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_linked`

Select all bones linked by parent/child connections to the current selection

:param all_forks: All Forks, Follow forks in the parents chain (optional)
:type all_forks: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_linked_pick`

(De)select bones linked by parent/child connections under the mouse cursor

:param deselect: Deselect, (optional)
:type deselect: bool
:param all_forks: All Forks, Follow forks in the parents chain (optional)
:type all_forks: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_mirror`

Mirror the bone selection

:param only_active: Active Only, Only operate on the active bone (optional)
:type only_active: bool
:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_more`

Select those bones connected to the initial selection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.select_similar`

Select similar bones by property types

:param type: Type, (optional)
:type type: Literal['CHILDREN', 'CHILDREN_IMMEDIATE', 'SIBLINGS', 'LENGTH', 'DIRECTION', 'PREFIX', 'SUFFIX', 'BONE_COLLECTION', 'COLOR', 'SHAPE']
:param threshold: Threshold, (in [0, 1], optional)
:type threshold: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.separate`

Isolate selected bones into a separate armature

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.shortest_path_pick`

Select shortest path between two bones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.split`

Split off selected bones from connected unselected bones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.subdivide`

Break selected bones into chains of smaller bones

:param number_cuts: Number of Cuts, (in [1, 1000], optional)
:type number_cuts: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.switch_direction`

Change the direction that a chain of bones points in (head and tail swap)

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.armature.symmetrize`

Enforce symmetry, make copies of the selection or use existing

:param direction: Direction, Which sides to copy from and to (when both are selected) (optional)
:type direction: Literal['NEGATIVE_X', 'POSITIVE_X']
:param copy_bone_colors: Bone Colors, Copy colors to existing bones (optional)
:type copy_bone_colors: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
