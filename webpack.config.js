/*
 * TODO
 * development vs production config
 * https://webpack.js.org/guides/production/
 * https://github.com/babel/minify
 * 
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // entry file - starting point for the app
  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    options: './src/options/index.jsx'
  },

  // where to dump the output of a production build
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?/i,
        loader: 'babel-loader',
        options: {
          'presets': [
            ['env', {
              'targets': {
                'browsers': ['Chrome >= 63'],
              },
              'modules': false
            }],
          ],
          plugins: [
            ['transform-react-jsx', { pragma: 'h' }]
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      'manifest.json',
      'LICENSE',
      { context: path.join(__dirname, 'src/extension'), from: `**` }])
  ],
  // enable Source Maps
  devtool: 'source-map'
};
