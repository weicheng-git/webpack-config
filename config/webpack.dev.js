const { merge } = require("webpack-merge");
const webpackBaseConfig = require("./webpack.config");
const webpack = require("webpack");
module.exports = merge(webpackBaseConfig, {
  mode: "development",
  target: "web", // 热更新不起作用需设置这个选项
  devtool: "source-map",
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
    name: `development-cache`,
  },
  watchOptions: {
    ignored: /(node_modules)/,
  },
  module: {
    rules: [
      {
        test: /\.(styl|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        // 排除 node_modules 目录下的文件
        exclude: /(node_modules)/,
      },
    ],
  },
  devServer: {
    proxy: {
      "/api": "http://localhost:4000",
    },
    compress: true,
    profile: true,
    hot: true,
    open: true,
    inline: true, // 优化自动刷新的性能
    // https: true,
    // contentBase: "./",
    // host: "0.0.0.0",
    // headers: {
    //   // 注入 HTTP 响应头
    //   "x-foo": "bar",
    // },
    historyApiFallback: {
      // 使用正则匹配路由
      rewrites: [
        { form: /^\/login/, to: "/login.html" },
        // 其他页面返回 login.html
        { form: /^\/./, to: "/index.html" },
      ],
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
});
