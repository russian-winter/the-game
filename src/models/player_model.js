import Model from './object_model';
import Vector3 from '../game_objects/vector3';

export default class PlayerModel extends Model {
  constructor(position = new Vector3()) {
    super(position);
    this.size = new Vector3(7.0, 7.0, 7.0);
  }
}
