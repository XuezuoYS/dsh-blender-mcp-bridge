<!-- source: api/gpu.compute.rst -->

This module provides access to the global GPU compute functions.

### function `gpu.compute.dispatch`

Dispatches GPU compute.

:param shader: The shader that you want to dispatch.
:type shader: :class:`gpu.types.GPUShader`
:param groups_x_len: Int for group x length:
:type groups_x_len: int
:param groups_y_len: Int for group y length:
:type groups_y_len: int
:param groups_z_len: Int for group z length:
:type groups_z_len: int
