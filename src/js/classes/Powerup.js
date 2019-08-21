import AObject from './AObject.js';

export default class Powerup extends AObject {
  constructor(scene, camera, level, accuracy, range) {
    super(scene, camera, level, accuracy, range);
    this.createPowerup();
  }

  /**
   * Create a powerup
   */
  createPowerup() {
    super.createObject('blue');
  }

  /**
   * Make the powerup move
   */
  initPowerup() {
    super.initObject(1000);
  }
}
