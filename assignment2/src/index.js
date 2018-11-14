import { createShader, Context, Program, Mesh } from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import firetruckRaw from "./firetruck.json";

console.log(firetruckRaw);

main();

function main() {
  const context = new Context("glCanvas");
  const triangleMesh = new Mesh(context, firetruckRaw);
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
    program.use();

    triangleMesh.draw();

    /* Disable vertex array and shader program */
    program.stopUsing();
  }
}
