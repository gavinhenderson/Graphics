import { Turbine } from "./shapes";

class Windfarm {
  constructor() {
    this.turbineLocations = [
      [1, 0, 1],
      [2, 0, 2],
      [0, 0, 0],
      [-1, 0, -1],
      [-2, 0, -2],
      [-3, 0, -3],
      [1, 0, -1],
      [2, 0, -2],
      [-1, 0, 1],
      [-2, 0, 2],
    ];

    this.turbines = this.turbineLocations.map((currentLocation) => {
      return new Turbine(currentLocation);
    });
  }

  initBuffers(gl) {
    this.turbines.forEach((current) => current.initBuffers(gl));
  }

  draw(gl, programInfo, rotation) {
    this.turbines.forEach((current) => current.draw(gl, programInfo, rotation));
  }
}

export default Windfarm;
