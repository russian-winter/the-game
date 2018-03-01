import EventEmitter from './game_objects/event_emitter';
import World from './game_objects/world';
import Player from './game_objects/player';
import Camera from './game_objects/camera';
import Vector3 from './game_objects/vector3';
import Serializer from './networking/serializer';

const Message = require('./networking/message');

// This dictionary maps bundled ES6 modules to be used from commonjs modules.
const gameModules = {
  Vector3, World, Player, Camera
};
Message.gameModules = gameModules;

export default class Game extends EventEmitter {
  constructor(ClientConnection, ServerConnection, netServer) {
    super();
    this.isServer = !!ServerConnection;
    this.timeOffset = 0;

    // Initialize game objects
    this.world = new World();
    this.players = [];

    // Synchronized objects shared between client and server.
    // It does not contains the whole list of objects (like this.world.objects).
    this.sharedObjects = {}; // {ownerId: {objId: object, objId: ...}, ...}

    // Client and server specific code
    if (this.isServer) {
      // [Server only]
      this.clients = []; // references to the clients

      // Create the server and bind the game as message handler
      this.connection = new ServerConnection((message, client) => {
        this.onClientMessage(message, client);
      });

      // Start listening for new clients!
      this.connection.listen(netServer);
    } else {
      // [Client only]
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
    const time = (Date.now() + this.timeOffset) / 1000;
    this.world.update(time);

    if (this.isServer) {
      this.clients.forEach(client => client.update(time));
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
        this.createPlayer(message.readNumber(0));
        break;

      case Message.kindCodes.serverGameTimeResponse:
        // Pass the received time offset
        this.setGameTimeOffset(
          message.getNumber(0), // request sent from client at
          message.getNumber(8) // request arrived to server at
        );
        break;

      case Message.kindCodes.serverCreateObject:
      case Message.kindCodes.serverUpdateObject:
        this.onServerObject(message);
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

      case Message.kindCodes.clientCreateObject:
      case Message.kindCodes.clientUpdateObject:
        this.onClientObject(message, client);
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
    const message = new Message(Buffer.alloc(9)); // TODO: Messsage.fromKindCode
    message.kind = Message.kindCodes.serverJoinResponse;
    message.writeNumber(0, clientPlayer.id);
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

  /**
  * Extracts the owner id and object id from a game object message (create,
  * update or delete).
  * @return {[number, number]} [ownerId, objectId].
  */
  static getOwnerAndId(message) {
    const ownerIdOffset = 1;
    const ownerId = message.readNumber(ownerIdOffset);
    const objectId = message.readNumber(ownerIdOffset + 8);
    return [ownerId, objectId];
  }

  /**
  * [Server only]
  * Called when a client tries to create or update an object.
  * It creates or updates the object and then every player is notified.
  * @message {Message} The received message.
  * @client {SimplePeer} Who sent the message.
  */
  onClientObject(message, client) {
    const [ownerId, objectId] = Game.getOwnerAndId(message);

    // TODO: Check if client is the owner!
    // if (ownerId !== ????(client)) { return; }

    let object = this.checkSharedObject(ownerId, objectId);

    if (object) {
      // Update existing object
      object.deserialize(message);
      // Re-use the same message, it's no longer used
      // eslint-disable-next-line
      message.kind = Message.kindCodes.serverCreateObject;
    } else {
      // Create a new object
      object = Serializer.deserialize(message);
      this.sharedObjects[ownerId][objectId] = object;
      this.world.addGameObject(object);
      // Re-use the same message, it's no longer used
      // eslint-disable-next-line
      message.kind = Message.kindCodes.serverUpdateObject;
    }

    // Notify every client with the updated message
    this.connection.broadcast(message);
  }

  /**
  * [Server only]
  * Called when a client tries to create or update an object.
  * It creates or updates the object and then every player is notified.
  * @message {Message} The received message.
  */
  onServerObject(message) {
    const [ownerId, objectId] = Game.getOwnerAndId(message);
    let object = this.checkSharedObject(ownerId, objectId);
    if (object) {
      // Update existing object
      object.deserialize(message);
    } else {
      // Create a new object
      object = Serializer.deserialize(message);
      this.sharedObjects[ownerId][objectId] = object;
      this.world.addGameObject(object);
    }
  }

  /**
  * Returns an object by owner id and object id if it exists.
  * returns undefined if it doesn't.
  * @return {GameObject} An object or undefined.
  */
  checkSharedObject(ownerId, objectId) {
    if (!this.sharedObjects[ownerId]) {
      this.sharedObjects[ownerId] = {};
    }

    return this.sharedObjects[ownerId][objectId];
  }
}
