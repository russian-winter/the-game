class Bullet extends GameObject {
  constructor(position, size, velocity) {
    super(position, size);
    this.velocity = velocity || new Vector3(0.5,0,0);
  }
}
