const SimplePeer = require('simple-peer');
const SocketIo = require('socket.io');
const wrtc = require('wrtc');
const Message = require('./message');

class ServerConnection {
  constructor(onMessageHandler) {
    this.peers = [];
    this.onMessageHandler = onMessageHandler;
  }

  /**
  * Listen to new client connections using the given server.
  * @server {http.Server}
  */
  listen(server) {
    this.io = SocketIo(server);

    // Once we connect over WebSocket, try to start a WebRTC connection
    this.io.on('connection', socket => this.onNewClient(socket));
  }

  onNewClient(socket) {
    // Be sure to pass in the WebRTC polyfills
    const peer = new SimplePeer({ wrtc });

    // When we get a signal, send it over the WebSocket to the server
    peer.on('signal', data => socket.emit('signal', data));

    // When we get a signal over the WebSocket from the
    // client, signal the WebRTC connection
    socket.on('signal', data => peer.signal(data));

    // WebRTC connection is successful!
    peer.on('connect', () => {
      this.peers.push(peer);
      console.log(
        `New peer connected: ${peer.remoteAddress}:${peer.remotePort}`
      );
    });

    // Handle data from a peer
    peer.on('data', data => this.onDataReceived(data, peer));
  }

  /**
  * Handles incoming data from a peer.
  * @data {Buffer} The raw data received.
  * @peer {SimplePeer} The peer that sent the data.
  */
  onDataReceived(data, peer) {
    const message = new Message(data);
    console.log(
      `New data from ${peer.remoteAddress}:${peer.remotePort} - ${
        Message.kindNameFromKindCode(message.kind)}`
    );
    this.onMessageHandler(message, peer);
  }

  /**
  * Sends a message to a client.
  * @message {Message} The message to be sent.
  * @peer {SimplePeer} The destination of the message.
  */
  send(message, peer) {
    peer.send(message.getServerBuffer());
  }

  /**
  * Sends a message to every client. It's not a real broadcast but a
  * lot of messages.
  * @message {Message} The message to be sent.
  */
  broadcast(message) {
    for (let i = 0; i < this.peers.length; ++i) {
      this.peers[i].send(message.getServerBuffer());
    }
  }
}

module.exports = ServerConnection;
