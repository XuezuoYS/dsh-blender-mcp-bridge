<!-- source: manual/render/shader_nodes/shader/toon.rst -->

.. _bpy.types.ShaderNodeBsdfToon:

*********

figure: /images/node-types_ShaderNodeBsdfToon.webp
:guilabel:`Cycles Only`

The *Toon* :abbr:`BSDF (Bidirectional Scattering Distribution Function)`
is used to create *Diffuse* and *Glossy* materials with cartoon light effects.

Color
Color of the surface, or physically speaking, the probability that light is reflected for each wavelength.
Size
Parameter between 0.0 and 1.0 that gives an angle of reflection between 0° and 90°.
Smooth
This value specifies an angle over which a smooth transition from full to no reflection happens.
Normal
Normal used for shading; if nothing is connected the default shading normal is used.

Component
The material component to base the toon effect.

:Diffuse: Use shading based on the Diffuse BSDF.
:Glossy: Use shading based on the Glossy BSDF for specular reflection.

BSDF
Standard shader output.

figure: /images/render_shader-nodes_shader_toon_example.jpg
