import { mat4 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

class Mesh {
  constructor(context, meshObj) {
    this.gl = context.gl;
    this.vertexPositions = new Float32Array(meshObj.vertexPositions);
    this.normals = new Float32Array(meshObj.normals);
    this.indicies = meshObj.indices;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.rotY = 0;
    this.rotX = 0;
    this.rotZ = 0;

    this.scale = [1, 1, 1];
    this.colourMode = 2;
  }

  getLocation() {
    return new Float32Array([this.x, this.y, this.z]);
  }

  setLocation(newLocation) {
    this.x = newLocation[0];
    this.y = newLocation[1];
    this.z = newLocation[2];
  }

  setScale(newScale) {
    this.scale = [newScale, newScale, newScale];
  }

  addRotationY(deg) {
    this.rotY += deg;
  }

  addRotationX(deg) {
    this.rotX += deg;
  }

  addRotationZ(deg) {
    this.rotZ += deg;
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

    const {
      vertexBuffer,
      normalsBuffer,
      indicies,
      scale,
      rotX,
      rotY,
      rotZ,
    } = this;

    gl.uniform1i(program.uniformLocations.colourMode, this.colourMode);

    const model = mat4.create();
    mat4.rotate(model, model, Math.radians(rotX), [1, 0, 0]);
    mat4.rotate(model, model, Math.radians(rotY), [0, 1, 0]);
    mat4.rotate(model, model, Math.radians(rotZ), [0, 0, 1]);
    mat4.translate(model, model, this.getLocation());
    mat4.scale(model, model, scale);
    gl.uniformMatrix4fv(program.uniformLocations.model, false, model);

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
