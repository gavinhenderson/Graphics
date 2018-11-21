import {
  createShader,
  Context,
  Program,
  Mesh,
  TexturedMesh,
  Camera,
  Scene,
  UserControl,
} from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import astronautRaw from "./astronaut.json";
import { mat4, vec4, vec3 } from "gl-matrix";
import astronautTexture from "./astronaut.png";
import sphereRaw from "./sphere.json";

main();

function main() {
  const userControl = new UserControl();
  //userControl.debug = true;

  const context = new Context("glCanvas");
  context.createVertexArray();

  const sphereMesh = new Mesh(context, sphereRaw);
  sphereMesh.setLocation([2, 0, 0]);
  sphereMesh.setScale(0.1);

  userControl.addKeyDownListener("arrowdown", (event) => {
    sphereMesh.z += 0.1;
  });

  userControl.addKeyDownListener("arrowup", (event) => {
    sphereMesh.z -= 0.1;
  });

  userControl.addKeyDownListener("arrowleft", (event) => {
    sphereMesh.x -= 0.1;
  });

  userControl.addKeyDownListener("arrowright", (event) => {
    sphereMesh.x += 0.1;
  });

  sphereMesh.initBuffers();

  const astronautMesh = new TexturedMesh(
    context,
    astronautRaw,
    astronautTexture,
  );
  astronautMesh.initBuffers();
  astronautMesh.setLocation([0, -2, 0]);

  const camera = new Camera(context);
  camera.setCameraControls(userControl);

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
    "lightPos",
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

    scene.draw(program);
    camera.draw(program);
    astronautMesh.draw(program);
    sphereMesh.draw(program);

    gl.uniform3fv(program.uniformLocations.lightPos, sphereMesh.getLocation());

    gl.disableVertexAttribArray(0);
    program.stopUsing();
  }
}
