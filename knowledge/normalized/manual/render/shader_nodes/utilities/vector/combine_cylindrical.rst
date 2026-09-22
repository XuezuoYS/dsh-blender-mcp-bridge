<!-- source: manual/render/shader_nodes/utilities/vector/combine_cylindrical.rst -->

.. --- copy below this line ---

************************

figure: /images/node-types_GeometryNodeCombineCylindrical.webp
The *Combine Cylindrical* node converts cylindrical coordinates (R, Φ, Z)
into a Cartesian vector (X, Y, Z). It is the inverse of the
:doc:`Separate Cylindrical </modeling/geometry_nodes/utilities/vector/separate_cylindrical>` node.

This node is useful for constructing positions or directions based on radial distance,
rotation angle, and height, such as creating spiral shapes or cylindrical displacements.

R
The radial distance from the origin in the X-Y plane.

Phi
The angle around the Z axis.

Z
The vertical position or height component.

Vector
The resulting Cartesian vector corresponding to the input cylindrical coordinates.

:start-after: .. --- copy below this line ---
