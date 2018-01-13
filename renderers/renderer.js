/* eslint-env browser */

class Renderer {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    // Listen for window size change
    window.addEventListener('resize', () => this.resize());
    // Adjust the size of the canvas for the first time
    this.resize();
    this.factor = 10;
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
  }

  /**
  * Draws a frame.
  */
  render(world) {
  // Clear canvas and set default color
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#ffffff';

    // Iterate over each world object and draw its bounding box
    world.objects.forEach((object) => {
      this.context.fillRect(
        object.boundingBox.position.x * this.factor,
        object.boundingBox.position.y * this.factor,
        object.boundingBox.size.x * this.factor,
        object.boundingBox.size.y * this.factor
      );
    });
  }
}
