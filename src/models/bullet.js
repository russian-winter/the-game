import GameObject from './game_object';
import Vector3 from './vector3';

export default class Bullet extends GameObject {
  constructor(position, size, velocity = new Vector3(0.5, 0, 0)) {
    super(position, size);
    this.velocity = velocity;
  }
}
