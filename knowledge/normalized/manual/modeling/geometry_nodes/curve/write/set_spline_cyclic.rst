<!-- source: manual/modeling/geometry_nodes/curve/write/set_spline_cyclic.rst -->

.. _bpy.types.GeometryNodeSetSplineCyclic:

**********************

figure: /images/node-types_GeometryNodeSetSplineCyclic.webp
The *Set Spline Cyclic* node changes whether splines loop back on themselves --
that is, whether their first and last control points are connected.

You can use the :doc:`/modeling/geometry_nodes/curve/read/is_spline_cyclic`
to read this property.

Curve
Standard geometry input.

Selection
Whether to change the cyclic setting for each spline. *True* means the
setting will be changed, *false* means it will stay the same.

Cyclic
Whether to connect the first and last control points of each spline.

Curve
Standard geometry output.
