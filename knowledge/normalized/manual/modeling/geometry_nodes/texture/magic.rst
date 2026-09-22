<!-- source: manual/modeling/geometry_nodes/texture/magic.rst -->

******************

note: 
This node is ported from shader nodes. The manual and images are
referencing the shader version of the node.
This node accepts field inputs and outputs.
When not connected the Vector input has an implicit ``position`` attribute value.
figure: /images/node-types_ShaderNodeTexMagic.webp
The *Magic Texture* node is used to add a psychedelic color texture.

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
