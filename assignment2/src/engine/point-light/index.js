class PointLight {
  constructor(mesh, context) {
    this.gl = context.gl;
    this.mesh = mesh;

    mesh.lightingMode = 2;
    this.isLightOn = true;
  }

  toggleLight() {
    this.isLightOn = !this.isLightOn;
  }

  draw(program) {
    this.gl.uniform3fv(
      program.uniformLocations.lightPos,
      this.mesh.getLocation(),
    );

    const lightPower = this.isLightOn ? 1 : 0;
    this.gl.uniform1f(program.uniformLocations.lightPower, lightPower);

    this.mesh.draw(program);
  }
}

export default PointLight;
