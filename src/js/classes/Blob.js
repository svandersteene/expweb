import AObject from './AObject.js';

export default class Blob extends AObject {
  constructor(scene, camera, level, accuracy, range) {
    super(scene, camera, level, accuracy, range);
    this.speed = 550;
    this.createBlob();
  }

  /**
   * Create a blob
   */
  createBlob() {
    super.createObject('grey');
  }

  /**
   * Make the blob move
   */
  initBlob() {
    super.initObject(this.speed);
  }
}
