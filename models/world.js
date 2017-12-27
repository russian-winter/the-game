class World extends GameObject {
  constructor() {
    super();
    this.objects = [];
  }

  /**
  * Updates each game object in the world.
  * @time {number} Simulation time in milliseconds.
  */
  this.update(time) {
    this.objects.forEach(object => object.update(time));
  }
};
