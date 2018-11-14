class Mesh {
  constructor(context, meshObj) {
    this.gl = context.gl;
    this.vertexPositions = meshObj.vertexPositions;
  }

  initBuffers() {
    const gl = this.gl;

    this.positionBufferObject = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBufferObject);

    /* Allocates OpenGL memory for storing data or indices, any data
 	   previously defined is deleted*/
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexPositions, gl.DYNAMIC_DRAW);

    /* Stop using buffer object for target (gl_ARRAY_BUFFER) because buffer name = 0*/
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw() {
    const gl = this.gl;
    /* Set the current active buffer object */
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexPositions, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBufferObject);

    /* Specifies where the dat values accociated with index can accessed in the vertex shader */
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

    /* Enable  the vertex array associated with the index*/
    gl.enableVertexAttribArray(0);

    /* Constructs a sequence of geometric primitives using the elements from the currently
 	   bound matrix */
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

export default Mesh;
