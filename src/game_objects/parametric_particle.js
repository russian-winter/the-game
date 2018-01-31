import Vector3 from './vector3';
import GameObject from './game_object';


export default class ParametricParticle extends GameObject {
  constructor(position = new Vector3(), velocity = new Vector3(),
    acceleration = new Vector3(), time) {
    super(position);
    this.initialPosition = position;
    this.initialVelocity = velocity;
    this.initialAcceleration = acceleration;
    this.initialTime = time;
  }

  update(time) {
    const deltaTime = time - this.initialTime;
    this.position = this.initialPosition.add(
      this.initialVelocity.multiply(deltaTime)
    ).add(this.initialAcceleration.multiply((deltaTime * deltaTime) / 2));
    super.update();
  }
}
