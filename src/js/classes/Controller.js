export default class Controller {

  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.sensitivity = 0.5;
    this.maxVelocity = 2;
    this.velocity = {x: 0, y: 0};
  }

  /**
   * Initialise controls when game loop started
   */
  initControls(gamepad) {
    // this.createVariableGravity();
    this.navigate(gamepad);
    this.resetController(gamepad);
    this.changeSensitivity(gamepad);
  }

  /**
   * Check if game should be started
   */
  startGame(padButton) {
    return padButton.pressed ? true : false;
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
    this.camera.setAttribute('position', `${this.xPos} ${this.yPos} 0`);
    this.camera.setAttribute('rotation', `0 0 ${this.stabilise(gamepad.buttons)}`);
    this.changeVelocity(gamepad);
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

  /**
   * Changes the speed at which the player moves
   */
  changeVelocity({axes: [x, y]}) {
    this.joystick = {x, y};
    this.velocity = {
      x: Math.max(- this.maxVelocity, Math.min(this.maxVelocity, Math.round((this.velocity.x + this.joystick.x / 10 * this.sensitivity) * 100) / 100)),
      y: Math.max(- this.maxVelocity, Math.min(this.maxVelocity, Math.round((this.velocity.y + this.joystick.y / 10 * this.sensitivity) * 100) / 100))
    };
  }

  /**
   * Change sensitivity of the controller with the UP or DOWN ARROW
   */
  changeSensitivity(gamepad) {
    if (this.sensitivity < 1 && gamepad.buttons[12].pressed) {
      this.sensitivity = parseFloat((this.sensitivity += 0.1).toFixed(1));
    }
    if (this.sensitivity > 0.1 && gamepad.buttons[13].pressed) {
      this.sensitivity = parseFloat((this.sensitivity -= 0.1).toFixed(1));
    }
  }

  /**
   * Use the L1 BUTTON to reset your position & rotation back to 0 0 0, in case you're completely lost
   * Use the TRIANGLE BUTTON to reset your gamepad's sensitivity
   */
  resetController(gamepad) {
    // reset your position in the world
    if (gamepad.buttons[4].pressed) {
      this.resetPositions();
      this.camera.setAttribute('rotation', '0 0 0');
    }

    // reset the gamepad's sensitivity
    if (gamepad.buttons[3].pressed) {
      this.sensitivity = 0.5;
    }
  }

  resetPositions() {
    this.velocity = {x: 0, y: 0};
    this.camera.setAttribute('position', '0 0 0');
  }

  /**
   * Helper functions
   */
  get xPos() {
    return this.camera.getAttribute('position').x += this.velocity.x;
  }

  get yPos() {
    return this.camera.getAttribute('position').y -= this.velocity.y;
  }
}
