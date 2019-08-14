import Controller from './Controller.js';

export default class Game {

  constructor() {
    console.log('creating the game...');
    this.scene = document.querySelector('.world');
    this.scene.setAttribute('style', 'display: block');
    this.camera = document.querySelector('a-camera');
    this.controller = new Controller(this.scene, this.camera);

    for (let i = 0;i < 10;i ++) {
      this.scene.appendChild(this.createBlob());
    }

    this.loop();
  }

  get randomPosition() {
    return Math.floor((Math.random() - 0.5) * 40);
  }

  get startPosition() {
    return - Math.floor((Math.random() * 50) + 50);
  }

    loop = () => {
      const gamepad = navigator.getGamepads()[0];
      this.controller.initControls(gamepad);
      requestAnimationFrame(this.loop);
    }

    // disconnectedGamepad() {
    //   console.log('oh no...');
    //   //   const scene = document.querySelector(`.world`);
    //   document.querySelectorAll(`.blobs`).forEach(blob => this.scene.removeChild(blob));
    //   this.scene.setAttribute('style', 'display: none');
    // }

    createBlob() {
      const blob = document.createElement('a-entity');
      blob.setAttribute('class', 'blobs');
      blob.setAttribute('geometry', 'primitive: octahedron');
      blob.setAttribute('material', 'color: grey; radius: 1');
      blob.setAttribute('position', `${this.randomPosition} ${this.randomPosition} ${this.startPosition}`);
      blob.setAttribute('rotation', '0 0 0');
      blob.setAttribute('animation', 'property: rotation; to: 360 360 360; loop: true; dur: 3000; easing: linear');
      return blob;
    }
}
