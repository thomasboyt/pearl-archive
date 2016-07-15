module.exports = {
  entry: {
    simple: './example/simple/game.ts'
  },

  output: {
    filename: '[name].bundle.js',
    path: './dist/example'
  },

  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    loaders: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },

  ts: {
    compilerOptions: {
      declaration: false,
    }
  }
}