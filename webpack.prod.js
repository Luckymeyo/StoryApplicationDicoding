// webpack.prod.js
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',

  // Generate a source‑map alongside each bundle
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // Extract CSS to its own file instead of injecting via style-loader
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Transpile to support older browsers
            presets: ['@babel/preset-env'],
            sourceMaps: true,
          },
        },
      },
    ],
  },

  plugins: [
    // Wipe out dist/ before each build
    new CleanWebpackPlugin(),

    // Write your CSS to dist/[name].[contenthash].css
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],

  optimization: {
    // Split vendor code (e.g. leaflet, babel‑runtime) into its own chunk
    splitChunks: {
      chunks: 'all',
    },
    // Keep the runtime chunk separate for long‑term caching
    runtimeChunk: {
      name: 'runtime',
    },
  },

  output: {
    // Make sure webpack still writes into dist/ (common already sets this, but
    // if you need to tweak hashing on JS you can override here)
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
});
