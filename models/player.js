class Player extends GameObject {

  constructor(position) {
    super(position);

    this.health = 10;
  }

  move(direction) {
    this.velocity = direction;
  }

  onHit() {
    this.health--;
    if (this.health === 0) {

      //DIE
    }
  }

}
