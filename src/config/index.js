// 'use strict'
import config from "./portConfig";
/* 测试服 */
/* eslint-disable */
// 运行环境
export const NODE_ENV = process.env.NODE_ENV || 'prod'
const env = process.env.VUE_APP_ENV || 'dev'

const envConfig = config[env]
const {
  LOGIN_URL,
  PERMS_URL,
  PRODUCT_URL,
  PROCUREMENT_URL,
  ORDER_URL,
  WAREHOUSE_URL,
  EMAIL_URL,
  FINANCE_URL
} = envConfig

// 登录跳转的首页
export const loginRedirect = envConfig.loginRedirect

// 当前宿主平台
export const HOST_PLATFORM = 'WEB'

// 是否强制所有请求访问本地 MOCK，看到这里同学不难猜到，每个请求也可以单独控制是否请求 MOCK
export const AJAX_LOCALLY_ENABLE = false
// 是否开启监控
export const MONITOR_ENABLE = true
// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {
  waitForData: true,
  transitionOnLoad: true
}

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 100000,
  maxContentLength: 2000,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== 'production'
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  // 是否强制一一对应service api
  strict: false,

  // mockBaseURL: 'http://120.79.124.232:8001/mock/131/',
  debug: false,
  sep: '/'
}

// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
  sep: '/'
}

// 不同业务模块对应的端口配置
export const CONST_PORT_CONFIG = {
  loginRedirect,
  LOGIN_URL,
  PERMS_URL,
  PRODUCT_URL,
  PROCUREMENT_URL,
  ORDER_URL,
  WAREHOUSE_URL,
  EMAIL_URL,
  FINANCE_URL

}

// 还有一些方便开发的配置
export const DEBUG_VUE_DEVTOOLS = true // vue devtools 开关
export const DEBUG_VUE_DEBUG = true // vue debug 开关
export const DEBUG_VUE_TIP = true // vue tip 开关

export const CONSOLE_REQUEST_ENABLE = true // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = true // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true // 监控记录打印
export const OSS_CONFIG = {
  // 簽名地址
  signUrl: CONST_PORT_CONFIG.PRODUCT_URL + '/img/get/oss/signature'
}