<!-- source: manual/modeling/geometry_nodes/curve/primitives/curve_spiral.rst -->

.. _bpy.types.GeometryNodeCurveSpiral:

***********

figure: /images/node-types_GeometryNodeCurveSpiral.webp
The *Spiral* node generates a poly spline in a spiral shape.
It can be used to create springs or other similar objects.
By default the spiral twists in a clockwise fashion.

Resolution
Number of points in one rotation of the spiral.

Rotations
Number of times the spiral makes a full rotation.

Start Radius, End Radius
Radius of the start point and end point of the spiral.
The radius of the spiral changes linearly between the two values over the whole spiral.

Height
Height of the spiral.

Reverse
Boolean value that changes the direction from clockwise to counterclockwise when it is enabled.

Curve
Poly spline generated from the inputs.
