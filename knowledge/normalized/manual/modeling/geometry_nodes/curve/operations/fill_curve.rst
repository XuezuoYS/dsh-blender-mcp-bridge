<!-- source: manual/modeling/geometry_nodes/curve/operations/fill_curve.rst -->

.. _bpy.types.GeometryNodeFillCurve:

***************

figure: /images/node-types_GeometryNodeFillCurve.webp
The *Fill Curve* node generates a mesh using the constrained Delaunay triangulation algorithm
with the curves as boundaries. The mesh is only generated flat with a local Z of 0.

Curve
Standard geometry input with a curve component.

Group ID
Value used to group curves together.
Curves with different Group ID are treated separately.

Mode
The type of geometry the output consists of.

:Triangles: The output is made up of triangles.
:N-gons: The output is made up of n-gons.

Mesh
The filled-in curves.

One or many "single point spline" can be used to customize the triangulation of the filled-in curves.

figure: /images/modeling_geometry-nodes_curve_curve-fill_example_0.png
figure: /images/modeling_geometry-nodes_curve_curve-fill_example_1.png
figure: /images/modeling_geometry-nodes_curve_curve-fill_example_2.png

The following figures display diverse application of the Group ID.

.. The following example were made with some nodes "hidden" to illustrate the amount of mesh islands
.. and avoid Z fighting.
.. Mesh Island Index -> Set Position (as z offset)
.. Mesh Island Index -> Map Range (Mesh island count as input max) -> Color Ramp (distributed from left)
.. Colors Used : 5ABD9E, 85BD50, DDB72C, D26072

figure: /images/modeling_geometry-nodes_curve_curve-fill_group-id_0.png
figure: /images/modeling_geometry-nodes_curve_curve-fill_group-id_1.png
figure: /images/modeling_geometry-nodes_curve_curve-fill_group-id_2.png
