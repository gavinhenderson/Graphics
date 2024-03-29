import { TexturedMesh } from "../";

class HeightMapMesh extends TexturedMesh {
  constructor(context, meshObj, textureImg, normalImg) {
    super(context, meshObj, textureImg);
    this.colourMode = 3;

    const gl = context.gl;
    this.gl = gl;

    let image = new Image();
    image.onload = () => {
      this.normalMap = image;

      // gl.activeTexture(gl.TEXTURE1);
      this.normalMapTex = gl.createTexture();

      gl.activeTexture(gl.TEXTURE1);
      //gl.bindTexture(gl.TEXTURE_2D, this.normalMapTex);

      gl.bindTexture(gl.TEXTURE_2D, this.normalMapTex);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.normalMap,
      );

      gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = normalImg;
  }

  draw(program) {
    const gl = this.gl;

    if (this.normalMap) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.normalMapTex);
    }

    super.draw(program);
  }
}

export default HeightMapMesh;
