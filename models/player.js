class Player extends GameObject {

  constructor(position) {
    super(position);

    this.health = 10;
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
      playerInput['left'] * -1 + playerInput['right'] * 1,
      playerInput['up'] * 1 + playerInput['down'] * -1,
      0
    );

    console.log(this.position)
  }  

  onHit() {
    this.health--;
    if (this.health === 0) {

      //DIE
    }
  }

}
