const glob = require("glob");
const { join } = require("path");

const PAGE_DIR = join(__dirname, "../src/pages");

/*动态出口*/
exports.entries = function () {
  const entryFile = glob.sync(`${PAGE_DIR}/**/*.ts`);
  const resultEntry = {};
  entryFile.forEach((filepath) => {
    const fileName = filepath.substring(
      filepath.lastIndexOf("/") + 1,
      filepath.lastIndexOf(".")
    );
    resultEntry[fileName] = filepath;
  });
  return resultEntry;
};
const pageTitle = {
  login: "登录",
  index: "Hello",
};
/*动态 html*/
exports.htmlPages = function () {
  const entryHtml = glob.sync(`${PAGE_DIR}/**/*.html`);
  const resultHtml = [];

  entryHtml.forEach((filepath) => {
    const filename = filepath.substring(
      filepath.lastIndexOf("/") + 1,
      filepath.lastIndexOf(".")
    );
    const htmlPlugin = {
      template: filepath,
      filename: `${filename}.html`,
      title: pageTitle[filename],
      chunks: filename,
      inject: true,
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    };
    resultHtml.push(htmlPlugin);
  });
  return resultHtml;
};
