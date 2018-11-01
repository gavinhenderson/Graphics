import { mat4, vec3 } from "gl-matrix";
// lookAt(out, eye, center, up)
// out 	    mat4 	mat4 frustum matrix will be written into
// eye 	    vec3 	Position of the viewer
// center 	vec3 	Point the viewer is looking at
// up 	    vec3 	vec3 pointing up

class Camera {
  constructor() {
    this.radius = 8;
    this.increment = 0.5;
    this.angleIncrement = 10;
    this.angle = 0;

    this.x = 0;
    this.y = 0;
    this.z = 4;
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
  }

  moveLeft() {
    this.angle -= this.angleIncrement;
    this.normaliseAngle();
  }

  moveIn() {
    this.radius -= this.increment;
  }

  moveOut() {
    this.radius += this.increment;
  }

  getView() {
    // Limit angle to 0 - 180
    // This will be corrected later
    // let angle = this.angle > 180 ? this.angle - 180 : this.angle;

    //Assuming angle is between 0 - 90
    let theta = this.angle;
    let z = Math.sin(theta) * this.radius;
    let x = Math.sqrt(this.radius * this.radius - z * z);

    console.log("THETA", theta);
    console.log("Z", z);
    console.log("X", x);
    console.log(this.angle);

    const view = mat4.create();

    mat4.lookAt(
      view,
      vec3.fromValues(z, 0, x),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0),
    );

    return view;
  }
}

export default Camera;
