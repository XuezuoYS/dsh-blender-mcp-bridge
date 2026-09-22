<!-- source: manual/render/shader_nodes/shader/transparent.rst -->

.. _bpy.types.ShaderNodeBsdfTransparent:

****************

figure: /images/node-types_ShaderNodeBsdfTransparent.webp
The *Transparent* :abbr:`BSDF (Bidirectional Scattering Distribution Function)`
is used to add transparency without refraction, passing straight through the surface,
as if there were no geometry there. Useful with alpha maps, for example.
This shader :ref:`affects light paths somewhat differently <render-cycles-light-paths-transparency>`
than other BSDFs.
Note that only pure white transparent shaders are completely transparent.

Color
Color of the surface, or physically speaking,
the probability for each wavelength that light is blocked or passes straight through the surface.

This node has no properties.

BSDF
Standard shader output.

[unparsed directive: list-table]
:widths: auto

* - .. figure:: /images/render_shader-nodes_shader_transparent_example.jpg

Transparent shader (pure white).

- .. figure:: /images/render_shader-nodes_shader_transparent_behavior.svg
:width: 308px

Transparent shader behavior.

* - .. figure:: /images/render_shader-nodes_shader_transparent_example-dark.jpg

Transparent shader (gray).

- ..
