<!-- source: api/bpy.types.bpy_prop.rst -->

### class `bpy.types.bpy_prop`

built-in base class for all property classes.

### method `bpy.types.bpy_prop.as_bytes`

Returns this string property as a byte rather than a Python string.

:return: The string as bytes.
:rtype: bytes

### method `bpy.types.bpy_prop.path_from_id`

Returns the data path from the ID to this property (string).

:return: The path from :class:`bpy.types.bpy_struct.id_data` to this property.
:rtype: str

### method `bpy.types.bpy_prop.path_from_module`

Returns the full data path to this struct (as a string) from the bpy module.

:return: The full path to the data.
:rtype: str

:raises ValueError:
   if the input data cannot be converted into a full data path.

### method `bpy.types.bpy_prop.update`

note: Even if all input data is correct, this function might
error out because Blender cannot derive a valid path.
      The incomplete path will be printed in the error message.
Execute the properties update callback.

### attribute `bpy.types.bpy_prop.data`

note: 
This is called when assigning a property,
   however in rare cases it's useful to call explicitly.
The data this property is using, (readonly)

:type: :class:`bpy.types.bpy_struct`

### attribute `bpy.types.bpy_prop.id_data`

The :class:`bpy.types.ID` object this data-block is from or None, (not available for all data types) (readonly)

:type: :class:`bpy.types.ID`

### attribute `bpy.types.bpy_prop.rna_type`

The property type for introspection.

:type: :class:`bpy.types.Property`

### method `bpy.types.bpy_prop.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `bpy.types.bpy_prop.__ge__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `bpy.types.bpy_prop.__gt__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `bpy.types.bpy_prop.__hash__`

:rtype: int

### method `bpy.types.bpy_prop.__le__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `bpy.types.bpy_prop.__lt__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `bpy.types.bpy_prop.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `bpy.types.bpy_prop.__repr__`

:rtype: str

### method `bpy.types.bpy_prop.__str__`

:rtype: str
