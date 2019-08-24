import Controller from './Controller.js';
import Blob from './Blob.js';
import Progressbar from 'progressbar.js';

// Sounds
import levelup from '../../assets/levelup.mp3';
import gameover from '../../assets/gameover.mp3';
import gunSound from '../../assets/gun.mp3';

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
    this.handleHighscore();
    window.addEventListener('gamepaddisconnected', () => {
      this.disconnectedGamepad();
    });

    // prepare scene
    this.scene = document.querySelector('a-scene');
    this.camera = document.querySelector('a-camera');
    this.hud = document.querySelector('.hud');
    this.hitSound = new Audio(gunSound);
    this.levelupSound = new Audio(levelup);
    this.gameoverSound = new Audio(gameover);
    this.controller = new Controller(this.scene, this.camera, parseFloat(this.hud.getAttribute('width')), parseFloat(this.hud.getAttribute('height')));
    this.resetGame(true);
    this.amount = 10;

    // prepare interface
    this.iScore = document.querySelector('.score');
    this.iLevel = document.querySelectorAll('.level');
    this.iAccuracy = new Progressbar.Line(document.querySelector('.accuracy'), {
      strokeWidth: 2,
      easing: 'easeInOut',
      duration: 1000,
      color: '#e76f64',
      trailColor: '#000',
      trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'},
      from: {color: '#e76f64'},
      to: {color: '#71dcfd'},
      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
      }
    });

    this.loop();
  }

  /**
   * Handle highscore
   */
  handleHighscore() {
    if (window.localStorage.getItem('highscore')) {
      this.highscore = window.localStorage.getItem('highscore');
    } else {
      this.highscore = 0;
      window.localStorage.setItem('highscore', this.highscore);
    }
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
      this.maxAccuracy = this.accuracy;
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
      this.gameoverSound.play();
      this.adjustInterface('end');
      if (this.score > this.highscore) {
        this.highscore = this.score;
        this.adjustInterface('highscore');
        window.localStorage.setItem('highscore', this.score);
      }
      this.resetGame(true);
    }

    // level checker
    if (this.hitBlobs.length >= this.amount * this.level) {
      this.levelupSound.play();
      this.resetGame(false);
      this.accuracy += 0.5;
      this.maxAccuracy += 0.5;
      this.updateAccuracyBar();
      this.level ++;
      this.iLevel.forEach(el => el.textContent = `Level ${this.level}`);
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
      this.iScore.textContent = this.score;
      this.blobs = this.blobs.filter(item => item !== blob);
    }
    if (blob.detectBoundaries() && !this.missedBlobs.includes(blob) && !this.hitBlobs.includes(blob)) {
      this.missedBlobs.push(blob);
      this.accuracy = Math.round((this.accuracy - (this.amount / 200)) * 100) / 100;
      this.updateAccuracyBar();
      this.blobs = this.blobs.filter(item => item !== blob);
    }
  }

  mappedAccuracy = (input, inLow, inHigh, outLow, outHigh) => (input - inLow) / (inHigh - inLow) * (outHigh - outLow) + outLow

  updateAccuracyBar() {
    this.iAccuracy.animate(this.mappedAccuracy(this.accuracy, 1, this.maxAccuracy, 0, 1), {
      easing: 'easeInOut',
      duration: 500
    });
  }

  /**
   * Adjust interface accordlingy to gamestate
   */
  adjustInterface(state) {
    switch (state) {
    case 'story':
      document.querySelector('.controls').classList.add('hide');
      document.querySelector('.story').classList.remove('hide');
      break;
    case 'controls':
      document.querySelector('.controls').classList.remove('hide');
      document.querySelector('.story').classList.add('hide');
      break;
    case 'gameplay':
      this.resetInterfaceValues();
      document.querySelector('.beginstate').classList.remove('show');
      document.querySelector('.endstate').classList.remove('show');
      document.querySelector('.interface').classList.add('show');
      break;
    case 'end':
      document.querySelector('.endstate').classList.add('show');
      document.querySelector('.interface').classList.remove('show');
      document.querySelector('.endscore').textContent = `You scored ${this.score} points`;
      document.querySelector('.highscore').classList.remove('hide');
      document.querySelector('.highscore').textContent = `Highscore: ${this.highscore}`;
      break;
    case 'highscore':
      document.querySelector('.endscore').textContent = `New highscore! You got ${this.highscore} points!`;
      document.querySelector('.highscore').classList.add('hide');
      break;
    }
  }

  /**
   * Set or reset values in HTML elements
   */
  resetInterfaceValues() {
    this.iScore.textContent = this.score;
    this.iLevel.forEach(el => el.textContent = `Level ${this.level}`);
    this.iAccuracy.animate(1);
  }

  /**
   * The gameloop
   */
    loop = () => {
      const gamepad = navigator.getGamepads()[0];

      // reset statistics
      if (!this.started && gamepad.buttons[1].pressed && gamepad.buttons[4].pressed && gamepad.buttons[5].pressed && gamepad.buttons[13].pressed) {
        console.log('statistics resetted');
        window.localStorage.removeItem('highscore');
        this.highscore = 0;
      }

      if (!this.started && gamepad.buttons[0].pressed) {
        this.adjustInterface('story');
      }

      // check if game should be started
      if (!this.started && gamepad.buttons[17].pressed) {
        this.adjustInterface('gameplay');
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

    /**
     * Handle disconnected gamepad
     */
    disconnectedGamepad() {
      console.log('The connection with the controller was lost');
      this.looping = false;
      this.resetGame(true);
      this.scene.setAttribute('style', 'display: none');
    }
}
