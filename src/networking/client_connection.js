// main.js
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

// create the WebSocket connection
const socket = io();

// Create a WebRTC connection, as the client this will be the initiating leg
const peer = new SimplePeer({ initiator: true });

// When we get a signal, send it over the WebSocket to the server
peer.on('signal', data => socket.emit('signal', data));

// WebRTC connection is successful!
peer.on('connect', () => console.log('connected'));

// When we get a signal over the WebSocket from the server,
// signal the WebRTC connection
socket.on('signal', data => peer.signal(data));

window.peer = peer;
