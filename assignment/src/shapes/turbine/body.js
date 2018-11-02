import body from "./body-def";
import { convertRGB } from "../../utils";

class Body {
  constructor() {
    this.verts = new Float32Array(body.verts);
    this.normals = new Float32Array(body.normals);
    this.indicies = new Float32Array(body.indices);
    this.genColours(convertRGB(81, 81, 81));
  }

  genColours(colour) {
    let tempColours = [];

    for (let i = 0; i < this.indicies.length; i++) {
      tempColours = [...tempColours, ...colour];
    }

    this.colours = new Float32Array(tempColours);
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

    gl.drawArrays(gl.TRIANGLES, 0, this.indicies.length);
  }
}

export default Body;
