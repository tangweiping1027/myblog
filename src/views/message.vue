<template>
  <transition name="message-fade">
    <div class="message" v-show="show">
      <p>{{ message }}</p>
      <p>{{ msg }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "v-message",
  props: ["message"],
  mounted() {
    this.StartTime();
  },
  data() {
    return {
      show: false,
      timer: null,
      msg: "123"
    };
  },
  created() {
    console.log("这是原生的");
  },
  methods: {
    StartTime() {
      console.log(111111111);
      this.show = true;
      if (this.timer) {
        window.clearTimeOut(this.timer);
      } else {
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000);
      }
    }
  }
};
</script>
