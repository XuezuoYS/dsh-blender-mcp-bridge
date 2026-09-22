<!-- source: manual/render/shader_nodes/textures/magic.rst -->

.. _bpy.types.ShaderNodeTexMagic:
.. --- copy below this line ---

******************

figure: /images/node-types_ShaderNodeTexMagic.webp
The Magic Texture node is used to add a psychedelic color texture.
It can be used for "Thin Film Interference" if you assign a *Reflection* Texture Coordinate
to the Vector input and use a relatively high *Turbulence*.
The RGB components are generated independently with a sine formula.

Vector
Texture coordinate to sample texture at;
defaults to Generated texture coordinates if the socket is left unconnected.
Scale
Scale of the texture.
Distortion
Amount of distortion.

Depth
Number of iterations.

Color
Texture color output.
Factor
Texture intensity output.

figure: /images/render_shader-nodes_textures_magic_example.jpg
