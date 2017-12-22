class GameObject {
  constructor(position) {
    this.position = position || new Vector3();
    this.velocity = new Vector3();
    this.model = null;
  }

  // Basic kinematics
  update() {
    this.position = this.position.add(this.velocity);
  }
};
