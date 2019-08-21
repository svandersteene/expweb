import gunSound from '../../assets/gun.wav';
import Controller from './Controller.js';
import Blob from './Blob.js';

/**
 * TODO: FEEDBACK
 * --------------
 * * adding changing gravity + make it visible
 * * add powerups => what kind of powerup ??
 * * add design, make it clean
 */

export default class Game {
  constructor() {
    console.log('creating the game...');
    this.looping = true;
    window.addEventListener('gamepaddisconnected', () => {
      this.disconnectedGamepad();
    });

    this.scene = document.querySelector('a-scene');
    this.scene.setAttribute('style', 'display: block');
    this.camera = document.querySelector('a-camera');
    this.hitSound = new Audio(gunSound);
    this.controller = new Controller(this.scene, this.camera);
    this.resetGame(true);
    this.amount = 10;

    this.loop();
  }

  /**
   * Set or reset all variables
   * @ beginning of the game
   * @ level up
   * @ game over
   */
  resetGame(full) {
    if (full) {
      this.started = false;
      this.score = 0;
      this.tick = 0;
      this.level = 1;
      this.accuracy = 2;
      this.range = - 125;
      this.missedBlobs = [];
    }
    if (this.blobs) this.blobs.forEach(blob => blob.destroy());
    this.blobs = [];
    this.hitBlobs = [];
    this.controller.resetPositions();
  }

  /**
   * Start all processes during gameplay
   */
  gamePlay(gamepad) {
    // init game controls
    this.controller.initControls(gamepad);

    // game over checker
    if (this.accuracy < 1) {
      console.log('GAME OVER');
      this.resetGame(true);
    }

    // level checker
    // TODO: add timeout so the player can prepare for the next level
    if (this.hitBlobs.length >= this.amount * this.level) {
      console.log(`you completed level ${this.level}`);
      this.resetGame(false);
      this.accuracy += 0.5;
      this.level ++;
      this.range = - 100 - 25 * this.level;
    }

    // starting blobs loop
    this.addRandomBlobs();
    this.blobs.forEach(blob => this.handleBlob(blob, gamepad.buttons[5]));
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
      this.hitSound.play();
      this.hitBlobs.push(blob);
      this.score += 10 * this.level;
      this.blobs = this.blobs.filter(item => item !== blob);
    }
    if (blob.detectBoundaries() && !this.missedBlobs.includes(blob) && !this.hitBlobs.includes(blob)) {
      this.missedBlobs.push(blob);
      this.accuracy = Math.round((this.accuracy - (this.amount / 200)) * 100) / 100;
      this.blobs = this.blobs.filter(item => item !== blob);
    }
  }

  /**
   * Handle disconnected gamepad
   */
  disconnectedGamepad() {
    console.log('The connection with the controller was lost');
    this.looping = false;
    this.resetGame(true);
    this.scene.setAttribute('style', 'display: none');
  }

  /**
   * The gameloop
   */
    loop = () => {
      console.log('statistics', this.level, this.score, this.accuracy, this.range, this.hitBlobs.length, this.missedBlobs.length);
      const gamepad = navigator.getGamepads()[0];

      // check if game should be started
      if (this.controller.startGame(gamepad.buttons[17])) {
        this.started = true;
      }

      // at game start
      if (this.started) {
        this.gamePlay(gamepad);
      }

      // timers
      this.tick ++;
      if (this.looping) {
        requestAnimationFrame(this.loop);
      }
    }
}
