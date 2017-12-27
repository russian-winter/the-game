class GameObject extends EventEmitter {
  constructor(position) {
    super();
    this.position = position || new Vector3();
    this.velocity = new Vector3();
    this.model = null;
  }

  // Basic kinematics
  update(time) {
    this.position = this.position.add(this.velocity);
  }
};
