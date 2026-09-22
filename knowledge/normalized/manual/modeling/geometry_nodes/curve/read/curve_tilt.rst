<!-- source: manual/modeling/geometry_nodes/curve/read/curve_tilt.rst -->

.. _bpy.types.GeometryNodeInputCurveTilt:

***************

figure: /images/node-types_GeometryNodeInputCurveTilt.webp
The *Curve Tilt* node outputs the angle used to turn the curve normal
around the direction of the curve tangent in its evaluated points.
Keep in mind that the output is per control point, just like the values
that can be controlled in curve Edit Mode. For NURBS and Bézier splines,
the values will be interpolated to the final evaluated points.

The input node for this data is the :doc:`Set Curve Tilt </modeling/geometry_nodes/curve/write/set_curve_tilt>` node.

This node has no inputs.

Tilt
The tilt angle for the normal in radians.
