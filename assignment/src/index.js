import { importShader } from "./shaders";
import { createProgram, getWebGLContext, Stack, convertRGB } from "./utils";
import { mat4, vec3, vec4 } from "gl-matrix";
import Camera from "./camera";
import Windfarm from "./windfarm";
import { Floor } from "./shapes";

Math.radians = (degrees) => (Math.PI * degrees) / 180;
let rotation = 0;
let camera = new Camera();
let lightDirection = vec4.fromValues(1, 1, 1, 1);
let rotSpeed = 1;
window.windfarm = new Windfarm();

// 1: Diffuse
// 2: Ambient
window.colourMode = 1;

main();

window.onkeyup = (event) => {
  let key = event.key.toLowerCase();

  switch (key) {
    case "e": {
      windfarm.addWindmill();
      break;
    }
    case "r": {
      windfarm.removeWindmill();
      break;
    }
  }
};

window.onkeydown = (event) => {
  let { key } = event;
  key = key.toLowerCase();
  console.log(rotSpeed);

  switch (key) {
    case "arrowleft": {
      camera.moveLeft();
      break;
    }
    case "arrowright": {
      camera.moveRight();
      break;
    }
    case "arrowup": {
      camera.moveIn();
      break;
    }
    case "arrowdown": {
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
      vertexPosition: 1,
      normal: 2,
      colour: 3,
    },
    uniformLocations: {
      proj: gl.getUniformLocation(shaderProgram, "projection"),
      model: gl.getUniformLocation(shaderProgram, "model"),
      view: gl.getUniformLocation(shaderProgram, "view"),
      lightDirection: gl.getUniformLocation(shaderProgram, "light_direction4"),
      colourMode: gl.getUniformLocation(shaderProgram, "colourMode"),
    },
  };

  let floor = new Floor();

  floor.initBuffers(gl);
  windfarm.initBuffers(gl);

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
    gl.clearColor(...convertRGB(30, 144, 255), 1.0);
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
    gl.uniform1i(programInfo.uniformLocations.colourMode, colourMode);

    floor.draw(gl, programInfo);
    windfarm.draw(gl, programInfo, rotation);

    gl.useProgram(null);

    rotation += deltaTime * rotSpeed;
  }
}
