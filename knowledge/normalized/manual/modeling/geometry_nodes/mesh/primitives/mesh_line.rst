<!-- source: manual/modeling/geometry_nodes/mesh/primitives/mesh_line.rst -->

.. _bpy.types.GeometryNodeMeshLine:

**************

figure: /images/node-types_GeometryNodeMeshLine.webp
The *Mesh Line* node generates vertices in a line and connects them with edges.

Count
Number of vertices on the line.

Resolution
Length of individual edges.
The node tries to fit as many vertices as possible between the start and end point.
The exact end point might not be hit.
This is only available when the mode is set to *End Points* and the count mode is set to *Resolution*.

Start Location
Position of the first vertex.

Offset
Controls the direction of the line and distance between the vertices.
This is only available when the mode is set to *Offset*.

End Location
Position of the last vertex.
This is only available when the mode is set to *End Points*.

Mode
Inputs to use to control the line.

:Offset: Specify the offset from one vertex to the next.
:End Points: Specify the start and end point of the line.

Count Mode
Determines how the number of vertices is chosen.
This is only available when the mode is set to *End Points*.

:Count: Specify the total number of vertices.
:Resolution: Specify the distance between vertices.

Mesh
Standard geometry output.
