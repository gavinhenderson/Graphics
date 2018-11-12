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
}

export default Mesh;
