import { importShader } from "./shaders";
import { Sphere } from "./objects";
import { mat4, vec3 } from "gl-matrix";

Math.radians = function(degrees) {
  return (degrees * Math.PI) / 180;
};

let program;
let vao;
let colourmode;
let angle_x, angle_inc_x, x, model_scale, z, y;
let angle_y, angle_inc_y, angle_z, angle_inc_z;
let drawmode;
let numlats, numlongs;
let modelID, viewID, projectionID;
let colourmodeID;
let aspect_ratio;
let numspherevertices;
let aSphere;
let aCube;

const gl = init();

setInterval(() => {
  display(gl);
}, 1000);

function init() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) alert("Your browser doesnt support webgl2");

  x = 0;
  y = 0;
  z = 0;
  angle_x = 0;
  angle_y = 0;
  angle_z = 0;
  angle_inc_x = 0;
  angle_inc_y = 0;
  angle_inc_z = 0;
  model_scale = 1;
  aspect_ratio = 640 / 480;
  colourmode = 1;
  numlats = 20;
  numlongs = 20;

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  /* Build both shaders */
  const vertShader = importShader(gl.VERTEX_SHADER, gl);
  const fragShader = importShader(gl.FRAGMENT_SHADER, gl);

  /* Create a shader program object and link the vertex and fragment shaders
 	into a single shader program */
  program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  /* Output and shader compilation errors */
  const programLog = gl.getProgramInfoLog(program);
  if (programLog !== "") console.log(programLog);

  modelID = gl.getUniformLocation(program, "model");
  colourmodeID = gl.getUniformLocation(program, "colourmode");
  viewID = gl.getUniformLocation(program, "view");
  projectionID = gl.getUniformLocation(program, "projection");

  aSphere = new Sphere();
  aSphere.makeSphere(numlats, numlongs, gl);

  return gl;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function display(gl) {
  /* Define the background colour*/
  gl.clearColor(1, 1, 1, 1);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  /* Set the current shader program to be used */
  gl.useProgram(program);

  let projection = mat4.create();
  mat4.perspective(projection, Math.radians(30), aspect_ratio, 0.1, 100);

  let view = mat4.create();
  mat4.lookAt(
    view,
    vec3.fromValues(0, 0, 4),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0),
  );

  gl.uniform1i(colourmodeID, colourmode);
  gl.uniformMatrix4fv(viewID, false, view);
  gl.uniformMatrix4fv(projectionID, false, projection);

  let model = [];
  model.push(mat4.create(1));

  let top = model.pop();

  mat4.scale(top, top, vec3.fromValues(model_scale, model_scale, model_scale));
  mat4.rotate(top, top, -Math.radians(angle_x), vec3.fromValues(1, 0, 0));
  mat4.rotate(top, top, -Math.radians(angle_y), vec3.fromValues(0, 1, 0));
  mat4.rotate(top, top, -Math.radians(angle_z), vec3.fromValues(0, 0, 1));

  mat4.translate(top, top, vec3.fromValues(-x - 0.5, 0, 0));
  mat4.scale(
    top,
    top,
    vec3.fromValues(model_scale / 3, model_scale / 3, model_scale / 3),
  );

  gl.uniformMatrix4fv(modelID, false, top);

  aSphere.drawSphere(drawmode, gl, program);

  gl.disableVertexAttribArray(0);
  gl.useProgram(null);

  angle_x += angle_inc_x;
  angle_y += angle_inc_y;
  angle_z += angle_inc_z;
}
