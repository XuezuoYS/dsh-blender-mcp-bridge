<!-- source: manual/render/shader_nodes/shader/volume_absorption.rst -->

.. _bpy.types.ShaderNodeVolumeAbsorption:

*****************

figure: /images/node-types_ShaderNodeVolumeAbsorption.webp
The *Volume Absorption* node allows light to be absorbed as it passes through the volume.
Typical usage for this node would be water and colored glass.

Color
Color of the volume.
Density
The density of the absorption effect.

This node has no properties.

Volume
The Volume Shader output must be plugged into the *Volume Input*
of the :doc:`Material </render/shader_nodes/output/material>`
or :doc:`World </render/shader_nodes/output/world>` Output node.

figure: /images/render_shader-nodes_shader_volume-absorption_example.png
