/* eslint-env browser */
import Game from './game';
import Renderer from './renderers/renderer';
import THREE from './assets/js/three-js/three';


// Wait for everything to load...
document.addEventListener('DOMContentLoaded', () => {
  // Initialize game objects
  const game = new Game(false);

  // Initialize renderer
  const renderer = new Renderer();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  // Debug helper
  window.game = game;
  // Game loop definition
  const update = () => {
    game.update();
    requestAnimationFrame(update);
    renderer.render(game, scene, camera);
    // window.requestAnimationFrame(update);
  };

  // Start game loop!
  update();

  // Actions the player is performing
  const playerActions = {
    up: false,
    down: false,
    right: false,
    left: false,
    shoot: false
  };

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
    68: 'right'
  };

  // Handler for user input
  const registerInput = (e) => {
    const isKeyDown = e.type === 'keydown';
    const action = keyBindings[e.keyCode];

    if (action) {
      playerActions[action] = isKeyDown;
    }

    game.player.onPlayerInput(playerActions);
  };

  // Listen for user input
  document.addEventListener('keydown', (e) => { registerInput(e); });
  document.addEventListener('keyup', (e) => { registerInput(e); });
});
