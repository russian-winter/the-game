const path = require('path');

const clientConfig = {
  entry: './src/client.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 9000
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'web'
};

const serverConfig = {
  entry: './src/game.js',
  output: {
    filename: 'bundle_node.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs'
  },
  target: 'node'
};

module.exports = [clientConfig, serverConfig];
