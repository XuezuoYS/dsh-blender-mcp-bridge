<!-- source: api/bpy.ops.pointcloud.rst -->

### function `bpy.ops.pointcloud.attribute_set`

Set values of the active attribute for selected elements

:param value_float: Value, (in [-inf, inf], optional)
:type value_float: float
:param value_float_vector_2d: Value, (array of 2 items, in [-inf, inf], optional)
:type value_float_vector_2d: Sequence[float]
:param value_float_vector_3d: Value, (array of 3 items, in [-inf, inf], optional)
:type value_float_vector_3d: Sequence[float]
:param value_float_vector_4d: Value, (array of 4 items, in [-inf, inf], optional)
:type value_float_vector_4d: Sequence[float]
:param value_int: Value, (in [-inf, inf], optional)
:type value_int: int
:param value_int_vector_2d: Value, (array of 2 items, in [-inf, inf], optional)
:type value_int_vector_2d: Sequence[int]
:param value_color: Value, (array of 4 items, in [-inf, inf], optional)
:type value_color: Sequence[float]
:param value_bool: Value, (optional)
:type value_bool: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.pointcloud.delete`

Remove selected points

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.pointcloud.duplicate`

Copy selected points

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.pointcloud.duplicate_move`

Make copies of selected elements and move them

:param POINTCLOUD_OT_duplicate: Duplicate, Copy selected points (optional, :func:`bpy.ops.pointcloud.duplicate` keyword arguments)
:type POINTCLOUD_OT_duplicate: dict[str, Any]
:param TRANSFORM_OT_translate: Move, Move selected items (optional, :func:`bpy.ops.transform.translate` keyword arguments)
:type TRANSFORM_OT_translate: dict[str, Any]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.pointcloud.select_all`

(De)select all points

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

### function `bpy.ops.pointcloud.select_random`

Randomize existing selection or create new random selection

:param seed: Seed, Source of randomness (in [-inf, inf], optional)
:type seed: int
:param probability: Probability, Chance of every point being included in the selection (in [0, 1], optional)
:type probability: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.pointcloud.separate`

Separate selected geometry into a new point cloud

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
