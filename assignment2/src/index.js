import {
  createShader,
  Context,
  Program,
  Mesh,
  TexturedMesh,
  Camera,
  Scene,
  UserControl,
  PointLight,
} from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import bedroomRaw from "./bedroom.json";
import bedroomTexture from "./bedroom.png";
import sphereRaw from "./sphere.json";

main();

function main() {
  const userControl = new UserControl();

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
  const pointLight = new PointLight(sphereMesh, context);

  userControl.addKeyUpListener("1", (event) => {
    pointLight.toggleLight();
  });

  const bedroomMesh = new TexturedMesh(context, bedroomRaw, bedroomTexture);
  bedroomMesh.initBuffers();
  bedroomMesh.setLocation([0, -2, 0]);
  bedroomMesh.addRotationY(180);

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
    "lightPower",
    "lightingMode",
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
    bedroomMesh.draw(program);
    pointLight.draw(program);

    gl.disableVertexAttribArray(0);
    program.stopUsing();
  }
}
