<template>
  <div class="t-page">
    <section class="search" v-if="searchFlag">
      <search
        :searchList="searchConfig"
        v-bind="$attrs"
        v-on="$listeners"
        @search="handleSearch"
      ></search>
    </section>
    <section class="btns">
      <t-btns
        @clickBtn="clickBtn"
        @btnClick="btnClick"
        :leftCustom="leftCustom"
        :list="costomList"
        :checkList.sync="checkList"
        :btnList="btnList"
      ></t-btns>
    </section>
    <section>
      <t-table
        :data="tableData"
        :border="true"
        @delete="handleDelete"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @selectChange="selectChange"
        v-loading="tableLoading"
        :columns="tableColumns"
        ref="table"
        v-bind="$attrs"
        v-on="$listeners"
        :pageNo="pageNo"
        :pageSize="pageSize"
        :total="total"
        @btnClick="btnClick"
        @sortChange="sortChange"
        :rowKey="id"
      ></t-table>
    </section>
    <t-dialog
      ref="dialog"
      @btnClick="btnClick"
      v-bind="$attrs"
      v-on="$listeners"
      :listFlag="true"
    ></t-dialog>
  </div>
</template>

<script>
import storage from "Utils/storage.js";
export default {
  name: "tPage",
  props: {
    searchFlag: {
      type: Boolean,
      default: true
    },
    leftCustom: {
      type: Boolean,
      default: false
    },
    moreConfig: {
      type: Object,
      default: () => {
        return {
          btnConfig: [],
          searchConfig: [],
          tableConfig: []
        };
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          url: "/",
          id: "id",
          btnConfig: [],
          searchConfig: [],
          tableConfig: [],
          searchForm(val) {
            return val;
          },
          clickBtn() {},
          moreParams: {},
          selectData: []
        };
      }
    }
  },
  data() {
    let vm = this;
    return {
      ...Object.assign(
        {
          url: "/",
          id: "id",
          btnConfig: [],
          searchConfig: [],
          tableConfig: [],
          searchForm(val) {
            return val;
          },
          handleResult(val) {
            return Promise.resolve(val);
          },
          clickBtn() {},
          moreParams: {},
          selectData: []
        },
        {},
        vm.config
      ),
      tableData: [],
      searchInfo: {},
      tableLoading: true,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      costomList: [],
      checkList: [],
      tableColumns: [],
      routeKey: null
    };
  },
  created() {
    this.routeKey = "finance" + this.$route.name;
  },
  mounted() {
    this.getList("mount");
  },
  computed: {
    btnList: {
      get() {
        let vm = this;
        return [...vm.btnConfig, ...vm.moreConfig.btnConfig];
      }
    }
  },
  watch: {
    checkList(val) {
      if (val) {
        storage.set("local", this.routeKey, val);
        this.tableColumns = this.utils
          .clone(this.tableConfig)
          .filter(item => (val.indexOf(item.label) >= 0 ? item : false));
      }
    },
    "config.tableConfig": {
      immediate: true,
      deep: true,
      handler(val) {
        let vm = this;
        if (vm.utils.isArrLength(val) && vm.leftCustom) {
          vm.tableConfig = val;
          vm.costomList = vm.utils.clone(val);
          vm.getDefaultTableColmns();
        } else {
          vm.tableColumns = val;
        }
      }
    }
  },
  methods: {
    getDefaultTableColmns() {
      let vm = this;
      if (!storage.get("local", this.routeKey)) {
        vm.checkList = vm.utils.clone(vm.tableConfig).map(item => item.label);
        storage.set("local", this.routeKey, vm.checkList);
      } else {
        vm.checkList = storage.get("local", this.routeKey);
      }
      vm.tableColumns = vm.utils
        .clone(vm.tableConfig)
        .filter(item => (vm.checkList.indexOf(item.label) >= 0 ? item : false));
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList("search");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList("search");
    },
    handleSearch(val) {
      val = JSON.parse(JSON.stringify(val));
      this.pageNo = 1;
      this.searchInfo = val;
      this.getList("search");
      this.clearSelection();
    },
    $dialog(options) {
      this.$refs.dialog &&
        this.$refs.dialog.$dialog &&
        this.$refs.dialog.$dialog(options);
    },
    sortChange(column) {
      let vm = this;
      vm.moreParams = {
        ...vm.moreParams,
        sortField: column.prop
      };
      this.getList("search");
    },
    getSearchData(params) {
      let vm = this;
      params = params || {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        sortOrder: "asc",
        ...vm.moreParams
      };

      // let searchInfo = JSON.parse(
      //   JSON.stringify(vm.searchForm(vm.searchInfo) || {})
      // )
      let searchInfo = vm.searchForm(vm.utils.clone(vm.searchInfo));
      // 默认第一个时间为time
      if (vm.utils.isArrLength(searchInfo.time)) {
        searchInfo.startTime = searchInfo.time[0];
        searchInfo.endTime = searchInfo.time[1];
        delete searchInfo.time;
      }
      params = Object.assign({}, params, searchInfo);
      // 处理为空的情况
      return vm.utils.filterObj(params);
    },
    getList(type) {
      let vm = this;
      let params = {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        sortOrder: "asc",
        ...vm.moreParams
      };
      if (type == "search" || type == "mount") {
        params = vm.getSearchData(params);
      }
      if (!this.url) {
        this.tableLoading = false;
        return;
      }
      try {
        vm.$api[vm.url](params)
          .then(async data => {
            let { pageNo, pageSize, total, rows = [] } = data;
            vm.pageNo = pageNo;
            vm.pageSize = pageSize;
            vm.total = total;
            vm.tableData = await vm.handleResult(vm.utils.clone(rows));
            // vm.tableData = rows
            vm.tableLoading = false;
          })
          .catch(() => {
            vm.tableLoading = false;
          });
      } catch (error) {
        vm.tableLoading = false;
        console.warn(error);
      }
    },
    handleDelete(...arg) {
      this.$delete(...arg)
        .then(() => {
          this.clearSelection();
          this.getList("search");
        })
        .catch(() => {});
    },
    /**
     * url 请求url
     * params 请求参数
     * fn 请求成功后回调
     * clearSelection 是否清除选项
     * refreshList 是否刷新列表
     */
    btnClick(options, name, callback) {
      let vm = this;
      let {
        url = "",
        params = {},
        selectOptions = {},
        fn = () => {},
        clearSelection = true,
        refreshList = true
      } = options;
      if (!url) {
        return;
      }

      if (vm.utils.isArray(selectOptions.ids)) {
        if (
          vm.$isEdit(
            selectOptions.ids,
            selectOptions.single != true ? false : true
          )
        ) {
          return;
        }
      }

      let apiResult = null;
      if (name && name.indexOf("删除") >= 0) {
        apiResult = vm
          .$confirm("此操作将删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .catch(() => {
            vm.$message({
              type: "info",
              message: "已取消删除"
            });
            return Promise.reject();
          });
      } else {
        apiResult = Promise.resolve();
      }
      return apiResult
        .then(() => {
          return vm.$api[url](params).then(async data => {
            await fn(data);
            vm.reset(clearSelection, refreshList);
            callback(true);
            return Promise.resolve();
          });
        })
        .catch(() => {
          callback(false);
        });
    },
    reset(clearSelection = true, refreshList = true) {
      if (clearSelection && refreshList) {
        this.clearSelection();
        this.getList("search");
      } else if (clearSelection && !refreshList) {
        this.clearSelection();
      } else if (!clearSelection && refreshList) {
        this.getList("search");
      }
    },
    clearSelection() {
      this.$refs.table.toggleSelection();
    },
    choseSelection(row) {
      this.$refs.table.toggleSelection(row);
    },
    selectChange(val) {
      this.selectData = val;
      this.config.selectData = val;
    }
  }
};
</script>

<style lang="scss">
.t-page {
  .search {
    padding: 10px;
    background: #f2f2f2;
    border-radius: 5px;
  }
  .btns {
    padding: 4px 0;
    .el-button {
      padding: 9px 15px;
    }
  }
}
</style>
