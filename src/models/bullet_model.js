import Model from './object_model';
import Vector3 from '../game_objects/vector3';

export default class BulletModel extends Model {
  constructor(position = new Vector3()) {
    super(position);
    this.size = new Vector3(0.5, 0.5, 0.5);
  }
}
