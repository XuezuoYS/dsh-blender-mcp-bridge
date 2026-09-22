<!-- source: manual/modeling/geometry_nodes/mesh/operations/mesh_to_sdf_grid.rst -->

.. _bpy.types.GeometryNodeMeshToSDFGrid:

*********************

figure: /images/node-types_GeometryNodeMeshToSDFGrid.webp
The *Mesh to SDF Grid* node converts a mesh into a Signed Distance Field (SDF)
grid. Each voxel in the resulting grid stores the shortest distance to the
surface of the mesh, with the sign indicating whether the voxel is inside or
outside the mesh.

Positive values represent distances outside the mesh, negative values represent
distances inside the mesh, and zero corresponds to the mesh surface.
SDF grids are useful for many applications, including surface reconstruction,
collision detection, morphing, and volumetric modeling.

Mesh
The input mesh whose volume is converted into a signed distance field grid.

Voxel Size
The size of each voxel in object space units.
Smaller values produce higher-resolution fields that more accurately capture
surface details, but require more memory and computation.

Band Width
The width of the active voxel band around the mesh surface, measured in voxels.
Only voxels within this band store meaningful signed distance values.
Increasing this value captures a wider region around the surface at the cost
of additional memory.

SDF Grid
A float grid representing the signed distance field of the mesh.
Each voxel contains the shortest signed distance to the nearest surface
point of the mesh, with negative values inside and positive values outside.
