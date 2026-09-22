<!-- source: manual/modeling/geometry_nodes/utilities/field/field_min_max.rst -->

.. _bpy.types.GeometryNodeFieldMinAndMax:

********************

figure: /images/node-types_GeometryNodeFieldMinAndMax.webp
The *Field Min & Max* calculates the minimum and maximum of a given field.

Value
The values the minimum and maximum will be calculated from

Group ID
An index used to group values together for multiple separate averages.
This can be thought of as a choice of the "bin" in which to place each value.
This input has no effect when it is only a single value.

Data Type
:Float: The node will average a *Float* field.
:Integer: The node will accumulate an *Integer* field.
:Vector: The node will average a *Vector* field.

Domain
The :ref:`attribute domain <attribute-domains>` used for evaluate the *Value* input.

Min
The lowest value in each group.

Max
The highest value in each group.
