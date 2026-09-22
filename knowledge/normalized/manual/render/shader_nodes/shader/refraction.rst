<!-- source: manual/render/shader_nodes/shader/refraction.rst -->

.. _bpy.types.ShaderNodeBsdfRefraction:

***************

figure: /images/node-types_ShaderNodeBsdfRefraction.webp
The *Refraction* :abbr:`BSDF (Bidirectional Scattering Distribution Function)`
is used to add glossy refraction with sharp or microfacet distribution,
used for materials that transmit light. For best results this node should be considered as
a building block and not be used on its own,
but rather mixed with a glossy node using a Fresnel factor.
Otherwise it will give quite dark results at the edges for glossy refraction.

Color
Color of the surface, or physically speaking, the probability that light is refracted for each wavelength.
Roughness
Influences sharpness of the refraction; perfectly sharp at 0.0 and smoother with higher values.
Normal
Normal used for shading; if nothing is connected the default shading normal is used.

Distribution
Microfacet distribution to use.

:GGX: GGX microfacet distribution.
:Beckmann: :guilabel:`Cycles Only`
Beckmann microfacet distribution.

BSDF
Standard shader output.

figure: /images/render_shader-nodes_shader_refraction_example.jpg
