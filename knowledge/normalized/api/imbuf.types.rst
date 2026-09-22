<!-- source: api/imbuf.types.rst -->

This module provides access to image buffer types.

### class `imbuf.types.ImBuf`

note: 
Image buffer is also the structure used by :class:`bpy.types.Image`
ID type to store and manipulate image data at runtime.

### method `imbuf.types.ImBuf.convert_buffer_type`

Convert the image's pixel buffer to the given type.
When the image is already of the given type this is a no-op.
The previous buffer is freed.

:param buffer_type: The buffer type.
:type buffer_type: Literal['BYTE', 'FLOAT']

### method `imbuf.types.ImBuf.copy`

Return a copy of the image.

:return: A copy of the image.
:rtype: :class:`ImBuf`

### method `imbuf.types.ImBuf.crop`

Crop the image in-place.

:param min: Minimum pixel coordinates (X, Y), inclusive.
:type min: tuple[int, int]
:param max: Maximum pixel coordinates (X, Y), inclusive.
:type max: tuple[int, int]

### method `imbuf.types.ImBuf.free`

Clear image data immediately (causing an error on re-use).

### method `imbuf.types.ImBuf.resize`

Resize the image in-place.

:param size: New size.
:type size: tuple[int, int]
:param method: Method of resizing ('FAST', 'BILINEAR').
:type method: str

### method `imbuf.types.ImBuf.with_buffer`

Return a context manager that yields a :class:`memoryview` of the image's pixel data, shaped ``(height, width, channels)``.

Usage::

   with image.with_buffer(write=True) as buf:
       buf[0, 0, 0] = 255  # set red channel of pixel (0, 0)

:param write: When true the buffer is writable.
:type write: bool
:param region: Optional sub-region ``((x_min, y_min), (x_max, y_max))``, clamped to image bounds. When set the shape becomes ``(region_height, region_width, channels)``.
:type region: tuple[tuple[int, int], tuple[int, int]] | None
:return: A context manager yielding a :class:`memoryview` of pixel data.
:rtype: :class:`ImBufBuffer`

### attribute `imbuf.types.ImBuf.buffer_type`

Type of the image's pixel buffer (``'BYTE'`` or ``'FLOAT'``).

:type: str

### attribute `imbuf.types.ImBuf.channels`

Number of color channels.

:type: int

### attribute `imbuf.types.ImBuf.compress`

Compression level for formats that support lossless compression levels (0 - 100, clamped).

:type: int

### attribute `imbuf.types.ImBuf.file_type`

The file type identifier.

:type: str

### attribute `imbuf.types.ImBuf.filepath`

Filepath associated with this image.

:type: str | bytes

### attribute `imbuf.types.ImBuf.planes`

Number of bits per pixel for the byte buffer.
Used when reading and writing image files.

- 8: Gray-scale.
- 16: Gray-scale with alpha.
- 24: RGB.
- 32: RGBA.

### attribute `imbuf.types.ImBuf.ppm`

note: 
This value may be set by the file format on load,
   and determines how many channels are written on save.

:type: int
Pixels per meter.

:type: tuple[float, float]

### attribute `imbuf.types.ImBuf.quality`

Quality for formats that support lossy compression (0 - 100, clamped).

:type: int

### attribute `imbuf.types.ImBuf.size`

Size of the image in pixels.

:type: tuple[int, int]

### method `imbuf.types.ImBuf.__hash__`

:rtype: int

### method `imbuf.types.ImBuf.__repr__`

:rtype: str

### method `imbuf.types.ImBufBuffer.__enter__`

:rtype: :class:`ImBufBuffer`

### method `imbuf.types.ImBufBuffer.__exit__`

:param exc_type: Exception type, or ``None``.
   :type exc_type: type | None
   :param exc_value: Exception instance, or ``None``.
   :type exc_value: BaseException | None
   :param traceback: Traceback object, or ``None``.
   :type traceback: BaseException | None
   :rtype: bool

### method `imbuf.types.ImBufBuffer.__repr__`

:rtype: str

### attribute `imbuf.types.ImBufFileType.file_extensions`

The file extensions associated with this image file type (e.g. ``(".jpg", ".jpeg")``).

:type: tuple[str, ...]

### attribute `imbuf.types.ImBufFileType.has_read_file`

True when images of this file type can be read from a file.

:type: bool

### attribute `imbuf.types.ImBufFileType.has_read_memory`

True when images of this file type can be read from memory.

:type: bool

### attribute `imbuf.types.ImBufFileType.has_write_file`

True when images of this file type can be written to a file.

:type: bool

### attribute `imbuf.types.ImBufFileType.has_write_memory`

True when images of this file type can be written to memory.

:type: bool

### attribute `imbuf.types.ImBufFileType.id`

The identifier for this image file type (e.g. ``"PNG"``, ``"JPEG"``).

:type: str

### method `imbuf.types.ImBufFileType.__hash__`

:rtype: int

### method `imbuf.types.ImBufFileType.__repr__`

:rtype: str
