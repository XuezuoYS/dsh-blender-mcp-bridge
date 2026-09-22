<!-- source: manual/modeling/geometry_nodes/input/import/vdb.rst -->

.. _bpy.types.GeometryNodeImportVDB:

***************

figure: /images/node-types_GeometryNodeImportVDB.webp
The *Import VDB* node loads volumetric data from a `.vdb` file
and outputs it as a :doc:`Volume </modeling/volumes/introduction>` geometry.
All grids present in the file are loaded and included in the resulting volume.

This node is useful for importing simulation data or procedural volumes created in external software.

Path
The path to the VDB file to be imported.

Volume
A Volume geometry containing all the grids from the specified VDB file.
