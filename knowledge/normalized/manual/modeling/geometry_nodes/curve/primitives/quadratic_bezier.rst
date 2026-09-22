<!-- source: manual/modeling/geometry_nodes/curve/primitives/quadratic_bezier.rst -->

.. _bpy.types.GeometryNodeCurveQuadraticBezier:

*********************

figure: /images/node-types_GeometryNodeCurveQuadraticBezier.webp
The *Quadratic Bézier* node generates a poly spline curve from the given control points.
The generated shape is a parabola.

Resolution
The number of edges on the curve.

Start, Middle, End
Positions of the three control points.
The generated curve passes through the two end points, and is tangent to the lines between
the middle point and the two end points.

Curve
Poly spline generated from the inputs.
