<!-- source: manual/render/shader_nodes/input/volume_info.rst -->

.. _bpy.types.ShaderNodeVolumeInfo:

****************

figure: /images/node-types_ShaderNodeVolumeInfo.webp
The *Volume Info* node provides information about *Smoke Domains*.

This node has no inputs.

This node has no properties.

Color
Gives the color of the smoke inside the :doc:`Fluid Domain </physics/fluid/type/domain/index>`.
The color and vector outputs are the same. The Factor output is an average of the channels.
Density
Gives a scalar defining the density of any smoke inside
the :doc:`Fluid Domain </physics/fluid/type/domain/index>`.
Flame
Gives a scalar defining the density of any fire inside
the :doc:`Fluid Domain </physics/fluid/type/domain/index>`.
All three outputs are the same.
Temperature
Gives a scalar defining the temperature of the volume. Values in the range 0 - 1 map to 0 - 1000 kelvin.
This may be used to render physically-based fire with the Blackbody or Principled Volume shaders.
All three outputs are the same.

figure: /images/render_shader-nodes_input_volume-info_example.jpg
figure: /images/render_shader-nodes_input_volume-info_example-fire.jpg
