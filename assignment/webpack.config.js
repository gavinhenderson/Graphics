const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    // removing 'src' directory from entry point, since 'context' is taking care of that
    app: "./index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.vert$/,
        use: "raw-loader",
      },
      {
        test: /\.frag$/,
        use: "raw-loader",
      },
      {
        test: /\.obj$/,
        use: "raw-loader",
      },
    ],
  },
};
