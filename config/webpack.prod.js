const { join } = require("path");
const terserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rimraf = require("rimraf");

// 删除目录
const rm = (rmPath) => {
  rimraf(join(__dirname, rmPath), (err) => err && console.log(err));
};

// 打包前删除 dist 目录
rm("../dist");

module.exports = {
  mode: "production",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(styl|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          "css-loader",
          "postcss-loader",
          "stylus-loader",
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
        exclude: /(node_modules)/,
        cache: true,
        parallel: true,
        sourceMap: true,
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
};
