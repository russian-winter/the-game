import EventEmitter from './game_objects/event_emitter';
import World from './game_objects/world';
import Player from './game_objects/player';
import Camera from './game_objects/camera';

const Message = require('./networking/message');

export default class Game extends EventEmitter {
  constructor(ClientConnection, serverConnection) {
    super();
    this.isServer = !!serverConnection;
    this.timeOffset = 0;

    // Initialize game objects
    this.world = new World();
    this.players = [];

    // Client and server specific code
    if (this.isServer) {
      this.clients = []; // references to the clients
      this.connection = serverConnection; // save referene to server connection

      // Bind the game as message handler
      this.connection.onMessageHandler = (message, client) => {
        this.onClientMessage(message, client);
      };
    } else {
      this.player = null; // The current player
      this.camera = null; // the current camera

      // Initialize connection to the server
      this.connection = new ClientConnection(
        // Bind the game as message handler
        message => this.onServerMessage(message)
      );

      // Wait for the connection to complete
      this.connection.connect().then(() => {
        // Send join request!
        this.connection.send(
          Message.fromKindCode(Message.kindCodes.clientJoinRequest)
        );
      }).catch(
        // Log errors
        error => console.error(error)
      );
    }
  }

  /**
  * Updates the world.
  * When running on a server, it sends updates to the clients.
  */
  update() {
    const time = Date.now() + this.timeOffset;
    this.world.update(time);

    if (this.isServer) {
      this.clients.forEach(client => client.update());
    }
  }

  /**
  * [Client only]
  * Called when running AS CLIENT, when the server sends a message.
  * @message {Message} The message received.
  */
  onServerMessage(message) {
    switch (message.kind) {
      case Message.kindCodes.serverJoinResponse:
        // Pass the received player id to createPlayer.
        this.createPlayer(message.payload.getUint32(0));
        break;
      case Message.serverGameTimeResponse:
        // Pass the received time offset
        this.setGameTimeOffset(
          message.payload.getFloat64(0), // request sent from client at
          message.payload.getFloat64(7) // request arrived to server at
        );
        break;
      default:
    }
  }

  /**
  * [Server only]
  * Called when running AS SERVER, when a client sends a message.
  * @message {Message} The message received.
  * @client {SimplePeer} Where the message originates.
  */
  onClientMessage(message, client) {
    switch (message.kind) {
      case Message.kindCodes.clientJoinRequest:
        this.onJoinRequest(client);
        break;
      default:

    }
  }

  /**
  * [Client and Server]
  * Adds a new player to the game.
  * When called as a Client, it creates the own player and an id from the
  * server is required. This initializes a camera that tracks the player.
  * It doesn't need to be called to create other players, they are just objects.
  * When called as a Server, is because someone is trying to join the game (via
  * a clientJoinRequest Message).
  * @id {Number} The id of the player, required for Clients only.
  * @return {Player} The player that was created.
  */
  createPlayer(id, ...args) {
    const player = Player.create(...args);

    if (this.isServer) {
      // Server specific code
      player.id = this.players.length + 1;
    } else {
      // Client specific code
      player.id = id;
      this.player = player;
      this.camera = Camera.create();
      this.camera.target = player;
    }

    // Players are special objects objects we like to track
    this.players.push(player);

    return player;
  }

  /**
  * [Server only]
  * Handles the request to join from a client.
  * @client {SimplePeer} The client who is asking to join the game.
  */
  onJoinRequest(client) {
    const clientPlayer = this.createPlayer();
    const message = new Message(Buffer.alloc(9));
    message.kind = Message.kindCodes.serverJoinResponse;
    message.payload.setFloat64(0, clientPlayer.id);
    console.log('about to answer...');
    this.connection.send(message, client);
  }

  /**
  * [Client only]
  * Calculates the offset between the server time and the local time.
  * This is required to run the simulation (this.update()) using a clock
  * thtat is synchronized with the server.
  * @localStartTime {Number} The value of Date.now() when we asked the server
  *                 for its time (sending a clientGameTimeRequest).
  * @serverResponseTime {Number} The time in the server clock when our request
  *                     was received.
  */
  setGameTimeOffset(localStartTime, serverResponseTime) {
    // Time since the time request started until now
    const roundTrip = Date.now() - localStartTime;

    // Estimated time of the server response, in our local clock
    const localServerResponseTime = localStartTime + (roundTrip / 2);

    // Estimated difference between the server clock and our local clock.
    // It's a positive number if the server clock is ahead us, or negative
    // if the server clock is behind our clock.
    this.timeOffset = serverResponseTime - localServerResponseTime;
  }
}
