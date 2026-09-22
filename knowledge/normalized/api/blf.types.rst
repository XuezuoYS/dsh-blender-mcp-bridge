<!-- source: api/blf.types.rst -->

This module provides access to font drawing types.

### class `blf.types.BLFImBufContext`

Context manager returned by :func:`blf.bind_imbuf` that binds an image buffer
as the destination for text drawing.

### method `blf.types.BLFImBufContext.__enter__`

:rtype: :class:`BLFImBufContext`

### method `blf.types.BLFImBufContext.__exit__`

:param exc_type: Exception type, or ``None``.
   :type exc_type: type | None
   :param exc_value: Exception instance, or ``None``.
   :type exc_value: BaseException | None
   :param traceback: Traceback object, or ``None``.
   :type traceback: BaseException | None
   :rtype: bool
