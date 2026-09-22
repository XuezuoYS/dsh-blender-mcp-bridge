<!-- source: manual/render/shader_nodes/color/shader_to_rgb.rst -->

.. _bpy.types.ShaderNodeShaderToRGB:

******************

figure: /images/node-types_ShaderNodeShaderToRGB.webp
:guilabel:`EEVEE Only`

The Shader to RGB node is typically used for non-photorealistic rendering,
to apply additional effects on the output of BSDFs.
For example, a color ramp on the output of a diffuse BSDF can be used to create a flexible toon shader.

Using this conversion breaks the :abbr:`PBR (Physically Based Rendering)` pipeline and
thus makes the result unpredictable when used in combination with effects such as
ambient occlusion, contact shadows, soft shadows and screen space refraction.

Some effects require multiple samples to converge, and applying arbitrary changes to
noisy input may not convert to a smooth result.

warning: 
If a Shader to RGB node is used, any upstream BSDF will be invisible to the following effects:

- Screen Space Reflection
- Subsurface Scattering
- Alpha Clip and Alpha Hashed blend modes

Shader to RGB node doesn't give expected results in render passes.

Shader
Any shader such as a BSDF or Emission node can be linked here.

This node has no properties.

Color
Surface color computed from BSDFs and lighting.
Alpha
Alpha transparency from any Transparent BSDFs in the input.

figure: /images/render_shader-nodes_converter_shader-to-rgb_example.jpg
