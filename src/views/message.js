import Vue from "vue";
import Msg from "./message.vue";
let MessageBox = Vue.extend({
  extends: Msg,
  props: {
    message: {
      type: String,
      default: "fdsafadsfdsa"
    }
  },
  created() {
    console.log("这是extend串讲的");
  }
});
let instance;
var message = function(options) {
  if (typeof options === "string") {
    options = {
      message: options
    };
  }
  //生成组件
  instance = new MessageBox({
    data: options,
    created() {
      console.log("这是new的时候穿件的");
    }
  });
  //组件需要挂载在dom元素上
  instance.vm = instance.$mount();
  //根据不同的类型，设置不同消息的背景颜色
  if (options.type) {
    instance.vm.$el.children[0].className += ` icon__${options.type}`;
  }
  document.body.appendChild(instance.vm.$el);
  return instance.vm;
};

const type = ["success", "info", "warning", "error"];
type.forEach(type => {
  message[type] = options => {
    if (typeof options === "string") {
      options = {
        message: options
      };
    }
    options.type = type;
    return message(options);
  };
});

export default message;
