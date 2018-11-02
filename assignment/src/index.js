import { importShader } from "./shaders";
import { createProgram, getWebGLContext, Stack } from "./utils";
import { Turbine } from "./shapes";
import { mat4, vec3, vec4 } from "gl-matrix";
import Camera from "./camera";

Math.radians = (degrees) => (Math.PI * degrees) / 180;
let rotation = 0;
let turbine1 = new Turbine([-1, 0, -1]);
let turbine2 = new Turbine([1, 0, 1]);
let camera = new Camera();
let lightDirection = vec4.fromValues(1, 1, 1, 1);
let rotSpeed = 1;

main();

window.onkeydown = (event) => {
  let { key } = event;
  console.log(rotSpeed);

  switch (key) {
    case "ArrowLeft": {
      camera.moveLeft();
      break;
    }
    case "ArrowRight": {
      camera.moveRight();
      break;
    }
    case "ArrowUp": {
      camera.moveIn();
      break;
    }
    case "ArrowDown": {
      camera.moveOut();
      break;
    }
    case "q": {
      rotSpeed++;
      break;
    }
    case "w": {
      rotSpeed--;
      break;
    }
  }
};

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
      proj: gl.getUniformLocation(shaderProgram, "projection"),
      model: gl.getUniformLocation(shaderProgram, "model"),
      view: gl.getUniformLocation(shaderProgram, "view"),
      lightDirection: gl.getUniformLocation(shaderProgram, "light_direction4"),
    },
  };

  turbine1.initBuffers(gl);
  turbine2.initBuffers(gl);

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(programInfo.program);

    // Projection Matrix
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = mat4.create();
    mat4.perspective(projection, Math.radians(30), aspectRatio, 0.1, 100);

    // View Matrix
    const view = camera.getView();

    // Load Uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.proj, false, projection);
    gl.uniformMatrix4fv(programInfo.uniformLocations.view, false, view);
    gl.uniform4fv(programInfo.uniformLocations.lightDirection, lightDirection);

    turbine1.draw(gl, programInfo, rotation);

    let differentRot = rotation / 2;
    turbine2.draw(gl, programInfo, differentRot);

    gl.useProgram(null);

    rotation += deltaTime * rotSpeed;
  }
}
