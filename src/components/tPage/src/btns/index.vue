<template>
  <div class="btns">
    <div class="btnList" v-if="btnList.length">
      <template v-for="(i, index) in btnList">
        <!--  -->
        <template v-if="!i.hidden">
          <el-button
            class="margin10"
            style="margin-left:0"
            :size="i.size || 'small'"
            :type="i.type || 'primary'"
            :key="index"
            :icon="i.icon || null"
            :disabled="
              typeof i.disabled === 'function' ? !!i.disabled() : i.disabled
            "
            v-if="!i.hasOwnProperty('children')"
            @click="handleClick(i)"
            >{{ i.name }}</el-button
          >
          <!-- 按鈕点击否有选项 -->
          <el-dropdown
            class="margin10"
            v-if="i.hasOwnProperty('children') && i.children.length"
            @command="clickBtn"
            :key="i.id"
          >
            <el-button :type="i.type || 'primary'" :size="i.size || 'small'">
              {{ i.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="j in i.children"
                :command="j.name"
                :key="j.name"
                >{{ j.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </template>
    </div>
    <!--  -->
    <div class="btnRight">
      <slot name="btnRight"></slot>
    </div>
    <div class="costomTag">
      <costomTag v-if="leftCustom" v-bind="$attrs" v-on="$listeners"
        >自定义展示列</costomTag
      >
    </div>
  </div>
</template>

<script>
import costomTag from "../costomTag";
export default {
  components: {
    costomTag
  },
  name: "t-btns",
  props: {
    leftCustom: {
      type: Boolean,
      default: () => false
    },
    btnList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    clickBtn(value) {
      this.$emit("clickBtn", value);
      // if (name) {
      //   this.$emit(name, value)
      // }
    },
    handleClick(i) {
      let vm = this;
      let options = null;
      if (!vm.utils.isFunction(i.fn)) {
        console.error(`${i.name}的fn不是一个函数`);
        return;
      }
      options = i.fn(i.name);
      if (vm.utils.isObject(options)) {
        this.$emit("btnClick", options, i.name, () => {});
      }
    },
    //设置自定义列表选中
    setDefaultData() {
      let key = "warehouse" + this.$route.name;

      if (localStorage.getItem(key)) {
        let arr = localStorage.getItem(key);
        this.defaultData = this.tableConfig.filter(
          item => arr.indexOf(item.label) >= 0
        );
      } else {
        this.defaultData = this.tableConfig;
      }
    },
    //自定义改变时更新列表展示数据
    selectCheck(val) {
      this.defaultData = this.tableConfig.filter(
        item => val.indexOf(item.label) >= 0
      );
      let storage = this.defaultData.map(i => i.label);
      let key = "warehouse" + this.$route.name;
      localStorage.setItem(key, JSON.stringify(storage));
    }
  }
};
</script>

<style lang="scss">
.btns {
  position: relative;
  .costomTag {
    position: absolute;
    right: 0;
    top: 4px;
  }
}
</style>
