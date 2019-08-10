import Vue from "vue";

function handleFiles(files, callback) {
  files = files
    .keys()
    .map(files)
    .forEach(directive => {
      callback(directive);
    });
}

// 组件注册
handleFiles(require.context("./src/components", true, /.js$/), module => {
  if (module.__esModule && module.default) {
    Vue.use(module.default);
  }
});
