const { join } = require("path");
const { DefinePlugin } = require("webpack");
const merge = require("webpack-merge");
const terserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const optimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const { entries, htmlPages } = require("./config/entry");
const devConfig = require("./config/webpack.dev");
const prodConfig = require("./config/webpack.prod");

const path = (dirPath) => join(__dirname, "./", dirPath);

// env 环境判断
const env = process.env.NODE_ENV;
const isDev = env === "development";

const webpackConfig = () => {
  const config = {
    entry: entries(),
    output: {
      filename: "js/[name]_[hash:8].js",
      path: path("./dist"),
    },
    resolve: {
      alias: {
        "@": "/src",
      },
      // 自动带上文件后缀
      extensions: [".ts", ".js", ".json", ".css", ".styl"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
          // use: ["babel-loader?cacheDirectory"]
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
              },
            },
          ],
          // 只转换 src 目录下的 js 文件
          include: path("src"),
          exclude: /(node_module)/,
        },
        {
          test: /\.vue$/,
          loader: ["vue-loader"],
        },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /(node_modules)/,
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10000,
              },
            },
          ],
          exclude: /(node_modules)/,
          include: /src/,
        },
      ],
    },
    plugins: [
      new optimizeCssAssetsWebpackPlugin(),
      new DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
        },
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
        new terserPlugin({
          cache: true, // 开启缓存
          parallel: true, // 并行打包
          sourceMap: true,
          extractComments: true, // 删除注释
          exclude: /(node_modules)/,
          include: /(src)/,
          terserOptions: {
            ie8: false,
          },
        }),
      ],
    },
  };
  /*html*/
  const pages = htmlPages();
  pages.forEach((page) => {
    const htmlPlugin = new HtmlWebpackPlugin({
      ...page,
    });
    config.plugins.push(htmlPlugin);
  });
  return isDev ? merge(config, devConfig) : merge(config, prodConfig);
};

module.exports = webpackConfig();
