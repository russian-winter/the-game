import Vector3 from './vector3';

export default class BoundingBox {
  constructor(position = new Vector3(), size = new Vector3()) {
    this.position = position;
    this.size = size;
  }

  /**
   * Returns true if two BoundingBox intersects, false otherwise.
   * @boundingBox(object) BoundingBox to check intersection against.
   * @return
   *   true if the BoundingBoxes intersected.
   */
  intersects(boundingBox) {
    let intersectedX = false;
    let intersectedY = false;
    if ((this.position.x <= (boundingBox.position.x + boundingBox.size.x)) &&
       ((this.position.x + this.size.x) >= boundingBox.position.x)) {
      intersectedX = true;
    } else {
      return false;
    }

    if ((this.position.y <= (boundingBox.position.y + boundingBox.size.y)) &&
       ((this.position.y + this.size.y) >= boundingBox.position.y)) {
      intersectedY = true;
    } else {
      return false;
    }

    return intersectedX && intersectedY;
  }
}
