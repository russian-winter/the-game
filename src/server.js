const express = require('express');
const { Server } = require('http');
const Game = require('../dist/bundle_node').default; // It's the webpack bundle
const GameServer = require('./networking/server_connection');

// TODO: read this from process arguments
const port = 3000;

// Create the web server with a WebSocket connection
const app = express();
const server = Server(app);

// Attach the game server to the http server
const gameServer = new GameServer((message) => {
  console.log(message);
});
const game = new Game(null, gameServer);

gameServer.listen(server);

// Serve static assets
app.use(express.static('dist'));

// Start!
server.listen(port, () => console.log(`Listening on *:${port}`));
