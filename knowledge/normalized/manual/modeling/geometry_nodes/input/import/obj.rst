<!-- source: manual/modeling/geometry_nodes/input/import/obj.rst -->

.. _bpy.types.GeometryNodeImportOBJ:

***************

figure: /images/node-types_GeometryNodeImportOBJ.webp
The *Import OBJ* node loads geometry data from a `.obj` file and outputs it as instances.

Each object defined in the OBJ file is imported as a separate instance,
which helps to preserve scene structure and optimize performance.
This approach allows for efficient manipulation and reuse of the geometry within Geometry Nodes workflows.

This node is useful for importing static 3D assets created in other modeling software.

note: 
The node imports only mesh geometry; materials and textures are not imported.
seealso: 
:ref:`OBJ Import Operator <bpy.ops.wm.obj_import>`

Path
The path to the `.obj` file to be imported.

Instances
A collection of instances representing the objects in the imported file.
