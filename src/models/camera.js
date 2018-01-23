import GameObject from './game_object';

export default class Camera extends GameObject {
  constructor(...args) {
    super(...args);

    // {GameObject}
    this.target = null;
  }
}
