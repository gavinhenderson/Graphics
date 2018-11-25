import { mat4 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

class Camera {
  constructor(context) {
    this.gl = context.gl;
    this.canvas = context.canvas;
    this.isMouseLocked = false;

    this.lookSensitivity = 0.1;

    this.x = 0;
    this.y = 0;
    this.z = -10;

    this.rotX = 0;
    this.rotY = 0;

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

  setCameraControls(userControl) {
    userControl.addKeyDownListener("w", (event) => {
      let rX = Math.radians(this.rotX);
      let rY = Math.radians(this.rotY);

      let dY = this.speed * Math.sin(rY);
      let H = this.speed * Math.cos(rY);

      let dX = H * Math.sin(-rX); // Delta X
      let dZ = H * Math.cos(rX); // Delta Z

      this.y += dY;
      this.x += dX;
      this.z += dZ;
    });

    userControl.addKeyDownListener("a", (event) => {
      let rX = Math.radians(this.rotX);
      this.z += this.speed * Math.cos(rX - Math.PI / 2);
      this.x -= this.speed * Math.sin(rX - Math.PI / 2);
    });

    userControl.addKeyDownListener("s", (event) => {
      let rX = Math.radians(this.rotX); // Rotation in X (left/right)
      let rY = Math.radians(this.rotY); // Rotation in Y (up/down)

      let dY = this.speed * Math.sin(rY); // Delta Y
      let H = this.speed * Math.cos(rY); // Movement distance in XZ plane

      let dX = H * Math.sin(-rX); // Delta X
      let dZ = H * Math.cos(rX); // Delta Z

      this.y -= dY;
      this.x -= dX;
      this.z -= dZ;
    });

    userControl.addKeyDownListener("d", (event) => {
      let rX = Math.radians(this.rotX);
      this.z += this.speed * Math.cos(rX + Math.PI / 2);
      this.x -= this.speed * Math.sin(rX + Math.PI / 2);
    });
  }

  draw(program) {
    const view = this.getView();
    this.gl.uniformMatrix4fv(program.uniformLocations.view, false, view);
  }
}

export default Camera;
