<!-- source: manual/modeling/geometry_nodes/curve/operations/subdivide_curve.rst -->

.. _bpy.types.GeometryNodeSubdivideCurve:

********************

figure: /images/node-types_GeometryNodeSubdivideCurve.webp
The *Subdivide Curve* node adds more control points in between existing control points on the curve input.
For Bézier and poly splines, the shape of the spline will not be changed at all.

With Bézier curves, this can be used to increase the control on the shape of the curve
while still having the higher-level provided by Bézier splines.
Unlike the :doc:`/modeling/geometry_nodes/curve/operations/resample_curve`, where they are converted to poly splines.

Curve
Standard geometry input.

Cuts
The number of control points to create on the segment following each point.
When the input is a field, the number of cuts for a segment is determined by
the value of the field when evaluated at the previous point.

Curve
Standard geometry output.
