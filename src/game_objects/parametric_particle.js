import Vector3 from './vector3';
import GameObject from './game_object';


export default class ParametricParticle extends GameObject {
  constructor(position = new Vector3(), velocity = new Vector3(),
    acceleration = new Vector3(), time = Date.now()) {
    super(position);
    this.initialPosition = position;
    this.initialVelocity = velocity;
    this.initialAcceleration = acceleration;
    this.initialTime = time;
  }

  update(time) {
    this.position = this.initialPosition.add(
      this.initialVelocity.multiply(time - this.initialTime)
    );
    super.update();
  }
}
