class GameObject extends EventEmitter {
  constructor(position) {
    super();
    this.position = position || new Vector3();
    this.velocity = new Vector3();
    this.model = null;

    // Calculate default bounding box
    const size = new Vector3(0.5, 0.5, 0.5);
    this.boundingBox =
        new BoundingBox(this.position.subtract(size.divide(2)), size);
  }

  /**
  * Basic kinematics.
  */
  update(time) {
    this.position = this.position.add(this.velocity);
    this.boundingBox.position = this.boundingBox.position.add(this.velocity);
  }
};
