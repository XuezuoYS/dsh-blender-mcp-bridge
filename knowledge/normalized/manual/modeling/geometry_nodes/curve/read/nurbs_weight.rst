<!-- source: manual/modeling/geometry_nodes/curve/read/nurbs_weight.rst -->

.. _bpy.types.GeometryNodeNURBSWeight:

*****************

figure: /images/node-types_GeometryNodeNURBSWeight.webp
The *NURBS Weight* node outputs the NURBS weight of each control point in a NURBS curve.

NURBS weights influence how strongly each control point affects the shape of
the curve. Higher weights pull the curve closer to the corresponding control point.

note: 
This node reads the built-in ``nurbs_weight`` attribute. The same values
can be accessed, modified, or transferred using nodes that operate on attributes.

This node has no inputs.

Weight
The NURBS weight of each control point.

For geometry that is not a NURBS curve, the output is zero.
