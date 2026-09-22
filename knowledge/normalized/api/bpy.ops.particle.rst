<!-- source: api/bpy.ops.particle.rst -->

### function `bpy.ops.particle.brush_edit`

Apply a stroke of brush to the particles

:param stroke: Stroke, (optional)
:type stroke: :class:`bpy_prop_collection`\ [:class:`OperatorStrokeElement`] | None
:param pen_flip: Pen Flip, Whether a tablet's eraser mode is being used (optional)
:type pen_flip: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.connect_hair`

Connect hair to the emitter mesh

:param all: All Hair, Connect all hair systems to the emitter mesh (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.copy_particle_systems`

Copy particle systems from the active object to selected objects

:param space: Space, Space transform for copying from one object to another (optional)

- ``OBJECT``
  Object -- Copy inside each object's local space.
- ``WORLD``
  World -- Copy in world space.
:type space: Literal['OBJECT', 'WORLD']
:param remove_target_particles: Remove Target Particles, Remove particle systems on the target objects (optional)
:type remove_target_particles: bool
:param use_active: Use Active, Use the active particle system from the context (optional)
:type use_active: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.delete`

Delete selected particles or keys

:param type: Type, Delete a full particle or only keys (optional)
:type type: Literal['PARTICLE', 'KEY']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.disconnect_hair`

Disconnect hair from the emitter mesh

:param all: All Hair, Disconnect all hair systems from the emitter mesh (optional)
:type all: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.duplicate_particle_system`

Duplicate particle system within the active object

:param use_duplicate_settings: Duplicate Settings, Duplicate settings as well, so the new particle system uses its own settings (optional)
:type use_duplicate_settings: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.dupliob_copy`

Duplicate the current instance object

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.dupliob_move_down`

Move instance object down in the list

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.dupliob_move_up`

Move instance object up in the list

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.dupliob_refresh`

Refresh list of instance objects and their weights

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.dupliob_remove`

Remove the selected instance object

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.edited_clear`

Undo all edition performed on the particle system

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.hair_dynamics_preset_add`

Add or remove a Hair Dynamics Preset

:param name: Name, Name of the preset, used to make the path name (optional, never None)
:type name: str
:param remove_name: remove_name, (optional)
:type remove_name: bool
:param remove_active: remove_active, (optional)
:type remove_active: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
:File: `startup/bl_operators/presets.py\:119 <https://projects.blender.org/blender/blender/src/branch/main/scripts/startup/bl_operators/presets.py#L119>`__

### function `bpy.ops.particle.hide`

Hide selected particles

:param unselected: Unselected, Hide unselected rather than selected (optional)
:type unselected: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.mirror`

Duplicate and mirror the selected particles along the local X axis

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.new`

Add new particle settings

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.new_target`

Add a new particle target

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.particle_edit_toggle`

Toggle particle edit mode

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.particle_system_remove_all`

Remove all particle system within the active object

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.rekey`

Change the number of keys of selected particles (root and tip keys included)

:param keys_number: Number of Keys, (in [2, inf], optional)
:type keys_number: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.remove_doubles`

Remove selected particles close enough to others

:param threshold: Merge Distance, Threshold distance within which particles are removed (in [0, inf], optional)
:type threshold: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.reveal`

Show hidden particles

:param select: Select, (optional)
:type select: bool
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.select_all`

(De)select all particles' keys

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

### function `bpy.ops.particle.select_less`

Deselect boundary selected keys of each particle

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.select_linked`

Select all keys linked to already selected ones

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.select_linked_pick`

Select nearest particle from mouse pointer

:param deselect: Deselect, Deselect linked keys rather than selecting them (optional)
:type deselect: bool
:param location: Location, (array of 2 items, in [0, inf], optional)
:type location: Sequence[int]
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.select_more`

Select keys linked to boundary selected keys of each particle

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.select_random`

Select a randomly distributed set of hair or points

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
:param type: Type, Select either hair or points (optional)
:type type: Literal['HAIR', 'POINTS']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.select_roots`

Select roots of all visible particles

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

### function `bpy.ops.particle.select_tips`

Select tips of all visible particles

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

### function `bpy.ops.particle.shape_cut`

Cut hair to conform to the set shape object

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.subdivide`

Subdivide selected particles segments (adds keys)

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.target_move_down`

Move particle target down in the list

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.target_move_up`

Move particle target up in the list

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.target_remove`

Remove the selected particle target

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.unify_length`

Make selected hair the same length

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.particle.weight_set`

Set the weight of selected keys

:param factor: Factor, Interpolation factor between current brush weight, and keys' weights (in [0, 1], optional)
:type factor: float
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
