<!-- source: manual/compositing/types/input/constant/font.rst -->

.. _bpy.types.GeometryNodeInputFont:
.. --- copy below this line ---

*********

figure: /images/node-types_GeometryNodeInputFont.webp
The *Font* node outputs a font data-block that can be used by other nodes
that require a font input.

This allows a font to be selected directly in a node tree and reused across
multiple nodes. For example, it can be connected to the
:doc:`/modeling/geometry_nodes/utilities/text/string_to_curves`
or used to control the font of a compositor :doc:`/compositing/types/input/string_to_image`.

Font
The font data-block to output.

By default, Blender's built-in font is selected.

.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
