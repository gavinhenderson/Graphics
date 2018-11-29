import { TexturedMesh } from "../";

class NormalMapMesh extends TexturedMesh {
  constructor(context, meshObj, textureImg, normalImg) {
    super(context, meshObj, textureImg);
    this.colourMode = 3;

    const gl = context.gl;
    this.gl = gl;

    let image = new Image();
    image.onload = () => {
      this.image = image;

      // gl.activeTexture(gl.TEXTURE1);
      this.texture = gl.createTexture();

      gl.activeTexture(gl.TEXTURE1);
      //gl.bindTexture(gl.TEXTURE_2D, this.texture);

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
    };

    image.src = normalImg;
  }

  draw(program) {
    const gl = this.gl;

    if (this.image) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    super.draw(program);
  }
}

export default NormalMapMesh;
