import Vector3 from './vector3';
import GameObject from './game_object';


export default class ParametricParticle extends GameObject {
  constructor(position = new Vector3(), velocity = new Vector3(),
    acceleration = new Vector3(), time = 0, finalTime = 0) {
    super(position);
    this.initialPosition = position;
    this.initialVelocity = velocity;
    this.initialAcceleration = acceleration;
    this.initialTime = time;
    this.finalTime = finalTime; // Final acceleration time
    this.isConstantSpeed = false;
  }

  update(time) {
    const deltaTime = time - this.initialTime;

    if (!this.isConstantSpeed && time > this.finalTime) {
      const finalDeltaTime = time - this.finalTime;
      // Position at the final time
      this.initialPosition = this.initialPosition.add(
        this.initialVelocity.multiply(finalDeltaTime)
      ).add(
        this.initialAcceleration.multiply((finalDeltaTime * finalDeltaTime) / 2)
      );
      // Velocity at the final time
      this.initialVelocity = (
        this.initialVelocity +
        this.initialAcceleration.multiply(finalDeltaTime)
      );
      // Acceleration at the final time
      this.initialAcceleration = 0;
      // Time at the final time
      this.initialTime = this.finalTime;
    }

    this.position = this.initialPosition.add(
      this.initialVelocity.multiply(deltaTime)
    ).add(this.initialAcceleration.multiply((deltaTime * deltaTime) / 2));

    super.update(time);
  }
}
