class Program {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {boolean} debug
   */
  constructor(gl, debug = true) {
    this.debug = debug;
    this.gl = gl;
    this.program = gl.createProgram();
    this.printProgramInfo();
  }

  printProgramInfo() {
    const programLog = this.gl.getProgramInfoLog(this.program);
    if (programLog !== "" && this.debug) console.log(programLog);
  }

  attachShader(shader) {
    this.gl.attachShader(this.program, shader);
    this.printProgramInfo();
  }

  linkProgram() {
    this.gl.linkProgram(this.program);
    this.printProgramInfo();
  }
}

export default Program;
