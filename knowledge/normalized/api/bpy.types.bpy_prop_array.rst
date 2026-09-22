<!-- source: api/bpy.types.bpy_prop_array.rst -->

base classes --- :class:`bpy_prop`

### class `bpy.types.bpy_prop_array`

built-in class used for array properties.

### method `bpy.types.bpy_prop_array.foreach_get`

This is a function to give fast access to array data.

:param seq: Buffer to read element values into, must match the length of this array.
:type seq: MutableSequence[Any]

### method `bpy.types.bpy_prop_array.foreach_set`

This is a function to give fast access to array data.

:param seq: Element values to write, must match the length of this array.
:type seq: Sequence[Any]

### method `bpy.types.bpy_prop_array.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bpy.types.bpy_prop_array.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `bpy.types.bpy_prop_array.__iter__`

:rtype: :class:`bpy_prop_array`

### method `bpy.types.bpy_prop_array.__len__`

:rtype: int

### method `bpy.types.bpy_prop_array.__repr__`

:rtype: str

### method `bpy.types.bpy_prop_array.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object
