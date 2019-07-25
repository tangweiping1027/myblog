import axios from "./axios";
import api from "./api";
import funs from "./$";

export default {
  // eslint-disable-next-line
  install: (Vue, options) => {
    Vue.prototype.$api = api;
    Vue.prototype.$ajax = axios;
    Vue.prototype.$ = funs;

    // 需要挂载的都放在这里
  }
};
