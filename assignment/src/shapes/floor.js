import { convertRGB } from "../utils";
import { mat4, vec3 } from "gl-matrix";

const verts = [
  -0.25,
  0.25,
  -0.25,
  0.25,
  0.25,
  -0.25,
  0.25,
  0.25,
  0.25,

  0.25,
  0.25,
  0.25,
  -0.25,
  0.25,
  0.25,
  -0.25,
  0.25,
  -0.25,
];

const normals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];

class Floor {
  constructor() {
    this.verts = new Float32Array(verts);
    this.normals = new Float32Array(normals);
    this.genColours(convertRGB(124, 252, 0));

    console.log(this);
  }

  /**
   * @param {WebGLRenderingContext} gl
   */
  initBuffers(gl) {
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.coloursBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coloursBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colours, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {*} programInfo
   */
  draw(gl, programInfo) {
    const model = mat4.create();
    mat4.translate(model, model, [0, -2, 0]);
    mat4.scale(model, model, vec3.fromValues(100, 0, 100));

    gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model);

    const { attribLocations } = programInfo;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(attribLocations.vertexPosition);
    gl.vertexAttribPointer(
      attribLocations.vertexPosition,
      3,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.enableVertexAttribArray(attribLocations.normal);
    gl.vertexAttribPointer(attribLocations.normal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.coloursBuffer);
    gl.enableVertexAttribArray(attribLocations.colour);
    gl.vertexAttribPointer(attribLocations.colour, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.verts.length / 3);
  }

  genColours(colour) {
    let tempColours = [];

    for (let i = 0; i < this.verts.length / 3; i++) {
      tempColours = [...tempColours, ...colour];
    }

    this.colours = new Float32Array(tempColours);
  }
}

export default Floor;
