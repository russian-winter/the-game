import BoundingBox from '../game_objects/bounding_box';
import Vector3 from '../game_objects/vector3';

export default class Model {
  constructor(position = new Vector3()) {
    this.position = position;
    this.size = new Vector3(0.5, 0.5, 0.5);
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

  render(context, scaleFactor) {
    context.fillRect(
      this.position.x * scaleFactor,
      this.position.y * scaleFactor,
      this.size.x * scaleFactor,
      this.size.y * scaleFactor
    );
  }
}
