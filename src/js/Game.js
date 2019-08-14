import Controller from './Controller.js';
import Blob from './Blob.js';

export default class Game {

  constructor() {
    console.log('creating the game...');
    this.scene = document.querySelector('.world');
    this.scene.setAttribute('style', 'display: block');

    this.camera = document.querySelector('a-camera');
    this.controller = new Controller(this.scene, this.camera);
    this.blob = new Blob(this.scene, this.camera);

    // this.blob.addEventListener('child-attached', e => {
    //   console.log('child attached', e.detail.el);
    // });

    // this.blob.addEventListener('child-detached', e => {
    //   console.log('child detached', e.detail.el);
    // });

    // for (let i = 0;i < 10;i ++) {
    //   this.scene.appendChild(this.createBlob());
    // }

    this.loop();
  }

  /**
   * The gameloop
   */
    loop = () => {
      const gamepad = navigator.getGamepads()[0];
      this.controller.initControls(gamepad);
      this.blob.moveBlob();
      this.blob.detectHit(gamepad.buttons[5]);
      requestAnimationFrame(this.loop);
    }

  // disconnectedGamepad() {
  //   console.log('oh no...');
  //   //   const scene = document.querySelector(`.world`);
  //   document.querySelectorAll(`.blobs`).forEach(blob => this.scene.removeChild(blob));
  //   this.scene.setAttribute('style', 'display: none');
  // }
}
