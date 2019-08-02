import Vue from "vue";
import Msg from "./src/index.vue";
import CreateComponent from "Utils/createComponent.js";

class Message extends CreateComponent {
  constructor() {
    super();
  }
  messageInstance(options, timeout) {
    if (options.styles == undefined) {
      options.styles = {
        position: "absolute",
        bottom: "100px",
        right: 0
      };
    }
    let instance = super.createInstance(options, {
      extends: Msg
    });
    if (options.type) {
      instance.$el.children[0].className += ` icon__${options.type}`;
    }
    let timer = setTimeout(() => {
      super.removeItem(instance).then(() => {
        instance.$on("afterLeave", () => {
          document.body.removeChild(instance.$el);
          instance.$destroy();
          clearTimeout(timer);
        });
      });
    }, timeout || 10000);
  }
}

let message = new Message();

Vue.component(Msg.name, Msg);
Vue.prototype.$msg = message.messageInstance.bind(message);
