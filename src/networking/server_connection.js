const SimplePeer = require('simple-peer');
const SocketIo = require('socket.io');
const wrtc = require('wrtc');

class ServerConnection {
  constructor() {
    this.peers = [];
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
  * @data {Buffer} The data received.
  * @peer {SimplePeer} The peer that sent the data.
  */
  onDataReceived(data, peer) {
    console.log(
      `New data from ${peer.remoteAddress}:${peer.remotePort} - ${data}`
    );
  }
}

module.exports = ServerConnection;
