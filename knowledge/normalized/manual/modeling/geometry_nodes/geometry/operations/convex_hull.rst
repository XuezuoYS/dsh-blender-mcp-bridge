<!-- source: manual/modeling/geometry_nodes/geometry/operations/convex_hull.rst -->

.. _bpy.types.GeometryNodeConvexHull:

****************

figure: /images/node-types_GeometryNodeConvexHull.webp
The *Convex Hull* node outputs a convex mesh that is enclosing all points in the input geometry.

note: 
When the node is used on a geometry with instances, the algorithm will run once per instance,
resulting in many convex hull meshes in the instance geometries. The *Realize Instances* node can
be used to get a convex hull of an entire geometry.
important: 
Volumes are not supported by this node, and attributes are not automatically transferred to the result.
note: 
This node is affected by the limitations of floating point precision. If points are too close together,
they may be merged in the result mesh.

Geometry
Standard geometry input.

Convex Hull
Mesh that encloses all points in the input.
