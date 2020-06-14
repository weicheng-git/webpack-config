# 学习 webpack 构建项目

## 初始化项目

```shell
mkdir pack-name
cd pack-name
yarn init
```

### 安装 webpack

```shell
yarn add -D webpack webpack-cli
```

package.json

```json
"script": {
  "dev": "webpack"
}
```

webpack.config.js

```js
const { join } = require("path");
const path = pathDir => join(__dirname, pathDir);
module.exports = {
  entry: path("./src/index.ts"),
  output: {
    filename: "[name].js",
    path: path("./dist"),
  },
};
```

### css 支持

```shell
yarn add -D style-loader
```

webpack.config.js

```js
module: {
  rules: [
    {
      test: /.(css)$/,
      use: ["style-loader", "css-loader"],
    },
  ];
}
```

### css 分离

```shell
yarn add -D mini-css-extract-plugin
```

webpack.config.js

```js
module: {
  rules: [
    {
      test: /.(css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
        },
      ],
    },
  ];
}
```

## DevServer

```shell
yarn add -D webpack-dev-server
```

package.json

```json
"script": {
  "dev": "webpack-dev-server"
}
```

## 多页动态 Entry

webpack.config.js

```js
// 同步函数
entry: () => ({
  a: "./pages/a",
  b: "./pages/b",
});
// 异步函数
entry: () => {
  return new Promise(resolve => ({
    a: "./pages/a",
    b: "./pages/b",
  }));
};
```
