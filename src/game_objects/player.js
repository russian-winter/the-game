import ParametricParticle from './parametric_particle';
import Vector3 from './vector3';
import Bullet from './bullet';
import PlayerModel from '../models/player_model';

export default class Player extends ParametricParticle {
  constructor(position, velocity, acceleration, time) {
    super(position, velocity, acceleration, time, Infinity);

    this.direction = new Vector3(1, 0, 0);
    this.health = 10;
    this.model = new PlayerModel();
    this.shootedAt = null;
    this.rotation = 0;
    this.millisecondsToReload = 150;
    this.acelerationMagnitude = 30;
    this.frictionCoefficient = 0.1;

    // Actions the player is performing
    this.playerActions = {
      up: false,
      down: false,
      right: false,
      left: false,
      shoot: false
    };
  }

  /**
  * Returns if the player can shoot at this moment
  */
  canShoot() {
    if (this.shootedAt === null) {
      return true;
    }
    return (new Date() - this.shootedAt) > this.millisecondsToReload;
  }

  /**
  * Returns the id of a player.
  * By definition, a player is its own ownwer.
  */
  get id() {
    return this.ownerId;
  }

  /**
  * Sets the id of a player.
  * This updates the owner id to match the player.
  */
  set id(val) {
    this.ownerId = val;
  }

  /*
  * Updates player state depending on player input.
  * @playerInput {Object} The keys represent posible actions for a player
  * and the values are boolean and indicate if these actions are active
   */
  onPlayerInput(playerInput, time) {
    this.initialAcceleration = new Vector3(
      (playerInput.left * -1) + (playerInput.right * 1),
      (playerInput.up * -1) + (playerInput.down * 1),
      0
    ).normalize().multiply(this.acelerationMagnitude);

    this.initialTime = time;
    this.initialPosition = this.position;
    this.initialVelocity = this.velocity;

    if (playerInput.left) {
      this.direction = new Vector3(-1, 0, 0);
    } else if (playerInput.right) {
      this.direction = new Vector3(1, 0, 0);
    }

    if (playerInput.up) {
      this.direction = new Vector3(0, -1, 0);
    } else if (playerInput.down) {
      this.direction = new Vector3(0, 1, 0);
    }

    // Shoot only once per action
    if (playerInput.shoot && this.canShoot()) {
      this.shoot(playerInput.shoot);
    }
  }

  onHit() {
    this.health--;
    if (this.health === 0) {

      // DIE
    }
  }

  /**
   * Shoots a bullet in the direction the player is facing.
   */
  shoot() {
    this.shootedAt = new Date();

    // Bullet volocity is player direction times some factor
    const speed = 30;
    const bulletVelocity = new Vector3(
      Math.cos(this.rotation) * speed,
      Math.sin(this.rotation) * speed,
      0
    ).add(this.velocity);

    Bullet.create(
      this.position,
      bulletVelocity,
      new Vector3(),
      Date.now() / 1000
    );
  }

  update(time) {
    super.update(time);
    this.model.rotation = this.rotation;
  }
}
