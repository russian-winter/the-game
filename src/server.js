const express = require('express');
const { Server } = require('http');
const SocketIo = require('socket.io');
// import Game from './game';
const connection = require('./networking/server_connection');

// Create the web server with a WebSocket connection
const app = express();
const server = Server(app);
const io = SocketIo(server);

app.use(express.static('dist'));

// Once we connect over WebSocket, try to start a WebRTC connection
io.on('connection', connection);

server.listen(3000, () => console.log('listening on *:3000'));
