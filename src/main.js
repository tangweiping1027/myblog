import Vue from "vue";
// import Vue from "vue/dist/vue.min.js";
import App from "./App.vue";
import store from "./store/index";
import router from "./router/index";
import "../es6demo";
import inject from "./plugins/inject";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import message from "./views/message";
// animate动画库
import "animate.css/animate.min.css";

Vue.prototype.$msg = message;

window.GLOBAL.vbus = new Vue();

Vue.use(ElementUI);
Vue.use(inject);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
