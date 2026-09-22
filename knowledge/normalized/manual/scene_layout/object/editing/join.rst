<!-- source: manual/scene_layout/object/editing/join.rst -->

.. _bpy.ops.object.join:
.. _object-join:

****

:Mode:      Object Mode
:Menu:      :menuselection:`Object --> Join`
:Shortcut:  :kbd:`Ctrl-J`
Join merges all selected objects into the last selected *Active* object.
All object data is linked to the active object (which must be selected).
All objects must be of the same type: mesh, curve, surface or armature.
If several curves are joined, each one will keep its subtype (NURBS or Bézier).

note: 
Object data has many attributes which may be handled when joining.

Materials, vertex groups, UV and Vertex layers will be merged.

Modifiers, constraints, groups and parent relationships are ignored
when joining and will not be applied to the active object.
