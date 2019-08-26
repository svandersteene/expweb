import AObject from './AObject.js';

export default class Powerup extends AObject {
  constructor(scene, camera, level, accuracy, range, type) {
    super(scene, camera, level, accuracy, range);
    this.type = type;
    this.speed = 800;
    this.createPowerup();
  }

  /**
   * Create a powerup
   */
  createPowerup() {
    this.powerup = super.createObject('#d4af37');
    this.powerup.setAttribute('scale', '0.4 0.4 0.4');
  }

  /**
   * Make the powerup move
   */
  initPowerup() {
    super.initObject(this.speed);
  }

  /**
   * Handle powerup activation
   */
//   startPowerup(type) {
//     console.log(type);
//   }
}
