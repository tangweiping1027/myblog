import Vue from "vue";
import Msg from "./message.vue";
import CreateComponent from "./createComponent";

let MessageBox = Vue.extend({
  extends: Msg
});

class Message extends CreateComponent {
  constructor() {
    super();
  }
  messageInstance(options, timeout) {
    let instance = super.createInstance(options, MessageBox);
    if (options.type) {
      instance.$el.children[0].className += ` icon__${options.type}`;
    }
    let timer = setTimeout(() => {
      super.removeItem(instance, "animate");
      clearTimeout(timer);
    }, timeout || 10000);
  }
}

let message = new Message();
export default message.messageInstance.bind(message);
