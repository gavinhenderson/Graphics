import { mat4 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

class Scene {
  constructor(context) {
    this.canvas = context.canvas;
    this.gl = context.gl;
  }

  preDraw() {
    const { gl } = this;
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  getProjection() {
    const { gl } = this;

    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = mat4.create();
    mat4.perspective(projection, Math.radians(30), aspectRatio, 0.1, 100);
    return projection;
  }

  draw(program) {
    const { gl } = this;

    const projection = this.getProjection();
    gl.uniformMatrix4fv(program.uniformLocations.projection, false, projection);
  }
}

export default Scene;
