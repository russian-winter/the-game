/* eslint-env browser */

import renderStats from './stats';

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

    const step = 10;
    if (!game.camera) {
      return;
    }

    const left = game.camera.position.x - game.camera.zoomX;
    const right = game.camera.position.x + game.camera.zoomX;
    const top = game.camera.position.y - game.camera.zoomY;
    const bottom = game.camera.position.y + game.camera.zoomY;

    let xPosition = left;
    let yPosition = top;
    let xSize;
    let ySize;

    while (xPosition < right) {
      if (xPosition % step !== 0) {
        xSize = Math.ceil(xPosition / step) * step;
      } else {
        xSize = (xPosition + step < right) ? xPosition + step : right;
      }
      yPosition = top;
      while (yPosition < bottom) {
        if (yPosition % step !== 0) {
          ySize = Math.ceil(yPosition / step) * step;
        } else {
          ySize = (yPosition + step < bottom) ? yPosition + step : bottom;
        }

        const evenCell = (Math.floor(xPosition / step) % 2 === 0);
        const evenRow = (Math.floor(yPosition / step) % 2 === 0);
        const fillColor = ((evenCell && !evenRow) || (!evenCell && evenRow)) ?
          '#ff4444' : '#4444ff';

        this.context.fillStyle = fillColor;
        this.context.fillRect(
          (xPosition - left) * this.scaleFactor,
          (yPosition - top) * this.scaleFactor,
          (xSize - xPosition) * this.scaleFactor,
          (ySize - yPosition) * this.scaleFactor
        );

        yPosition = ySize;
      }
      xPosition = xSize;
    }

    // Iterate over each world object and draw its bounding box
    this.context.fillStyle = '#ffffff';
    game.world.objects.forEach((object) => {
      if (!object.model) {
        // Do not render invisible objects!
        return;
      }
      object.model.render(this.context, this.scaleFactor, game.camera);
    });

    renderStats(this.context, game);
  }
}
