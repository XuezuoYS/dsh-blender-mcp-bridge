<!-- source: manual/modeling/geometry_nodes/geometry/geometry_to_instance.rst -->

.. _bpy.types.GeometryNodeGeometryToInstance:

*************************

figure: /images/node-types_GeometryNodeGeometryToInstance.webp
The *Geometry to Instance* node turns every connected input geometry into an instance.
Visually, the node has a similar result as the :doc:`/modeling/geometry_nodes/geometry/join_geometry`,
but it outputs the result as separate instances instead. The geometry data itself isn't actually
joined.

The node can be used in combination with the *Pick Instances* option in the
:doc:`/modeling/geometry_nodes/instances/instance_on_points`, as a way to pick
between geometry generated in the node tree (as opposed to picking from separate
instances from the :doc:`/modeling/geometry_nodes/input/scene/collection_info`, for example).

tip: 
This node can be much faster than the join geometry node when the inputs are large geometries.
This is because the join geometry node must actually create a larger mesh, or a larger curve.
Even though the operation is simple, just creating a large mesh can have a significant cost.
This node can be better, because instead of merging large geometries, it just groups them
together as instances.

Geometry
Geometry that will be joined. Multiple inputs are allowed.
When the node is muted, only the first link will be passed through.

Geometry
Standard geometry output.

figure: /images/modeling_geometry-nodes_geometry_geometry-to-instance_instance.png
The node used in combination with the :doc:`/modeling/geometry_nodes/instances/instance_on_points`
to choose between multiple primitives for instancing.
