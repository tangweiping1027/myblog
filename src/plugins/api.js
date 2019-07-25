import axios from "./axios";
import _pick from "lodash/pick";
import _assign from "lodash/assign";
import _isEmpty from "lodash/isEmpty";

import { assert } from "Utils/tools";
import { API_DEFAULT_CONFIG, CONST_PORT_CONFIG } from "Config";
import API_CONFIG from "Service/api";

const { strict } = API_DEFAULT_CONFIG;

class MakeApi {
  constructor(options) {
    this.api = {};

    this.apiBuilder(options);
  }

  apiBuilder({
    sep = "|",
    config = {},
    mock = false,
    debug = false,
    mockBaseURL = ""
  }) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder({
        namespace,
        mock,
        mockBaseURL,
        CONST_PORT_CONFIG,
        sep,
        debug,
        config: config[namespace]
      });
    });
  }
  async _apiSingleBuilder({
    namespace,
    sep = "|",
    config = {},
    // eslint-disable-next-line
    mock = false,
    debug = false,
    _CONST_PORT_CONFIG,
    mockBaseURL = ""
  }) {
    config.forEach(api => {
      const {
        mock: apiMock,
        name,
        desc,
        params,
        method,
        mockEnable,
        path,
        type,
        showSuccess,
        singleLoading,
        mockPath
      } = api;

      const isMock =
        process.env.NODE_ENV === "production" ? false : apiMock || mockEnable;
      const url = isMock ? mockPath || path : path;
      let baseURL = isMock && mockBaseURL;

      debug && assert(name, `${url} :接口name属性不能为空`);
      debug &&
        assert(url.indexOf("/") === 0, `${url} :接口路径path，首字符应为/`);

      Object.defineProperty(this.api, `${namespace}${sep}${name}`, {
        value(outerParams, outerOptions) {
          // 是否强制一一对应service api
          const _data = _isEmpty(outerParams)
            ? params
            : strict
            ? _pick(_assign({}, params, outerParams), Object.keys(params))
            : outerParams instanceof Array
            ? outerParams
            : _assign({}, params, outerParams);
          if (!isMock) {
            //如果不是mock接口
            const name = namespace.toUpperCase() + "_URL";
            baseURL = _CONST_PORT_CONFIG[name];
          }

          const _options = {
            url,
            desc,
            baseURL,
            showSuccess,
            singleLoading,
            method
          };
          return axios(
            _normoalize(_assign(_options, outerOptions), _data, type)
          );
        }
      });
    });
  }
}

function _normoalize(options, data, type) {
  // 这里可以做大小写转换，也可以做其他类型 RESTFUl 的兼容
  if (options.method === "POST") {
    if (type === "formdata") {
      // formdata处理
      options.headers = {
        "Content-Type": "multipart/form-data"
      };
      let formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (Object.prototype.toString.call(element) === "[object Object]") {
            if (element.raw) {
              formData.append(key, element.raw);
            }
          } else if (
            Object.prototype.toString.call(element) === "[object Array]"
          ) {
            element.forEach(el => {
              if (Object.prototype.toString.call(el) === "[object Object]") {
                //对象是二进制文件
                if (el.raw) {
                  formData.append(key, el.raw);
                  //是对象不是2进止 是数组
                } else {
                  formData.append(key, JSON.stringify(el));
                }
              }
            });
            continue;
          } else {
            formData.append(key, element);
          }
        }
      }
      options.data = formData;
      return options;
    }
    options.data = data;
  } else if (options.method === "GET") {
    options.params = data;
  }
  return options;
}

// 注入模型和全局配置，并暴露出去
export default new MakeApi(
  Object.assign(
    {},
    {
      config: API_CONFIG
    },
    API_DEFAULT_CONFIG
  )
)["api"];
