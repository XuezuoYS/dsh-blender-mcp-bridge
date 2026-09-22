<!-- source: manual/modeling/geometry_nodes/curve/read/spline_length.rst -->

.. _bpy.types.GeometryNodeSplineLength:

******************

figure: /images/node-types_GeometryNodeSplineLength.webp
The *Spline Length* node outputs the total length of each spline, as a distance, or a number of points.
This is different than the :doc:`Curve Length </modeling/geometry_nodes/curve/read/curve_length>` node,
which adds up the total length for all of the curve's splines.

The output values correspond to the spline domain, but the node can be used to output a value for every
curve control point as well.

This node has no inputs.

Length
The length of each spline.

Point Count
The number of control points in each spline.
