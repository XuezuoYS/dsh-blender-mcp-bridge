<!-- source: manual/modeling/geometry_nodes/geometry/operations/merge_points.rst -->

.. _bpy.types.GeometryNodeMergePoints:

*****************

figure: /images/node-types_GeometryNodeMergePoints.webp
The *Merge Points* node merges selected points in a point cloud or mesh.

Points are merged independently for each unique *Merge ID*, allowing
multiple groups of points to be merged in a single operation.

Geometry
Standard geometry input.

Selection
Boolean field indicating which points participate in the merge.

Unselected points are unaffected. They are neither merged into other
points nor can selected points merge into them.

Merge ID
Integer field defining independent merge groups.

Points with the same merge ID are merged together. Points with
different merge IDs are merged separately.

Geometry
The geometry with the selected points merged.
