<!-- source: manual/modeling/geometry_nodes/grease_pencil/operations/grease_pencil_to_curves.rst -->

.. _bpy.types.GeometryNodeGreasePencilToCurves:

****************************

figure: /images/node-types_GeometryNodeGreasePencilToCurves.png
The *Grease Pencil to Curves* node converts each Grease Pencil layer into an instance
that contains curves.

Grease Pencil
Standard Grease Pencil geometry.

Selection
Selects the layers to convert.

Instances as Layers
Create a separate curve instance for every layer.

tip: 
This is equivalent to a :doc:`Realize Instances </modeling/geometry_nodes/instances/realize_instances>`
operation after creating the curve geometry instances. This can simplify some logic later on, but
typically keeping this operation off will be much better for performance.

Curves
Standard curves geometry.
