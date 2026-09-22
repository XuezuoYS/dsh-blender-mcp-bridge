<!-- source: manual/modeling/geometry_nodes/curve/operations/reverse_curve.rst -->

.. _bpy.types.GeometryNodeReverseCurve:

******************

figure: /images/node-types_GeometryNodeReverseCurve.webp
The *Reverse Curve* node swaps the start and end of splines.
The shape of the splines is not changed.

tip: 
When used on the *Profile* input of the :doc:`/modeling/geometry_nodes/curve/operations/curve_to_mesh`,
this node fill flip the normals of the resulting mesh.

Curve
Standard geometry input.

Selection
Whether or not to change the direction of each spline. True values mean the direction will be changed,
false values mean the spline will be unaffected.

Curve
Standard geometry output.
