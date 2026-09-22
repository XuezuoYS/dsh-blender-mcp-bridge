<!-- source: manual/modeling/geometry_nodes/volume/operations/grid_mean.rst -->

.. _bpy.types.GeometryNodeGridMean:

**************

figure: /images/node-types_GeometryNodeGridMean.webp
The *Grid Mean* node applies a mean (box) filter to a volume grid.
For each active voxel, the value is replaced with the average of neighboring
voxels within a box-shaped region defined by the filter width.

This operation smooths voxel data and reduces high-frequency variations.
It is commonly used to soften density fields, smooth noise,
or prepare volume data for further processing.

Data Type
The type of data stored in the grid (for example *Float*, *Integer*,
or *Vector*). Must match the data type of the input grid.

Grid
The input volume grid to smooth.

Width
The filter kernel radius in voxels.
Larger values increase the size of the neighborhood used for averaging,
resulting in stronger smoothing.

Iterations
Number of times the mean filter is applied.
Higher values produce progressively smoother results.

Grid
The filtered grid with smoothed voxel values.
