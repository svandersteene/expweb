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
    this.blobs = [];
    this.tick = 0;

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
  // TODO: blobs should spawn at random times and more quickly as the game progresses
  addRandomBlobs() {
    if (this.tick % 30 === 0) {
      this.blobs.push(new Blob(this.scene, this.camera));
    }
  }

  /**
   * The gameloop
   */
    loop = () => {
      this.addRandomBlobs();
      const gamepad = navigator.getGamepads()[0];
      this.controller.initControls(gamepad);
      this.blobs.forEach(blob => blob.initBlob(gamepad.buttons[5]));
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
