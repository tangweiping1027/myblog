<template>
  <div class="login">
    <el-button @click="handle">点击</el-button>
    <aaa></aaa>
  </div>
</template>

<script>
import aaa from "./aaa";
import storage from "Utils/storage";
import Vue from "vue";
let Aaa = Vue.extend({
  extends: aaa
});

export default {
  components: { aaa },
  data() {
    return {
      visible: false,
      dialogVisible: false
    };
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
      // this.$msg({
      //   message: "sdfadsfdasf",
      //   on: {
      //     click: () => {
      //       console.log("click");
      //     }
      //   },
      //   childFn: [
      //     {
      //       name: "edit",
      //       params: {
      //         aaa: "123455"
      //       }
      //     }
      //   ],
      //   getForm(form) {
      //     console.log(form);
      //   }
      // });
      this._dialog({
        visible: true,
        title: "hello",
        component: () => import("./aaa"),
        width: "300px"
      });
    },
    destoryed() {
      console.log("dfsda");
    }
  }
};
</script>

<style lang="scss">
.login {
  background: #fff;
}
</style>
