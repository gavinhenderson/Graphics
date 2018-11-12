import { createShader, Context, Program, Mesh } from "./engine";
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
let triangleMesh = null;

const context = init();

setInterval(() => {
  display(context.gl);
}, 1000);

function init() {
  const context = new Context("glCanvas");
  triangleMesh = new Mesh(context, { vertexPositions });
  triangleMesh.initBuffers();

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
  gl.bufferData(gl.ARRAY_BUFFER, triangleMesh.vertexPositions, gl.DYNAMIC_DRAW);

  /* Define the background colour*/
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /* Set the current shader program to be used */
  gl.useProgram(program.program);

  /* Set the current active buffer object */
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleMesh.positionBufferObject);

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
