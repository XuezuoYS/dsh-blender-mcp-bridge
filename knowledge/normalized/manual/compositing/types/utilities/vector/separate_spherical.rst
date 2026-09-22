<!-- source: manual/compositing/types/utilities/vector/separate_spherical.rst -->

.. --- copy below this line ---

***********************

figure: /images/node-types_GeometryNodeSeparateSpherical.webp
The *Separate Spherical* node converts a vector from Cartesian coordinates (X, Y, Z)
into spherical coordinates (R, Φ, Θ) and outputs each component separately.
It is the inverse of the :doc:`Combine Spherical </modeling/geometry_nodes/utilities/vector/combine_spherical>` node.

Spherical coordinates describe a position in 3D space using radius, azimuth (horizontal angle),
and polar (vertical) angle. This representation is useful for procedural effects involving
rotational symmetry, spherical gradients, or direction-based transformations.

Vector
The input Cartesian vector to be converted into spherical coordinates.

R
The radial distance from the origin.

Phi
The azimuthal angle (horizontal rotation) around the Z axis, measured in radians.

Theta
The polar angle (vertical inclination) from the Z axis, measured in radians.

:start-after: .. --- copy below this line ---
