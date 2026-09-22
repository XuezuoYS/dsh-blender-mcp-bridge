<!-- source: manual/modeling/geometry_nodes/utilities/math/hash_value.rst -->

.. _bpy.types.FunctionNodeHashValue:

***************

figure: /images/node-types_FunctionNodeHashValue.webp
The *Hash Value* node takes a value input and hashes this to
an integer.

important: 
Hashes cannot be relied upon to be used as unique
identifiers because they are not guaranteed to be unique.
It can be used to generate somewhat stable randomness
especially in cases where *White Noise* does not offer
enough flexibility.

Value
Value input determined by *Data Type* property.

Seed
Integer input used to generate different Hashes	.

Data Type
The data type that is used for the *Value* input.
The node supports float, integer, vector, color,
boolean, rotation, matrix and string data types.

Hash
Standard integer output.
