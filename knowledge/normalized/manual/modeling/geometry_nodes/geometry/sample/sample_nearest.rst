<!-- source: manual/modeling/geometry_nodes/geometry/sample/sample_nearest.rst -->

.. _bpy.types.GeometryNodeSampleNearest:

*******************

figure: /images/node-types_GeometryNodeSampleNearest.webp
The *Sample Nearest* node retrieves the :doc:`index </modeling/geometry_nodes/geometry/read/input_index>`
of the geometry element in its input geometry that is closest to the input position.

This node is similar to the :doc:`/modeling/geometry_nodes/geometry/sample/geometry_proximity`,
but it outputs the index of the closest element instead of its distance from the current location.

tip: 
If you want to find nearest to each point in same geometry, its better to use
the :doc:`/modeling/geometry_nodes/geometry/sample/index_of_nearest` node.

Geometry
The geometry to sample.

note: 
This node only supports point cloud and mesh inputs.
Sample Position
The position to start from when finding the closest location on the target geometry.
By default, this is the same as if the :doc:`/modeling/geometry_nodes/geometry/read/position` was connected.

Domain
The :ref:`attribute domain <attribute-domains>` to consider the distance from.

Index
The :doc:`index </modeling/geometry_nodes/geometry/read/input_index>` of the closest geometry element of the
chosen domain. For the *Face Corner* domain this is defined to be the closest corner on the closest face.

figure: /images/modeling_geometry-nodes_sample_nearest-example.png
