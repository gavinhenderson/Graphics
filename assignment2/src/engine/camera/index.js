import { mat4, vec3 } from "gl-matrix";

class Camera {
  constructor(context) {
    this.x = 0;
    this.z = 10;
    this.gl = context.gl;
    this.canvas = context.canvas;
    this.isMouseLocked = false;

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
    console.log(e.movementX);
    console.log(e.movementY);
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
