class Program {
  /**
   * @param {boolean} debug
   */
  constructor(context, debug = true) {
    this.debug = debug;
    this.gl = context.gl;
    this.program = this.gl.createProgram();
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
