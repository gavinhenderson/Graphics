import { createShader, Program } from "../";
import vertRaw from "./particle.vert";
import fragRaw from "./particle.frag";

class Particles {
  constructor(context, numberOfParticles) {
    // prettier-ignore
    this.vertexBufferData = [
      -1.0, -1.0,
      1.0, -1.0,
      1.0, 1.0,
      -1.0, 1.0
    ]

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

    this.program.addMultipleAttribs(["lifetime", "offsetFromCenter"]);

    this.program.addMultipleUniforms([
      "startingPos",
      "time",
      "projection",
      "model",
      "view",
    ]);
  }

  initBuffers() {
    /** @type {WebGLRenderingContext} */
    const gl = this.gl;

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferData, gl.STATIC_DRAW);

    this.particlesPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.maxParticles * 4, gl.STREAM_DRAW);

    this.particlesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.maxParticles * 4, NULL, GL_STREAM_DRAW);
  }

  draw() {}
}

export default Particles;
