import axios from "axios";
import store from "../../store/index";
import router from "../../router/index";
import Vue from "vue";
import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE } from "../index.js";
import storage from "../../utils/storage";

let GLOBAL = window.GLOBAL;
let CancelToken = axios.CancelToken;
let pending = [];
let removePending = config => {
  for (let p in pending) {
    if (!config) {
      pending[p].f();
      pending.splice(p, 1);
    } else {
      if (
        pending[p].u ===
        config.url +
          "&" +
          config.method +
          "&" +
          (config.method === "get"
            ? JSON.stringify(config.params)
            : JSON.stringify(config.data))
      ) {
        //当当前请求在数组中存在时执行函数体
        pending[p].f(); //执行取消操作
        pending.splice(p, 1); //把这条记录从数组中移除
      }
    }
  }
};

GLOBAL.removePending = removePending;

let codeStragy = {
  // 跳转登录页并记录重定向网址
  redirectToLogin(msg, path = "/login") {
    let errorPage = ["/login", "/error/"];
    msg && GLOBAL.vbus.$emit("ajax.response.error", msg);
    let redirect;
    if (
      errorPage.every(
        el => decodeURIComponent(window.location.href).indexOf(el) === -1
      )
    ) {
      redirect = window.location.href;
    }

    router.replace({
      path,
      query: {
        redirect
      }
    });
  }
};

export function requestSuccessFunc(requestObj) {
  CONSOLE_REQUEST_ENABLE &&
    // console.info(
    //     "requestInterceptorFunc",
    //     `url: ${requestObj.url}`,
    //     requestObj
    // );

    // 移除相同请求
    removePending(requestObj);
  // 推入当前的请求到记录请求的数组
  requestObj.cancelToken = new CancelToken(c => {
    pending.push({
      u:
        requestObj.url +
        "&" +
        requestObj.method +
        "&" +
        (requestObj.method === "get"
          ? JSON.stringify(requestObj.params)
          : JSON.stringify(requestObj.data)),
      f: c
    });
  });

  if (!requestObj.singleLoading) {
    store.state.isloading = true;
  } else {
    store.state.loading = true;
  }
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  let token = storage.get("local", "token");
  // console.log(router);
  // if (!token && requestObj.url !== '/login' && router.currentRoute.name !== 'login') {
  //   removePending()
  //   codeStragy.redirectToLogin('登录失效，请重新登录')
  //   return Promise.reject('登录失效，请重新登录')
  // }
  requestObj.headers.token = token;
  // 去除空提交字符
  requestObj = Vue.prototype.$.dealObjectValue(requestObj);

  return requestObj;
}

export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...
  store.state.loading = false;
  store.state.isloading = false;
  return Promise.reject(requestError);
}

export function responseSuccessFunc(responseObj) {
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  // ...
  // 假设我们请求体为
  // {
  //     code: 1010,
  //     msg: 'this is a msg',
  //     data: null
  // }

  CONSOLE_RESPONSE_ENABLE;
  // &&
  // console.info(
  //     "响应参数",
  //     responseObj
  // );

  if (!responseObj.config.singleLoading) {
    store.state.isloading = false;
  } else {
    store.state.loading = false;
  }
  let resData = responseObj.data;

  let {
    code,
    msg,
    // eslint-disable-next-line
    status
  } = resData;

  // 响应代码
  switch (code) {
    case 0: // 如果业务成功，直接进成功回调
      responseObj.config.showSuccess &&
        GLOBAL.vbus.$emit("business.response.success", msg);
      return resData;
    case "0": // 如果业务成功，直接进成功回调
      responseObj.config.showSuccess &&
        GLOBAL.vbus.$emit("business.response.success", msg);
      return resData;

    // 如果业务失败，弹窗提示
    // 比如最常见的授权过期跳登录
    // 特定弹窗
    // 跳转特定页面等
    case 401: // 401 403 token 过期， 跳转登录面，要记录当前url, 方便下次登录后跳转回来
      codeStragy.redirectToLogin(msg);
      return;
    case 403:
      codeStragy.redirectToLogin(msg, "/error/notpermission");
      return;
    case 404:
      codeStragy.redirectToLogin(msg, "/error/404");
      return;
    // case 407: // 无权限，跳转无权限页（需要修改）
    //   codeStragy.redirectToLogin(msg, '/error/notpermission')
    //   return
    default:
      if (code == null && resData != null) {
        return resData;
      } else {
        // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下放它们到业务层
        !responseObj.config.noShowDefaultError &&
          GLOBAL.vbus.$emit("business.response.incorrect", resData.msg);
        return Promise.reject(resData);
      }
  }
}

export function responseFailFunc(responseError) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  store.state.loading = false;
  store.state.isloading = false;
  return Promise.reject(responseError);
}
