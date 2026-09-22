<!-- source: manual/modeling/geometry_nodes/utilities/rotation/axes_to_rotation.rst -->

.. _bpy.types.FunctionNodeAxesToRotation:
.. --- copy below this line ---

*********************

figure: /images/node-types_FunctionNodeAxesToRotation.webp
Creates a rotation based on two axis directions.

tip: 
In many cases, these directions are a normal and tangent on a mesh or curve.

Primary Axis
The desired direction of the primary axis.

Secondary Axis
The desired direction of the secondary axis. Ideally, this is orthogonal to the primary direction.

Primary Axis
The axis (X, Y or Z) that should be aligned exactly to the primary direction.

Secondary Axis
The axis that should be aligned as closely as possible to the secondary direction.

Rotation
The rotation that results in the given axes being aligned to the given directions.
