<!-- source: manual/modeling/geometry_nodes/input/scene/image_info.rst -->

.. _bpy.types.GeometryNodeImageInfo:

***************

figure: /images/node-types_GeometryNodeImageInfo.webp
The *Image Info* node gets information from image and animation.
This can be useful to generate parameters in the geometry node for arbitrary images. Image information can be either
general or frame-specific.

Image
Source image to get parameters from.

Frame
Frame index for frame-specific outputs.

Width
The number of pixels along the X axis. Specific to each frame.

Height
The number of pixels along the Y axis. Specific to each frame.

Has Alpha
Whether the transparency channel be different from 1 for the pixels of this image frame. Specific to each frame.

Frame Count
The number of frames in an image or video frame sequence. For a static image, always 1.

FPS
The number of frames per second. For static image is always 0.
