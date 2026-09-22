<!-- source: manual/modeling/geometry_nodes/curve/write/set_nurbs_weight.rst -->

.. _bpy.types.GeometryNodeSetNURBSWeight:

*********************

figure: /images/node-types_GeometryNodeSetNURBSWeight.webp
The *Set NURBS Weight* node sets the weight of control points
on NURBS curves by modifying the ``nurbs_weight`` attribute.

In NURBS curves, the weight influences how strongly a control point affects the
shape of the curve. Higher weights pull the curve closer to the control point,
while lower weights reduce its influence.

Curve
Input curve geometry. Only curves of type NURBS are affected; other curve
types are passed through unchanged.

Selection
The control points whose weights will be modified.

Weight
The weight value assigned to the selected control points.

Curve
The modified curve geometry with updated NURBS weights.
