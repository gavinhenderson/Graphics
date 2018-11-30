class UserControl {
  constructor() {
    this.onKeyDownActions = {};
    this.onKeyUpActions = {};

    window.onkeydown = (event) => {
      if (this.debug) console.log(event.key);

      const key = event.key.toLowerCase();
      const action = this.onKeyDownActions[key];
      if (action) action(event);
    };

    window.onkeyup = (event) => {
      if (this.debug) console.log(event.key);

      const key = event.key.toLowerCase();
      const action = this.onKeyUpActions[key];
      if (action) action(event);
    };
  }

  addKeyDownListener(key, action) {
    this.onKeyDownActions[key] = action;
  }

  addKeyUpListener(key, action) {
    this.onKeyUpActions[key] = action;
  }
}

export default UserControl;
