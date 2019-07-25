import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: () => import("@/views/login"),
    name: "logins",
    meta: {
      title: "系统登录"
    }
  }
];

export default new Router({
  routes
});
