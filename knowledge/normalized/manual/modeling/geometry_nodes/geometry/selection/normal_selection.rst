<!-- source: manual/modeling/geometry_nodes/geometry/selection/normal_selection.rst -->

*********************

figure: /images/node-types_GeometryNodeNormalSelection.webp
The *Normal Selection* node creates a selection of elements whose normals point
in a specified direction within a given angular threshold.
It is useful for selecting geometry that faces a certain way, such as upward-facing
surfaces, walls, or elements oriented toward a light or camera.

Direction
A vector that defines the reference direction to compare against the element normals.
The direction should typically be normalized.

Threshold
The maximum angular difference between the element normal and the given direction
for the element to be included in the selection.

Selection
A boolean field indicating which elements have normals pointing
within the given angular threshold of the specified direction.
