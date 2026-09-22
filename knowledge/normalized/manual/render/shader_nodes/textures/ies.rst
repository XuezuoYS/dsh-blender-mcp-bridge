<!-- source: manual/render/shader_nodes/textures/ies.rst -->

.. _bpy.types.ShaderNodeTexIES:

****************

figure: /images/node-types_ShaderNodeTexIES.webp
The *IES Texture* is used to match real world lights based on IES files
(:abbr:`IES (Illuminating Engineering Society of North America)`).
IES files store the directional intensity distribution of light sources.

Vector
Texture coordinate for lookup in the light distribution.
Defaults to the normal.
Strength
Light strength multiplier.

Mode
The location to load the IES file from.

:Internal: Use IES profile from a file embedded in a text data-block in the blend-file, for easy distribution.
:External: Load IES profile from a file on the drive.

Factor
Light intensity, typically plugged into the Strength input of an Emission node.

figure: /images/render_shader-nodes_textures_ies_example.jpg
