<!-- source: api/bpy.ops.ui.rst -->

### function `bpy.ops.ui.assign_default_button`

Set this property's current value as the new default

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.button_execute`

Presses active button

:param skip_depressed: Skip Depressed, (optional)
:type skip_depressed: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.button_string_clear`

Unsets the text of the active button

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.copy_as_driver_button`

Create a new driver with this property as input, and copy it to the internal clipboard. Use Paste Driver to add it to the target property, or Paste Driver Variables to extend an existing driver

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.copy_data_path_button`

Copy the RNA data path for this property to the clipboard

:param full_path: full_path, Copy full data path (optional)
:type full_path: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.copy_driver_to_selected_button`

Copy the property's driver from the active item to the same property of all selected items, if the same property exists

:param all: All, Copy to selected the drivers of all elements of the array (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.copy_python_command_button`

Copy the Python command matching this button

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.copy_to_selected_button`

Copy the property's value from the active item to the same property of all selected items if the same property exists

:param all: All, Copy to selected all elements of the array (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.drop_color`

Drop colors to buttons

:param color: Color, Source color (array of 4 items, in [0, inf], optional)
:type color: Sequence[float]
:param gamma: Gamma Corrected, The source color is gamma corrected (optional)
:type gamma: bool
:param has_alpha: Has Alpha, The source color contains an Alpha component (optional)
:type has_alpha: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.drop_material`

Drag material to Material slots in Properties

:param session_uid: Session UID, Session UID of the data-block to use by the operator (in [-inf, inf], optional)
:type session_uid: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.drop_name`

Drop name to button

:param string: String, The string value to drop into the button (optional, never None)
:type string: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.editsource`

Edit UI source code of the active button

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_bone`

Sample a bone from the 3D View or the Outliner to store in a property

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_color`

Sample a color from the Blender window to store in a property

:param prop_data_path: Data Path, Path of property to be set with the depth (optional, never None)
:type prop_data_path: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_colorramp`

Sample a color band

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_colorramp_point`

Point-sample a color band

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_depth`

Sample depth from the 3D view

:param prop_data_path: Data Path, Path of property to be set with the depth (optional, never None)
:type prop_data_path: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_driver`

Pick a property to use as a driver target

:param mapping_type: Mapping Type, Method used to match target and driven properties (optional)

- ``SINGLE_MANY``
  All from Target -- Drive all components of this property using the target picked.
- ``DIRECT``
  Single from Target -- Drive this component of this property using the target picked.
- ``MATCH``
  Match Indices -- Create drivers for each pair of corresponding elements.
- ``NONE_ALL``
  Manually Create Later -- Create drivers for all properties without assigning any targets yet.
- ``NONE_SINGLE``
  Manually Create Later (Single) -- Create driver for this property only and without assigning any targets yet.
:type mapping_type: Literal['SINGLE_MANY', 'DIRECT', 'MATCH', 'NONE_ALL', 'NONE_SINGLE']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_grease_pencil_color`

Sample a color from the Blender Window and create Grease Pencil material

:param mode: Mode, (optional)
:type mode: Literal['MATERIAL', 'PALETTE', 'BRUSH']
:param material_mode: Material Mode, (optional)
:type material_mode: Literal['STROKE', 'FILL', 'BOTH']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.eyedropper_id`

Sample a data-block from the 3D View to store in a property

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.jump_to_target_button`

Switch to the target object or bone

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.list_start_filter`

Start entering filter text for the list in focus

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.override_add_button`

Create an override operation

:param all: All, Add overrides for all elements of the array (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.override_idtemplate_clear`

Delete the selected local override and relink its usages to the linked data-block if possible, else reset it and mark it as non editable

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.override_idtemplate_make`

Create a local override of the selected linked data-block, and its hierarchy of dependencies

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.override_idtemplate_reset`

Reset the selected local override to its linked reference values

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.override_remove_button`

Remove an override operation

:param all: All, Reset to default values all elements of the array (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.reloadtranslation`

Force a full reload of UI translation

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.reset_default_button`

Reset this property's value to its default value

:param all: All, Reset to default values all elements of the array (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.unset_property_button`

Clear the property and use default or generated value in operators

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_drop`

Drag and drop onto a data-set or item within the data-set

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_item_delete`

Delete selected list item

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_item_focus`

Bring active item into focus by scrolling the view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_item_navigate`

Walk and select view items in given direction

:param direction: Navigation Direction, Direction in which to navigate and select next element. (optional)

- ``UP``
  Up -- Select item above the active.
- ``DOWN``
  Down -- Select item below the active.
- ``LEFT``
  Left -- Collapse or walk towards left of the active item.
- ``RIGHT``
  Right -- Uncollapse or walk towards right of the active item.
:type direction: Literal['UP', 'DOWN', 'LEFT', 'RIGHT']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_item_rename`

Rename the active item in the data-set view

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_item_select`

Activate selected view item

:param wait_to_deselect_others: Wait to Deselect Others, (optional)
:type wait_to_deselect_others: bool
:param use_select_on_click: Act on Click, Instead of selecting on mouse press, wait to see if there's drag event. Otherwise select on mouse release (optional)
:type use_select_on_click: bool
:param mouse_x: Mouse X, (in [-inf, inf], optional)
:type mouse_x: int
:param mouse_y: Mouse Y, (in [-inf, inf], optional)
:type mouse_y: int
:param extend: extend, Extend Selection (optional)
:type extend: bool
:param range_select: Range Select, Select all between clicked and active items (optional)
:type range_select: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_scroll`

Undocumented, consider `contributing <https://developer.blender.org/>`__.

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.ui.view_start_filter`

Start entering filter text for the data-set in focus

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
