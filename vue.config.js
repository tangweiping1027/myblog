var path = require("path");

function resolve(dir) {
  return path.join(__dirname, ".", dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  lintOnSave: false,
  chainWebpack: config => {
    // 别名
    config.resolve.alias
      .set("Views", resolve("src/views"))
      .set("Store", resolve("src/store"))
      .set("Utils", resolve("src/utils"))
      .set("Config", resolve("src/config"))
      .set("Routes", resolve("src/router"))
      .set("Assets", resolve("src/assets"))
      .set("Service", resolve("src/service"))
      .set("Plugins", resolve("src/plugins"))
      .set("Components", resolve("src/components"))
      .set("Directives", resolve("src/directives"));
  }
};
