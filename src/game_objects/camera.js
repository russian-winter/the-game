import GameObject from './game_object';

export default class Camera extends GameObject {
  constructor(...args) {
    super(...args);

    // {GameObject}
    this.target = null;
  }

  /**
  * Follows the target on update.
  */
  update(...args) {
    if (!this.target) { return; }

    this.position.x = (0.9 * this.position.x) + (0.1 * this.target.position.x);
    this.position.y = (0.9 * this.position.y) + (0.1 * this.target.position.y);
    super.update(...args);
  }
}
