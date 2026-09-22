<!-- source: manual/compositing/types/creative/posterize.rst -->

.. _bpy.types.CompositorNodePosterize:

*********

figure: /images/node-types_CompositorNodePosterize.webp
The *Posterize Node* reduces the number of colors in an image, converting
smooth gradients into sharp transitions.
This node is useful for generating masks in particular for rotoscoping.

Image
Standard color input.
Steps
The number of colors per channel;
A value of 8 will result in :math:`8^3 = 512` total colors.

Image
Standard color output.
