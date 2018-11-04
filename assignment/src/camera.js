import { mat4, vec3 } from "gl-matrix";
Math.radians = (degrees) => (Math.PI * degrees) / 180;

class Camera {
  constructor() {
    this.radius = 10;
    this.increment = 0.5;
    this.angleIncrement = 3;
    this.angle = 25;
    this.y = 0;
    this.updateCoords();
  }

  // Calculate the camera coords based on the angle and radius
  updateCoords() {
    let theta = Math.radians(this.angle);
    this.z = Math.cos(theta) * this.radius;
    this.x = Math.sin(theta) * this.radius;
  }

  // Make sure the angle is within the bounds
  normaliseAngle() {
    this.angle = this.angle > 360 ? this.angle - 360 : this.angle;
    this.angle = this.angle < 0 ? this.angle + 360 : this.angle;
  }

  moveRight() {
    this.angle += this.angleIncrement;
    this.normaliseAngle();
    this.updateCoords();
  }

  moveLeft() {
    this.angle -= this.angleIncrement;
    this.normaliseAngle();
    this.updateCoords();
  }

  moveIn() {
    this.radius -= this.increment;
    this.normaliseAngle();
    this.updateCoords();
  }

  moveOut() {
    this.radius += this.increment;
    this.normaliseAngle();
    this.updateCoords();
  }

  getView() {
    const view = mat4.create();

    mat4.lookAt(
      view,
      vec3.fromValues(this.x, 0, this.z),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0),
    );

    return view;
  }
}

export default Camera;
