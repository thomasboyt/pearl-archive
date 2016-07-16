module.exports = {
  entry: {
    simple: './examples/simple/game.ts',
    coroutines: './examples/coroutines/game.ts',
  },

  output: {
    filename: '[name].bundle.js',
    path: './dist/examples'
  },

  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    loaders: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, loades: ["babel", "ts"] }
    ]
  },

  ts: {
    compilerOptions: {
      declaration: false,
    }
  },

  devServer: {
    contentBase: './examples'
  }
}