import EventEmitter from './models/event_emitter';
import World from './models/world';
import Player from './models/player';
import Camera from './models/camera';

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
      this.player = this.createPlayer(); // the current player
      this.camera = Camera.create(); // the current camera
      this.camera.target = this.player;
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
  * TODO: Clients should receive a player from server.
  */
  createPlayer(...args) {
    const player = Player.create(...args);
    player.id = this.players.length + 1; // FIXME: get this id from server
    this.players.push(player);
    return player;
  }
}
