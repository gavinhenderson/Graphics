import fragShaderText from "./shader.frag";
import vertShaderText from "./shader.vert";

/**
 *
 * @param {number} shaderType
 * @param {WebGLRenderingContext} gl
 * @param {boolean} debug
 */
function importShader(shaderType, gl, debug = true) {
  const shader = gl.createShader(shaderType);
  let shaderText = null;

  if (shaderType === gl.VERTEX_SHADER) {
    console.log("Loading vertex shader......");
    shaderText = vertShaderText;
  } else {
    console.log("Loading fragment shader......");
    shaderText = fragShaderText;
  }

  gl.shaderSource(shader, shaderText);
  gl.compileShader(shader);

  const shaderInfo = gl.getShaderInfoLog(shader);
  if (debug & (shaderInfo !== "")) console.log(shaderInfo);

  return shader;
}

export { importShader };
