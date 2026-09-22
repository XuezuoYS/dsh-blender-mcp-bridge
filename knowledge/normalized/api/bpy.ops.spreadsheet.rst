<!-- source: api/bpy.ops.spreadsheet.rst -->

### function `bpy.ops.spreadsheet.add_row_filter_rule`

Add a filter to remove rows from the displayed data

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.spreadsheet.change_spreadsheet_data_source`

Change visible data source in the spreadsheet

:param component_type: Component Type, (in [0, 32767], optional)
:type component_type: int
:param attribute_domain_type: Attribute Domain Type, (in [0, 32767], optional)
:type attribute_domain_type: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.spreadsheet.fit_column`

Resize a spreadsheet column to the width of the data

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.spreadsheet.remove_row_filter_rule`

Remove a row filter from the rules

:param index: Index, (in [0, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.spreadsheet.reorder_columns`

Change the order of columns

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.spreadsheet.resize_column`

Resize a spreadsheet column

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.spreadsheet.toggle_pin`

Turn on or off pinning

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/spreadsheet.py\:21 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/spreadsheet.py#L21>`__
