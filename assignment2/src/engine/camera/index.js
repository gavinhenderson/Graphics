import { mat4, vec3 } from "gl-matrix";

Math.radians = (degrees) => (Math.PI * degrees) / 180;

class Camera {
  constructor(context) {
    this.gl = context.gl;
    this.canvas = context.canvas;
    this.isMouseLocked = false;

    this.x = 0;
    this.y = 0;
    this.z = -10;

    this.rotX = 0;
    this.rotY = 0;

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
    this.rotX += e.movementX;
    this.rotY += e.movementY;
  }

  getView() {
    const view = mat4.create();

    mat4.rotate(view, view, Math.radians(this.rotX), [0, 1, 0]);
    mat4.rotate(view, view, Math.radians(this.rotY), [1, 0, 0]);
    mat4.translate(view, view, [this.x, this.y, this.z]);

    return view;
  }

  setCameraControls(userControl) {
    userControl.addKeyDownListener("w", (event) => {
      this.z--;
    });

    userControl.addKeyDownListener("a", (event) => {
      this.x--;
    });

    userControl.addKeyDownListener("s", (event) => {
      this.z++;
    });

    userControl.addKeyDownListener("d", (event) => {
      this.x++;
    });
  }

  draw(program) {
    const view = this.getView();
    this.gl.uniformMatrix4fv(program.uniformLocations.view, false, view);
  }
}

export default Camera;
