<!-- source: manual/modeling/geometry_nodes/curve/primitives/curve_line.rst -->

.. _bpy.types.GeometryNodeCurvePrimitiveLine:

***************

figure: /images/node-types_GeometryNodeCurvePrimitiveLine.webp
The *Curve Line* node generates poly spline line.

Start
Position of the first control point.

End
Position of the second control point.
This is only available in the *Points* mode.

Direction
Direction the line is going in.
The length of this vector does not matter.
This is only available in the *Direction* mode.

Length
Length of the line.
This is only available in the *Direction* mode.

Mode:
:Points:
Define the spline with start and end points.
:Direction:
Define the spline with a start, direction and length.

Curve
Standard geometry output.
