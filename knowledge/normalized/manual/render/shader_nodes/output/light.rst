<!-- source: manual/render/shader_nodes/output/light.rst -->

.. _bpy.types.ShaderNodeOutputLight:

*****************

figure: /images/node-types_ShaderNodeOutputLight.webp
The *Light Output* node defines the final shader used by a
:doc:`Light object </render/lights/light_object>`.

It is used to control how a light emits energy in the scene using shader nodes.
Currently, light shaders are only supported by the Cycles render engine.
When evaluated in other contexts or renderers, the node has no effect.

See :ref:`cycles-light-nodes` for more information about using shader nodes with lights.

Surface
Shader defining the emitted light.
Typically this is an :doc:`Emission </render/shader_nodes/shader/emission>` shader,
which controls the light's color and intensity.
Only emission-based shading affects lighting; other shader types have no effect
when connected to a light.

Target
Specifies which render engine the connected shader applies to.

:All: The shader is used by all render engines.
:Cycles: The shader is only used when rendering with Cycles.
:EEVEE: The shader is only used when rendering with EEVEE.

Using multiple *Light Output* nodes with different targets allows creating
renderer-specific light setups.

This node has no outputs.
