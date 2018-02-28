import Model from './object_model';
import Vector3 from '../game_objects/vector3';

export default class BulletModel extends Model {
  constructor(position = new Vector3()) {
    super(position);
    this.size = new Vector3(0.5, 0.5, 0.5);
  }

  getMesh() {
    const geometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }
}
