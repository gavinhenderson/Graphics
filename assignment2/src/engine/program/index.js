class Program {
  /**
   * @param {boolean} debug
   */
  constructor(context, debug = true) {
    this.debug = debug;
    this.gl = context.gl;
    this.program = this.gl.createProgram();
    this.printProgramInfo();
    this.attribLocations = {};
    this.uniformLocations = {};
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

  use() {
    this.gl.useProgram(this.program);
  }

  stopUsing() {
    this.gl.disableVertexAttribArray(0);
    this.gl.useProgram(null);
  }

  addAttrib(attribName) {
    this.attribLocations[attribName] = this.gl.getAttribLocation(
      this.program,
      attribName,
    );
  }

  addUniform(uniformName) {
    this.uniformLocations[uniformName] = this.gl.getUniformLocation(
      this.program,
      uniformName,
    );
  }

  addMultipleAttribs(listOfAttribs) {
    listOfAttribs.forEach((current) => this.addAttrib(current));
  }

  addMultipleUniforms(listOfUniforms) {
    listOfUniforms.forEach((current) => this.addUniform(current));
  }
}

export default Program;
