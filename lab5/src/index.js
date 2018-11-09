import { createShader, Context, Program } from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";

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

const context = init();

setInterval(() => {
  display(context.gl);
}, 1000);

function init() {
  const context = new Context("glCanvas");

  positionBufferObject = context.gl.createBuffer();

  /* Specify the current active buffer object by identifer */
  context.gl.bindBuffer(context.gl.ARRAY_BUFFER, positionBufferObject);

  /* Allocates OpenGL memory for storing data or indices, any data
 	   previously defined is deleted*/
  context.gl.bufferData(
    context.gl.ARRAY_BUFFER,
    vertexPositions,
    context.gl.DYNAMIC_DRAW,
  );

  /* Stop using buffer object for target (context.gl_ARRAY_BUFFER) because buffer name = 0*/
  context.gl.bindBuffer(context.gl.ARRAY_BUFFER, null);

  /* Build both shaders */
  const vertShader = createShader(
    context.gl,
    context.gl.VERTEX_SHADER,
    vertSource,
  );
  const fragShader = createShader(
    context.gl,
    context.gl.FRAGMENT_SHADER,
    fragSource,
  );

  /* Create a shader program object and link the vertex and fragment shaders
 	into a single shader program */
  program = new Program(context.gl);
  program.attachShader(vertShader);
  program.attachShader(fragShader);
  program.linkProgram();

  return context;
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
  gl.useProgram(program.program);

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
