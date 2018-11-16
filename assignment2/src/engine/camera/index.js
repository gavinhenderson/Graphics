import { mat4, vec3 } from "gl-matrix";

class Camera {
  constructor() {}

  getView() {
    const view = mat4.create();
    mat4.lookAt(
      view,
      vec3.fromValues(5, 0, 10),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0),
    );

    return view;
  }
}

export default Camera;
