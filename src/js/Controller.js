export default class Controller {

  constructor(scene, camera) {
    this.sensitivity = 1;
    this.pause = false;
    this.scene = scene;
    this.camera = camera;
  }

  /**
   * Initialise controls when game loop started
   */
  initControls(gamepad) {
    // this.createVariableGravity();
    this.navigate(gamepad);
    // this.shoot(gamepad);
    this.resetController(gamepad);
    // this.pauseGame(gamepad);
    // this.pause ? this.scene.pause() : this.scene.play();
    this.changeSensitivity(gamepad);
  }

  //TODO: not quite working yet, too jiggery
  /**
   * Create a continuous variable gravity
   */
  // createVariableGravity() {
  //     this.camera.setAttribute('position', `${this.randomiseX()} ${this.randomiseY()} 0`);
  //     this.camera.setAttribute('rotation', `0 0 ${this.randomiseZ()}`);
  //   }

  //   randomiseX() {
  //     return this.camera.getAttribute('position').x += (Math.random() - 0.5) / 5;
  //   }

  //   randomiseY() {
  //     return this.camera.getAttribute('position').y += (Math.random() - 0.5) / 5;
  //   }

  //   randomiseZ() {
  //     return this.camera.getAttribute('rotation').z += (Math.random() - 0.5) * 5;
  //   }

  /**
   * Navigate through the world with the LEFT JOYSTICK and stabilise with the L2 and R2 BUTTONS
   */
  navigate(gamepad) {
    this.camera.setAttribute('position', `${this.moveHorizontal(gamepad.axes[0])} ${this.moveVertical(gamepad.axes[1])} 0`);
    this.camera.setAttribute('rotation', `0 0 ${this.stabilise(gamepad.buttons)}`);
  }

  /**
   * Use the R1 BUTTON to destroy the blobs
   */
  //   shoot(gamepad) {
  //     if (gamepad.buttons[5].pressed) {
  //       console.log('camera', {x: this.camera.getAttribute('position').x, y: this.camera.getAttribute('position').y});
  //     }
  //   }

  /**
   * Use the L1 BUTTON to reset your position & rotation back to 0 0 0, in case you're completely lost
   * Use the TRIANGLE BUTTON to reset your gamepad's sensitivity
   */
  resetController(gamepad) {
    // reset your position in the world
    if (gamepad.buttons[4].pressed) {
      this.camera.setAttribute('position', '0 0 0');
      this.camera.setAttribute('rotation', '0 0 0');
    }

    // reset the gamepad's sensitivity
    if (gamepad.buttons[3].pressed) {
      this.sensitivity = 1;
    }
  }

  /**
   * Use the TOUCHPAD in the middle of the controller to pause the game
   */
  pauseGame(gamepad) {
    if (gamepad.buttons[17].pressed) {
      this.pause = !this.pause;
      console.log('pause', this.pause);
    }
  }

  /**
   * Change sensitivity of the controller with the UP or DOWN ARROW
   */
  changeSensitivity(gamepad) {
    if (this.sensitivity < 2 && gamepad.buttons[12].pressed) {
      this.sensitivity = parseFloat((this.sensitivity += 0.1).toFixed(1));
    }
    if (this.sensitivity > 0.1 && gamepad.buttons[13].pressed) {
      this.sensitivity = parseFloat((this.sensitivity -= 0.1).toFixed(1));
    }
  }

  /**
   * Helper functions
   */
  moveHorizontal(joystick) {
    return this.camera.getAttribute('position').x += joystick / this.sensitivity;
  }

  moveVertical(joystick) {
    return this.camera.getAttribute('position').y -= joystick / this.sensitivity;
  }

  stabilise(buttons) {
    this.position = this.camera.getAttribute('rotation').z;
    if (buttons[6].pressed) {
      this.position -= buttons[6].value / this.sensitivity;
    }
    if (buttons[7].pressed) {
      this.position += buttons[7].value / this.sensitivity;
    }
    return this.position;
  }
}
