<!-- source: manual/modeling/geometry_nodes/instances/instances_to_points.rst -->

.. _bpy.types.GeometryNodeInstancesToPoints:

************************

figure: /images/node-types_GeometryNodeInstancesToPoints.webp
The *Instances to Points* node generates points at the origins of top-level instances.
Attributes on the :ref:`instance domain <attribute-domains>` are moved to the point cloud points.

note: 
Top-level instances are those that are owned by the node's input geometry.
Instances owned by other instances, i.e. nested instances, are not considered
by this node.

Instances
Standard geometry input.

Selection
The instances used to generate points. True values mean a point is created for the instance,
false values mean the instance is skipped.

Position
Overrides the default position of generated point.

Radius
Controls the radius of the result points.

Points
Standard geometry output.
