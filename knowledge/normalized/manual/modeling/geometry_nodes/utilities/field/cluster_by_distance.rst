<!-- source: manual/modeling/geometry_nodes/utilities/field/cluster_by_distance.rst -->

.. _bpy.types.GeometryNodeClusterByDistance:

************************

figure: /images/node-types_GeometryNodeClusterByDistance.webp
The *Cluster by Distance* node assigns cluster IDs to elements based on the
proximity of their positions.

Elements within the specified distance of one another are assigned the same
cluster ID. Separate *Group ID* values define independent sets of clusters.

For clustering based on mesh connectivity instead of spatial proximity, see
the :doc:`Cluster by Connected </modeling/geometry_nodes/mesh/read/cluster_by_connected>` node.

Selection
Boolean field indicating which elements participate in the clustering.

Unselected elements are ignored and do not contribute to any cluster.

Group ID
Integer field defining independent clustering groups.

Elements with different group IDs are clustered separately, even if they
are within the specified distance.

Position
Position of each element used to measure distances.

Distance
Maximum distance between elements for them to belong to the same cluster.

Cluster ID
Integer field identifying the cluster assigned to each selected element.

Elements with the same cluster ID belong to the same proximity-based cluster.
