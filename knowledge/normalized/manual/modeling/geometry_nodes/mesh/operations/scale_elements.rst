<!-- source: manual/modeling/geometry_nodes/mesh/operations/scale_elements.rst -->

.. _bpy.types.GeometryNodeScaleElements:

*******************

figure: /images/node-types_GeometryNodeScaleElements.webp
Scales the selected faces or edges, letting you specify a scaling factor and pivot point for each one.
Connected faces/edges are scaled together using their average factor and pivot point.

Geometry
Standard geometry input.

Selection
Boolean field indicating which elements to scale.

Scale
The scaling factor for each element.

Center
The pivot point for each element.

Axis :guilabel:`Single Axis Mode Only`
Axis along which to scale each element. This vector is normalized internally, so the length does not matter.

Scale Mode
:Uniform: Scale elements by the same factor in every direction.
:Single Axis: Scale elements in a single direction defined by the *Axis* input.

Domain
The element type to transform.

:Face: Scale faces.
:Edge: Scale edges.

Geometry
Standard geometry output.

figure: /images/modeling_geometry-nodes_flip-faces_extrude.png
The node is useful when combined with the :doc:`/modeling/geometry_nodes/mesh/operations/extrude_mesh`,
especially in *Individual* mode where connected faces aren't extruded together.
