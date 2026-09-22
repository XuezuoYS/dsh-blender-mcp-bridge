<!-- source: manual/render/shader_nodes/shader/mix.rst -->

.. _bpy.types.ShaderNodeMixShader:

**********

figure: /images/node-types_ShaderNodeMixShader.webp
The *Mix* node is used to mix two shaders together. Mixing can be used for material layering,
where the *Factor* input may, for example, be connected to a *Blend Weight* node.

Shader
Shaders to mix, such that incoming rays hit either with the specified probability in the *Factor* socket.
Factor
Blend weight to use for mixing two shaders;
at zero it uses the first shader entirely and at one the second shader.

This node has no properties.

Shader
Standard shader output.

figure: /images/render_shader-nodes_shader_mix_example.jpg
