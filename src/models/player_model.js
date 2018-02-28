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
    // Width is smaller to emphasize tip of the triangle
    this.size = new Vector3(5.0, 7.0, 7.0);
    this.rotation = 0;
  }

  onLoadObject(object) {
    this.mesh = object;
  }

  getMesh() {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function OnProgress(item, loaded, total) {
      console.log(item, loaded, total);
    };
    const objLoader = new THREE.OBJLoader(manager);
    objLoader.load(
      '../the-game-assets/3d_models/utah-teapot.obj',
      (...args) => this.onLoadObject(...args),
      onProgress,
      onError
    );
  }
}
