<template>
  <div>
    <!-- 远程搜索 -->
    <el-select
      v-if="remoteFlag"
      v-model="value"
      :placeholder="placeholder"
      :clearable="clearable"
      @clear="clear"
      :style="styles"
      size="small"
      :multiple="false"
      filterable
      remote
      reserve-keyword
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in countryList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 输入，可搜索 -->
    <el-select
      v-else
      v-model="value"
      :placeholder="placeholder"
      :clearable="clearable"
      @clear="clear"
      :style="styles"
      size="small"
      :multiple="false"
      filterable
    >
      <el-option
        v-for="item in countryList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    clearable: {
      type: Boolean,
      default: true
    },
    styles: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    countryId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: "国家"
    },
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      value: null,
      countryList: [],
      loading: false,
      remoteFlag: true
    };
  },
  methods: {
    clear() {
      this.$emit("clear");
      this.countryList = [];
    },
    remoteMethod(query, val) {
      let vm = this;
      if (!val) {
        val = vm.countryId;
      }
      if (query !== "") {
        vm.loading = true;
        let params = {};
        if (vm.title == "国家") {
          params = {
            countryName: query
          };
        } else if (vm.title == "省") {
          params = {
            provinceName: query,
            countryId: val
          };
        }
        vm.$api[`warehouse/${vm.url}`](params)
          .then(data => {
            let { rows } = data;
            vm.countryList = rows.map(item => {
              if (vm.title == "国家") {
                return {
                  label: item.countryName,
                  value: item.countryId
                };
              } else if (vm.title == "省") {
                return {
                  label: item.provinceName,
                  value: item.provinceId
                };
              }
            });
            vm.loading = false;
          })
          .catch(() => {
            vm.loading = false;
          });
      } else {
        vm.countryList = [];
      }
    }
  },
  watch: {
    value(val) {
      this.$emit("change", val);
    },
    countryId(val) {
      let vm = this;
      if (!val) {
        this.remoteFlag = true;
        vm.countryList = [];
      } else {
        vm.countryList = [];
        this.remoteMethod(vm.value, val);
      }
    }
  }
};
</script>

<style></style>
