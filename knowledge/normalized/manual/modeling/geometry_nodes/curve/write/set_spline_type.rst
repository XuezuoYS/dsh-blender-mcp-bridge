<!-- source: manual/modeling/geometry_nodes/curve/write/set_spline_type.rst -->

.. _bpy.types.GeometryNodeCurveSplineType:

********************

figure: /images/node-types_GeometryNodeCurveSplineType.webp
Sets the spline type for the splines in the curve component that
are in the selection.

Curve
Standard geometry input with a curve component.

Selection
The splines whose spline types will be changed.

Spline Type
The type to convert the splines in the selection to.
Read the :ref:`Spline Types <curves-spline-types>` page for more details
on the different spline types.

:Bézier:
Convert to a Bézier spline. A spline converted from a poly spline gets vector handles,
while one converted from NURBS or Catmull Rom spline gets auto handles.

note: 
When converting from a NURBS spline to a Bézier spline,
   at least six points are needed.
   When the number of points is not a multiple of three
   a full conversion is not possible and the spline has to be truncated.
:NURBS:
Convert to a NURBS spline.
:Poly:
Convert to a poly spline.
:Catmull Rom:
Convert to a Catmull Rom spline.

Curve
Standard curve output.
