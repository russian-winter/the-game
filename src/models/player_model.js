import { ObjectLoader, MaterialLoader } from 'three';

import Model from './object_model';
import Vector3 from '../game_objects/vector3';

const onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(`${Math.round(percentComplete, 2)} downloaded`);
  }
};

const onError = function () { console.log('Error'); };

export default class PlayerModel extends Model {
  constructor(position = new Vector3()) {
    super(position);
    this.size = new Vector3(7.0, 7.0, 7.0);
  }

  onLoadMaterials(materials) {
    materials.preload();
    const objLoader = new ObjectLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
      './assets/3d_models/Space Shuttle.obj',
      this.onLoadObject,
      onProgress,
      onError
    );
  }

  onLoadObject(object) {
    this.mesh = object;
  }

  getMesh() {
    const mtlLoader = new MaterialLoader();
    mtlLoader.load(
      './assets/materials/Space Shuttle.mtl',
      this.onLoadMaterials,
      onProgress,
      onError
    );
  }
}
