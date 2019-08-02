import Vue from "vue";
/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
let dataType = obj => {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * 去除空或者null的属性值
 * @param {Object} obj 要处理的对象
 */
let dealObjectValue = obj => {
  var param = {};
  if (obj === null || obj === undefined || obj === "") return param;
  for (var key in obj) {
    if (dataType(obj[key]) === "Object") {
      param[key] = dealObjectValue(obj[key]);
    } else if (
      (obj[key] !== null &&
        obj[key] !== undefined &&
        obj[key] !== "" &&
        !Array.isArray(obj[key])) ||
      (Array.isArray(obj[key]) && obj[key].length > 0)
    ) {
      param[key] = obj[key];
    }
    if (typeof param[key] === "string") {
      param[key] = obj[key].trim();
    }
  }
  return param;
};

Vue.prototype.$formValidate = options => {
  let obj = {};
  for (let index = 0; index < options.length; index++) {
    const item = options[index];
    item.maxLen = item.maxLen ? item.maxLen : 100; //默认字符长度为100
    item.label = item.label ? item.label : "";
    item.required = item.required == false ? item.required : true;
    item.must = item.must == false ? item.must : true;
    let trigger = item.select == "undefined" ? "blur" : "change";
    if (!item.required) {
      continue;
    }
    obj[item.value] = [
      {
        required: item.must,
        trigger,
        validator: (rule, value, callback) => {
          let str = "";
          str += `if(value=='' || value == undefined || value == null) {
              callback(new Error('${item.label}不能为空'))
            }`;
          if (dataType(item.opt) === "Array" && item.opt.length) {
            // 是否存在opt
            for (let index = 0, len = item.opt.length; index < len; index++) {
              const el = item.opt[index];
              str += `else if (${el.condition}) {
                callback(new Error('${el.msg}'))
              }`;
            }
          }
          if (dataType(value) == "Array") {
            // 值为数组
            if (!value.length) {
              str += `else if (true) {
                callback(new Error('${item.label}不能为空'))
              }`;
            }
          } else {
            if (item.type && item.type == "email") {
              // email 验证
              str += `else if (!specialExp(value,'email')) {
                  callback(new Error('输入的邮箱格式不正确'))
                }`;
            } else if (item.type && item.type == "phone") {
              // phone 验证
              str += `else if (!specialExp(value,'phone')) {
                  callback(new Error('输入的电话号码格式有误'))
                }`;
            } else if (item.type && item.type == "qq") {
              // qq 验证
              str += `else if (!specialExp(value,'qq')) {
                  callback(new Error('输入的qq号码格式有误'))
                }`;
            } else if (item.type && item.type == "url") {
              // url 验证
              str += `else if (!specialExp(value,'url')) {
                  callback(new Error('输入的url格式有误'))
                }`;
            } else if (item.type && item.type == "user") {
              // user 验证
              str += `else if (!specialExp(value,'user')) {
                  callback(new Error('输入的用户名格式有误'))
                }`;
            } else if (item.type && item.type == "fax") {
              // fax 验证
              str += `else if (!specialExp(value,'fax')) {
                  callback(new Error('输入的传真格式有误'))
                }`;
            } else if (item.type == "discount") {
              str += `else if (!specialExp(value,'discount')) {
                      callback(new Error('${item.label}必须为1或者1-2位小数'))
                    }`;
            } else if (
              item.type &&
              (item.type == "number" || dataType(item.type) == "Array")
            ) {
              // 数字验证
              if (
                dataType(item.type) == "Array" &&
                item.type[1] == "undefined"
              ) {
                item.type[1] == 2;
              }
              if (dataType(item.type) == "Array") {
                if (item.type[1]) {
                  str += `else if (!specialExp(value,'number',${
                    item.type[1]
                  })) {
                      callback(new Error('${item.label}必须为${
                    item.type[1]
                  }有效小数'))
                    }`;
                } else {
                  str += `else if (!specialExp(value,'number',${
                    item.type[1]
                  })) {
                      callback(new Error('${item.label}必须为有效整数'))
                    }`;
                }
              } else {
                str += `else if (!specialExp(value,'number',2)) {
                    callback(new Error('${item.label}必须为有效2位小数数字'))
                  }`;
              }
            }
          }

          str += `else if (value.length > ${item.maxLen}) {
                  callback(new Error('${item.label}字符不能超过${item.maxLen}'))
                }else {
                  callback()
                }`; // 字符长度验证
          new Function(`value`, "callback", "specialExp", str)(
            value,
            callback,
            specialExp
          );
        }
      }
    ];
  }
  return obj;
};

function specialExp(val, type, numType) {
  let reg = null;
  switch (type) {
    case "email":
      reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      break;
    case "number":
      switch (numType) {
        case 0:
          reg = /^(0|[1-9]\d*)$/; //整数或者0
          break;

        default:
          reg = new RegExp(
            `^(([1-9]{1}\\d*)|0)(\\.\\d{1,${Number(numType)}})?$`
          ); //正数并且限制2位以内的小数
          break;
      }
      break;
    case "discount":
      reg = /(^0\.[1-9]{1,2}$)|(^0\.[0-9]{1}[1-9]{1}$)|(^1{1}$)|(^1{1}\.0{2}$)|(^1{1}\.0{1}$)/;
      break;
    case "phone":
      reg = /(^1([3|4|5|7|8|])\d{9}$)|(^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$)/;
      break;
    case "qq":
      reg = /^[1-9][0-9]{4,10}$/;
      break;
    case "url":
      reg = /^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
      break;
    case "user":
      reg = /^[a-zA-Z0-9_\-\u4E00-\u9FA5]{4,16}$/;
      break;
    case "fax":
      reg = /^(\d{3,4}-)?\d{7,8}$/;
      break;
  }

  if (reg) {
    return reg.test(val);
  } else {
    return false;
  }
}

export default {
  dealObjectValue
};
