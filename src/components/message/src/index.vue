<template>
  <transition
    enter-active-class="animated bounce"
    leave-active-class="animated bounce"
    @after-leave="$emit('afterLeave')"
  >
    <div class="message" :style="styles" v-show="visible">
      <p>{{ message }}</p>
      <el-button type="primary" @click="handleClick">点击</el-button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "v-msg",
  props: {
    message: {
      type: String,
      default: ""
    },
    styles: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {},
  data() {
    return {
      visible: false,
      msg: "123",
      form: {
        bbb: 454
      }
    };
  },
  computed: {},
  watch: {
    visible(val) {
      console.log(val);
    }
  },
  created() {
    console.log("这是原生的");
  },
  methods: {
    handleClick() {
      this.visible = false;
    },
    edit(params) {
      console.log(params);
    }
  }
};
</script>
