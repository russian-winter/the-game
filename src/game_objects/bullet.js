import ParametricParticle from './parametric_particle';
import Vector3 from './vector3';
import BulletModel from '../models/bullet_model';

export default class Bullet extends ParametricParticle {
  constructor(position, velocity = new Vector3(0.5, 0, 0),
    acceleration = new Vector3(), time) {
    super(position, velocity, acceleration, time, Infinity);

    // model
    this.model = new BulletModel(position);
  }
}
