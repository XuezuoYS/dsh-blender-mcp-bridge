<!-- source: manual/modeling/geometry_nodes/input/scene/self_object.rst -->

.. _bpy.types.GeometryNodeSelfObject:

****************

figure: /images/node-types_GeometryNodeSelfObject.webp
The *Self Object* node outputs the object that contains the geometry nodes modifier
currently being executed. This can be used to retrieve the original transforms.

When evaluated in the :ref:`Tool context <tool_context>`, this node returns the Active object.

note: 
The geometry cannot be retrieved from this object with the
:doc:`/modeling/geometry_nodes/input/scene/object_info`, since its final geometry is still
being evaluated.

This node has no inputs.

Self Object
The object currently being evaluated.
