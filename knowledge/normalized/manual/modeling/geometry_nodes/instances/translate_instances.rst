<!-- source: manual/modeling/geometry_nodes/instances/translate_instances.rst -->

.. _bpy.types.GeometryNodeTranslateInstances:

************************

figure: /images/node-types_GeometryNodeTranslateInstances.webp
The *Translate Instances* node moves top-level geometry instances in local or global space.

The :doc:`/modeling/geometry_nodes/instances` page contains more information about geometry instances.

Instances
Standard geometry input.

Selection
Boolean field used to determine if an instance will be translated.

Translation
The vector to translate the instances by.

Local Space
If enabled, the instances are translated relative to their initial rotation.
Otherwise they are translated in the local space of the modifier object.

Instances
Standard geometry output.
