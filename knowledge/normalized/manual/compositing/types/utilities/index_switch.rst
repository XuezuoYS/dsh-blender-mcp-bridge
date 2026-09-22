<!-- source: manual/compositing/types/utilities/index_switch.rst -->

.. _bpy.types.GeometryNodeIndexSwitch:
.. --- copy below this line ---

*****************

figure: /images/node-types_GeometryNodeIndexSwitch.webp
The *Index Switch* node outputs one of its inputs based on an integer *Index* value.
Only the selected input is evaluated, making this node useful for switching between
multiple data inputs efficiently.

seealso: 
The :doc:`Menu Switch <menu_switch>` node provides similar functionality,
but exposes the selection as a user-friendly menu rather than an index.

Index
Determines which of the following input sockets is passed through to the output.
The index is zero-based (i.e., the first input corresponds to index 0).

Each socket represents a possible input to select from.
The active input is determined by the *Index* value.

Additional input sockets can be added by either:
- Dragging a connection onto the empty socket at the bottom of the list.
- Clicking the :bl-icon:`add` icon in the node header.

tip: 
When the *Index* input is connected to a :doc:`Menu Switch <menu_switch>` node
set to *Integer* *Type*, the corresponding menu labels will automatically be shown next to the index value.
This provides a clearer context for what each numeric index represents, making node networks more readable.

Type
Determines the type of the data that is handled by the node.

Output
Outputs the value from the input corresponding to the current *Index* value,
without any modification.
If the *Index* value is outside the range of available inputs, the output defaults
to the first input or a zero-equivalent value, depending on the data type.

:start-after: .. --- copy below this line ---
