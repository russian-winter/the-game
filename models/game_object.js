class GameObject {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.model = null;
  }

  // Basic kinematics
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
};
