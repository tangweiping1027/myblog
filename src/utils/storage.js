const storage = {
  local: localStorage,
  session: sessionStorage,
  host: window.location.host,
  get(...arg) {
    let type = null,
      name = null;
    switch (arg.length) {
      case 1:
        type = "local";
        [name] = arg;
        break;
      case 2:
        [type, name] = arg;
        break;
      default:
        console.warn("get传入的参数有误");
        break;
    }
    const item = this[type].getItem(this.host + "_" + name);
    return !item ? null : JSON.parse(item);
  },
  set(...arg) {
    let type = null,
      name = null,
      val = null;
    switch (arg.length) {
      case 2:
        type = "local";
        [name, val] = arg;
        break;
      case 3:
        [type, name, val] = arg;
        break;
      default:
        console.warn("set传入的参数有误");
        break;
    }
    return this[type].setItem(this.host + "_" + name, JSON.stringify(val));
  },
  remove(...arg) {
    let type = null,
      name = null;
    switch (arg.length) {
      case 1:
        type = "local";
        [name] = arg;
        break;
      case 2:
        [type, name] = arg;
        break;
      default:
        console.warn("remove传入的参数有误");
        break;
    }
    return this[type].removeItem(this.host + "_" + name);
  },
  clear(type) {
    return this[type].clear();
  }
};

export default storage;
