<!-- source: api/bpy.ops.info.rst -->

### function `bpy.ops.info.report_copy`

Copy selected reports to clipboard

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.info.report_delete`

Delete selected reports

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.info.report_replay`

Replay selected reports

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.info.reports_display_update`

Update the display of reports in Blender UI (internal use)

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.info.select_all`

Change selection of all visible reports

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

### function `bpy.ops.info.select_box`

Toggle box selection

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

### function `bpy.ops.info.select_pick`

Select reports by index

:param report_index: Report, Index of the report (in [0, inf], optional)
:type report_index: int
:param extend: Extend, Extend report selection (optional)
:type extend: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
