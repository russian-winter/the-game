import Model from './object_model';
import Vector3 from '../game_objects/vector3';

const onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(`${Math.round(percentComplete, 2)} downloaded`);
  }
};

const onError = function () { console.log('Error loading object'); };

export default class PlayerModel extends Model {
  constructor(position = new Vector3()) {
    super(position);
    this.size = new Vector3(7.0, 7.0, 7.0);
  }

  onLoadObject(object) {
    this.mesh = object;
  }

  getMesh() {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
    };
    const objLoader = new THREE.OBJLoader(manager);
    objLoader.load(
      '../../the-game-assets/3d_models/Space Shuttle.obj',
      this.onLoadObject,
      onProgress,
      onError
    );
  }
}
