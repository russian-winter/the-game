/* eslint-env browser */
import GameObject from './game_object';


export default class Camera extends GameObject {
  constructor(...args) {
    super(...args);

    // {GameObject}
    this.target = null;

    this.zoom = 50;
    this.zoomX = this.zoom;
    this.zoomY = this.zoom;

    if (window.innerWidth > window.innerHeight) {
      this.zoomY *= (window.innerHeight / window.innerWidth);
    }
  }

  /**
  * handles window resize
  */
  onWindowResize() {
    if (window.innerWidth > window.innerHeight) {
      this.zoomY = this.zoomX * (window.innerHeight / window.innerWidth);
    }
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
