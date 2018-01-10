/* global GameObject */

class World extends GameObject {
  constructor() {
    super();
    this.objects = [];
  }

  /**
  * Updates each game object in the world.
  * @time {number} Simulation time in milliseconds.
  */
  update(time) {
    this.objects.forEach(object => object.update(time));
  }

  /**
  * Add a game object to the list of current game objects
  * @gameObject {Object} a game object that should be added
  */
  addGameObject(gameObject) {
    this.objects.push(gameObject);
  }
}
