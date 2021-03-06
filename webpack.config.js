const path = require(`path`);

module.exports = {
  entry: `./src/index.js`,
  output: {
    filename: `site-navigation.js`,
    path: path.resolve(__dirname, `dist`),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: `babel-loader`,
          options: {
            presets: [`@babel/preset-env`],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          `style-loader`,
          { loader: `css-loader`, options: { importLoaders: 1 } },
          `postcss-loader`,
        ],
      },
    ],
  },
};
