<!-- source: api/bpy.types.ContextTempOverride.rst -->

### method `bpy.types.ContextTempOverride.logging_set`

Set context member logging options for this temporary override.

:param enable: Enable logging of context member access.
:type enable: bool
:param hide_missing: When true, suppress logging access to members that
   are not available in the current context.
:type hide_missing: bool

### method `bpy.types.ContextTempOverride.__enter__`

:rtype: :class:`ContextTempOverride`

### method `bpy.types.ContextTempOverride.__exit__`

:param exc_type: Exception type, or ``None``.
   :type exc_type: type | None
   :param exc_value: Exception instance, or ``None``.
   :type exc_value: BaseException | None
   :param traceback: Traceback object, or ``None``.
   :type traceback: BaseException | None
   :rtype: bool
