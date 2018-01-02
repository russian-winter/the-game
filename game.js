// Wait for everything to load...
document.addEventListener('DOMContentLoaded', function(event) {
  // Initialize game objects
  const world = new World();
  window.world = world;

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
});
