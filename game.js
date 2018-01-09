// Wait for everything to load...
document.addEventListener('DOMContentLoaded', function(event) {
  // Initialize game objects
  window.world = new World();
  const player = new Player();
  world.addGameObject(player);
  const playerInput = {
    'up': false,
    'down': false,
    'right': false,
    'left': false
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
  document.addEventListener('keydown', e => {registerInput(e);});
  document.addEventListener('keyup', e => {registerInput(e);});
  function registerInput(e) {
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
  }
});
