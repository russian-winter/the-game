/* eslint-env browser */

import THREE from '../assets/js/three-js/three';

export default class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  /**
  * Draws a frame.
  */
  render(game, scene, camera) {
    game.world.objects.forEach((object) => {
      if (!object.model) {
        // Do not render invisible objects!
        return;
      }
      object.model.addToScene(scene);
      object.model.animate();
    });
    this.renderer.render(scene, camera);
  }
}
