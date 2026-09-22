<!-- source: manual/modeling/geometry_nodes/curve/operations/curves_to_grease_pencil.rst -->

.. _bpy.types.GeometryNodeCurvesToGreasePencil:

****************************

figure: /images/node-types_GeometryNodeCurvesToGreasePencil.png
The *Curves to Grease Pencil* node Converts top-level curve instances into Grease Pencil layers

Curves
Either plain curves or curve instances.

Selection
Either a curve or instance selection.

Instances as Layers
Create a separate layer for each instance. If instances are used, realized curve geometry will be
ignored. Layer names will use the instance geometry name. If real curve geometry is used, a single
layer is created with the input geometry's name.

Grease Pencil
Standard Grease Pencil geometry.

figure: /images/node-types_curves_to_grease_pencil_set_radius_example.jpeg
