import Game from './js/Game.js';

{
  console.log('initialising...');
  window.addEventListener('gamepadconnected', ({gamepad}) => {
    console.log(`${gamepad.id} is connected, ready to play`);
    new Game();
  });
}
