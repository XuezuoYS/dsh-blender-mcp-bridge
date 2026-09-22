<!-- source: manual/modeling/geometry_nodes/grease_pencil/write/set_grease_pencil_color.rst -->

.. _bpy.types.GeometryNodeSetGreasePencilColor:

****************************

figure: /images/node-types_GeometryNodeSetGreasePencilColor.webp
The *Set Grease Pencil Color* node sets the color and opacity attributes
of strokes and fills on Grease Pencil geometry.

Grease Pencil
The input Grease Pencil geometry.

Selection
A boolean field to determine which elements to affect.
Elements with a value of true will be modified.

Color
The new color to apply.

Opacity
The opacity value to apply.

Mode
Determines which component of the stroke is affected:

:Stroke: Apply the color and opacity to stroke points.
:Fill: Apply the color and opacity to stroke fills.

Grease Pencil
The modified Grease Pencil geometry.
