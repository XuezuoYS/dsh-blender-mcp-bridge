<!-- source: manual/modeling/geometry_nodes/geometry/write/set_id.rst -->

.. _bpy.types.GeometryNodeSetID:

***********

figure: /images/node-types_GeometryNodeSetID.webp
The *Set ID* node fills the ``id`` attribute on the input geometry. If the attribute does not
exist yet, it will be created with a default value of zero. The ID is also created by
the :doc:`/modeling/geometry_nodes/point/distribute_points_on_faces`, and it is used in
the :doc:`/modeling/geometry_nodes/utilities/random_value` and other nodes if it exists.

The input node for this data is the :doc:`/modeling/geometry_nodes/geometry/read/id`.

Geometry
Standard geometry input.

Selection
Whether or not to change the value on each point or instance.
True values mean the value will be changed, false values mean the value will remain the same.

ID
The value for each element. By default, this input uses
the :doc:`index </modeling/geometry_nodes/geometry/read/input_index>`, which is useful
when stable IDs are desired when deleting a dynamic number of instances.

Geometry
Standard geometry output.
