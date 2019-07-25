<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
let GLOBAL = window.GLOBAL;
export default {
  methods: {
    bindEvent() {
      GLOBAL.vbus.$on("business.response.incorrect", message => {
        // ... code 不为 0，业务不正确处理
        this.$message({
          type: "error",
          dangerouslyUseHTMLString: true,
          message: message || "未知异常，请联系客服人员"
        });
      });
      GLOBAL.vbus.$on("business.response.success", message => {
        // ... code 为 0，显示成功信息
        this.$message({
          type: "success",
          dangerouslyUseHTMLString: true,
          message
        });
      });
      // 自行触发
      GLOBAL.vbus.$on("ajax.request.error", resData => {
        console.info(resData);
      });
      GLOBAL.vbus.$on("ajax.response.error", message => {
        console.info(message);
        this.$message({
          type: "error",
          dangerouslyUseHTMLString: true,
          message
        });
      });
    }
  },
  created() {
    // this.init()
    this.bindEvent();
  },
  distory() {}
};
</script>
<style lang="scss">
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}
</style>
