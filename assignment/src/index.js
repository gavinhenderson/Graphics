import { importShader } from "./shaders";
import { createProgram, getWebGLContext, convertRGB } from "./utils";
import { mat4, vec4 } from "gl-matrix";
import Camera from "./camera";
import Windfarm from "./windfarm";
import { Floor } from "./shapes";
import intialiseEventListeners from "./keyboard";

// Adds a randians converter to the Math lib
Math.radians = (degrees) => (Math.PI * degrees) / 180;

// Setup Global variables
let rotation = 0;
let camera = new Camera();
let lightDirection = vec4.fromValues(1, 1, 1, 1);
window.rotSpeed = 1;
window.windfarm = new Windfarm();

// 1: Diffuse
// 2: Ambient
window.colourMode = 1;

intialiseEventListeners(windfarm, camera);
main();

function main() {
  let gl = getWebGLContext();

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vertShader = importShader(gl.VERTEX_SHADER, gl);
  const fragShader = importShader(gl.FRAGMENT_SHADER, gl);

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

  // Setup the draw function loop
  let then = 0;
  function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

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
