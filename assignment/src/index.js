import { importShader } from "./shaders";
import { createProgram, getWebGLContext } from "./utils";
import { Turbine } from "./shapes";
import { mat4, vec3 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;
let rotation = 0;
let turbine = new Turbine();
main();

function main() {
  /** @type {WebGLRenderingContext} */
  let gl = getWebGLContext();

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vertShader = importShader(gl.VERTEX_SHADER, gl);
  const fragShader = importShader(gl.FRAGMENT_SHADER, gl);

  /** @type {WebGLProgram} */
  let shaderProgram = createProgram(gl, vertShader, fragShader);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "position"),
      normal: gl.getAttribLocation(shaderProgram, "normal"),
    },
    uniformLocations: {
      projection: gl.getUniformLocation(shaderProgram, "projection"),
      model: gl.getUniformLocation(shaderProgram, "model"),
      view: gl.getUniformLocation(shaderProgram, "view"),
    },
  };

  turbine.initBuffers(gl);

  let then = 0;
  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {*} programInfo
   * @param {*} deltaTime
   */
  function drawScene(gl, programInfo, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas before we start drawing on it.
    gl.useProgram(programInfo.program);

    // Projection Matrix
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = mat4.create();
    mat4.perspective(projection, Math.radians(30), aspectRatio, 0.1, 100);

    // View Matrix
    const view = mat4.create();
    mat4.lookAt(
      view,
      vec3.fromValues(0, 0, 4),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0),
    );

    // Model Position Matrix
    const model = mat4.create();
    mat4.translate(model, model, [0, 0, -10]);
    mat4.rotate(model, model, rotation, [0, 0, 1]);
    mat4.rotate(model, model, rotation, [0, 1, 0]);
    mat4.rotate(model, model, rotation, [1, 0, 0]);
    mat4.scale(model, model, vec3.fromValues(0.1, 0.1, 0.1));

    // Load Uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projection,
      false,
      projection,
    );
    gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model);
    gl.uniformMatrix4fv(programInfo.uniformLocations.view, false, view);

    turbine.draw(gl, programInfo);

    gl.useProgram(null);
    rotation += deltaTime;
  }
}
