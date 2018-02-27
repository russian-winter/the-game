/* eslint-env browser */
import Game from './game';
import Renderer from './renderers/renderer';
import ClientConnection from './networking/client_connection';

// Wait for everything to load...
document.addEventListener('DOMContentLoaded', () => {
  // Initialize game objects
  const game = new Game(ClientConnection, null);

  // Initialize renderer
  const renderer = new Renderer();

  // Debug helper
  window.game = game;

  // Game loop definition
  const update = () => {
    game.update();
    renderer.render(game);
    window.requestAnimationFrame(update);
  };

  // Start game loop!
  update();

  // Player actions associated with each keyCode
  const keyBindings = {
    32: 'shoot',
    // arrows
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    // wasd:
    87: 'up',
    65: 'left',
    83: 'down',
    68: 'right',
    // mouse
    mouseup: 'shoot',
    mousedown: 'shoot'
  };

  // Handler for user input
  const registerInput = (e) => {
    if (!game.player) { return; }
    const isKeyDown = e.type === 'keydown' || e.type === 'mousedown';
    const action = keyBindings[e.keyCode] || keyBindings[e.type];

    if (action) {
      game.player.playerActions[action] = isKeyDown;
    }

    game.player.onPlayerInput(game.player.playerActions, Date.now() / 1000);
  };

  // Handler for mousemove
  const handleMouseMove = (e) => {
    if (!game.player) { return; }
    const playerOffsetX = (
      game.player.position.x - game.camera.position.x
    ) * renderer.scaleFactor;
    const playerOffsetY = (
      game.player.position.y - game.camera.position.y
    ) * renderer.scaleFactor;

    // Calculate angle relative to screen center
    game.player.rotation = Math.atan2(
      (e.clientY - ((window.innerHeight) / 2)) - playerOffsetY,
      (e.clientX - ((window.innerWidth) / 2)) - playerOffsetX
    );
  };

  // Listen for user input
  document.addEventListener('keydown', (e) => { registerInput(e); });
  document.addEventListener('keyup', (e) => { registerInput(e); });
  document.addEventListener('mousedown', (e) => { registerInput(e); });
  document.addEventListener('mousemove', (e) => { handleMouseMove(e); });
  document.addEventListener('mouseup', (e) => { registerInput(e); });
  window.addEventListener(
    'resize',
    (e) => { game.camera.onWindowResize(e); }
  );
});
