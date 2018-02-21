import BoundingBox from '../game_objects/bounding_box';
import Vector3 from '../game_objects/vector3';
import {
  BoxGeometry, MeshBasicMaterial, Mesh
} from '../assets/js/three-js/three';


export default class Model {
  constructor(position = new Vector3()) {
    this.position = position;
    this.size = new Vector3(10, 10, 0.5);
    this.boundingBox =
      new BoundingBox(position.subtract(this.size.divide(2)), this.size);
    this.addedToScene = false;
    this.mesh = this.getMesh();
  }

  /**
  * Checks if two Models collisioned by checking the intersection of their
  * BoundingBoxes.
  * @Model(object) another Model to check intersection against.
  * @return
  *   true if BoundingBoxes intersects, flase otherwise.
  */
  collision(model) {
    return this.boundingBox.intersects(model.boundingBox);
  }

  getMesh() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    return cube;
  }

  animate(position) {
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
  }

  addToScene(scene) {
    if (!this.addedToScene) {
      scene.add(this.mesh);
      this.addedToScene = true;
    }
  }
}
