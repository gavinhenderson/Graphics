/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertShader
 * @param {WebGLShader} fragShader
 * @returns {WebGLProgram}
 */
function createProgram(gl, vertShader, fragShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  const programLog = gl.getProgramInfoLog(program);
  if (programLog !== "") console.log(programLog);

  return program;
}

/**
 * @returns {WebGLRenderingContext}
 */
function getWebGLContext() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) alert("Your browser doesnt support webgl2");

  return gl;
}

module.exports = { createProgram, getWebGLContext };
