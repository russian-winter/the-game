/* eslint-env browser */
/* global World Renderer Player */

// Wait for everything to load...
document.addEventListener('DOMContentLoaded', () => {
  // Initialize game objects
  const world = new World();
  window.world = world; // debug only
  const player = new Player();

  world.addGameObject(player);
  const playerInput = {
    up: false,
    down: false,
    right: false,
    left: false
  };

  // Initialize renderer
  const renderer = new Renderer();

  // Game loop definition
  const update = () => {
    world.update(Date.now());
    renderer.render(world);
    window.requestAnimationFrame(update);
  };

  // Start game loop!
  update();

  // Handler for user input
  const registerInput = (e) => {
    const isKeyDown = e.type === 'keydown';
    const action = {
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    }[e.keyCode];

    if (action) {
      playerInput[action] = isKeyDown;
    }

    player.onPlayerInput(playerInput);
  };

  // Listen for user input
  document.addEventListener('keydown', (e) => { registerInput(e); });
  document.addEventListener('keyup', (e) => { registerInput(e); });
});
