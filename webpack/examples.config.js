const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: {
    helloWorld: './examples/hello-world/game.ts',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist/examples'),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,

        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                declaration: false,
                outDir: null,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|ttf)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  serve: {
    content: './examples',
    hot: false,
  },
};
