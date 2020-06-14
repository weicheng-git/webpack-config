module.exports = {
  mode: "development",
  devtool: "source-map",
  watchOptions: {
    ignored: /(node_modules)/,
  },
  module: {
    rules: [
      {
        test: /\.(styl|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "stylus-loader"],
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
    inline: false, // 优化自动刷新的性能
    /*另一种思路: <script src="http://localhost:8080/webpack-dev-server.js"></script>*/
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
};
