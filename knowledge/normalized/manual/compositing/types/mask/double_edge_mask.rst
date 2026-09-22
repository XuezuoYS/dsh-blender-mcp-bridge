<!-- source: manual/compositing/types/mask/double_edge_mask.rst -->

.. _bpy.types.CompositorNodeDoubleEdgeMask:

*********************

figure: /images/node-types_CompositorNodeDoubleEdgeMask.webp
The *Double Edge Mask* node creates a gradient between two masks.

Outer Mask
A mask representing the outside shape, which will fade from black at its edges
to white at the *Inner Mask*.
Inner Mask
A mask representing the inside shape, which will be fully white.
Images Edges
The edges of the image that intersects the outer mask will be considered edges
of the outer mask. Otherwise, the outer mask will be considered open-ended.

[unparsed directive: list-table]

* - .. figure:: /images/compositing_types_matte_double-edge-mask_in.png

Disabled.

- .. figure:: /images/compositing_types_matte_double-edge-mask_bleed.png

Enabled.

Only Inside Outer
Only edges of the inner mask that lie inside the outer mask will be considered.
Otherwise, all edges of the inner mask will be considered.

[unparsed directive: list-table]

* - .. figure:: /images/compositing_types_matte_double-edge-mask_all.png

Disabled.

- .. figure:: /images/compositing_types_matte_double-edge-mask_adjacent.png

Enabled.

Mask
Standard mask output.

`Double Edge Mask Example Video <https://www.youtube.com/watch?v=VcjEfoNIHZs>`__
