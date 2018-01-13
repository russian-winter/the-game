/* global EventEmitter Vector3 BoundingBox */

class GameObject extends EventEmitter {
  constructor(position = new Vector3(), size = new Vector3(0.5, 0.5, 0.5)) {
    super();
    this.position = position;
    this.velocity = new Vector3();
    this.model = null;

    // Calculate default bounding box
    this.boundingBox =
      new BoundingBox(this.position.subtract(size.divide(2)), size);
  }

  /**
  * Checks if two GameObjects collisioned by checking the intersection of their
  * BoundingBoxes.
  * @gameObject(object) another gameObject to check intersection against.
  * @return
  *   true if BoundingBoxes intersects, flase otherwise.
  */
  collision(gameObject) {
    return this.boundingBox.intersects(gameObject.boundingBox);
  }

  /**
  * Basic kinematics.
  */
  update(/* time */) {
    this.position = this.position.add(this.velocity);
    this.boundingBox.position = this.boundingBox.position.add(this.velocity);
  }

  /**
  * Creates a new instance of a game object.
  * The new object is automatically added to the world.
  */
  static create(...args) {
    const object = new this(...args);

    // Notify the receiver of new game objects (world, you there?)
    if (GameObject.onGameObjectCreated) {
      GameObject.onGameObjectCreated(object);
    }

    return object;
  }
}

// Listener of new GameObjects (it should be a world)
GameObject.onGameObjectCreated = null;
