<!-- source: manual/modeling/geometry_nodes/volume/operations/sdf_grid_mean_curvature.rst -->

.. _bpy.types.GeometryNodeSDFGridMeanCurvature:

****************************

figure: /images/node-types_GeometryNodeSDFGridMeanCurvature.webp
The *SDF Grid Mean Curvature* node applies mean curvature flow smoothing to a Signed Distance Field (SDF) grid.
This operation evolves the surface of the field over time based on its mean curvature,
causing high-curvature (sharp or noisy) regions to smooth out more rapidly than flatter areas.

Unlike simple averaging or Laplacian smoothing, mean curvature flow adapts to
the geometric features of the surface, providing a more natural, shape-preserving
smoothing process. It can be used to refine complex SDF surfaces, remove small
artifacts, and create organically blended transitions between features.

This node is particularly effective after boolean operations or mesh-to-SDF
conversion, where the resulting fields may contain high-frequency noise.

Grid
The input signed distance field to smooth.
Typically, the grid represents a surface or volume generated from a mesh or procedural operation.

Iterations
The number of mean curvature flow iterations to apply.
Each iteration progressively smooths the surface, with higher values
resulting in a more pronounced smoothing effect.
A small number of iterations will gently polish the surface, while
larger values can significantly alter its shape.

Grid
The resulting SDF grid after mean curvature flow smoothing.
The output surface has reduced high-curvature noise and smoother transitions,
while retaining major structural features of the original shape.
