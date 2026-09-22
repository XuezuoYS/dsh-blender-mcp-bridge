<!-- source: api/bpy.ops.lattice.rst -->

### function `bpy.ops.lattice.flip`

Mirror all control points without inverting the lattice deform

:param axis: Flip Axis, Coordinates along this axis get flipped (optional)
:type axis: Literal['U', 'V', 'W']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.lattice.make_regular`

Set UVW control points a uniform distance apart

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.lattice.select_all`

Change selection of all UVW control points

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

### function `bpy.ops.lattice.select_less`

Deselect vertices at the boundary of each selection region

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.lattice.select_mirror`

Select mirrored lattice points

:param axis: Axis, (optional)
:type axis: set[Literal[:ref:`rna_enum_axis_flag_xyz_items`]]
:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.lattice.select_more`

Select vertices directly linked to already selected ones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.lattice.select_random`

Randomly select UVW control points

:param ratio: Ratio, Portion of items to select randomly (in [0, 1], optional)
:type ratio: float
:param seed: Random Seed, Seed for the random number generator (in [0, inf], optional)
:type seed: int
:param action: Action, Selection action to execute (optional)

- ``SELECT``
  Select -- Select all elements.
- ``DESELECT``
  Deselect -- Deselect all elements.
:type action: Literal['SELECT', 'DESELECT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.lattice.select_ungrouped`

Select vertices without a group

:param extend: Extend, Extend the selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
