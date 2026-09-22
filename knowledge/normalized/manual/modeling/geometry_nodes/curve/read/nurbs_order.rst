<!-- source: manual/modeling/geometry_nodes/curve/read/nurbs_order.rst -->

.. _bpy.types.GeometryNodeNURBSOrder:

****************

figure: /images/node-types_GeometryNodeNURBSOrder.webp
The *NURBS Order* node outputs the order of each NURBS spline.

The order determines how many control points influence each segment of the curve.
Higher orders produce smoother curves with broader control over the curve shape.

note: 
This node reads the built-in ``nurbs_order`` attribute. The same values
can be accessed, modified, or transferred using nodes that operate on attributes.

This node has no inputs.

Order
The order of the NURBS spline.

For geometry that is not a NURBS curve, the output is zero.
