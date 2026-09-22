<!-- source: manual/interface/controls/nodes/types/utilities/bundles/typed_bundle.rst -->

.. _bpy.ops.node.add_typed_bundle:
.. --- copy below this line ---

****************

:Editor:    Geometry Node Editor
:Menu:      :menuselection:`Add --> Utilities --> Bundle --> Typed Bundle`
Adds a :doc:`Combine Bundle <combine_bundle>` node configured as a typed bundle.

The operator creates a *Combine Bundle* node containing the required
``Type`` string item and initializes it with the chosen bundle type.
Additional bundle items can then be added as needed.

Type
String identifying the type of the bundle.

important: 
Typed bundles reserve the string item named ``Type`` to identify the
bundle type.

Renaming or removing this item, or using the name ``Type`` for another
string item, will prevent the bundle from being recognized as a typed
bundle.
seealso: 
See :ref:`nodes-typed-bundles` for more information about typed bundles.
