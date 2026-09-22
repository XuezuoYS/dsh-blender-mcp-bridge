<!-- source: manual/render/shader_nodes/shader/translucent.rst -->

.. _bpy.types.ShaderNodeBsdfTranslucent:

****************

figure: /images/node-types_ShaderNodeBsdfTranslucent.webp
The *Translucent* :abbr:`BSDF (Bidirectional Scattering Distribution Function)`
is used to add Lambertian diffuse transmission.

Color
Color of the surface, or physically speaking, the probability that light is transmitted for each wavelength.
Normal
Normal used for shading; if nothing is connected the default shading normal is used.

This node has no properties.

BSDF
Standard shader output.

[unparsed directive: list-table]
:widths: auto

* - .. figure:: /images/render_shader-nodes_shader_translucent_example.jpg

Translucent shader example.

- .. figure:: /images/render_shader-nodes_shader_translucent_behavior.svg
:width: 308px

Translucent shader behavior.
