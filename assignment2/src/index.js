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
  Particles,
} from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import bedroomRaw from "./bedroom.json";
import bedroomTexture from "./bedroom.png";
import carRaw from "./car.json";
import carTexture from "./car-texture.png";
import lightbulbRaw from "./lightbulb.json";
import setupUserControls from "./setupUserControls";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

main();

function main() {
  const context = new Context("glCanvas");
  context.createVertexArray();

  const particles = new Particles(context, 1000);
  particles.initBuffers();

  const lightbulbMesh = new Mesh(context, lightbulbRaw);
  lightbulbMesh.setLocation([0, 0, 0]);
  lightbulbMesh.setScale(0.005);
  lightbulbMesh.addRotationZ(180);
  lightbulbMesh.initBuffers();
  lightbulbMesh.y += 0.5;

  const pointLight = new PointLight(lightbulbMesh, context);

  const userControl = new UserControl();
  setupUserControls(userControl, lightbulbMesh, pointLight);

  const bedroomMesh = new TexturedMesh(context, bedroomRaw, bedroomTexture);
  bedroomMesh.initBuffers();
  bedroomMesh.setLocation([0, -2, 0]);
  bedroomMesh.addRotationY(180);

  const carMesh = new TexturedMesh(context, carRaw, carTexture);
  carMesh.x = 0.5;
  carMesh.z = 0.5;
  carMesh.initBuffers();
  carMesh.y = -2.6;
  carMesh.setScale(0.5);

  let currentCarAngle = 0;
  let carStartingX = carMesh.x;
  let carStartingZ = carMesh.z;

  setInterval(() => {
    currentCarAngle++;
    let radius = 1;
    carMesh.rotY = -currentCarAngle;
    const theta = Math.radians(currentCarAngle);
    carMesh.x = Math.cos(theta) * radius + carStartingX;
    carMesh.z = Math.sin(theta) * radius + carStartingZ;

    carMesh.x -= 0.001;
  }, 1);

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
    "mode",
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

    gl.uniform1i(program.uniformLocations.mode, 1);

    scene.draw(program);
    camera.draw(program);
    bedroomMesh.draw(program);
    carMesh.draw(program);
    pointLight.draw(program);

    gl.disableVertexAttribArray(0);
    program.stopUsing();
  }
}
