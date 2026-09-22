<!-- source: api/bpy.ops.script.rst -->

### function `bpy.ops.script.execute_preset`

Load a preset

:param filepath: filepath, (optional, never None)
:type filepath: str
:param menu_idname: Menu ID Name, ID name of the menu this was called from (optional, never None)
:type menu_idname: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/presets.py\:285 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/presets.py#L285>`__

### function `bpy.ops.script.python_file_run`

Run Python file

:param filepath: Path, (optional, never None)
:type filepath: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.script.reload`

Reload scripts

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
