<!-- source: api/bpy.ops.constraint.rst -->

### function `bpy.ops.constraint.add_target`

Add a target to the constraint

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/constraint.py\:26 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/constraint.py#L26>`__

### function `bpy.ops.constraint.apply`

Apply constraint and remove from the stack

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:param report: Report, Create a notification after the operation (optional)
:type report: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.childof_clear_inverse`

Clear inverse correction for Child Of constraint

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.childof_set_inverse`

Set inverse correction for Child Of constraint

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.copy`

Duplicate constraint at the same position in the stack

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:param report: Report, Create a notification after the operation (optional)
:type report: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.copy_to_selected`

Copy constraint to other selected objects/bones

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.delete`

Remove constraint from constraint stack

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:param report: Report, Create a notification after the operation (optional)
:type report: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.disable_keep_transform`

Set the influence of this constraint to zero while trying to maintain the object's transformation. Other active constraints can still influence the final transformation

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/constraint.py\:86 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/constraint.py#L86>`__

### function `bpy.ops.constraint.followpath_path_animate`

Add default animation for path used by constraint if it isn't animated already

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:param frame_start: Start Frame, First frame of path animation (in [-1048574, 1048574], optional)
:type frame_start: int
:param length: Length, Number of frames that path animation should take (in [0, 1048574], optional)
:type length: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.limitdistance_reset`

Reset limiting distance for Limit Distance Constraint

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.move_down`

Move constraint down in constraint stack

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.move_to_index`

Change the constraint's position in the list so it evaluates after the set number of others

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:param index: Index, The index to move the constraint to (in [0, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.move_up`

Move constraint up in constraint stack

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.normalize_target_weights`

Normalize weights of all target bones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/constraint.py\:61 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/constraint.py#L61>`__

### function `bpy.ops.constraint.objectsolver_clear_inverse`

Clear inverse correction for Object Solver constraint

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.objectsolver_set_inverse`

Set inverse correction for Object Solver constraint

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.constraint.remove_target`

Remove the target from the constraint

:param index: index, (in [-inf, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/constraint.py\:44 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/constraint.py#L44>`__

### function `bpy.ops.constraint.stretchto_reset`

Reset original length of bone for Stretch To Constraint

:param constraint: Constraint, Name of the constraint to edit (optional, never None)
:type constraint: str
:param owner: Owner, The owner of this constraint (optional)

- ``OBJECT``
  Object -- Edit a constraint on the active object.
- ``BONE``
  Bone -- Edit a constraint on the active bone.
:type owner: Literal['OBJECT', 'BONE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
