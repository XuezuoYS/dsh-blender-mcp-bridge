<!-- source: manual/modeling/geometry_nodes/utilities/bundle/join_bundle.rst -->

.. _bpy.types.NodeJoinBundle:
.. --- copy below this line ---

****************

figure: /images/node-types_NodeJoinBundle.webp
The *Join Bundle* node combines multiple bundles into a single output bundle.
Each connected input bundle is merged together, producing one bundle
that contains all items from the inputs.

Bundle
One or more input bundles to combine.
Each bundle's contents are merged by name into the output bundle.

note: 
If multiple bundles contain sockets with the same name (duplicate keys),
the value from the first occurrence is used.
An information icon in the node header will indicate if duplicate keys are detected.

Bundle
The resulting bundle that contains all items from the input bundles.

Use the :doc:`separate_bundle` to access individual items from the combined bundle if needed.

:start-after: .. --- copy below this line ---
