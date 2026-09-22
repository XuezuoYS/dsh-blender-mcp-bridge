<!-- source: manual/modeling/geometry_nodes/curve/primitives/bezier_segment.rst -->

.. _bpy.types.GeometryNodeCurvePrimitiveBezierSegment:

*******************

figure: /images/node-types_GeometryNodeCurvePrimitiveBezierSegment.webp
The *Bézier Segment* node generates a 2D Bézier spline from the given control points and handles.

Resolution
The number of edges on the curve.

Start, End
Positions of the start and end control point of the curve.

Start Handle, End Handle
Positions of the handles used to define the shape of the curve.

Mode
:Position:
The handle inputs are the absolute positions of the handles in 3D space.
:Offset:
The handle positions are relative to the control point on the curve.
The handle inputs give the offset from the control points.

Curve
Bézier spline generated from the inputs.
