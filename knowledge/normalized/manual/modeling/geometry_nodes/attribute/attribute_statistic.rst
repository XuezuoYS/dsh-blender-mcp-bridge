<!-- source: manual/modeling/geometry_nodes/attribute/attribute_statistic.rst -->

.. _bpy.types.GeometryNodeAttributeStatistic:

************************

figure: /images/node-types_GeometryNodeAttributeStatistic.webp
The *Attribute Statistic* node evaluates a field on a geometry and outputs a statistic about the entire data set.

Geometry
Standard geometry input.

Selection
A boolean field input for each element indicating whether to include its value in the statistics result
If the boolean is false, the corresponding value from the *Attribute* input will be ignored.

Attribute
The attribute field to query a statistic from.

Data Type
:Float:
The output will be a single floating-point value.
:Vector:
The output will be a vector of three floating-point values.
All calculations are elementwise.

Domain
The :ref:`attribute domain <attribute-domains>` used for the statistics
and to evaluate the input *Attribute* field on.

Mean
The average value of all data.

Median
The median value of all data.

Sum
The sum value of all data.

Min
The min value of all data.

Max
The max value of all data.

Range
The difference between the max and min value.

Standard Deviation
How much values differ from the mean.
A low standard deviation indicates that the values are grouped tightly together at the mean.
A high standard deviation indicates that the values are spread out over a large range.

Variance
The variance of all data, defined as the square of the standard deviation.
