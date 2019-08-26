import Controller from './Controller.js';
import Blob from './Blob.js';
import Powerup from './Powerup.js';
import Progressbar from 'progressbar.js';

// Sounds
import levelupSound from '../../assets/levelup.mp3';
import gameoverSound from '../../assets/gameover.mp3';
import gunSound from '../../assets/gun.mp3';
import powerupSound from '../../assets/powerup.mp3';

export default class Game {
  constructor() {
    console.log('creating the game...');
    this.looping = true;
    this.showOptions = false;
    this.handleHighscore();
    window.addEventListener('gamepaddisconnected', () => {
      this.disconnectedGamepad();
    });

    this.difficulty = 1;

    // prepare scene
    this.scene = document.querySelector('a-scene');
    this.camera = document.querySelector('a-camera');
    this.hud = document.querySelector('.hud');
    this.hitSound = new Audio(gunSound);
    this.levelupSound = new Audio(levelupSound);
    this.gameoverSound = new Audio(gameoverSound);
    this.powerupSound = new Audio(powerupSound);
    this.controller = new Controller(this.scene, this.camera, parseFloat(this.hud.getAttribute('width')), parseFloat(this.hud.getAttribute('height')));
    this.amount = 10;
    this.blobsLeft = 10;
    this.powerupDuration = 600;
    this.resetGame(true);

    // prepare interface
    this.iScore = document.querySelector('.score');
    this.iBlobs = document.querySelector('.blobs');
    this.iPowerups = document.querySelector('.powerups');
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
      this.caughtPowerups = [];
    }
    if (this.blobs) this.blobs.forEach(blob => blob.destroy());
    if (this.powerups) this.powerups.forEach(powerup => powerup.destroy());
    this.activePowerup = false;
    this.powerupDuration = 600;
    this.boost = 1;
    this.blobs = [];
    this.hitBlobs = [];
    this.powerups = [];
    this.controller.resetPositions();
  }

  /**
   * Start all processes during gameplay
   */
  gamePlay(gamepad) {
    // init game controls
    this.controller.initControls(gamepad, this.tick, this.difficulty);

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
      document.querySelector('.activated').classList.add('hide');
      document.querySelector('.temporary').classList.add('hide');
      this.accuracy += 0.5;
      this.maxAccuracy += 0.5;
      this.updateAccuracyBar();
      this.level ++;
      this.blobsLeft = this.amount * this.level;
      this.iBlobs.textContent = `${this.blobsLeft} blobs left`;
      this.iLevel.forEach(el => el.textContent = `Level ${this.level}`);
      this.range = - 100 - 25 * this.level;
    }

    // starting blobs loop
    this.addRandomBlobs();
    this.blobs.forEach(blob => this.handleBlob(blob, gamepad.buttons[5]));

    // starting powerups loop
    this.addRandomPowerups();
    this.powerups.forEach(powerup => this.handlePowerup(powerup, gamepad.buttons[5]));
    this.handlePowerupActivation(gamepad.buttons[1]);
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
   * Handle blobs
   */
  handleBlob(blob, hitButton) {
    blob.initBlob();
    if (blob.detectHit(hitButton) && !this.hitBlobs.includes(blob)) {
      this.hitSound.play();
      this.hitBlobs.push(blob);
      this.score += this.amount * this.level * this.boost;
      this.blobsLeft --;
      this.iScore.textContent = this.score;
      this.iBlobs.textContent = `${this.blobsLeft} blobs left`;
      this.blobs = this.blobs.filter(item => item !== blob);
    }
    if (blob.detectBoundaries() && !this.hitBlobs.includes(blob)) {
      this.accuracy = Math.round((this.accuracy - (this.amount / 200)) * 100) / 100;
      this.updateAccuracyBar();
      this.blobs = this.blobs.filter(item => item !== blob);
    }
  }

  /**
   * Create powerups at random times (less than blobs)
   */
  addRandomPowerups() {
    // TODO: randomize better !!
    this.random = Math.round((Math.random() * 30 + 480) * 100) / 100;
    if (this.tick % this.random > 0 && this.tick % this.random < 1) {
      this.powerups.push(new Powerup(this.scene, this.camera, this.level, this.accuracy, this.range, Math.floor(Math.random() * 2)));
    }
  }

  /**
   * Handle Powerups
   */
  handlePowerup(powerup, hitButton) {
    powerup.initPowerup();
    if (powerup.detectHit(hitButton) && !this.caughtPowerups.includes(powerup)) {
      this.powerupSound.play();
      this.caughtPowerups.push(powerup);
      this.powerups = this.powerups.filter(item => item !== powerup);
    }
    if (powerup.detectBoundaries() && !this.caughtPowerups.includes(powerup)) {
      this.powerups = this.powerups.filter(item => item !== powerup);
    }
  }

  handlePowerupActivation(actionButton) {
    this.iPowerups.textContent = `${this.caughtPowerups.length} powerups`;

    if (!this.activePowerup && actionButton.pressed && this.caughtPowerups.length > 0) {
      this.activePowerup = true;
      this.current = this.caughtPowerups.shift();
    }

    if (this.activePowerup && this.current) {
      document.querySelector('.temporary').classList.remove('hide');
      document.querySelector('.temporary').textContent = `${Math.round(this.powerupDuration / 60 * 10) / 10}`;
      this.powerupDuration > 300 ? document.querySelector('.activated').classList.remove('hide') : document.querySelector('.activated').classList.add('hide');
      switch (true) {
      case (this.powerupDuration > 0 && this.current.type === 0):
        this.blobs.forEach(blob => blob.accuracy = 20);
        document.querySelector('.activated').textContent = 'Extreme Accuracy Activated';
        break;
      case (this.powerupDuration > 0 && this.current.type === 1):
        this.boost = 5;
        document.querySelector('.activated').textContent = 'Extreme Score Boost Activated';
        break;
      default:
        document.querySelector('.temporary').classList.add('hide');
        this.activePowerup = false;
        if (this.current.type === 0) {
          this.blobs.forEach(blob => blob.accuracy = this.accuracy);
        }
        if (this.current.type === 1) {
          this.boost = 1;
        }
        this.powerupDuration = 600;
      }
      this.powerupDuration --;
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
    case 'options':
      document.querySelector('.options').classList.remove('hide');
      document.querySelector('.beginstate').classList.add('hide');
      break;
    case 'begin':
      document.querySelector('.options').classList.add('hide');
      document.querySelector('.beginstate').classList.remove('hide');
      document.querySelector('.endstate').classList.add('hide');
      break;
    case 'gameplay':
      this.resetInterfaceValues();
      document.querySelector('.beginstate').classList.add('hide');
      document.querySelector('.endstate').classList.add('hide');
      document.querySelector('.interface').classList.remove('hide');
      break;
    case 'end':
      // TODO: return to homepage via boolean ??
      document.querySelector('.endstate').classList.remove('hide');
      document.querySelector('.interface').classList.add('hide');
      document.querySelector('.endscore').textContent = `You scored ${this.score} points`;
      document.querySelector('.highscore').classList.remove('hide');
      document.querySelector('.highscore').textContent = `Highscore: ${this.highscore}`;
      break;
    case 'highscore':
      document.querySelector('.endscore').textContent = `New highscore! You got ${this.highscore} points!`;
      document.querySelector('.highscore').classList.add('hide');
      break;
    case 'reset':
      this.iAccuracy.destroy();
      document.querySelector('.beginstate').classList.remove('hide');
      document.querySelector('.options').classList.add('hide');
      document.querySelector('.endstate').classList.add('hide');
      document.querySelector('.interface').classList.add('hide');
      break;
    }
  }

  /**
   * Set or reset values in HTML elements
   */
  resetInterfaceValues() {
    this.iScore.textContent = this.score;
    this.iBlobs.textContent = `${this.blobsLeft} blobs left`;
    this.iPowerups.textContent = `${this.caughtPowerups.length} powerups`;
    this.iLevel.forEach(el => el.textContent = `Level ${this.level}`);
    this.iAccuracy.animate(1);
  }

  /**
   * The gameloop
   */
    loop = () => {
      const gamepad = navigator.getGamepads()[0];

      // reset statistics
      if (!this.started && gamepad.buttons[0].pressed && gamepad.buttons[4].pressed && gamepad.buttons[5].pressed && gamepad.buttons[13].pressed) {
        console.log('statistics resetted');
        window.localStorage.removeItem('highscore');
        this.highscore = 0;
      }

      // show options page
      if (!this.started && gamepad.buttons[9].pressed) {
        this.showOptions = true;
        this.adjustInterface('options');
      }

      if (this.showOptions && gamepad.buttons[3].pressed) {
        this.showOptions = false;
        this.adjustInterface('begin');
      }

      // check if game should be started
      if (!this.started && !this.showOptions && gamepad.buttons[17].pressed) {
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
      this.adjustInterface('reset');
      this.resetGame(true);
      this.looping = false;
    }
}
