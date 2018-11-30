import { mat4 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

class Camera {
  constructor(context) {
    this.gl = context.gl;
    this.canvas = context.canvas;
    this.isMouseLocked = false;

    this.lookSensitivity = 0.1;

    this.x = -21.7;
    this.y = -7.4;
    this.z = 13;

    this.rotX = -120;
    this.rotY = 12;

    this.speed = 1;

    this.setupPointerLock(this.canvas);
  }

  setupPointerLock(canvas) {
    canvas.requestPointerLock =
      canvas.requestPointerLock || canvas.mozRequestPointerLock;

    canvas.onclick = (event) => {
      canvas.requestPointerLock();
    };

    document.addEventListener(
      "pointerlockchange",
      this.toggleMouseListener.bind(this),
      false,
    );
  }

  toggleMouseListener() {
    this.isMouseLocked = !this.isMouseLocked;

    if (this.isMouseLocked) {
      document.onmousemove = this.updatePosition.bind(this);
    } else {
      document.onmousemove = null;
    }
  }

  /**
   * @param {MouseEvent} e
   */
  updatePosition(e) {
    this.rotX += e.movementX * this.lookSensitivity;
    this.rotY += e.movementY * this.lookSensitivity;

    if (this.rotY > 180) this.rotY = 180;
    if (this.rotY < -180) this.rotY = -180;
  }

  getView() {
    const view = mat4.create();

    mat4.rotateX(view, view, Math.radians(this.rotY));
    mat4.rotateY(view, view, Math.radians(this.rotX));
    mat4.translate(view, view, [this.x, this.y, this.z]);

    return view;
  }

  setPosition(position) {
    this.x = position[0];
    this.y = position[1];
    this.z = position[2];
  }

  moveZ(direction) {
    let radRotX = Math.radians(this.rotX);
    let radRotY = Math.radians(this.rotY);

    let dY = this.speed * Math.sin(radRotY) * direction;
    let dX = this.speed * Math.cos(radRotY) * Math.sin(-radRotX) * direction;
    let dZ = this.speed * Math.cos(radRotY) * Math.cos(radRotX) * direction;

    let newX = dX + this.x;
    let newY = dY + this.y;
    let newZ = dZ + this.z;

    this.setPosition([newX, newY, newZ]);
  }

  moveX(direction) {
    let rX = Math.radians(this.rotX);
    let angle = (Math.PI / 2) * direction;
    this.z += this.speed * Math.cos(rX + angle);
    this.x -= this.speed * Math.sin(rX + angle);
  }

  setCameraControls(userControl) {
    userControl.addKeyDownListener("w", (event) => {
      this.moveZ(1);
    });

    userControl.addKeyDownListener("a", (event) => {
      this.moveX(-1);
    });

    userControl.addKeyDownListener("s", (event) => {
      this.moveZ(-1);
    });

    userControl.addKeyDownListener("d", (event) => {
      this.moveX(1);
    });
  }

  draw(program) {
    const view = this.getView();
    this.gl.uniformMatrix4fv(program.uniformLocations.view, false, view);
  }
}

export default Camera;
