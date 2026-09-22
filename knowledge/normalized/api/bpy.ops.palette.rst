<!-- source: api/bpy.ops.palette.rst -->

### function `bpy.ops.palette.color_add`

Add new color to active palette

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.palette.color_delete`

Remove active color from palette

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.palette.color_move`

Move the active Color up/down in the list

:param type: Type, (optional)
:type type: Literal['UP', 'DOWN']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.palette.extract_from_image`

Extract all colors used in Image and create a Palette

:param threshold: Threshold, (in [-inf, inf], optional)
:type threshold: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.palette.join`

Join Palette Swatches

:param palette: Palette, Name of the Palette (optional, never None)
:type palette: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.palette.new`

Add new palette

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.palette.sort`

Sort Palette Colors

:param type: Type, (optional)
:type type: Literal['HSV', 'SVH', 'VHS', 'LUMINANCE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
