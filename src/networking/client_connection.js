import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const Message = require('./message');

export default class ClientConnection {
  constructor(onMessageHandler) {
    this.socket = null; // WebSocket for signals exchange
    this.peer = null; // WebRTC connection
    this.connected = false;
    this.onMessageHandler = onMessageHandler;
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
      this.peer.on('data', (data) => {
        if (!this.connected) {
          // This is a server hello after our client hello, the connection
          // is now completed!
          this.connected = true;
          resolve();
          return;
        }

        this.onDataReceived(data);
      });

      // WebRTC connection is successful!
      this.peer.on('connect', () => {
        // Now we can send data to the server:
        this.send(Message.fromKindCode(Message.kindCodes.clientHello));
      });
    });
  }

  /**
  * Handles the received data from the server.
  * @data {Uint8Array} The raw data received.
  */
  onDataReceived(data) {
    const message = new Message(data);
    console.log(`Received: ${Message.kindNameFromKindCode(message.kind)}`);
    this.onMessageHandler(message);
  }

  /**
  * Sends a message to the server.
  * @message {Message} The message to be sent.
  */
  send(message) {
    this.peer.send(message.getClientBuffer());
  }
}
