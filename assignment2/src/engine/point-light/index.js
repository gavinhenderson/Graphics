class PointLight {
  constructor(mesh, context) {
    this.gl = context.gl;
    this.mesh = mesh;
  }

  draw(program) {
    this.gl.uniform3fv(
      program.uniformLocations.lightPos,
      this.mesh.getLocation(),
    );

    this.mesh.draw(program);
  }
}

export default PointLight;
