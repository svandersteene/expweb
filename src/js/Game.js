import Controller from './Controller.js';
import Blob from './Blob.js';

export default class Game {

  constructor() {
    console.log('creating the game...');
    window.addEventListener('gamepaddisconnected', () => {
      this.disconnectedGamepad();
    });
    this.scene = document.querySelector('a-scene');
    this.scene.setAttribute('style', 'display: block');
    this.camera = document.querySelector('a-camera');
    this.controller = new Controller(this.scene, this.camera);
    this.tick = 0;
    this.level = 1;
    this.accuracy = 2;
    this.range = - 100 - 25 * this.level;
    this.blobs = [];
    this.hitBlobs = [];
    this.missedBlobs = [];

    // this.blob.addEventListener('child-attached', e => {
    //   console.log('child attached', e.detail.el);
    // });

    // this.blob.addEventListener('child-detached', e => {
    //   console.log('child detached', e.detail.el);
    // });

    this.loop();
  }

  /**
   * Create blobs at random times
   */
  addRandomBlobs() {
    this.random = Math.round(((Math.random() * (30 - 2 * this.level)) + (30 - 2 * this.level)) * 10) / 10;
    if (this.tick % this.random > 0 && this.tick % this.random < 1) {
      this.blobs.push(new Blob(this.scene, this.camera, this.level, this.accuracy, this.range));
    }
  }

  /**
   * Handle blobsß
   */
  handleBlob(blob, hitButton) {
    blob.initBlob();
    if (blob.detectHit(hitButton) && !this.hitBlobs.includes(blob)) {
      this.hitBlobs.push(blob);
      this.blobs = this.blobs.filter(item => item !== blob);
    }
    if (blob.detectBoundaries() && !this.missedBlobs.includes(blob) && !this.hitBlobs.includes(blob)) {
      this.missedBlobs.push(blob);
      this.accuracy = Math.round((this.accuracy - 0.01) * 100) / 100;
      console.log('accuracy', this.accuracy);
      this.blobs = this.blobs.filter(item => item !== blob);
    }
  }

  /**
   * Handle the gameplay when a level is completed
   */
  checkGameLevel() {
    return this.hitBlobs.length === 50 * this.level ? true : false;
  }

  /**
   * The gameloop
   */
    loop = () => {
      // game controls & settings
      const gamepad = navigator.getGamepads()[0];
      this.controller.initControls(gamepad);

      // level checker
      if (this.checkGameLevel()) {
        console.log(`you completed level ${this.level}`);
        this.blobs.forEach(blob => blob.destroy());
        this.blobs = [];
        this.hitBlobs = [];
        this.accuracy += 0.5;
        this.level ++;
      }

      // starting blobs loop
      this.addRandomBlobs();
      this.blobs.forEach(blob => this.handleBlob(blob, gamepad.buttons[5]));

      // timers
      this.tick ++;
      requestAnimationFrame(this.loop);
    }

    /**
     * Handle disconnected gamepad
     */
    // TODO: cancel animation frame => where to place the RAF ID ??
    disconnectedGamepad() {
      console.log('The connection with the controller was lost');
      //   cancelAnimationFrame(this.raf);
      this.scene.setAttribute('style', 'display: none');
    }
}
