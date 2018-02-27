import Vector3 from './vector3';
import GameObject from './game_object';


export default class ParametricParticle extends GameObject {
  constructor(position = new Vector3(), velocity = new Vector3(),
    acceleration = new Vector3(), time = 0, frictionCoefficient = 0) {
    super(position);
    this.initialPosition = position;
    this.velocity = velocity;
    this.initialVelocity = velocity;
    this.initialAcceleration = acceleration;
    this.acceleration = acceleration;
    this.initialTime = time;
    this.frictionCoefficient = frictionCoefficient;
    this.friction = new Vector3();
  }

  update(time) {
    const deltaTime = time - this.initialTime;

    this.friction = this.velocity.multiply(this.frictionCoefficient);

    this.acceleration = this.initialAcceleration.subtract(this.friction);

    this.position = this.initialPosition.add(
      this.initialVelocity.multiply(deltaTime)
    ).add(this.acceleration.multiply((deltaTime * deltaTime) / 2));

    this.velocity = (
      this.acceleration.multiply(deltaTime)
        .add(this.initialVelocity)
    );

    this.initialPosition = this.position;
    this.initialVelocity = this.velocity;
    this.initialTime = time;

    super.update();
  }
}
