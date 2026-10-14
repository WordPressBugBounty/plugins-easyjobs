'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  entry: {
    easyjobs: path.resolve(__dirname, 'src/easyjobs.js'),
  },
  output: {
    path: path.join(__dirname, '../assets/dist/js'),
    filename: '[name].js',
  },
  target: 'web',
  mode: 'development',
  watch: true,
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
            options: { hmr: true },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'), // eslint-disable-line
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie <9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'src/scss')],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: 'url-loader',
      },
    ],
  },
  devtool: 'eval',
  performance: {
    hints: false,
  },
  plugins: [new BundleAnalyzerPlugin()],
  externals: {
    lodash: ['lodash'],
  },
};
