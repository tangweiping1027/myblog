<template>
  <div>
    {{ msg }}
    <!-- <tinymce-editor
      v-model="msg"
      :disabled="disabled"
      @onClick="onClick"
      ref="editor"
    ></tinymce-editor>-->
    <button @click="clear">清空内容</button>
    <button @click="disabled = true">禁用</button>
    <aaa></aaa>
  </div>
</template>

<script>
import "./aaa.js";
export default {
  data() {
    return {
      msg: "Welcome to Use Tinymce Editor",
      disabled: false
    };
  },
  created() {
    this.$msg({
      style: {}
    });
  },
  methods: {
    //鼠标单击的事件
    onClick(e, editor) {
      console.log("Element clicked");
      console.log(e);
      console.log(editor);
    },
    //清空内容
    clear() {
      this.$refs.editor.clear();
    }
  },
  components: {
    aaa: () => import("./aaa.vue")
  }
};
</script>

<style scoped></style>
