import { importShader } from "./shaders";

/* Array of vertex positions */
const vertexPositions = new Float32Array([
  0.75,
  0.75,
  0.0,
  1.0,
  0.75,
  -0.75,
  0.0,
  1.0,
  -0.75,
  -0.75,
  0.0,
  1.0,
]);

let program = null;
let positionBufferObject = null;

const gl = init();

setInterval(() => {
  display(gl);
}, 1000);

function init() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) alert("Your browser doesnt support webgl2");

  positionBufferObject = gl.createBuffer();

  /* Specify the current active buffer object by identifer */
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferObject);

  /* Allocates OpenGL memory for storing data or indices, any data
 	   previously defined is deleted*/
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.DYNAMIC_DRAW);

  /* Stop using buffer object for target (GL_ARRAY_BUFFER) because buffer name = 0*/
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

  return gl;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function display(gl) {
  /* Update the vertext buffer object with the modified array of vertices */
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.DYNAMIC_DRAW);

  /* Define the background colour*/
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /* Set the current shader program to be used */
  gl.useProgram(program);

  /* Set the current active buffer object */
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferObject);

  /* Specifies where the dat values accociated with index can accessed in the vertex shader */
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

  /* Enable  the vertex array associated with the index*/
  gl.enableVertexAttribArray(0);

  /* Constructs a sequence of geometric primitives using the elements from the currently
 	   bound matrix */
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  /* Disable vertex array and shader program */
  gl.disableVertexAttribArray(0);
  gl.useProgram(null);
}
