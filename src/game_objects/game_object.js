import EventEmitter from './event_emitter';
import Vector3 from './vector3';

export default class GameObject extends EventEmitter {
  constructor(position = new Vector3()) {
    super();

    // This allow us to represent objects of other players (or server objects)
    this.ownerId = GameObject.defaultOwnerId;

    // Kinematics
    this.position = position;
    this.velocity = new Vector3();

    // Graphic representation, maybe the bounding geometry should be here
    this.model = null;
  }

  /**
  * Checks if two GameObjects collisioned by checking the intersection of their
  * Models.
  * @gameObject(object) another gameObject to check intersection against.
  * @return
  *   true if Models intersects, flase otherwise.
  */
  collision(gameObject) {
    return this.model.intersects(gameObject.model);
  }

  /**
  * Basic kinematics.
  */
  update(/* time */) {
    this.position = this.position.add(this.velocity);
    if (this.model) {
      this.model.position = this.position;
      // TODO do this in object models
      this.model.boundingBox.position = this.position.subtract(
        this.model.boundingBox.size.multiply(0.5)
      );
    }
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

// Who is the default owner of new objects? 0 is the server.
GameObject.defaultOwnerId = 0;
