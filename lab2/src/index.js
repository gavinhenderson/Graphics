import { importShader } from "./shaders";
import { mat4 } from "gl-matrix";

let positionBufferObject;
let colourObject;
let program;
let vao;
/* Position and view globals */
let angle_x;
let angle_x_inc;
let angle_y;
let angle_y_inc;

/* Uniforms*/
let modelID;

const gl = init();

setInterval(() => {
  display(gl);
}, 100);

function init() {
  angle_x = 0;
  angle_x_inc = 0;
  angle_y = 0;
  angle_y_inc = 0;
  const canvas = document.querySelector("#glCanvas");

  /**
   * @type {WebGLRenderingContext}
   */
  const gl = canvas.getContext("webgl2");

  if (!gl) alert("Your browser doesnt support webgl2");

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  /* Define vertices for a cube in 12 triangles */
  const vertexPositions = new Float32Array([
    -0.25,
    0.25,
    -0.25,
    1,
    -0.25,
    -0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    -0.25,
    1,
    0.25,
    0.25,
    -0.25,
    1,
    -0.25,
    0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    0.25,
    1,
    0.25,
    0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    0.25,
    1,
    0.25,
    0.25,
    0.25,
    1,
    0.25,
    0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    0.25,
    1,
    -0.25,
    -0.25,
    0.25,
    1,
    0.25,
    0.25,
    0.25,
    1,
    -0.25,
    -0.25,
    0.25,
    1,
    -0.25,
    0.25,
    0.25,
    1,
    0.25,
    0.25,
    0.25,
    1,
    -0.25,
    -0.25,
    0.25,
    1,
    -0.25,
    -0.25,
    -0.25,
    1,
    -0.25,
    0.25,
    0.25,
    1,
    -0.25,
    -0.25,
    -0.25,
    1,
    -0.25,
    0.25,
    -0.25,
    1,
    -0.25,
    0.25,
    0.25,
    1,
    -0.25,
    -0.25,
    0.25,
    1,
    0.25,
    -0.25,
    0.25,
    1,
    0.25,
    -0.25,
    -0.25,
    1,
    0.25,
    -0.25,
    -0.25,
    1,
    -0.25,
    -0.25,
    -0.25,
    1,
    -0.25,
    -0.25,
    0.25,
    1,
    -0.25,
    0.25,
    -0.25,
    1,
    0.25,
    0.25,
    -0.25,
    1,
    0.25,
    0.25,
    0.25,
    1,
    0.25,
    0.25,
    0.25,
    1,
    -0.25,
    0.25,
    0.25,
    1,
    -0.25,
    0.25,
    -0.25,
    1,
  ]);

  gl.enable(gl.DEPTH_TEST);

  /* Define an array of colours */
  const vertexColours = new Float32Array([
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0,
    1.0,
    1.0,
  ]);

  /* Create a vertex buffer object to store vertices */
  positionBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  /* Create a vertex buffer object to store vertex colours */
  colourObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colourObject);
  gl.bufferData(gl.ARRAY_BUFFER, vertexColours, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  /* Build both shaders */
  const vertShader = importShader(gl.VERTEX_SHADER, gl);
  const fragShader = importShader(gl.FRAGMENT_SHADER, gl);

  /* Create a shader program object and link the vertex and fragment shaders
 	into a single shader program */
  program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  /* Output and shader compilation errors */
  const programLog = gl.getProgramInfoLog(program);
  if (programLog !== "") console.log(programLog);

  modelID = gl.getUniformLocation(program, "model");

  return gl;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function display(gl) {
  /* Update the vertext buffer object with the modified array of vertices */
  //gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, vertexColours, gl.STATIC_DRAW);

  /* Define the background colour*/
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferObject);
  gl.enableVertexAttribArray(0);

  /* Specifies where the dat values accociated with index can accessed in the vertex shader */
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colourObject);
  gl.enableVertexAttribArray(1);

  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

  let model = mat4.create(1);
  let rotatedX = mat4.create();

  mat4.rotate(rotatedX, model, -angle_x, new Float32Array([1, 0, 0]));

  let rotatedTotal = mat4.create();

  mat4.rotate(rotatedTotal, rotatedX, -angle_y, new Float32Array([0, 1, 0]));

  gl.uniformMatrix4fv(modelID, false, rotatedTotal);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  gl.disableVertexAttribArray(0);
  gl.useProgram(null);

  angle_x += angle_x_inc;
  angle_y += angle_y_inc;
}

window.onkeyup = (event) => {
  if (event.key === "ArrowDown") {
    angle_x_inc += 0.001;
  } else if (event.key === "ArrowUp") {
    angle_x_inc -= 0.001;
  } else if (event.key === "ArrowRight") {
    angle_y_inc += 0.001;
  } else if (event.key === "ArrowLeft") {
    angle_y_inc -= 0.001;
  }
};
