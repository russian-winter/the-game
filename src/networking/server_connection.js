const SimplePeer = require('simple-peer');
const wrtc = require('wrtc');

// this code is 90% the same as the code in the client!
const connection = (socket) => {
  // be sure to pass in the WebRTC polyfills
  const peer = new SimplePeer({ wrtc });

  // when we get a signal, send it over the WebSocket to the server
  peer.on('signal', data => socket.emit('signal', data));

  // WebRTC connection is successful!
  peer.on('connect', () => console.log('connected'));

  // when we get a signal over the WebSocket from the
  // client, signal the WebRTC connection
  socket.on('signal', data => peer.signal(data));
};

module.exports = connection;
