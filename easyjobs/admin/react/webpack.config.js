const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const config = {
  ...defaultConfig,
  entry: {
    easyjobs: path.resolve(__dirname, 'src/easyjobs.js'),
  },
  output: {
    ...defaultConfig.output,
    path: path.join(__dirname, '../assets/dist/react/'),
    filename: '[name].js',
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  plugins: [...defaultConfig.plugins],
};

module.exports = config;
