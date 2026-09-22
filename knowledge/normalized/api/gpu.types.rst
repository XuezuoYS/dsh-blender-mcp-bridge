<!-- source: api/gpu.types.rst -->

### class `gpu.types.Buffer`

For Python access to GPU functions requiring a pointer.

### method `gpu.types.Buffer.__init__`

:param format: Format type to interpret the buffer.
   ``UINT_24_8`` is deprecated, use ``FLOAT`` instead.
:type format: Literal['FLOAT', 'INT', 'UINT', 'UBYTE', 'UINT_24_8', '10_11_11_REV']
:param dimensions: Array describing the dimensions.
:type dimensions: int | Sequence[int]
:param data: Optional data array.
:type data: Buffer | Sequence[float] | Sequence[int]

### method `gpu.types.Buffer.to_list`

Return the buffer as a list.

:return: The buffer as a list.
:rtype: list

### attribute `gpu.types.Buffer.dimensions`

The size of the buffer for each dimension.

Setting the dimensions is supported when the total number of elements is unchanged.

:type: list[int]

### method `gpu.types.Buffer.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `gpu.types.Buffer.__len__`

:rtype: int

### method `gpu.types.Buffer.__repr__`

:rtype: str

### method `gpu.types.Buffer.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### class `gpu.types.GPUBatch`

Reusable container for drawable geometry.

### method `gpu.types.GPUBatch.__init__`

:param type: The primitive type of geometry to be drawn.
:type type: Literal['POINTS', 'LINES', 'TRIS', 'LINE_STRIP', 'LINE_LOOP', 'TRI_STRIP', 'TRI_FAN', 'LINES_ADJ', 'TRIS_ADJ', 'LINE_STRIP_ADJ']
:param buf: Vertex buffer containing all or some of the attributes required for drawing.
:type buf: :class:`gpu.types.GPUVertBuf`
:param elem: An optional index buffer.
:type elem: :class:`gpu.types.GPUIndexBuf` | None

### method `gpu.types.GPUBatch.draw`

Run the drawing shader with the parameters assigned to the batch.

:param shader: Shader that performs the drawing operations.
   If ``None`` is passed, the last shader set to this batch will run.
:type shader: :class:`gpu.types.GPUShader` | None

### method `gpu.types.GPUBatch.draw_instanced`

Draw multiple instances of the drawing program with the parameters assigned
to the batch. In the vertex shader, ``gl_InstanceID`` will contain the instance
number being drawn.

:param program: Program that performs the drawing operations.
:type program: :class:`gpu.types.GPUShader`
:param instance_start: Number of the first instance to draw.
:type instance_start: int
:param instance_count: Number of instances to draw. When not provided or set to 0
   the number of instances will be determined by the number of rows in the first
   vertex buffer.
:type instance_count: int

### method `gpu.types.GPUBatch.draw_range`

Run the drawing program with the parameters assigned to the batch. Only draw the ``elem_count`` elements of the index buffer starting at ``elem_start``.

:param program: Program that performs the drawing operations.
:type program: :class:`gpu.types.GPUShader`
:param elem_start: First index to draw. When not provided or set to 0 drawing
   will start from the first element of the index buffer.
:type elem_start: int
:param elem_count: Number of elements of the index buffer to draw. When not
   provided or set to 0 all elements from ``elem_start`` to the end of the
   index buffer will be drawn.
:type elem_count: int

### method `gpu.types.GPUBatch.program_set`

Assign a shader to this batch that will be used for drawing when not overwritten later.
Note: This method has to be called in the draw context that the batch will be drawn in.
This function does not need to be called when you always
set the shader when calling :meth:`gpu.types.GPUBatch.draw`.

:param program: The program/shader the batch will use in future draw calls.
:type program: :class:`gpu.types.GPUShader`

### method `gpu.types.GPUBatch.vertbuf_add`

Add another vertex buffer to the Batch.
It is not possible to add more vertices to the batch using this method.
Instead it can be used to add more attributes to the existing vertices.
A good use case would be when you have a separate
vertex buffer for vertex positions and vertex normals.
Current a batch can have at most GPU_BATCH_VBO_MAX_LEN vertex buffers.

:param buf: The vertex buffer that will be added to the batch.
:type buf: :class:`gpu.types.GPUVertBuf`

### class `gpu.types.GPUDevice`

Represents a GPU device.

:ivar index: Device index.
:type index: int
:ivar identifier: Device identifier.
:type identifier: str
:ivar name: Device name.
:type name: str

### attribute `gpu.types.GPUDevice.identifier`

Device identifier.

:type: str

### attribute `gpu.types.GPUDevice.index`

Device index.

:type: int

### attribute `gpu.types.GPUDevice.name`

Device name.

:type: str

### method `gpu.types.GPUDevice.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `gpu.types.GPUDevice.__ge__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `gpu.types.GPUDevice.__gt__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `gpu.types.GPUDevice.__le__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `gpu.types.GPUDevice.__lt__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `gpu.types.GPUDevice.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `gpu.types.GPUDevice.__repr__`

:rtype: str

### class `gpu.types.GPUFrameBuffer`

This object gives access to framebuffer functionalities.
When a 'layer' is specified in a argument, a single layer of a 3D or array texture is attached to the frame-buffer.
For cube map textures, layer is translated into a cube map face.

### method `gpu.types.GPUFrameBuffer.__init__`

:param depth_slot: GPUTexture to attach or a ``dict`` containing keywords: 'texture', 'layer' and 'mip'.
:type depth_slot: :class:`gpu.types.GPUTexture` | dict[str, int | :class:`gpu.types.GPUTexture`] | None
:param color_slots: Tuple where each item can be a GPUTexture or a ``dict`` containing keywords: 'texture', 'layer' and 'mip'.
:type color_slots: :class:`gpu.types.GPUTexture` | dict[str, int | :class:`gpu.types.GPUTexture`] | Sequence[:class:`gpu.types.GPUTexture` | dict[str, int | :class:`gpu.types.GPUTexture`]] | None

### method `gpu.types.GPUFrameBuffer.bind`

Context manager to ensure balanced bind calls, even in the case of an error.

### method `gpu.types.GPUFrameBuffer.clear`

Fill color, depth and stencil textures with specific value.
Common values: color=(0.0, 0.0, 0.0, 1.0), depth=1.0, stencil=0.

:param color: Sequence of 3 or 4 floats representing ``(r, g, b, a)``.
:type color: Sequence[float] | None
:param depth: depth value.
:type depth: float | None
:param stencil: stencil value.
:type stencil: int | None

### method `gpu.types.GPUFrameBuffer.read_color`

Read a block of pixels from the frame buffer.

:param x: Lower left corner x of a rectangular block of pixels.
:type x: int
:param y: Lower left corner y of a rectangular block of pixels.
:type y: int
:param xsize: Width of the pixel rectangle.
:type xsize: int
:param ysize: Height of the pixel rectangle.
:type ysize: int
:param channels: Number of components to read.
:type channels: int
:param slot: The framebuffer slot to read data from.
:type slot: int
:param format: The format that describes the content of a single channel.
   ``UINT_24_8`` is deprecated, use ``FLOAT`` instead.
:type format: Literal['FLOAT', 'INT', 'UINT', 'UBYTE', 'UINT_24_8', '10_11_11_REV']
:param data: Optional Buffer object to fill with the pixels values.
:type data: :class:`gpu.types.Buffer` | None
:return: The Buffer with the read pixels.
:rtype: :class:`gpu.types.Buffer`

### method `gpu.types.GPUFrameBuffer.read_depth`

Read a pixel depth block from the frame buffer.

:param x: Lower left corner x of a rectangular block of pixels.
:type x: int
:param y: Lower left corner y of a rectangular block of pixels.
:type y: int
:param xsize: Width of the pixel rectangle.
:type xsize: int
:param ysize: Height of the pixel rectangle.
:type ysize: int
:param data: Optional Buffer object to fill with the pixels values.
:type data: :class:`gpu.types.Buffer` | None
:return: The Buffer with the read pixels.
:rtype: :class:`gpu.types.Buffer`

### method `gpu.types.GPUFrameBuffer.viewport_get`

Returns position and dimension to current viewport.

:return: The viewport as ``(x, y, width, height)``.
:rtype: tuple[int, int, int, int]

### method `gpu.types.GPUFrameBuffer.viewport_set`

Set the viewport for this framebuffer object.
Note: The viewport state is not saved upon framebuffer rebind.

:param x: Lower left corner x of the viewport rectangle, in pixels.
:type x: int
:param y: Lower left corner y of the viewport rectangle, in pixels.
:type y: int
:param xsize: Width of the viewport.
:type xsize: int
:param ysize: Height of the viewport.
:type ysize: int

### attribute `gpu.types.GPUFrameBuffer.is_bound`

Checks if this is the active frame-buffer in the context.

:type: bool

### class `gpu.types.GPUIndexBuf`

Contains an index buffer.

### method `gpu.types.GPUIndexBuf.__init__`

:param type: The primitive type this index buffer is composed of.
:type type: Literal['POINTS', 'LINES', 'TRIS', 'LINES_ADJ', 'TRIS_ADJ']
:param seq: Indices this index buffer will contain.
   Whether a 1D or 2D sequence is required depends on the type.
   Optionally the sequence can support the buffer protocol.
:type seq: Buffer | Sequence[int] | Sequence[Sequence[int]]

### class `gpu.types.GPUOffScreen`

This object gives access to off screen buffers.

### method `gpu.types.GPUOffScreen.__init__`

:param width: Horizontal dimension of the buffer.
:type width: int
:param height: Vertical dimension of the buffer.
:type height: int
:param format: Internal data format inside GPU memory for color attachment texture.
:type format: Literal['RGBA8', 'RGBA16', 'RGBA16F', 'RGBA32F']

### method `gpu.types.GPUOffScreen.bind`

Context manager to ensure balanced bind calls, even in the case of an error.

:return: A context manager for the off-screen binding.
:rtype: :class:`gpu.types.OffScreenStackContext`

### method `gpu.types.GPUOffScreen.draw_view3d`

Draw the 3d viewport in the offscreen object.

:param scene: Scene to draw.
:type scene: :class:`bpy.types.Scene`
:param view_layer: View layer to draw.
:type view_layer: :class:`bpy.types.ViewLayer`
:param view3d: 3D View to get the drawing settings from.
:type view3d: :class:`bpy.types.SpaceView3D`
:param region: Region of the 3D View (required as temporary draw target).
:type region: :class:`bpy.types.Region`
:param view_matrix: View Matrix (e.g. ``camera.matrix_world.inverted()``).
:type view_matrix: :class:`mathutils.Matrix`
:param projection_matrix: Projection Matrix (e.g. ``camera.calc_matrix_camera(...)``).
:type projection_matrix: :class:`mathutils.Matrix`
:param do_color_management: Color manage the output.
:type do_color_management: bool
:param draw_background: Draw background.
:type draw_background: bool

### method `gpu.types.GPUOffScreen.free`

Free the offscreen object.
The framebuffer, texture and render objects will no longer be accessible.

### method `gpu.types.GPUOffScreen.unbind`

Unbind the offscreen object.

:param restore: Restore the OpenGL state, can only be used when the state has been saved before.
:type restore: bool

### attribute `gpu.types.GPUOffScreen.height`

Height of the texture.

:type: int

### attribute `gpu.types.GPUOffScreen.texture_color`

The color texture attached.

:type: :class:`gpu.types.GPUTexture`

### attribute `gpu.types.GPUOffScreen.width`

Width of the texture.

:type: int

### method `gpu.types.GPUShader.attr_from_name`

Get attribute location by name.

:param name: The name of the attribute variable whose location is to be queried.
:type name: str
:return: The location of an attribute variable.
:rtype: int

### method `gpu.types.GPUShader.attrs_info_get`

Information about the attributes used in the Shader.

:return: tuples containing information about the attributes in order (name, type)
:rtype: tuple[tuple[str, str | None], ...]

### method `gpu.types.GPUShader.bind`

Bind the shader object. Required to be able to change uniforms of this shader.

### method `gpu.types.GPUShader.format_calc`

Build a new format based on the attributes of the shader.

:return: vertex attribute format for the shader
:rtype: :class:`gpu.types.GPUVertFormat`

### method `gpu.types.GPUShader.image`

Specify the value of an image variable for the current GPUShader.

:param name: Name of the image variable to which the texture is to be bound.
:type name: str
:param texture: Texture to attach.
:type texture: :class:`gpu.types.GPUTexture`

### method `gpu.types.GPUShader.uniform_block`

Specify the value of a uniform buffer object variable for the current GPUShader.

:param name: Name of the uniform variable whose UBO is to be specified.
:type name: str
:param ubo: Uniform Buffer to attach.
:type ubo: :class:`gpu.types.GPUUniformBuf`

### method `gpu.types.GPUShader.uniform_block_from_name`

Get uniform block location by name.

:param name: Name of the uniform block variable whose location is to be queried.
:type name: str
:return: The location of the uniform block variable.
:rtype: int

### method `gpu.types.GPUShader.uniform_bool`

Specify the value of a uniform variable for the current program object.

:param name: Name of the uniform variable whose value is to be changed.
:type name: str
:param value: Value that will be used to update the specified uniform variable.
:type value: bool | Sequence[bool]

### method `gpu.types.GPUShader.uniform_float`

Specify the value of a uniform variable for the current program object.

:param name: Name of the uniform variable whose value is to be changed.
:type name: str
:param value: Value that will be used to update the specified uniform variable.
:type value: float | Sequence[float]

### method `gpu.types.GPUShader.uniform_from_name`

Get uniform location by name.

:param name: Name of the uniform variable whose location is to be queried.
:type name: str
:return: Location of the uniform variable.
:rtype: int

### method `gpu.types.GPUShader.uniform_int`

Specify the value of a uniform variable for the current program object.

:param name: Name of the uniform variable whose value is to be changed.
:type name: str
:param seq: Value that will be used to update the specified uniform variable.
:type seq: int | Sequence[int]

### method `gpu.types.GPUShader.uniform_sampler`

Specify the value of a texture uniform variable for the current GPUShader.

:param name: Name of the uniform variable whose texture is to be specified.
:type name: str
:param texture: Texture to attach.
:type texture: :class:`gpu.types.GPUTexture`

### method `gpu.types.GPUShader.uniform_vector_float`

Set the buffer to fill the uniform.

:param location: Location of the uniform variable to be modified.
:type location: int
:param buffer: The data that should be set. Can support the buffer protocol.
:type buffer: Sequence[float]
:param length: Size of the uniform data type:

   - 1: float
   - 2: vec2 or float[2]
   - 3: vec3 or float[3]
   - 4: vec4 or float[4]
   - 9: mat3
   - 16: mat4
:type length: int
:param count: Specifies the number of elements, vector or matrices that are to be modified.
:type count: int

### method `gpu.types.GPUShader.uniform_vector_int`

Set the buffer to fill the uniform.

:param location: Location of the uniform variable to be modified.
:type location: int
:param buffer: Buffer object with format matching the uniform.
:type buffer: Buffer
:param length: Size of the uniform data type.
:type length: int
:param count: Specifies the number of elements that are to be modified.
:type count: int

### attribute `gpu.types.GPUShader.name`

The name of the shader object for debugging purposes (read-only).

:type: str

### attribute `gpu.types.GPUShader.program`

The name of the program object for use by the OpenGL API (read-only).
This is deprecated and will always return -1.

:type: int

### class `gpu.types.GPUShaderCreateInfo`

Stores and describes types and variables that are used in shader sources.

### method `gpu.types.GPUShaderCreateInfo.compute_source`

compute shader source code written in GLSL.

Example:

### method `gpu.types.GPUShaderCreateInfo.define`

```
"""void main() {
      int2 index = int2(gl_GlobalInvocationID.xy);
      vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
      imageStore(img_output, index, color);
   }"""

:param source: The compute shader source code.
:type source: str
```
seealso: `GLSL Cross Compilation <https://developer.blender.org/docs/features/gpu/glsl_cross_compilation/>`__
Add a preprocessing define directive. In GLSL it would be something like:

### method `gpu.types.GPUShaderCreateInfo.depth_write`

```
#define name value

:param name: Token name.
:type name: str
:param value: Text that replaces token occurrences.
:type value: str
```
Specify a depth write behavior when modifying gl_FragDepth.

There is a common optimization for GPUs that relies on an early depth
test to be run before the fragment shader so that the shader evaluation
can be skipped if the fragment ends up being discarded because it is occluded.

This optimization does not affect the final rendering, and is typically
possible when the fragment does not change the depth programmatically.
There is, however, a class of operations on the depth in the shader which
could still be performed while allowing the early depth test to operate.

This function alters the behavior of the optimization to allow those operations
to be performed.

:param value: Depth write value.
   :UNCHANGED: disables depth write in a fragment shader and execution of the fragments can be optimized away.
   :ANY: enables depth write in a fragment shader for any fragments
   :GREATER: enables depth write in a fragment shader for depth values that are greater than the depth value in the output buffer.
   :LESS: enables depth write in a fragment shader for depth values that are less than the depth value in the output buffer.
:type value: Literal['UNCHANGED', 'ANY', 'GREATER', 'LESS']

### method `gpu.types.GPUShaderCreateInfo.fragment_out`

Specify a fragment output corresponding to a framebuffer target slot.

:param slot: The attribute index.
:type slot: int
:param type: The data type of the output.
:type type: Literal['FLOAT', 'VEC2', 'VEC3', 'VEC4', 'MAT3', 'MAT4', 'UINT', 'UVEC2', 'UVEC3', 'UVEC4', 'INT', 'IVEC2', 'IVEC3', 'IVEC4', 'BOOL']
:param name: Name of the attribute.
:type name: str
:param blend: Dual Source Blending Index.
:type blend: Literal['NONE', 'SRC_0', 'SRC_1']

### method `gpu.types.GPUShaderCreateInfo.fragment_source`

Fragment shader source code written in GLSL.

Example:

### method `gpu.types.GPUShaderCreateInfo.image`

```
"void main() {fragColor = vec4(0.0, 0.0, 0.0, 1.0);}"

:param source: The fragment shader source code.
:type source: str
```
seealso: `GLSL Cross Compilation <https://developer.blender.org/docs/features/gpu/glsl_cross_compilation/>`__
Specify an image resource used for arbitrary load and store operations.

:param slot: The image resource index.
:type slot: int
:param format: The GPUTexture format that is passed to the shader.
:type format: Literal['RGBA8UI', 'RGBA8I', 'RGBA8', 'RGBA32UI', 'RGBA32I', 'RGBA32F', 'RGBA16UI', 'RGBA16I', 'RGBA16F', 'RGBA16', 'RG8UI', 'RG8I', 'RG8', 'RG32UI', 'RG32I', 'RG32F', 'RG16UI', 'RG16I', 'RG16F', 'RG16', 'R8UI', 'R8I', 'R8', 'R32UI', 'R32I', 'R32F', 'R16UI', 'R16I', 'R16F', 'R16', 'R11F_G11F_B10F', 'DEPTH32F_STENCIL8', 'DEPTH24_STENCIL8', 'SRGB8_A8', 'RGB16F', 'SRGB8_A8_DXT1', 'SRGB8_A8_DXT3', 'SRGB8_A8_DXT5', 'RGBA8_DXT1', 'RGBA8_DXT3', 'RGBA8_DXT5', 'DEPTH_COMPONENT32F', 'DEPTH_COMPONENT24', 'DEPTH_COMPONENT16']
:param type: The data type describing how the image is to be read in the shader.
:type type: Literal['FLOAT_BUFFER', 'FLOAT_1D', 'FLOAT_1D_ARRAY', 'FLOAT_2D', 'FLOAT_2D_ARRAY', 'FLOAT_3D', 'FLOAT_CUBE', 'FLOAT_CUBE_ARRAY', 'INT_BUFFER', 'INT_1D', 'INT_1D_ARRAY', 'INT_2D', 'INT_2D_ARRAY', 'INT_3D', 'INT_CUBE', 'INT_CUBE_ARRAY', 'UINT_BUFFER', 'UINT_1D', 'UINT_1D_ARRAY', 'UINT_2D', 'UINT_2D_ARRAY', 'UINT_3D', 'UINT_CUBE', 'UINT_CUBE_ARRAY', 'SHADOW_2D', 'SHADOW_2D_ARRAY', 'SHADOW_CUBE', 'SHADOW_CUBE_ARRAY', 'DEPTH_2D', 'DEPTH_2D_ARRAY', 'DEPTH_CUBE', 'DEPTH_CUBE_ARRAY']
:param name: The image resource name.
:type name: str
:param qualifiers: Set containing values that describe how the image resource is to be read or written.
:type qualifiers: set[Literal['NO_RESTRICT', 'READ', 'WRITE']]

### method `gpu.types.GPUShaderCreateInfo.local_group_size`

Specify the local group size for compute shaders.

:param x: The local group size in the x dimension.
:type x: int
:param y: The local group size in the y dimension. Optional. Defaults to 1.
:type y: int
:param z: The local group size in the z dimension. Optional. Defaults to 1.
:type z: int

### method `gpu.types.GPUShaderCreateInfo.push_constant`

Specify a global access constant.

:param type: The data type of the constant.
:type type: Literal['FLOAT', 'VEC2', 'VEC3', 'VEC4', 'MAT3', 'MAT4', 'UINT', 'UVEC2', 'UVEC3', 'UVEC4', 'INT', 'IVEC2', 'IVEC3', 'IVEC4', 'BOOL']
:param name: Name of the constant.
:type name: str
:param size: If not zero, indicates that the constant is an array with the specified size.
:type size: int

### method `gpu.types.GPUShaderCreateInfo.sampler`

Specify an image texture sampler.

:param slot: The image texture sampler index.
:type slot: int
:param type: The data type describing the format of each sampler unit.
:type type: Literal['FLOAT_BUFFER', 'FLOAT_1D', 'FLOAT_1D_ARRAY', 'FLOAT_2D', 'FLOAT_2D_ARRAY', 'FLOAT_3D', 'FLOAT_CUBE', 'FLOAT_CUBE_ARRAY', 'INT_BUFFER', 'INT_1D', 'INT_1D_ARRAY', 'INT_2D', 'INT_2D_ARRAY', 'INT_3D', 'INT_CUBE', 'INT_CUBE_ARRAY', 'UINT_BUFFER', 'UINT_1D', 'UINT_1D_ARRAY', 'UINT_2D', 'UINT_2D_ARRAY', 'UINT_3D', 'UINT_CUBE', 'UINT_CUBE_ARRAY', 'SHADOW_2D', 'SHADOW_2D_ARRAY', 'SHADOW_CUBE', 'SHADOW_CUBE_ARRAY', 'DEPTH_2D', 'DEPTH_2D_ARRAY', 'DEPTH_CUBE', 'DEPTH_CUBE_ARRAY']
:param name: The image texture sampler name.
:type name: str

### method `gpu.types.GPUShaderCreateInfo.typedef_source`

Source code included before resource declaration. Useful for defining structs used by Uniform Buffers.

Example:

### method `gpu.types.GPUShaderCreateInfo.uniform_buf`

```
"struct MyType {int foo; float bar;};"

:param source: The source code defining types.
:type source: str
```
Specify a uniform variable whose type can be one of those declared in :meth:`gpu.types.GPUShaderCreateInfo.typedef_source`.

:param slot: The uniform variable index.
:type slot: int
:param type_name: Name of the data type. It can be a struct type defined in the source passed through the :meth:`gpu.types.GPUShaderCreateInfo.typedef_source`.
:type type_name: str
:param name: The uniform variable name.
:type name: str

### method `gpu.types.GPUShaderCreateInfo.vertex_in`

Add a vertex shader input attribute.

:param slot: The attribute index.
:type slot: int
:param type: The data type of the attribute.
:type type: Literal['FLOAT', 'VEC2', 'VEC3', 'VEC4', 'MAT3', 'MAT4', 'UINT', 'UVEC2', 'UVEC3', 'UVEC4', 'INT', 'IVEC2', 'IVEC3', 'IVEC4', 'BOOL']
:param name: name of the attribute.
:type name: str

### method `gpu.types.GPUShaderCreateInfo.vertex_out`

Add a vertex shader output interface block.

:param interface: Object describing the block.
:type interface: :class:`gpu.types.GPUStageInterfaceInfo`

### method `gpu.types.GPUShaderCreateInfo.vertex_source`

Vertex shader source code written in GLSL.

Example:

### class `gpu.types.GPUStageInterfaceInfo`

```
"void main() {gl_Position = vec4(pos, 1.0);}"

:param source: The vertex shader source code.
:type source: str
```
seealso: `GLSL Cross Compilation <https://developer.blender.org/docs/features/gpu/glsl_cross_compilation/>`__
List of varyings between shader stages.

### method `gpu.types.GPUStageInterfaceInfo.__init__`

:param name: Name of the interface block.
:type name: str

### method `gpu.types.GPUStageInterfaceInfo.flat`

Add an attribute with qualifier of type ``flat`` to the interface block.

:param type: The data type of the attribute.
:type type: Literal['FLOAT', 'VEC2', 'VEC3', 'VEC4', 'MAT3', 'MAT4', 'UINT', 'UVEC2', 'UVEC3', 'UVEC4', 'INT', 'IVEC2', 'IVEC3', 'IVEC4', 'BOOL']
:param name: name of the attribute.
:type name: str

### method `gpu.types.GPUStageInterfaceInfo.no_perspective`

Add an attribute with qualifier of type ``no_perspective`` to the interface block.

:param type: The data type of the attribute.
:type type: Literal['FLOAT', 'VEC2', 'VEC3', 'VEC4', 'MAT3', 'MAT4', 'UINT', 'UVEC2', 'UVEC3', 'UVEC4', 'INT', 'IVEC2', 'IVEC3', 'IVEC4', 'BOOL']
:param name: name of the attribute.
:type name: str

### method `gpu.types.GPUStageInterfaceInfo.smooth`

Add an attribute with qualifier of type *smooth* to the interface block.

:param type: The data type of the attribute.
:type type: Literal['FLOAT', 'VEC2', 'VEC3', 'VEC4', 'MAT3', 'MAT4', 'UINT', 'UVEC2', 'UVEC3', 'UVEC4', 'INT', 'IVEC2', 'IVEC3', 'IVEC4', 'BOOL']
:param name: name of the attribute.
:type name: str

### attribute `gpu.types.GPUStageInterfaceInfo.name`

Name of the interface block.

:type: str

### class `gpu.types.GPUTexture`

This object gives access to GPU textures.

### method `gpu.types.GPUTexture.__init__`

:param size: Dimensions of the texture 1D, 2D, 3D or cubemap.
:type size: int | Sequence[int]
:param layers: Number of layers in texture array or number of cubemaps in cubemap array
:type layers: int
:param is_cubemap: Indicates the creation of a cubemap texture.
:type is_cubemap: bool
:param format: Internal data format inside GPU memory.
   ``DEPTH24_STENCIL8`` is deprecated, use ``DEPTH32F_STENCIL8``.
   ``DEPTH_COMPONENT24`` is deprecated, use ``DEPTH_COMPONENT32F``.
:type format: Literal['RGBA8UI', 'RGBA8I', 'RGBA8', 'RGBA32UI', 'RGBA32I', 'RGBA32F', 'RGBA16UI', 'RGBA16I', 'RGBA16F', 'RGBA16', 'RG8UI', 'RG8I', 'RG8', 'RG32UI', 'RG32I', 'RG32F', 'RG16UI', 'RG16I', 'RG16F', 'RG16', 'R8UI', 'R8I', 'R8', 'R32UI', 'R32I', 'R32F', 'R16UI', 'R16I', 'R16F', 'R16', 'R11F_G11F_B10F', 'DEPTH32F_STENCIL8', 'DEPTH24_STENCIL8', 'SRGB8_A8', 'RGB16F', 'SRGB8_A8_DXT1', 'SRGB8_A8_DXT3', 'SRGB8_A8_DXT5', 'RGBA8_DXT1', 'RGBA8_DXT3', 'RGBA8_DXT5', 'DEPTH_COMPONENT32F', 'DEPTH_COMPONENT24', 'DEPTH_COMPONENT16']
:param data: Buffer object to fill the texture.
:type data: :class:`gpu.types.Buffer` | None

### method `gpu.types.GPUTexture.anisotropic_filter`

Set anisotropic filter usage. This only has effect if mipmapping is enabled.

:param use_anisotropic: If set to true, the texture will use anisotropic filtering.
:type use_anisotropic: bool

### method `gpu.types.GPUTexture.clear`

Fill texture with specific value.

:param format: The format that describes the content of a single item.
   ``UINT_24_8`` is deprecated, use ``FLOAT`` instead.
:type format: Literal['FLOAT', 'INT', 'UINT', 'UBYTE', 'UINT_24_8', '10_11_11_REV']
:param value: Sequence each representing the value to fill. Sizes 1..4 are supported.
:type value: Sequence[float] | Sequence[int]

### method `gpu.types.GPUTexture.extend_mode`

Set texture sampling method for coordinates outside of the [0..1] uv range along
both the x and y axis.

:param extend_mode: the specified extent mode.
:type extend_mode: Literal['EXTEND', 'REPEAT', 'MIRRORED_REPEAT', 'CLAMP_TO_BORDER']

### method `gpu.types.GPUTexture.extend_mode_x`

Set texture sampling method for coordinates outside of the [0..1] uv range along the x axis.

:param extend_mode: the specified extent mode.
:type extend_mode: Literal['EXTEND', 'REPEAT', 'MIRRORED_REPEAT', 'CLAMP_TO_BORDER']

### method `gpu.types.GPUTexture.extend_mode_y`

Set texture sampling method for coordinates outside of the [0..1] uv range along the y axis.

:param extend_mode: the specified extent mode.
:type extend_mode: Literal['EXTEND', 'REPEAT', 'MIRRORED_REPEAT', 'CLAMP_TO_BORDER']

### method `gpu.types.GPUTexture.filter_mode`

Set texture filter usage.

:param use_filter: If set to true, the texture will use linear interpolation between neighboring texels.
:type use_filter: bool

### method `gpu.types.GPUTexture.mipmap_mode`

Set texture filter and mip-map usage.

:param use_mipmap: If set to true, the texture will use mip-mapping as anti-aliasing method.
:type use_mipmap: bool
:param use_filter: If set to true, the texture will use linear interpolation between neighboring texels.
:type use_filter: bool

### method `gpu.types.GPUTexture.read`

Creates a buffer with the value of all pixels.

:return: The Buffer with the read pixels.
:rtype: :class:`gpu.types.Buffer`

### attribute `gpu.types.GPUTexture.format`

Format of the texture.

:type: str

### attribute `gpu.types.GPUTexture.height`

Height of the texture.

:type: int

### attribute `gpu.types.GPUTexture.width`

Width of the texture.

:type: int

### class `gpu.types.GPUUniformBuf`

This object gives access to uniform buffers.

### method `gpu.types.GPUUniformBuf.__init__`

:param data: Data to fill the buffer.
:type data: Buffer

### method `gpu.types.GPUUniformBuf.update`

Update the data of the uniform buffer object.

:param data: Data to fill the buffer.
:type data: Buffer

### class `gpu.types.GPUVertBuf`

Contains a VBO.

### method `gpu.types.GPUVertBuf.__init__`

:param format: Vertex format.
:type format: :class:`gpu.types.GPUVertFormat`
:param len: Amount of vertices that will fit into this buffer.
:type len: int

### method `gpu.types.GPUVertBuf.attr_fill`

Insert data into the buffer for a single attribute.

:param id: Either the name or the id of the attribute.
:type id: int | str
:param data: Buffer or sequence of data that should be stored in the buffer
:type data: Buffer | Sequence[float] | Sequence[int] | Sequence[Sequence[float]] | Sequence[Sequence[int]]

### class `gpu.types.GPUVertFormat`

This object contains information about the structure of a vertex buffer.

### method `gpu.types.GPUVertFormat.attr_add`

Add a new attribute to the format.

:param id: Name of the attribute. Often ``position``, ``normal``, ...
:type id: str
:param comp_type: The data type that will be used to store the value in memory.
:type comp_type: Literal['I8', 'U8', 'I16', 'U16', 'I32', 'U32', 'F32', 'I10']
:param len: How many individual values the attribute consists of
   (e.g. 2 for uv coordinates).
:type len: int
:param fetch_mode: How values from memory will be converted when used in the shader.
   This is mainly useful for memory optimizations when you want to store values with
   reduced precision. E.g. you can store a float in only 1 byte but it will be
   converted to a normal 4 byte float when used.
:type fetch_mode: Literal['FLOAT', 'INT', 'INT_TO_FLOAT_UNIT']

### class `gpu.types.MatrixStackContext`

Context manager for matrix stack push/pop.

### method `gpu.types.MatrixStackContext.__enter__`

:rtype: :class:`MatrixStackContext`

### method `gpu.types.MatrixStackContext.__exit__`

:param exc_type: Exception type, or ``None``.
   :type exc_type: type | None
   :param exc_value: Exception instance, or ``None``.
   :type exc_value: BaseException | None
   :param traceback: Traceback object, or ``None``.
   :type traceback: BaseException | None
   :rtype: bool

### class `gpu.types.OffScreenStackContext`

Context manager for off-screen framebuffer binding.

### method `gpu.types.OffScreenStackContext.__enter__`

:rtype: :class:`OffScreenStackContext`

### method `gpu.types.OffScreenStackContext.__exit__`

:param exc_type: Exception type, or ``None``.
   :type exc_type: type | None
   :param exc_value: Exception instance, or ``None``.
   :type exc_value: BaseException | None
   :param traceback: Traceback object, or ``None``.
   :type traceback: BaseException | None
   :rtype: bool
