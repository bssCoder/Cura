const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const cssnano = require("cssnano");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production", // Make sure it's set to production mode for minification
  devtool:false,
  plugins: [
    // Define environment variables (like API_URL)
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(
        process.env.API_URL || "https://default-url.com"
      ),
    }),
    // Extract CSS into separate files
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css", // Add a hash to ensure cache busting
    }),
  ],
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log statements in production
          },
        },
      }), // Minify JavaScript using Terser
    ],
    splitChunks: {
      chunks: "all", // Code splitting for better caching
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files for production
          "css-loader", // Turns CSS into JS
          {
            loader: "postcss-loader", // Uses PostCSS for further optimization
            options: {
              postcssOptions: {
                plugins: [
                  require("autoprefixer"), // Add vendor prefixes to CSS
                  cssnano({ preset: "default" }), // Minify CSS
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
