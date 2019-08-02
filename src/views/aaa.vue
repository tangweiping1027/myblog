<template>
  <div class="add">
    <ElForm
      :model="form"
      ref="form"
      size="small"
      :rules="rules"
      label-width="100px"
    >
      <ElFormItem label="自定义账户名:" prop="customAccount">
        <el-input
          v-model="form.customAccount"
          placeholder
          class="normal-input"
        ></el-input>
      </ElFormItem>
      <ElSelect v-model="form.storeId" placeholder class="normal-input">
        <!-- <ElOption v-for='' :key=''></ElOption> -->
      </ElSelect>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {}
    };
  },
  methods: {
    edit(params) {
      console.log(params);
    },
    submit() {
      return {
        url: "aaa",
        params: {
          bbb: "bbb"
        }
      };
    }
  }
};
</script>

<style lang="scss">
.add {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>
