// webpack.prod.js
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin   = require('mini-css-extract-plugin');
const HtmlWebpackPlugin      = require('html-webpack-plugin');
const CopyWebpackPlugin      = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',

  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/StoryApplicationDicoding/',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            sourceMaps: true,
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),

    // Copy PWA assets into dist/
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/scripts/service-worker.js'), to: 'service-worker.js' },
        { from: path.resolve(__dirname, 'src/public/offline.html'), to: 'offline.html' },
        { from: path.resolve(__dirname, 'src/public/manifest.json'), to: 'manifest.json' },
        { from: path.resolve(__dirname, 'src/public/favicon.png'), to: 'favicon.png' },
        { from: path.resolve(__dirname, 'src/public/images'), to: 'images' },
      ],
    }),    
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
});
