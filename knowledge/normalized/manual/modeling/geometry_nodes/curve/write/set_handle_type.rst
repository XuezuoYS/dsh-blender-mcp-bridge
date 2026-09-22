<!-- source: manual/modeling/geometry_nodes/curve/write/set_handle_type.rst -->

.. _bpy.types.GeometryNodeCurveSetHandles:

********************

figure: /images/node-types_GeometryNodeCurveSetHandles.webp
Sets the handle type for the points on the Bézier curve that are in the selection.

A selection for a certain handle type can be retrieved with
the :doc:`/modeling/geometry_nodes/curve/read/handle_type_selection`.

Curve
Bézier curve.

Selection
The points whose handle types will be changed.

Mode
Whether to update left or right or both handles.
When both are selected, both the left and the right handles will be updated.

:Left:
Update the left handles.
:Right:
Update the right handles.

Handle Type
The handle type to switch to. See the :ref:`Bézier curves <curve-bezier-handle-type>`
page for more details on the different handle types.

Curve
Standard curve output.
