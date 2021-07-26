const { join } = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rimraf = require("rimraf");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const webpackBaseConfig = require("./webpack.config");

console.log("production");

// 删除目录
const rm = (rmPath) => {
  rimraf(join(__dirname, rmPath), (err) => err && console.log(err));
};

// 打包前删除 dist 目录
rm("../dist");

module.exports = merge(webpackBaseConfig, {
  mode: "production",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              publishPath: "./",
            },
          },
          "css-loader",
          "postcss-loader",
        ],
        // 排除 node_modules 目录下的文件
        exclude: /(node_modules)/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `css/[name]_[contenthash:8].css`,
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2,
          minSize: 0,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /(node_modules)/,
        parallel: true,
        terserOptions: {
          ie8: false,
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
});
