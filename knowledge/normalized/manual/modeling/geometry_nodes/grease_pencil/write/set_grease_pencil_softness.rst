<!-- source: manual/modeling/geometry_nodes/grease_pencil/write/set_grease_pencil_softness.rst -->

.. _bpy.types.GeometryNodeSetGreasePencilSoftness:

*******************************

figure: /images/node-types_GeometryNodeSetGreasePencilSoftness.webp
The *Set Grease Pencil Softness* node sets a stroke's softness,
which controls how much a stroke's edges fade out. Higher softness values create more transparent,
blurred edges, while lower values produce crisper, more defined strokes.

Grease Pencil
Grease Pencil geometry input.

Selection
A boolean field that controls which stroke points are affected.
Only elements where the selection is true will be modified.
By default, all strokes are affected.

Softness
The softness value to assign. Higher values increase the fade at stroke edges.
This input sets the value for the ``softness`` attribute.

Grease Pencil
The modified Grease Pencil geometry with updated softness values.

figure: /images/geometry_nodes-grease_pencil-set_gp_softness.png
