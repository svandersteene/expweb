import '../css/style.css';
import Game from './classes/Game.js';

{
  console.log('initialising...');
  document.querySelector('.sound').addEventListener('sound-loaded', ({currentTarget}) => {
    currentTarget.components.sound.playSound();
  });
  if (window.confirm('Are you on Google Chrome and do you have a PS4 controller in hand?')) {
    window.addEventListener('gamepadconnected', ({gamepad}) => {
      console.log(`${gamepad.id} is connected, ready to play`);
      new Game();
    });
  } else {
    document.querySelector('.beginstate').classList.add('hide');
    document.querySelector('.prompt').classList.remove('hide');
  }
}
