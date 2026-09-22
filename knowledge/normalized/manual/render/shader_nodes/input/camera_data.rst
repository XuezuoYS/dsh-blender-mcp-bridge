<!-- source: manual/render/shader_nodes/input/camera_data.rst -->

.. _bpy.types.ShaderNodeCameraData:

****************

figure: /images/node-types_ShaderNodeCameraData.webp
The *Camera Data* node returns information about the shading point relative to the camera.
This could be used for example to change the shading
of objects further away from the camera, or make custom fog effects.

This node has no inputs.

This node has no properties.

View Vector
A normalized vector, in camera space, from the camera to the shading point.
View Z Depth
The distance each pixel is away from the camera.
View Distance
Distance from the camera to the shading point.
