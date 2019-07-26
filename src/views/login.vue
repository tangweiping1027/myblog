<template>
  <div class="login">
    <el-button @click="handle">点击</el-button>
  </div>
</template>

<script>
import storage from "Utils/storage";
export default {
  data() {
    return {};
  },
  created() {
    if (storage.get("token")) {
      return;
    }
    this.$ajax
      .post("http://192.168.0.135:8081/login", {
        captcha: "1",
        password: "admin123!",
        username: "admin"
      })
      .then(({ rows = {} }) => {
        storage.set("token", rows.token);
      });
  },
  mounted() {
    // this.aaaa();
  },
  methods: {
    handle() {
      this.$msg({
        type: "success"
      });
    }
  }
};
</script>

<style lang="scss">
.login {
  background: #fff;
}
</style>
