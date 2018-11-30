/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} shaderType
 * @param {string} shaderSource
 * @param {boolean} debug
 */
function createShader(gl, shaderType, shaderSource, debug = true) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const shaderInfo = gl.getShaderInfoLog(shader);
  if (debug & (shaderInfo !== "")) console.log(shaderInfo);

  return shader;
}

export default createShader;
