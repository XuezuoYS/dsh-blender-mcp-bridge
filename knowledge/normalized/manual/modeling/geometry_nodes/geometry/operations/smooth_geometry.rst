<!-- source: manual/modeling/geometry_nodes/geometry/operations/smooth_geometry.rst -->

********************

figure: /images/node-types_GeometryNodeSmoothGeometry.webp
The *Smooth Geometry* node smooths connected parts of a geometry by averaging the positions
of neighboring elements. It can be used to reduce surface irregularities or create a
softened, more organic appearance without significantly altering the overall shape.

Geometry
The input geometry to be smoothed.

Selection
Controls which elements are affected by the smoothing operation.
Unselected elements remain unchanged.

Iterations
The number of smoothing steps to perform.
Higher values result in a stronger smoothing effect.

Weight
Relative mix weight of neighboring elements.
Determines how strongly each element is influenced by the positions of its neighbors.

Geometry
The resulting smoothed geometry.
