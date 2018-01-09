class BoundingBox {
    constructor(position, size) {
        this.position = position || new Vector3();
        this.size = size || new Vector3();
    }
    /**
    * Returns true if two BoundingBox intersects, false otherwise.
    * @boundingBox(object) BoundingBox to check intersection against.
    * @return
    *   true if the BoundingBoxes intersected.
    **/
    intersects(boundingBox){
      let intersected_x = false;
      let intersected_y = false;
      if((this.position.x <= (boundingBox.position.x + boundingBox.size.x)) &&
         ((this.position.x + this.size.x) >= boundingBox.position.x)){
           intersected_x = true;
      }
      if((this.position.y <= (boundingBox.position.y + boundingBox.size.y)) &&
         ((this.position.y + this.size.y) >= boundingBox.position.y)){
           intersected_y = true;
      }
      return intersected_x && intersected_y;
    }
}
