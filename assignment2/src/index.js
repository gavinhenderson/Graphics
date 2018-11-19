import {
  createShader,
  Context,
  Program,
  TexturedMesh,
  Camera,
  Scene,
  UserControl,
} from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import astronautRaw from "./astronaut.json";
import { mat4, vec4 } from "gl-matrix";
import astronautTexture from "./astronaut.png";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

main();

function main() {
  const userControl = new UserControl();
  let counter = 0;
  userControl.addKeyDownListener("a", () => {
    console.log(counter);
    counter++;
  });

  userControl.addKeyUpListener("l", () => {
    console.log("test");
  });

  const context = new Context("glCanvas");
  context.createVertexArray();

  const astronautMesh = new TexturedMesh(
    context,
    astronautRaw,
    astronautTexture,
  );

  astronautMesh.initBuffers();

  const camera = new Camera();

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

  const program = new Program(context, { vertShader, fragShader });

  program.addMultipleAttribs(["position", "normal", "texcoord"]);
  program.addMultipleUniforms([
    "projection",
    "model",
    "view",
    "light_direction4",
    "colourMode",
    "point_light_pos",
  ]);

  const scene = new Scene(context);

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

    scene.preDraw();
    program.use();

    // Projection Matrix
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = mat4.create();
    mat4.perspective(projection, Math.radians(30), aspectRatio, 0.1, 100);

    // View Matrix
    const view = camera.getView();

    const model = mat4.create();
    mat4.translate(model, model, [0, -2, 0]);

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

    gl.disableVertexAttribArray(0);
    program.stopUsing();
  }
}
