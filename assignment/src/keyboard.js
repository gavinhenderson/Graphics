function intialiseEventListeners(windfarm, camera) {
  // Stop the arrow keys from scrolling the page
  window.addEventListener(
    "keydown",
    function(e) {
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false,
  );

  // Set colour Modes
  let colourModes = ["Diffuse", "Ambient"];
  let colourModeElement = document.querySelector(".lighting-mode");

  window.onkeyup = (event) => {
    let key = event.key.toLowerCase();

    switch (key) {
      case "e": {
        windfarm.addWindmill();
        break;
      }
      case "r": {
        windfarm.removeWindmill();
        break;
      }
      case "t": {
        colourMode++;
        if (colourMode > 2) colourMode = 1;
        colourModeElement.innerHTML = colourModes[colourMode - 1];
      }
    }
  };

  window.onkeydown = (event) => {
    let { key } = event;
    key = key.toLowerCase();

    switch (key) {
      case "arrowleft": {
        camera.moveLeft();
        break;
      }
      case "arrowright": {
        camera.moveRight();
        break;
      }
      case "arrowup": {
        camera.moveIn();
        break;
      }
      case "arrowdown": {
        camera.moveOut();
        break;
      }
      case "q": {
        rotSpeed++;
        break;
      }
      case "w": {
        rotSpeed--;
        break;
      }
    }
  };
}

export default intialiseEventListeners;
