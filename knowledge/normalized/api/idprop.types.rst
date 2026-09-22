<!-- source: api/idprop.types.rst -->

### class `idprop.types.IDPropertyArray`

An array of values with a fixed type, supporting indexing and slicing.

### method `idprop.types.IDPropertyArray.to_list`

Return the array as a list.

:return: The array as a list.
:rtype: list[int] | list[float] | list[bool]

### attribute `idprop.types.IDPropertyArray.typecode`

The type of the data in the array {'f': float (32-bit), 'd': double (64-bit), 'i': int, 'b': bool}. Both 'f' and 'd' use Python's :class:`float` type but differ in storage precision.

:type: Literal['f', 'd', 'i', 'b']

### method `idprop.types.IDPropertyArray.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float | int | bool

### method `idprop.types.IDPropertyArray.__getitem__`

:noindex:

   :param key: Index or key.
   :type key: slice
   :rtype: list[float] | list[int] | list[bool]

### method `idprop.types.IDPropertyArray.__len__`

:rtype: int

### method `idprop.types.IDPropertyArray.__repr__`

:rtype: str

### method `idprop.types.IDPropertyArray.__setitem__`

:param key: Index.
   :type key: int
   :param value: Value to assign.
   :type value: float | int | bool

### class `idprop.types.IDPropertyGroup`

A dictionary-like group of ID properties, supporting key access, iteration, and membership testing.

### method `idprop.types.IDPropertyGroup.clear`

note: 
Only supports a maximum of 1024 levels of nesting.
Clear all members from this group.

### method `idprop.types.IDPropertyGroup.get`

Return the value for key, if it exists, else default.

:param key: The key to look up.
:type key: str
:param default: Value to return if *key* is not found.
:type default: Any
:return: The value for the key, or *default* if not found.
:rtype: Any

### method `idprop.types.IDPropertyGroup.items`

Return a view of the items in the group, behaves like dictionary method items.

:return: A view of the items.
:rtype: :class:`IDPropertyGroupViewItems`

### method `idprop.types.IDPropertyGroup.keys`

Return a view of the keys in the group.

:return: A view of the keys.
:rtype: :class:`IDPropertyGroupViewKeys`

### method `idprop.types.IDPropertyGroup.pop`

Remove an item from the group, returning a Python representation.

:raises KeyError: When the item doesn't exist and no *default* is given.

:param key: Name of item to remove.
:type key: str
:param default: Value to return when *key* isn't found (optional, a :exc:`KeyError` is raised when omitted and the key is not found).
:type default: Any
:return: A Python representation of the removed item, or *default*.
:rtype: Any

### method `idprop.types.IDPropertyGroup.to_dict`

Return a purely Python version of the group.

:return: A dictionary representation of the group.
:rtype: dict[str, Any]

### method `idprop.types.IDPropertyGroup.update`

Update key-value pairs from *other*, overwriting existing keys.

### method `idprop.types.IDPropertyGroup.values`

note: 
Unlike :meth:`dict.update`, keyword arguments are not supported.

:param other: Updates the values in the group with this.
:type other: :class:`IDPropertyGroup` | dict[str, Any]
Return the values associated with this group.

:return: A view of the values.
:rtype: :class:`IDPropertyGroupViewValues`

### attribute `idprop.types.IDPropertyGroup.name`

The name of this Group.

:type: str

### method `idprop.types.IDPropertyGroup.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `idprop.types.IDPropertyGroup.__getitem__`

:param key: Property name.
   :type key: str
   :rtype: Any

### method `idprop.types.IDPropertyGroup.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroup.__iter__`

:rtype: :class:`IDPropertyGroupIterKeys`

### method `idprop.types.IDPropertyGroup.__len__`

:rtype: int

### method `idprop.types.IDPropertyGroup.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroup.__setitem__`

:param key: Property name.
   :type key: str
   :param value: Value to assign.
   :type value: Any

### class `idprop.types.IDPropertyGroupIterItems`

Iterator over :class:`IDPropertyGroup` items (key/value pairs).

### method `idprop.types.IDPropertyGroupIterItems.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupIterItems.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroupIterItems.__iter__`

:rtype: :class:`IDPropertyGroupIterItems`

### method `idprop.types.IDPropertyGroupIterItems.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupIterItems.__next__`

:rtype: tuple[str, Any]

### method `idprop.types.IDPropertyGroupIterItems.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroupIterItems.__str__`

:rtype: str

### class `idprop.types.IDPropertyGroupIterKeys`

Iterator over :class:`IDPropertyGroup` keys.

### method `idprop.types.IDPropertyGroupIterKeys.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupIterKeys.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroupIterKeys.__iter__`

:rtype: :class:`IDPropertyGroupIterKeys`

### method `idprop.types.IDPropertyGroupIterKeys.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupIterKeys.__next__`

:rtype: str

### method `idprop.types.IDPropertyGroupIterKeys.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroupIterKeys.__str__`

:rtype: str

### class `idprop.types.IDPropertyGroupIterValues`

Iterator over :class:`IDPropertyGroup` values.

### method `idprop.types.IDPropertyGroupIterValues.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupIterValues.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroupIterValues.__iter__`

:rtype: :class:`IDPropertyGroupIterValues`

### method `idprop.types.IDPropertyGroupIterValues.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupIterValues.__next__`

:rtype: Any

### method `idprop.types.IDPropertyGroupIterValues.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroupIterValues.__str__`

:rtype: str

### class `idprop.types.IDPropertyGroupViewItems`

A view of :class:`IDPropertyGroup` items as key/value pairs (supports ``len()``, ``in``, iteration, and ``reversed()``).

### method `idprop.types.IDPropertyGroupViewItems.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewItems.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewItems.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroupViewItems.__iter__`

:rtype: :class:`IDPropertyGroupIterItems`

### method `idprop.types.IDPropertyGroupViewItems.__len__`

:rtype: int

### method `idprop.types.IDPropertyGroupViewItems.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewItems.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroupViewItems.__str__`

:rtype: str

### class `idprop.types.IDPropertyGroupViewKeys`

A view of :class:`IDPropertyGroup` keys (supports ``len()``, ``in``, iteration, and ``reversed()``).

### method `idprop.types.IDPropertyGroupViewKeys.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewKeys.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewKeys.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroupViewKeys.__iter__`

:rtype: :class:`IDPropertyGroupIterKeys`

### method `idprop.types.IDPropertyGroupViewKeys.__len__`

:rtype: int

### method `idprop.types.IDPropertyGroupViewKeys.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewKeys.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroupViewKeys.__str__`

:rtype: str

### class `idprop.types.IDPropertyGroupViewValues`

A view of :class:`IDPropertyGroup` values (supports ``len()``, ``in``, iteration, and ``reversed()``).

### method `idprop.types.IDPropertyGroupViewValues.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewValues.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewValues.__hash__`

:rtype: int

### method `idprop.types.IDPropertyGroupViewValues.__iter__`

:rtype: :class:`IDPropertyGroupIterValues`

### method `idprop.types.IDPropertyGroupViewValues.__len__`

:rtype: int

### method `idprop.types.IDPropertyGroupViewValues.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `idprop.types.IDPropertyGroupViewValues.__repr__`

:rtype: str

### method `idprop.types.IDPropertyGroupViewValues.__str__`

:rtype: str
