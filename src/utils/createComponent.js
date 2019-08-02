import Vue from "vue";
export default class CreateComponent {
  constructor() {
    this.instances = [];
    this.id = 1;
  }
  removeItem(instance) {
    if (!instance) {
      return;
    }
    let index = this.instances.findIndex(item => item.id == instance.id);
    if (index < 0) {
      return;
    }
    this.instances.splice(index, 1);
    instance.visible = false;
    return Promise.resolve(instance);
  }
  createInstance(options, creatorOptions) {
    //生成组件
    let Creator = Vue.extend(creatorOptions);
    let { on, childFn, ...rest } = options;
    let instance = new Creator({
      propsData: {},
      data: {
        ...rest
      }
    });
    instance.id = "instance" + this.id++;
    //组件需要挂载在dom元素上
    instance.vm = instance.$mount();

    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    // 调用组件的方法
    if (childFn && Array.isArray(childFn)) {
      childFn.forEach(item => {
        if (typeof instance.vm[item.name] != "function") {
          return;
        }
        instance.vm[item.name](item.params == undefined ? {} : item.params);
      });
    }

    // 监听组件$emit事件
    if (on) {
      for (const key in on) {
        if (on.hasOwnProperty(key)) {
          const element = on[key];
          instance.$on(key, element);
        }
      }
    }
    this.instances.push(instance);
    return instance.vm;
  }
}
