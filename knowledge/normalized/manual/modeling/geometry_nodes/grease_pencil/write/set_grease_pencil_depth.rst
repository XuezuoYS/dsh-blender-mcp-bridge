<!-- source: manual/modeling/geometry_nodes/grease_pencil/write/set_grease_pencil_depth.rst -->

.. _bpy.types.GeometryNodeSetGreasePencilDepth:

****************************

figure: /images/node-types_GeometryNodeSetGreasePencilDepth.webp
The *Set Grease Pencil Depth* node sets the Grease Pencil
:ref:`depth order <bpy.types.GreasePencil.stroke_depth_order>` to use.

Grease Pencil
The input Grease Pencil geometry.

Depth Order
Defines how the strokes are ordered in 3D space (for objects not displayed *In Front*).

:2D Layers:
The Strokes drawing order respect the order of the 2D layers list (top to bottom)
and ignores the real position of the strokes in 3D space.
See :doc:`2D Layers </grease_pencil/properties/layers>` for more information.
:3D Location:
The strokes drawing order is based on the stroke location in 3D space.

Grease Pencil
The modified Grease Pencil geometry.
