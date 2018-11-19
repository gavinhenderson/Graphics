class PointLight {
  constructor(mesh, startingPos) {
    this.mesh = mesh;
    this.currentPos = startingPos;
  }

  draw() {
    this.mesh.draw();
  }
}

export default PointLight;
