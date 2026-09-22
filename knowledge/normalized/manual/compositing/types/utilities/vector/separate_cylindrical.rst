<!-- source: manual/compositing/types/utilities/vector/separate_cylindrical.rst -->

.. --- copy below this line ---

*************************

figure: /images/node-types_GeometryNodeSeparateCylindrical.webp
The *Separate Cylindrical* node converts a vector from Cartesian coordinates (X, Y, Z)
into cylindrical coordinates (R, Φ, Z) and outputs each component separately. It is the inverse of the
:doc:`Combine Cylindrical </modeling/geometry_nodes/utilities/vector/combine_cylindrical>` node.

This node is useful for analyzing geometry or generating procedural effects that depend on
radial distance, angular position, or height -- for example, creating spiral deformations,
cylindrical gradients, or radial masks.

Vector
The input vector to be converted from Cartesian to cylindrical coordinates.

R
The radial distance from the origin in the X-Y plane.

Phi
The angular position around the Z axis.

Z
The vertical component of the input vector, corresponding directly to its Z coordinate.

:start-after: .. --- copy below this line ---
