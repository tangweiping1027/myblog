import storage from "Utils/saver";
export function routerBeforeEachFunc(to, from, next) {
  // 这里可以做页面拦截，权限处理
  if (from.path.name === "login") next();
  let token = storage.get("local", "token");
  if (from.path.name !== "login") {
    if (!token) {
      next("/login");
    }
    next();
  }
}
