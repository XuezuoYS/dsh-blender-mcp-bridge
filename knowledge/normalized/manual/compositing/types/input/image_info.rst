<!-- source: manual/compositing/types/input/image_info.rst -->

.. _bpy.types.CompositorNodeImageInfo:

***************

figure: /images/node-types_CompositorNodeImageInfo.webp
The *Image Info* node outputs spatial and transformation information about an image in the compositor.

This node is useful for generating procedural effects that depend on image size or position.
It enables workflows such as vignette creation using math nodes,
or dynamic scaling of effects relative to image dimensions.

Image
The image to retrieve information from.

Dimensions
The dimensions of the image in pixels with transformations applied.

Resolution
The width and height of the image in pixels.

Location
The position of the image in compositing space.

Rotation
The rotation of the image in radians, around its center.

Scale
The scale of the image relative to its original size in compositing space.
