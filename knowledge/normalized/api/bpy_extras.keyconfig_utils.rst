<!-- source: api/bpy_extras.keyconfig_utils.rst -->

### function `bpy_extras.keyconfig_utils.addon_keymap_register`

Register a set of keymaps for addons using a list of keymaps.

See 'blender_default.py' for examples of the format this takes.

:param keymap_data: A list of keymap definitions to register.
:type keymap_data: list[tuple[str, dict[str, Any], dict[str, Any]]]

### function `bpy_extras.keyconfig_utils.addon_keymap_unregister`

Unregister a set of keymaps for addons.

:param keymap_data: A list of keymap definitions to unregister.
:type keymap_data: list[tuple[str, dict[str, Any], dict[str, Any]]]

### function `bpy_extras.keyconfig_utils.keyconfig_test`

Test a key configuration for duplicate key-map item assignments.

:param kc: The key configuration to test.
:type kc: :class:`bpy.types.KeyConfig`
:return: True if any duplicates were found.
:rtype: bool
