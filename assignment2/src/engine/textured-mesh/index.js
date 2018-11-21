import { Mesh } from "../";

class TexturedMesh extends Mesh {
  constructor(context, meshObj, textureImg) {
    super(context, meshObj);

    this.colourMode = 1;
    const { gl } = context;

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    let image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = textureImg;

    this.texcoords = new Float32Array(meshObj.texcoords);
  }

  initBuffers() {
    const { gl } = this;

    this.texcoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.texcoords, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    super.initBuffers();
  }

  draw(program) {
    const gl = this.gl;
    const { attribLocations } = program;
    const { texcoordsBuffer } = this;

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordsBuffer);
    gl.enableVertexAttribArray(attribLocations.texcoord);
    gl.vertexAttribPointer(attribLocations.texcoord, 2, gl.FLOAT, false, 0, 0);

    super.draw(program);
  }
}

export default TexturedMesh;
