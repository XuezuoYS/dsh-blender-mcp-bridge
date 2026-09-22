<!-- source: manual/render/shader_nodes/groups.rst -->

.. _bpy.types.CompositorNodeGroup:
.. Editor's Note: This page gets copied into:
- :doc:`/editors/texture_node/types/groups`
- :doc:`/modeling/geometry_nodes/group`
- :doc:`/render/shader_nodes/groups`
.. --- copy below this line ---

*****

A :doc:`Group Node </interface/controls/nodes/groups>` combines a set of nodes into a single one,
and selectively exposes inputs and outputs of those nodes.

Group nodes can simplify a node tree by hiding away complexity and reusing functionality.

Exposes the inputs of the node group. You can have multiple of these nodes in your tree to keep it clean,
bringing in each input right where you need it (rather than dragging long links all across your graph).

The input slots can be edited in the *Group* tab of the *Sidebar*.

Receives the outputs of the node group. You can have multiple of these nodes in your tree to keep it clean,
outputting each result right where it's produced (rather than dragging long links all across your graph).

The output slots can be edited in the *Group* tab of the *Sidebar*.

Lists node groups that are referenced indirectly through other node groups.

This section lists all the node groups, both those in the current blend-file and those
:doc:`Linked or Appended </files/linked_libraries/link_append>` from another blend-file.

.. _bpy.types.ShaderNodeGroup:
.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
