<!-- source: manual/compositing/types/utilities/text/find_in_string.rst -->

.. _bpy.types.FunctionNodeFindInString:
.. --- copy below this line ---

*******************

figure: /images/node-types_FunctionNodeFindInString.webp
The *Find in String* node searches for a substring within a string and outputs
the position of the first match as well as the total number of matches.

If the substring is not found, the Count output will be zero.

String
The input string in which the search will be conducted.

Search
The substring that will be searched for within the input string.

Mode
Determines how the first match is found.

:From Start:
Finds the first occurrence of the substring starting from the beginning of the string.
:From End:
Finds the last occurrence of the substring by searching from the end of the string.

First Found
The start index of the first matching occurrence of the substring.

When *Mode* is set to *From End*, this corresponds to the start position
of the last occurrence.

Count
The total number of occurrences of the substring within the input string.

:start-after: .. --- copy below this line ---
