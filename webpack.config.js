const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "",
    // You can do fun things here like use the [hash] keyword to generate unique
    // filenames, but for this purpose rinse.js is fine. This file and path will
    // be what you put in package.json's "main" field
    filename: "main.js",
    // This field determines how things are importable when installed from other
    // sources. UMD may not be correct now and there is an open issue to fix this,
    // but until then, more reading can be found here:
    // https://webpack.js.org/configuration/output/#output-librarytarget
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this"
  },

  externals: [
    {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    }
  ]
};
