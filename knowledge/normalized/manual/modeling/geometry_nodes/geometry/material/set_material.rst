<!-- source: manual/modeling/geometry_nodes/geometry/material/set_material.rst -->

.. _bpy.types.GeometryNodeSetMaterial:

*****************

figure: /images/node-types_GeometryNodeSetMaterial.webp
The *Set Material* changes the material assignment in the specified selection,
by adjusting the ``material_index`` attribute. If the material is already used
on the geometry, the existing material index will be reused.

note: 
This node adjusts mesh, point clouds, and volume data;
other data types do not support materials.

Geometry
Standard geometry input containing a mesh.

Material
The material to apply to the geometry.

Selection
Whether to change the material of each face.
True values mean the material will be changed, false values mean it will remain the same.

Note, volumes and point clouds only support a single material,
in these cases a field input will be ignored.

Geometry
Standard geometry output.
