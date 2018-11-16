import { createShader, Context, Program, Mesh } from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import astronautRaw from "./astronaut.json";
import { mat4, vec3, vec4 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

const square = {
  vertexPositions: [
    -0.25,
    0.25,
    -0.25,
    0.25,
    0.25,
    -0.25,
    0.25,
    0.25,
    0.25,
    0.25,
    0.25,
    0.25,
    -0.25,
    0.25,
    0.25,
    -0.25,
    0.25,
    -0.25,
  ],
  normals: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
};

main();

function main() {
  const context = new Context("glCanvas");
  context.createVertexArray();

  const astronautMesh = new Mesh(context, astronautRaw);
  astronautMesh.initBuffers();

  // const squareMesh = new Mesh(context, square);
  // squareMesh.initBuffers();

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

    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.use();

    // Projection Matrix
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = mat4.create();
    mat4.perspective(projection, Math.radians(30), aspectRatio, 0.1, 100);

    // View Matrix
    const view = mat4.create();
    mat4.lookAt(
      view,
      vec3.fromValues(5, 0, 10),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0),
    );

    // const model = mat4.create();
    // mat4.translate(model, model, [0, 0, 0]);
    // mat4.scale(model, model, vec3.fromValues(0.01, 0.01, 0.01));

    const model = mat4.create();
    mat4.translate(model, model, [0, 0, 0]);
    // mat4.scale(model, model, vec3.fromValues(100, 0, 100));

    // Load Uniforms
    gl.uniformMatrix4fv(program.uniformLocations.projection, false, projection);
    gl.uniformMatrix4fv(program.uniformLocations.view, false, view);
    gl.uniform4fv(
      program.uniformLocations.light_direction4,
      vec4.fromValues(1, 1, 1, 1),
    );
    gl.uniform1i(program.uniformLocations.colourMode, 1);
    gl.uniformMatrix4fv(program.uniformLocations.model, false, model);

    astronautMesh.draw(program);
    // squareMesh.draw(program);

    gl.disableVertexAttribArray(0);
    program.stopUsing();
  }
}
