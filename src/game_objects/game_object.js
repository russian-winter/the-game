import EventEmitter from './event_emitter';
import Vector3 from './vector3';

// Sequence number for clientIds in the clients, and server ids in the server.
let objectIdSequence = 1;

export default class GameObject extends EventEmitter {
  constructor(position = new Vector3()) {
    super();

    // Id for the identification of an object.
    this.id = objectIdSequence++;

    // This allow us to represent objects of other players (or server objects)
    // The owner id 0 is reserved for the server.
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
  * Updates model position
  */
  update(/* time */) {
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
