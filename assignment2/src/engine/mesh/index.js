class Mesh {
  constructor(context, meshObj) {
    this.gl = context.gl;
    this.vertexPositions = new Float32Array(meshObj.vertexPositions);
    this.normals = new Float32Array(meshObj.normals);
    this.texcoords = new Float32Array(meshObj.texcoords);
    this.indicies = meshObj.indices;
  }

  initBuffers() {
    const gl = this.gl;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw(program) {
    const gl = this.gl;
    const { attribLocations } = program;

    const { vertexBuffer, normalsBuffer, indicies } = this;
    // console.log(vertexBuffer);
    // console.log(normalsBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(attribLocations.position);
    gl.vertexAttribPointer(attribLocations.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.enableVertexAttribArray(attribLocations.normal);
    gl.vertexAttribPointer(attribLocations.normal, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, indicies.length);
  }
}

export default Mesh;
