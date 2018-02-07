/* eslint-env browser */

import Vector3 from '../game_objects/vector3';
import THREE from '../assets/js/three-js/three';

export default class Renderer {
  constructor() {
    // DOM object and drawing api refereces
    // this.canvas = document.querySelector('canvas');
    // this.context = this.canvas.getContext('2d');

    // Default scale, updated in resize()
    this.scaleFactor = 10;

    // Listen for window size change
    // window.addEventListener('resize', () => this.resize());
    // // Adjust the size of the canvas for the first time
    // this.resize();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  /**
  * Set the canvas internal size (the size of the bitmap) to be
  * equal to the available size.
  */
  resize() {
    // Get the screen pixel density (or the browser zoom)
    const ratio = window.devicePixelRatio || 1;

    // Get the real size in physical pixels (instead of logical pixels)
    this.canvas.width = ratio * window.innerWidth;
    this.canvas.height = ratio * window.innerHeight;

    // make the new width equal to 100 game units (meters)
    this.scaleFactor = this.canvas.width / 100;
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
