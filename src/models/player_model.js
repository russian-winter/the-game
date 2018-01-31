import Model from './object_model';
import Vector3 from '../game_objects/vector3';

export default class PlayerModel extends Model {
  constructor(position = new Vector3()) {
    super(position);
    // Width is smaller to emphasize tip of the triangle
    this.size = new Vector3(5.0, 7.0, 7.0);
    this.rotation = 0;
  }

  render(context, scaleFactor, camera = null) {
    if (camera) {
      const x1 = ((this.boundingBox.position.x - camera.position.x)
        + camera.zoom) * scaleFactor;

      const y1 = ((this.boundingBox.position.y - camera.position.y)
        + (camera.zoom / 2)) * scaleFactor;

      const width = this.size.x * scaleFactor;
      const height = this.size.y * scaleFactor;

      context.save();

      // Rotate relative to player position
      context.translate(x1, y1);
      context.rotate(this.rotation - (Math.PI / 2));

      // Draw a triangle
      context.beginPath();
      context.moveTo(-width / 2, -height / 2);
      context.lineTo(width / 2, -height / 2);
      context.lineTo(0, height / 2);
      context.fill();

      // Undo transforms
      context.restore();
    }
  }
}
