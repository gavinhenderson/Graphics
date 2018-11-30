import { createShader, Program } from "../";
import vertRaw from "./particle.vert";
import fragRaw from "./particle.frag";
import { mat4 } from "gl-matrix";

class Particles {
  constructor(context, numberOfParticles, mesh, scene, camera) {
    this.mesh = mesh;
    this.scene = scene;
    this.camera = camera;

    // prettier-ignore
    this.singleVertex = [
      -1.0, -1.0,
      1.0, -1.0,
      1.0, 1.0,
      -1.0, 1.0
    ];

    this.time = 0;

    this.numberOfParticles = numberOfParticles;

    this.gl = context.gl;

    const vertShader = createShader(
      context.gl,
      context.gl.VERTEX_SHADER,
      vertRaw,
    );

    const fragShader = createShader(
      context.gl,
      context.gl.FRAGMENT_SHADER,
      fragRaw,
    );

    this.program = new Program(context, { vertShader, fragShader });

    this.program.addMultipleAttribs(["vertex", "lifetime", "offsetFromCenter"]);

    this.program.addMultipleUniforms([
      "startingPos",
      "currentTime",
      "projection",
      "model",
      "view",
    ]);
  }

  getBufferData() {
    let lifetimes = [];
    let vertexes = [];
    let offsets = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      let currentLifetime = Math.random() * 10;
      //let currentLifetime = 10;
      let currentOffset = [0, 0, 0]; // Make random
      vertexes.push(...this.singleVertex);

      for (let j = 0; j < 4; j++) {
        offsets.push(...currentOffset);
        lifetimes.push(currentLifetime);
      }
    }

    // console.log("lifetimes", lifetimes.length / 1);
    // console.log("vertexes", vertexes.length / 2);
    // console.log("offsets", offsets.length / 3);

    lifetimes = new Float32Array(lifetimes);
    vertexes = new Float32Array(vertexes);
    offsets = new Float32Array(offsets);

    return { lifetimes, vertexes, offsets };
  }

  initBuffers() {
    /** @type {WebGLRenderingContext} */
    const gl = this.gl;

    const { lifetimes, vertexes, offsets } = this.getBufferData();

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);

    this.lifetimeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lifetimeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, lifetimes, gl.STATIC_DRAW);

    this.offsetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
  }

  draw(deltaTime) {
    this.program.use();

    this.time += deltaTime;

    const model = this.mesh.getModel();
    // const model = mat4.create();
    const projection = this.scene.getProjection();
    const view = this.camera.getView();
    this.startingPos = new Float32Array([0, 0, 0]);

    const { attribLocations, uniformLocations } = this.program;
    /** @type {WebGLRenderingContext} */
    const gl = this.gl;
    const { vertexBuffer, lifetimeBuffer, offsetBuffer } = this;

    // mat4.scale(model, model, [5, 5, 5]);

    // console.log(this.time);

    gl.uniformMatrix4fv(uniformLocations.model, false, model);
    gl.uniform1f(uniformLocations.currentTime, this.time);
    gl.uniformMatrix4fv(uniformLocations.projection, false, projection);
    gl.uniformMatrix4fv(uniformLocations.view, false, view);
    gl.uniform3fv(uniformLocations.startingPos, this.startingPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(attribLocations.vertex);
    gl.vertexAttribPointer(attribLocations.vertex, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, lifetimeBuffer);
    gl.enableVertexAttribArray(attribLocations.lifetime);
    gl.vertexAttribPointer(attribLocations.lifetime, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.enableVertexAttribArray(attribLocations.offset);
    gl.vertexAttribPointer(attribLocations.offset, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.numberOfParticles * 4);

    gl.disableVertexAttribArray(0);
    this.program.stopUsing();
  }
}

export default Particles;
