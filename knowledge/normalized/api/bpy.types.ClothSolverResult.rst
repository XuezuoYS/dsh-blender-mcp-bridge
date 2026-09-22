<!-- source: api/bpy.types.ClothSolverResult.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ClothSolverResult`

Result of cloth solver iteration

### data `bpy.types.ClothSolverResult.avg_error`

Average error during substeps (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.ClothSolverResult.avg_iterations`

Average iterations during substeps (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.ClothSolverResult.max_error`

Maximum error during substeps (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.ClothSolverResult.max_iterations`

Maximum iterations during substeps (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.ClothSolverResult.min_error`

Minimum error during substeps (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.ClothSolverResult.min_iterations`

Minimum iterations during substeps (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.ClothSolverResult.status`

Status of the solver iteration (default set(), readonly)

- ``SUCCESS``
  Success -- Computation was successful.
- ``NUMERICAL_ISSUE``
  Numerical Issue -- The provided data did not satisfy the prerequisites.
- ``NO_CONVERGENCE``
  No Convergence -- Iterative procedure did not converge.
- ``INVALID_INPUT``
  Invalid Input -- The inputs are invalid, or the algorithm has been improperly called.

:type: set[Literal['SUCCESS', 'NUMERICAL_ISSUE', 'NO_CONVERGENCE', 'INVALID_INPUT']]

### classmethod `bpy.types.ClothSolverResult.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ClothSolverResult.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`

:columns: 2

- :class:`bpy_struct.as_pointer`
- :class:`bpy_struct.driver_add`
- :class:`bpy_struct.driver_remove`
- :class:`bpy_struct.get`
- :class:`bpy_struct.id_properties_clear`
- :class:`bpy_struct.id_properties_ensure`
- :class:`bpy_struct.id_properties_ui`
- :class:`bpy_struct.is_property_hidden`
- :class:`bpy_struct.is_property_overridable_library`
- :class:`bpy_struct.is_property_readonly`
- :class:`bpy_struct.is_property_set`
- :class:`bpy_struct.items`
- :class:`bpy_struct.keyframe_delete`
- :class:`bpy_struct.keyframe_insert`
- :class:`bpy_struct.keys`
- :class:`bpy_struct.path_from_id`
- :class:`bpy_struct.path_from_module`
- :class:`bpy_struct.path_resolve`
- :class:`bpy_struct.pop`
- :class:`bpy_struct.property_overridable_library_set`
- :class:`bpy_struct.property_unset`
- :class:`bpy_struct.rna_ancestors`
- :class:`bpy_struct.type_recast`
- :class:`bpy_struct.values`

:columns: 2

- :class:`ClothModifier.solver_result`
