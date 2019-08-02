import Vue from "vue";
import dialog from "./src";
import CreateComponent from "Utils/createComponent.js";

class Dialog extends CreateComponent {
  constructor() {
    super();
  }
  dialogInstance(options) {
    let instance = super.createInstance(options, {
      extends: dialog
    });
    instance.$on("close", () => {
      super.removeItem(instance).then(instance => {
        document.body.removeChild(instance.$el);
        instance.$destroy();
      });
    });
  }
}

let dia = new Dialog();
Vue.prototype._dialog = dia.dialogInstance.bind(dia);
