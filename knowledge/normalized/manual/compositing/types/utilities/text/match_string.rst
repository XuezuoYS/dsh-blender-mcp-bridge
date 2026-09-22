<!-- source: manual/compositing/types/utilities/text/match_string.rst -->

.. _bpy.types.FunctionNodeMatchString:
.. --- copy below this line ---

*****************

figure: /images/node-types_FunctionNodeMatchString.webp
The *Match String* node compares two string values and outputs a Boolean result based on the selected operation.
It is useful for conditional logic involving string comparisons, such as matching object names or attribute values.

String
The input string to be evaluated.

Operation
Determines how the input string is compared to the key:

:Starts With:
True if the input string begins with the key.
:Ends With:
True if the input string ends with the key.
:Contains:
True if the input string contains the key anywhere within it.

Key
The target string to compare against.

Result
A Boolean value indicating whether the input string matches the key according to the selected operation.

:start-after: .. --- copy below this line ---
