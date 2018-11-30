class Context {
  /**
   * @param {string} canvasId
   */
  constructor(canvasId) {
    const canvas = document.querySelector("#" + canvasId);
    this.canvas = canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext("webgl2");

    if (!gl) alert("Your browser doesnt support webgl2");

    this.gl = gl;
  }

  createVertexArray() {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
  }
}

export default Context;
