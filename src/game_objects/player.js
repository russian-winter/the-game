import ParametricParticle from './parametric_particle';
import Vector3 from './vector3';
import Bullet from './bullet';
import PlayerModel from '../models/player_model';

export default class Player extends ParametricParticle {
  constructor(position, velocity, acceleration, time) {
    super(position, velocity, acceleration, time);

    this.direction = new Vector3(1, 0, 0);
    this.health = 10;
    this.shooted = false;
    this.model = new PlayerModel();
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
    const speed = 10;
    this.initialVelocity = new Vector3(
      (playerInput.left * -1) + (playerInput.right * 1),
      (playerInput.up * -1) + (playerInput.down * 1),
      0
    ).normalize().multiply(speed);
    this.initialTime = time;
    this.initialPosition = this.position;
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
    if (playerInput.shoot && !this.shooted) {
      this.shoot(playerInput.shoot);
    }
    this.shooted = playerInput.shoot;
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
    // Bullet volocity is player direction times some factor
    const speed = 5;
    const velocity = this.direction.multiply(speed);
    Bullet.create(
      this.position,
      velocity,
      new Vector3(),
      Date.now() / 1000
    );
  }
}
