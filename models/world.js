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
};
