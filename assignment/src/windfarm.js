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

    this.numberOfTurbines = 1;

    this.turbines = this.turbineLocations.map((currentLocation) => {
      return new Turbine(currentLocation);
    });
  }

  addWindmill() {
    if (this.numberOfTurbines + 1 > this.turbineLocations.length) return;
    this.numberOfTurbines++;
  }

  removeWindmill() {
    if (this.numberOfTurbines - 1 < 1) return;
    this.numberOfTurbines--;
  }

  initBuffers(gl) {
    this.turbines.forEach((current) => current.initBuffers(gl));
  }

  draw(gl, programInfo, rotation) {
    for (let i = 0; i < this.numberOfTurbines; i++) {
      this.turbines[i].draw(gl, programInfo, rotation);
    }
  }
}

export default Windfarm;
