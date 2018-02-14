const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new NyanProgressPlugin(),
    new CleanTerminalPlugin()
  ]
});
