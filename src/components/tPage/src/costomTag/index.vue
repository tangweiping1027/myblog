<template lang="html">
  <div class="">
    <el-popover placement="bottom" width="270" trigger="click">
      <el-checkbox-group v-model="_checkList" class="list">
        <el-row>
          <el-col :span="12" v-for="(item, index) in list" :key="index">
            <el-checkbox
              class="check-item"
              :label="item.label"
              :value="item.label"
              >{{ item.label }}</el-checkbox
            >
          </el-col>
        </el-row>
      </el-checkbox-group>
      <el-button slot="reference" size="small" icon="el-icon-menu">
        <slot></slot>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    checkList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    _checkList: {
      get() {
        return this.checkList;
      },
      set(val) {
        this.$emit("update:checkList", val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  .el-checkbox {
    margin: 0 10px 15px 0 !important;
    flex: 1;
  }
}
</style>
