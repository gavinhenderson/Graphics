class Context {
  /**
   * @param {string} canvasId
   */
  constructor(canvasId) {
    const canvas = document.querySelector("#" + canvasId);
    const gl = canvas.getContext("webgl2");

    if (!gl) alert("Your browser doesnt support webgl2");

    this.gl = gl;
  }
}

export default Context;
