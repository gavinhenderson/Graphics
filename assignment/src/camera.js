import { mat4, vec3 } from "gl-matrix";
Math.radians = (degrees) => (Math.PI * degrees) / 180;

// lookAt(out, eye, center, up)
// out 	    mat4 	mat4 frustum matrix will be written into
// eye 	    vec3 	Position of the viewer
// center 	vec3 	Point the viewer is looking at
// up 	    vec3 	vec3 pointing up

class Camera {
  constructor() {
    this.radius = 8;
    this.increment = 0.5;
    this.angleIncrement = 15;
    this.angle = 0;

    this.x = 0;
    this.y = 0;
    this.z = this.radius;
  }

  updateCoords() {
    let theta = Math.radians(this.angle);
    this.z = Math.cos(theta) * this.radius;
    this.x = Math.sin(theta) * this.radius;
  }

  normaliseAngle() {
    if (this.angle > 360) {
      this.angle -= 360;
      return;
    }

    if (this.angle < 0) {
      this.angle += 360;
      return;
    }

    console.log(this.angle);
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

    // console.log(view);

    return view;
  }
}

export default Camera;
