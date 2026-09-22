<!-- source: manual/render/shader_nodes/input/wireframe.rst -->

.. _bpy.types.ShaderNodeWireframe:

**************

figure: /images/node-types_ShaderNodeWireframe.webp
The Wireframe node is used to retrieve the edges of an object as it appears to Cycles.
As meshes are triangulated before being processed by Cycles,
topology will always appear triangulated when viewed with the Wireframe node.

This node has no inputs.

Pixel Size
When enabled, the size of edge lines is set in screen space.
Size
Thickness of the edge lines.

Factor
Black-and-white mask showing white lines representing edges according to the object's :term:`Topology`.

figure: /images/render_shader-nodes_input_wireframe_example.jpg
