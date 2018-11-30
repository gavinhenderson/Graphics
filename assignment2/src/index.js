import {
  createShader,
  Context,
  Program,
  Mesh,
  TexturedMesh,
  NormalMapMesh,
  Camera,
  Scene,
  UserControl,
  PointLight,
  Particles,
} from "./engine";
import vertSource from "./shader.vert";
import fragSource from "./shader.frag";
import roomRaw from "./room.json";
import roomTexture from "../raw/iso-room/texture.png";
import carRaw from "./car.json";
import carTexture from "./car-texture.png";
import lightbulbRaw from "./lightbulb.json";
import setupUserControls from "./setupUserControls";
import floorRaw from "./floor.json";
import pebbleDashTexture from "../raw/pebbledash-tile.jpg";
import pebbleDashNormalMap from "../raw/pebble-dash-normal.png";
import floorTexture from "../raw/floor.png";
import floorNormalMap from "../raw/floornormal.png";
import "./index.css";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

main();

function main() {
  const context = new Context("glCanvas");
  context.createVertexArray();

  const lightbulbMesh = new Mesh(context, lightbulbRaw);
  lightbulbMesh.setLocation([0, 0, 0]);
  lightbulbMesh.setScale(0.01);
  lightbulbMesh.addRotationZ(180);
  lightbulbMesh.initBuffers();
  lightbulbMesh.y = 5;

  const floorMesh = new NormalMapMesh(
    context,
    floorRaw,
    floorTexture,
    floorNormalMap,
  );
  floorMesh.setLocation([1, -1.65, -1]);
  floorMesh.scale = [7.5, 1, 7.5];
  floorMesh.initBuffers();

  const pointLight = new PointLight(lightbulbMesh, context);

  const userControl = new UserControl();
  setupUserControls(userControl, lightbulbMesh, pointLight);

  const roomMesh = new TexturedMesh(context, roomRaw, roomTexture);
  roomMesh.initBuffers();
  roomMesh.setLocation([0, -2, 0]);
  // roomMesh.setScale(0.5);
  roomMesh.addRotationY(180);

  const carMesh = new TexturedMesh(context, carRaw, carTexture);
  carMesh.x = 0.5;
  carMesh.z = 0.5;
  carMesh.initBuffers();
  carMesh.y = -1.2;
  carMesh.setScale(1);

  let currentCarAngle = 0;
  let carStartingX = carMesh.x;
  let carStartingZ = carMesh.z;

  setInterval(() => {
    currentCarAngle++;
    let radius = 2;
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
    "texture1",
    "texture2",
  ]);

  const scene = new Scene(context);

  // const particles = new Particles(context, 5, carMesh, scene, camera);
  // particles.initBuffers();

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

    gl.uniform1i(program.uniformLocations.texture1, 0); // texture unit 0
    gl.uniform1i(program.uniformLocations.texture2, 1); // texture unit 1
    gl.uniform1i(program.uniformLocations.mode, 1);

    scene.draw(program);
    camera.draw(program);
    roomMesh.draw(program);
    carMesh.draw(program);
    pointLight.draw(program);
    floorMesh.draw(program);

    gl.disableVertexAttribArray(0);
    program.stopUsing();

    // particles.draw(deltaTime);
  }
}
