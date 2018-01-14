import EventEmitter from './models/event_emitter';
import World from './models/world';
import Player from './models/player';

export default class Game extends EventEmitter {
  constructor(isServer) {
    super();
    this.isServer = isServer;

    // Initialize game objects
    this.world = new World();
    this.players = [];

    // Client and server specific code
    if (this.isServer) {
      this.clients = []; // references to the clients
    } else {
      this.server = null; // a reference to the server
      this.player = null; // the current player
    }
  }

  /**
  * Updates the world.
  * When running on a server, it sends updates to the clients.
  */
  update() {
    const time = Date.now();
    this.world.update(time);

    if (this.isServer) {
      this.clients.forEach(client => client.update());
    }
  }

  /**
  * Adds a new player to the game.
  */
  createPlayer(...args) {
    const player = Player.create(...args);
    this.players.push(player);
    return player;
  }
}
