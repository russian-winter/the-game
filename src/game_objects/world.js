import GameObject from './game_object';

export default class World extends GameObject {
  constructor() {
    super();
    this.objects = [];

    // Listen for new game objects
    GameObject.onGameObjectCreated = object => this.addGameObject(object);
  }

  /**
  * Updates each game object in the world.
  * @time {number} Simulation time in milliseconds.
  */
  update(time) {
    this.objects.forEach(object => object.update(time));
  }

  /**
  * Add a game object to the list of current game objects.
  * @gameObject {Object} a game object that should be added.
  */
  addGameObject(gameObject) {
    this.objects.push(gameObject);
  }

  /**
  * Removes a game object from the list of current game objects.
  * @gameObject {Object} a game object that should be removed.
  */
  removeGameObject(gameObject) {
    const index = this.objects.indexOf(gameObject);

    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }
}
