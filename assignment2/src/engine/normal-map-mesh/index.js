import { TexturedMesh } from "../";

class NormalMapMesh extends TexturedMesh {
  constructor(context, meshObj, textureImg, normalImg) {
    super(context, meshObj, textureImg);
    this.colourMode = 3;

    const gl = context.gl;
    this.gl = gl;

    this.texture = gl.createTexture();
    let image = new Image();
    image.onload = () => {
      this.image = image;
    };

    image.src = normalImg;
  }

  draw(program) {
    const gl = this.gl;

    if (this.image) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.image,
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    super.draw(program);
  }
}

export default NormalMapMesh;
