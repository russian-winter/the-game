/* eslint-env browser */
import Game from './game';
import Renderer from './renderers/renderer';

// Wait for everything to load...
document.addEventListener('DOMContentLoaded', () => {
  // Initialize game objects
  const game = new Game(false);

  // Initialize renderer
  const renderer = new Renderer();

  // Debug helper
  window.game = game;

  // Actions the player is performing
  const playerActions = {
    up: false,
    down: false,
    right: false,
    left: false,
    shoot: false,
    rotate: false,
    rotation: 0
  };

  // Game loop definition
  const update = () => {
    game.player.onPlayerInput(playerActions);
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
    const isKeyDown = e.type === 'keydown' || e.type === 'mousedown';
    const action = keyBindings[e.keyCode] || keyBindings[e.type];

    if (action) {
      playerActions[action] = isKeyDown;
    }

    // Handle mouse input
    if (e.type === 'mousemove') {
      playerActions.rotate = true;

      const playerOffsetX = (
        game.player.position.x - game.camera.position.x
      ) * renderer.scaleFactor;
      const playerOffsetY = (
        game.player.position.y - game.camera.position.y
      ) * renderer.scaleFactor;

      // Calculate angle relative to screen center
      playerActions.rotation = Math.atan2(
        (e.clientY - ((window.innerHeight) / 2)) - playerOffsetY,
        (e.clientX - ((window.innerWidth) / 2)) - playerOffsetX
      );
    }
  };

  // Listen for user input
  document.addEventListener('keydown', (e) => { registerInput(e); });
  document.addEventListener('keyup', (e) => { registerInput(e); });
  document.addEventListener('mousemove', (e) => { registerInput(e); });
  document.addEventListener('mouseup', (e) => { registerInput(e); });
  document.addEventListener('mousedown', (e) => { registerInput(e); });
  window.addEventListener(
    'resize',
    (e) => { game.camera.onWindowResize(e); }
  );
});
