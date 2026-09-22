<!-- source: manual/modeling/geometry_nodes/point/distribute_points_in_grid.rst -->

.. _bpy.types.GeometryNodeDistributePointsInGrid:

*************************

figure: /images/node-types_GeometryNodeDistributePointsInGrid.webp
The *Distribute Points in Grid* node generates points within the active region
of a voxel grid. The number and placement of points can be controlled using
the grid's density values and various distribution parameters.

This node is useful for scattering geometry procedurally inside a volumetric
region, such as distributing particles in a fog volume, populating points in
a simulation domain, or sampling areas defined by a signed distance field (SDF)
or density grid.

Grid
The input grid that defines the volume within which points are distributed.
The grid's values determine where points can be placed—typically based on
density or occupancy.

Density :guilabel:`Random`
A scaling factor applied to the voxel values that determines the expected
number of points to generate per unit volume.
Higher values produce denser distributions of points.

Seed :guilabel:`Random`
The seed value used by the random number generator for reproducible results.
Changing this value alters the random point distribution without affecting
other parameters.

Spacing :guilabel:`Grid`
The distance between points when using the *Grid* distribution method.
Controls how tightly points are packed inside the volume.

Threshold :guilabel:`Grid`
The minimum voxel density value required for a point to be generated.
Voxels below this threshold are ignored, which can be used to restrict
point placement to denser or more meaningful regions.

Distribution Method
The method used to scatter points inside the grid volume:

:Random:
Distribute points randomly inside the grid, weighted by voxel density.
Produces a natural, stochastic scattering pattern.
:Grid:
Distribute points evenly in a regular grid pattern inside the volume.
The spacing between points is controlled by the *Spacing* input.

Points
A set of generated points positioned inside the grid's active volume,
distributed according to the chosen *Distribution Method* and input parameters.
