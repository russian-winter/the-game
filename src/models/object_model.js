import BoundingBox from '../game_objects/bounding_box';
import Vector3 from '../game_objects/vector3';

export default class Model {
  constructor(position = new Vector3()) {
    this.position = position;
    this.size = new Vector3(10, 10, 0.5);
    this.boundingBox =
      new BoundingBox(position.subtract(this.size.divide(2)), this.size);
  }

  /**
  * Checks if two Models collisioned by checking the intersection of their
  * BoundingBoxes.
  * @Model(object) another Model to check intersection against.
  * @return
  *   true if BoundingBoxes intersects, flase otherwise.
  */
  collision(model) {
    return this.boundingBox.intersects(model.boundingBox);
  }

  render(context, scaleFactor, camera = null) {
    if (camera) {
      const x1 = ((this.boundingBox.position.x - camera.position.x)
        + camera.zoom) * scaleFactor;

      const y1 = ((this.boundingBox.position.y - camera.position.y)
        + (camera.zoom / 2)) * scaleFactor;

      const width = this.size.x * scaleFactor;
      const height = this.size.y * scaleFactor;

      context.fillRect(x1, y1, width, height);
    }
  }
}
