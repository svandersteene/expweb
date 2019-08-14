import Game from './js/Game.js';
// import TGame from './js/TGame.js';

{
  console.log('initialising...');
  //   new TGame();
  //   game.initGame();
  //   game.initGame('insert gamepad code');

  window.addEventListener('gamepadconnected', ({gamepad}) => {
    console.log(`${gamepad.id} is connected, ready to play`);
    new Game();
  });

  window.addEventListener('gamepaddisconnected', () => {
    console.log('The connection with the controller was lost');
    // game.disconnectedGamepad();
  });
}
