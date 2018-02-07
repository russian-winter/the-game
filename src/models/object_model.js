import BoundingBox from '../game_objects/bounding_box';
import Vector3 from '../game_objects/vector3';
import THREE from '../assets/js/three-js/three';


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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  animate() {
    this.mesh.rotation.x += 0.1;
    this.mesh.rotation.y += 0.1;
  }

  addToScene(scene) {
    if (!this.addedToScene) {
      scene.add(this.mesh);
      this.addedToScene = true;
    }
  }
}
