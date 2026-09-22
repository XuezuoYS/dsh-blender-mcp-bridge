<!-- source: manual/modeling/geometry_nodes/geometry/material/replace_material.rst -->

.. _bpy.types.GeometryNodeReplaceMaterial:

*********************

figure: /images/node-types_GeometryNodeReplaceMaterial.webp
The *Replace Material* node swaps one material with another.
Replacing a material with this node is more efficient than creating a selection of all faces
with the old material with the :doc:`/modeling/geometry_nodes/geometry/material/material_selection`
and then using the :doc:`/modeling/geometry_nodes/geometry/material/set_material`.

note: 
Currently this node only adjusts mesh data.

Geometry
Standard geometry input.

Old
Material that is going to be replaced.

New
Material that is replacing the old material.

Geometry
Standard geometry output.
