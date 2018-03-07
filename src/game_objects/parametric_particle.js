import Vector3 from './vector3';
import SynchronizedObject from './synchronized_object';

export default class ParametricParticle extends SynchronizedObject {
  constructor(position = new Vector3(), velocity = new Vector3(),
    acceleration = new Vector3(), time = 0, finalTime = 0) {
    super(position);

    // Serializable
    this.initialPosition = position;
    this.initialVelocity = velocity;
    this.initialAcceleration = acceleration;
    this.initialTime = time;
    this.finalTime = finalTime; // Final acceleration time

    // Non-serializable
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
        this.initialVelocity.add(
          this.initialAcceleration.multiply(finalDeltaTime)
        )
      );
      // Acceleration at the final time
      this.initialAcceleration = new Vector3();
      // Time at the final time
      this.initialTime = this.finalTime;
    }

    this.position = this.initialPosition.add(
      this.initialVelocity.multiply(deltaTime)
    ).add(this.initialAcceleration.multiply((deltaTime * deltaTime) / 2));
    this.velocity = (
      this.initialVelocity.add(this.initialAcceleration.multiply(deltaTime))
    );
    super.update(time);
  }

  /**
  * Returns a message to be sent over the network.
  * @return {Message} A message with its payload filled with data.
  */
  serialize() {
    const offset = SynchronizedObject.serializationSize;
    const message = super.serialize();
    message.writeVector3(offset, this.initialPosition);
    message.writeVector3(offset + 12, this.initialVelocity);
    message.writeVector3(offset + 24, this.initialAcceleration);
    message.writeNumber(offset + 36, this.initialTime);
    message.writeNumber(offset + 44, this.finalTime);
    return message;
  }

  /**
  * Updates this object with the values from a network message.
  * @message {Message} the network message.
  */
  deserialize(message) {
    super.deserialize(message);
    const offset = SynchronizedObject.serializationSize;
    this.initialPosition = message.writeVector3(offset);
    this.initialVelocity = message.writeVector3(offset + 12);
    this.initialAcceleration = message.writeVector3(offset + 24);
    this.initialTime = message.writeNumber(offset + 36);
    this.finalTime = message.writeNumber(offset + 44);
  }
}

ParametricParticle.serializationSize = 68; // bytes
