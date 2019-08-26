export default class Controller {

  constructor(scene, camera, hudWidth, hudHeight) {
    this.scene = scene;
    this.camera = camera;
    this.hudPosition = {x: hudWidth / 2, y: hudHeight / 2};
    this.sensitivity = 0.5;
    this.maxVelocity = 2;
    this.velocity = {x: 0, y: 0};
    this.maxRotation = 1;
    this.rotation = 0;
  }

  /**
   * Initialise controls when game loop started
   */
  initControls(gamepad, tick, difficulty) {
    this.nudgeGravity(tick, difficulty);
    this.navigate(gamepad);
    this.resetController(gamepad);
    this.changeSensitivity(gamepad);
  }

  nudgeGravity(tick, difficulty) {
    this.random = Math.round((Math.random() * 30 + 120) * 100) / 100;
    if (tick % this.random > 0 && tick % this.random < 1) {
      this.rotation += Math.round((Math.random() - 0.5) * (difficulty * 5) / 100 * 100) / 100;
      this.velocity.x += Math.round((Math.random() - 0.5) * (difficulty * 8) / 100 * 100) / 100;
      this.velocity.y += Math.round((Math.random() - 0.5) * (difficulty * 8) / 100 * 100) / 100;
    }
  }

  /**
   * Navigate through the world with the LEFT JOYSTICK and stabilise with the L2 and R2 BUTTONS
   */
  navigate(gamepad) {
    this.camera.setAttribute('position', `${this.xPos} ${this.yPos} 0`);
    this.camera.setAttribute('rotation', `0 0 ${this.zPos}`);
    this.changeSpeed(gamepad);

    // change interface
    document.querySelector('#hudhorizontal').setAttribute('transform', `rotate(${this.mapInput(this.velocity.x, - this.maxVelocity, this.maxVelocity, - 90, 90)}, ${this.hudPosition.x}, ${this.hudPosition.y})`);
    document.querySelector('#cross').setAttribute('transform', `rotate(${this.zPos}, ${this.hudPosition.x}, ${this.hudPosition.y}), translate(${this.mapInput(this.velocity.x, - this.maxVelocity, this.maxVelocity, - 180, 180)}, ${this.mapInput(this.velocity.y, - this.maxVelocity, this.maxVelocity, - 180, 180)}), rotate(${- this.zPos}, ${this.hudPosition.x}, ${this.hudPosition.y})`);
    document.querySelector('#hudrotation').setAttribute('transform', `translate(140.000000, 136.000000), rotate(${this.mapInput(this.zPos, - 180, 180, - 135, 135)}, 132, 64)`);
  }

  /**
   * Changes the speed at which the player moves and rotates
   */
  changeSpeed({axes: [x, y, z]}) {
    this.joystick = {x, y, z};
    this.velocity = {
      x: Math.max(- this.maxVelocity, Math.min(this.maxVelocity, Math.round((this.velocity.x + this.joystick.x / 10 * this.sensitivity) * 100) / 100)),
      y: Math.max(- this.maxVelocity, Math.min(this.maxVelocity, Math.round((this.velocity.y + this.joystick.y / 10 * this.sensitivity) * 100) / 100))
    };
    this.rotation = Math.max(- this.maxRotation, Math.min(this.maxRotation, Math.round((this.rotation + this.joystick.z / 100) * 100) / 100));
  }

  /**
   * Change sensitivity of the controller with the UP or DOWN ARROW
   */
  changeSensitivity(gamepad) {
    if (this.sensitivity < 1 && gamepad.buttons[12].pressed) {
      this.sensitivity = parseFloat((this.sensitivity += 0.01).toFixed(2));
    }
    if (this.sensitivity > 0.1 && gamepad.buttons[13].pressed) {
      this.sensitivity = parseFloat((this.sensitivity -= 0.01).toFixed(2));
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
    }

    // reset the gamepad's sensitivity
    if (gamepad.buttons[3].pressed) {
      this.sensitivity = 0.5;
    }
  }

  resetPositions() {
    this.velocity = {x: 0, y: 0};
    this.rotation = 0;
    this.camera.setAttribute('position', '0 0 0');
    this.camera.setAttribute('rotation', '0 0 0');
  }

  /**
   * Helper functions
   */
  mapInput = (input, inLow, inHigh, outLow, outHigh) => (input - inLow) / (inHigh - inLow) * (outHigh - outLow) + outLow;

  get xPos() {
    return this.camera.getAttribute('position').x += this.velocity.x;
  }

  get yPos() {
    return this.camera.getAttribute('position').y -= this.velocity.y;
  }

  get zPos() {
    return Math.max(- 180, Math.min(180, this.camera.getAttribute('rotation').z += this.rotation));
  }
}
