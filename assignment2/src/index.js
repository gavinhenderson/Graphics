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

main();

function main() {
  const context = new Context("glCanvas");
  const triangleMesh = new Mesh(context, { vertexPositions });
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
  const program = new Program(context);
  program.attachShader(vertShader);
  program.attachShader(fragShader);
  program.linkProgram();

  let then = 0;
  function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    display(deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function display(deltaTime) {
    const { gl } = context;

    /* Define the background colour*/
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /* Set the current shader program to be used */
    gl.useProgram(program.program);

    triangleMesh.draw();

    /* Disable vertex array and shader program */
    gl.disableVertexAttribArray(0);
    gl.useProgram(null);
  }
}
