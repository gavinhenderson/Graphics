const setupUserControls = (userControl, lightbulbMesh, pointLight) => {
  userControl.addKeyDownListener("arrowdown", (event) => {
    lightbulbMesh.z += 0.1;
  });

  userControl.addKeyDownListener("arrowup", (event) => {
    lightbulbMesh.z -= 0.1;
  });

  userControl.addKeyDownListener("arrowleft", (event) => {
    lightbulbMesh.x -= 0.1;
  });

  userControl.addKeyDownListener("arrowright", (event) => {
    lightbulbMesh.x += 0.1;
  });

  userControl.addKeyUpListener("1", (event) => {
    pointLight.toggleLight();
  });
};

export default setupUserControls;
