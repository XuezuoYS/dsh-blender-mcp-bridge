<!-- source: api/gpu.matrix.rst -->

This module provides access to the matrix stack.

### function `gpu.matrix.get_model_view_matrix`

Return a copy of the model-view matrix.

:return: A 4x4 view matrix.
:rtype: :class:`mathutils.Matrix`

### function `gpu.matrix.get_normal_matrix`

Return a copy of the normal matrix.

:return: A 3x3 normal matrix.
:rtype: :class:`mathutils.Matrix`

### function `gpu.matrix.get_projection_matrix`

Return a copy of the projection matrix.

:return: A 4x4 projection matrix.
:rtype: :class:`mathutils.Matrix`

### function `gpu.matrix.load_identity`

Load an identity matrix into the stack.

### function `gpu.matrix.load_matrix`

Load a matrix into the stack.

:param matrix: A 4x4 matrix.
:type matrix: :class:`mathutils.Matrix`

### function `gpu.matrix.load_projection_matrix`

Load a projection matrix into the stack.

:param matrix: A 4x4 matrix.
:type matrix: :class:`mathutils.Matrix`

### function `gpu.matrix.multiply_matrix`

Multiply the current stack matrix.

:param matrix: A 4x4 matrix.
:type matrix: :class:`mathutils.Matrix`

### function `gpu.matrix.pop`

Remove the last model-view matrix from the stack.

### function `gpu.matrix.pop_projection`

Remove the last projection matrix from the stack.

### function `gpu.matrix.push`

Add to the model-view matrix stack.

### function `gpu.matrix.push_pop`

Context manager to ensure balanced push/pop calls, even in the case of an error.

:return: The context manager.
:rtype: :class:`gpu.types.MatrixStackContext`

### function `gpu.matrix.push_pop_projection`

Context manager to ensure balanced push/pop calls, even in the case of an error.

:return: The context manager.
:rtype: :class:`gpu.types.MatrixStackContext`

### function `gpu.matrix.push_projection`

Add to the projection matrix stack.

### function `gpu.matrix.reset`

Empty stack and set to identity.

### function `gpu.matrix.scale`

Scale the current stack matrix.

:param scale: Scale the current stack matrix with 2 or 3 floats.
:type scale: Sequence[float]

### function `gpu.matrix.scale_uniform`

Scale the current stack matrix uniformly.

:param scale: Uniform scale factor.
:type scale: float

### function `gpu.matrix.translate`

Translate the current stack matrix.

:param offset: Translate the current stack matrix with 2 or 3 floats.
:type offset: Sequence[float]
