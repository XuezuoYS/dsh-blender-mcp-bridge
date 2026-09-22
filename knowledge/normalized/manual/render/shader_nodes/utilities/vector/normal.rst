<!-- source: manual/render/shader_nodes/utilities/vector/normal.rst -->

.. _bpy.types.ShaderNodeNormal:

***********

figure: /images/node-types_ShaderNodeNormal.webp
The Normal node generates a normal vector and a dot product.

Normal
Normal vector input.

Normal Direction
To manually set a fixed normal direction vector.
:kbd:`LMB` click and drag on the sphere to set the direction of the normal.
Holding :kbd:`Ctrl` while dragging snaps to 45 degree rotation increments.

Normal
Normal vector output.
Dot
Dot product output. The dot product is a scalar value.

- If two normals are pointing in the same direction the dot product is 1.
- If they are perpendicular the dot product is zero (0).
- If they are antiparallel (facing directly away from each other) the dot product is -1.
