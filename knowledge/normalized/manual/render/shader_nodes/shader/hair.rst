<!-- source: manual/render/shader_nodes/shader/hair.rst -->

.. _bpy.types.ShaderNodeBsdfHair:

*********

figure: /images/node-types_ShaderNodeBsdfHair.webp
:guilabel:`Cycles Only`

The *Hair* :abbr:`BSDF (Bidirectional Scattering Distribution Function)`
node is used to add shading for :doc:`Hair </physics/particles/hair/index>`.

Color
Color of the hair.
Offset
Controls the way the light is rotated (angular shift) for the reflection/transmission.

figure: /images/render_shader-nodes_shader_hair_reflect-offset.png
figure: /images/render_shader-nodes_shader_hair_trans-offset.png
Roughness U/V
Controls the roughness in the direction light is skewed, and perpendicular to it.

[unparsed directive: list-table]

* - .. figure:: /images/render_shader-nodes_shader_hair_reflect-roughness-uv.png

Roughness when using the Reflection Component.

- .. figure:: /images/render_shader-nodes_shader_hair_trans-roughness-uv.png

Roughness when using the Transmission Component.

Tangent
Input tangent.

Component
There are two components that can be used to control the look of the hair.
Usually you are going to want each of these and use a :doc:`Mix Node </render/shader_nodes/shader/mix>`.

:Reflection: The light that bounces off the surface of the hair.
:Transmission: The light that passes through the hair and exits on the other side.

figure: /images/render_shader-nodes_shader_hair_mix-node.png

BSDF
Standard shader output.
