<!-- source: manual/modeling/modifiers/generate/mesh_to_volume.rst -->

.. _bpy.types.MeshToVolumeModifier:

***********************

This modifier is only available for :doc:`Volume Objects </modeling/volumes/index>`.
The *Mesh to Volume* modifier uses a mesh to create a new volume grid.
All previously existing volume grids on the volume object are discarded.
So this modifier is usually added to an empty volume object.
The new volume grid is called "density".

tip: 
To copy and move the generated volume separately from the mesh object,
use a :doc:`collection instance </scene_layout/object/properties/instancing/collection>`.

figure: /images/modeling_modifiers_generate_mesh-to-volume_panel.png
Object
The mesh object that determines where the volume data will be generated.

Density
Makes the generated volume appear denser or less dense when rendering.

Interior Band Width
The maximum distance of the included voxels to the surface on the inside of the mesh.

Resolution Mode
Mode for how the voxel size is specified.

:Voxel Amount:
This allows setting an approximate number of voxels that will be used to represent mesh along its diagonal.
When the dimensions of the mesh changes, the voxel size will change as well.
For final rendering of animations, it's better to specify the voxel size explicitly to avoid artifacts.
:Voxel Size:
This allows setting the exact voxel size that will be used.
This is ideal for rendering when the voxel size should not change between frames.

figure: /images/modeling_modifiers_generate_mesh-to-volume_example.png
