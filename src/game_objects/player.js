/* globals Audio */

import GameObject from './game_object';
import Vector3 from './vector3';
import Bullet from './bullet';
import PlayerModel from '../models/player_model';

export default class Player extends GameObject {
  constructor(position, model = new PlayerModel()) {
    super(position, model);

    this.direction = new Vector3(1, 0, 0);
    this.health = 10;
    this.shooted = false;
    this.rotation = 0;

    this.shootingAudio = new Audio('../assets/sounds/shoot.wav');
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

    if (playerInput.rotate) {
      this.rotation = playerInput.rotation;
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
    this.shootingAudio.pause();
    this.shootingAudio.currentTime = 0;

    // Bullet volocity is player direction times some factor
    const speed = 2;
    const bulletVelocity = new Vector3(
      Math.cos(this.rotation) * speed,
      Math.sin(this.rotation) * speed,
      0
    ).add(this.velocity);
    Bullet.create(
      this.position,
      new Vector3(0.25, 0.25, 0.25),
      bulletVelocity
    );

    this.shootingAudio.play();
  }

  update() {
    super.update();
    this.model.rotation = this.rotation;
  }
}
