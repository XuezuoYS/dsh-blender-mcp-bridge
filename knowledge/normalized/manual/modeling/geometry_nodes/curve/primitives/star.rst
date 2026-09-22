<!-- source: manual/modeling/geometry_nodes/curve/primitives/star.rst -->

.. _bpy.types.GeometryNodeCurveStar:

*********

figure: /images/node-types_GeometryNodeCurveStar.webp
The *Star* node generates a poly spline in a star pattern by connecting alternating points of two circles.
The points on the inner circle are offset by a rotation so that they lie in between the points on the outer circle.
This offset can be changed with the twist input.

Points
Number of points on each of the circles.

Inner Radius, Outer Radius
Radii of the two circles on which to place the control points.
The inner radius can be larger than the outer radius.

Twist
Angle offset of the inner circle.
The twist value rotates the points on the circle corresponding with the inner radius
counterclockwise by the given angle.

Curve
Poly spline generated from the inputs.

Outer Points
A boolean attribute field with a selection of the points on the *Outer Radius*, which is every
other point.
