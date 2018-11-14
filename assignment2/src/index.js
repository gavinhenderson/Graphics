import { createShader, Context, Program, Mesh } from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import firetruckRaw from "./firetruck.json";

console.log(firetruckRaw);

main();

function main() {
  const context = new Context("glCanvas");
  context.createVertexArray();

  const firetruckMesh = new Mesh(context, firetruckRaw);
  firetruckMesh.initBuffers();

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

  const program = new Program(context);
  program.attachShader(vertShader);
  program.attachShader(fragShader);
  program.linkProgram();

  program.addMultipleAttribs(["position", "normal"]);
  program.addMultipleUniforms([
    "projection",
    "model",
    "view",
    "light_direction4",
    "colourMode",
  ]);

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

    firetruckMesh.draw();

    /* Disable vertex array and shader program */
    program.stopUsing();
  }
}
