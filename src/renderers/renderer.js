/* eslint-env browser */

export default class Renderer {
  constructor() {
    // DOM object and drawing api refereces
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    // Default scale, updated in resize()
    this.scaleFactor = 10;

    // Listen for window size change
    window.addEventListener('resize', () => this.resize());
    // Adjust the size of the canvas for the first time
    this.resize();
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
  render(game) {
  // Clear canvas and set default color
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let fillColor = '#ff4444';
    const step = 10;
    for (let i = 0; i < 100; i += step) {
      for (let j = 0; j < 100; j += step) {
        this.context.fillStyle = fillColor;
        this.context.fillRect(i * this.scaleFactor, j * this.scaleFactor,
          (i + step) * this.scaleFactor, (j + step) * this.scaleFactor);

        fillColor = (fillColor === '#ff4444') ? '#4444ff' : '#ff4444';
      }
      fillColor = (fillColor === '#ff4444') ? '#4444ff' : '#ff4444';
    }

    // Iterate over each world object and draw its bounding box
    this.context.fillStyle = '#ffffff';
    game.world.objects.forEach((object) => {
      if (!object.model) {
        // Do not render invisible objects!
        return;
      }

      this.context.fillRect(
        object.boundingBox.position.x * this.scaleFactor,
        object.boundingBox.position.y * this.scaleFactor,
        object.boundingBox.size.x * this.scaleFactor,
        object.boundingBox.size.y * this.scaleFactor
      );
    });
  }
}
