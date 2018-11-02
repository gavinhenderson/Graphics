import Body from "./body";
import Fins from "./fins";
import { mat4, vec3 } from "gl-matrix";

class Turbine {
  constructor() {
    this.body = new Body();
    this.fins = new Fins();
  }

  initBuffers(gl) {
    this.body.initBuffers(gl);
    this.fins.initBuffers(gl);
  }

  draw(gl, programInfo, rotation) {
    // Model Position Matrix
    const model = mat4.create();
    mat4.translate(model, model, [0, -2, 0]);
    mat4.scale(model, model, vec3.fromValues(0.5, 0.5, 0.5));

    gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model);

    this.body.draw(gl, programInfo);

    mat4.translate(model, model, [0, 6.7, 0.3]);
    mat4.rotate(model, model, rotation, [1, 0, 0]);
    gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model);

    this.fins.draw(gl, programInfo);
  }
}

export default Turbine;
