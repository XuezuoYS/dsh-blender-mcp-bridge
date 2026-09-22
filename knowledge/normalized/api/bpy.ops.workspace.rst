<!-- source: api/bpy.ops.workspace.rst -->

### function `bpy.ops.workspace.add`

Add a new workspace by duplicating the current one or appending one from the user configuration

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.append_activate`

Append a workspace and make it the active one in the current window

:param idname: Identifier, Name of the workspace to append and activate (optional, never None)
:type idname: str
:param filepath: Filepath, Path to the library (optional, never None, blend relative ``//`` prefix supported)
:type filepath: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.delete`

Delete the active workspace

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.delete_all_others`

Delete all workspaces except this one

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.duplicate`

Add a new workspace

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.reorder_to_back`

Reorder workspace to be last in the list

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.reorder_to_front`

Reorder workspace to be first in the list

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.workspace.scene_pin_toggle`

Remember the last used scene for the current workspace and switch to it whenever this workspace is activated again

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
