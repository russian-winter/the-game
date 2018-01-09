class GameObject extends EventEmitter {
  constructor(position, size) {
    super();
    this.position = position || new Vector3();
    this.velocity = new Vector3();
    this.model = null;

    // Calculate default bounding box
    size = size || new Vector3(0.5, 0.5, 0.5);
    this.boundingBox =
        new BoundingBox(this.position.subtract(size.divide(2)), size);
  }
  /**
  * Checks if two GameObjects collisioned by checking the intersection of their
  * BoundingBoxes.
  * @gameObject(object) another gameObject to check intersection against.
  * @return
  *   true if BoundingBoxes intersects, flase otherwise.
  **/
  collision(gameObject){
    return this.boundingBox.intersects(gameObject.boundingBox);
  }
  /**
  * Basic kinematics.
  */
  update(time) {
    this.position = this.position.add(this.velocity);
    this.boundingBox.position = this.boundingBox.position.add(this.velocity);
  }
};
