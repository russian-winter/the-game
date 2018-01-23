import GameObject from './game_object';
import Vector3 from './vector3';
import Bullet from './bullet';

export default class Player extends GameObject {
  constructor(position, size) {
    super(position, size);

    this.model = {};
    this.direction = new Vector3(1, 0, 0);
    this.health = 10;
    this.shooted = false;
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
  onPlayerInput(playerInput) {
    this.velocity = new Vector3(
      (playerInput.left * -1) + (playerInput.right * 1),
      (playerInput.up * -1) + (playerInput.down * 1),
      0
    );

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
    const speed = 2;
    const velocity = this.direction.multiply(speed);
    Bullet.create(
      this.position,
      new Vector3(0.25, 0.25, 0.25),
      velocity
    );
  }
}
