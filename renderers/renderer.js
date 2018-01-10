/* eslint-env browser */

class Renderer {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.factor = 10;
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
