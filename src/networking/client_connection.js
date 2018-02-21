import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const Message = require('./message');

export default class ClientConnection {
  constructor() {
    this.socket = null; // WebSocket for signals exchange
    this.peer = null; // WebRTC connection
  }

  /*
  * Starts a connection to the server.
  * Returns a promise fulfilled when the connection is ready.
  */
  connect() {
    return new Promise((resolve) => {
      // Create the WebSocket connection
      this.socket = io();

      // Create a WebRTC connection, this will be the initiating leg
      this.peer = new SimplePeer({
        initiator: true,
        channelConfig: {
          ordered: false
        }
      });

      // When we get a signal, send it over the WebSocket to the server
      this.peer.on('signal', data => this.socket.emit('signal', data));

      // When we get a signal over the WebSocket from the server,
      // pass the signal to the WebRTC connection
      this.socket.on('signal', data => this.peer.signal(data));

      // Set the handlers for incoming data
      this.peer.on('data', data => this.onDataReceived(data));

      // WebRTC connection is successful!
      this.peer.on('connect', () => {
        // Now we can send data to the server:
        this.peer.send(
          Message.fromKindCode(Message.kindCodes.clientHello).data
        );
        resolve();
      });
    });
  }

  /**
  * Handles the received data from the server.
  */
  onDataReceived(data) {
    // TODO: do something
    console.log(data);
    new Message(data);
  }

  /**
  * Sends a message to the server.
  */
  send(message) {
    this.peer.send(message);
  }
}
