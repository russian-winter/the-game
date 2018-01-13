/* global GameObject Vector3 Bullet */

class Player extends GameObject {
  constructor(position, size) {
    super(position, size);
    this.direction = new Vector3(1, 0, 0);
    this.health = 10;
    this.shooted = false;
  }

  move(direction) {
    this.velocity = direction;
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

    this.shoot(playerInput.space);
  }

  onHit() {
    this.health--;
    if (this.health === 0) {

      // DIE
    }
  }

  /**
   * Shoots a bullet if space was pressed, just once
   * @param {boolean} input space bar input
   */
  shoot(input) {
    // Shoot only once when space bar is pressed
    if (!this.shooted && input) {
      this.shooted = true;
      // Bullet volocity is player direction times some factor
      const speed = 2;
      const velocity = this.direction.multiply(speed);
      Bullet.create(
        this.position,
        new Vector3(0.25, 0.25, 0.25),
        velocity
      );
    } else {
      this.shooted = input;
    }
  }
}
