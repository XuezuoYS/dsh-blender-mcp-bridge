<!-- source: manual/render/shader_nodes/input/point_info.rst -->

.. _bpy.types.ShaderNodePointInfo:

**********

:guilabel:`Cycles Only`

figure: /images/node-types_ShaderNodePointInfo.webp
The *Point Info* node can be used in the material node tree for point cloud objects
and gives access to the data of individual points.
It can be useful to give some variation to a single material assigned a point cloud object.

This node has no inputs.

This node has no properties.

Location
Location of the particle.
Radius
Size of the particle.
Random
A random per-point value in the range from 0 to 1.
It can for example be used in combination with a color ramp, to randomize the point color.
