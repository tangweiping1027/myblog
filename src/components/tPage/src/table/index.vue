<template>
  <div class="t-table">
    <el-table
      :data="data"
      v-bind="$attrs"
      v-on="$listeners"
      @selection-change="selectChange"
      :row-key="rowKey"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :load="load"
      ref="baseTable"
      @sort-change="$emit('sortChange', $event)"
    >
      >
      <el-table-column
        v-if="selection"
        type="selection"
        width="50"
        :reserve-selection="!!rowKey"
      ></el-table-column>
      <el-table-column
        v-if="serialNumber"
        type="index"
        width="50"
      ></el-table-column>
      <template v-for="(item, index) in columns">
        <!-- 自定义表单 -->
        <el-table-column
          v-if="(item.btns || item.render) && !item.renderHeader"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable || false"
          :key="index"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="item.btns">
              <template v-for="(j, idx) in item.btns">
                <el-tooltip
                  :content="j.name"
                  placement="top"
                  v-if="
                    j.show
                      ? typeof j.show === 'function'
                        ? j.show(scope)
                        : true
                      : true
                  "
                  :open-delay="2"
                  :key="idx"
                >
                  <el-button
                    v-if="j.type == 'text'"
                    @click="handleClick(j, scope)"
                    type="text"
                    >{{ j.name }}</el-button
                  >
                  <i
                    v-else-if="!j.render && !item.hide"
                    @click="handleClick(j, scope)"
                    class="normal-icon-btn"
                    style="padding: 0 2px;"
                    :class="j.icon ? j.icon : 'el-icon-edit'"
                  ></i>

                  <div style="display: inline-block" v-else>
                    <custorm :item="j" :scope="scope"></custorm>
                  </div>
                </el-tooltip>
              </template>
            </div>
            <custorm v-else :item="item" :scope="scope"></custorm>
          </template>
        </el-table-column>

        <!-- 自定义表头 -->
        <el-table-column
          v-else-if="(item.btns || item.render) && item.renderHeader"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable || false"
          :key="index"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="item.btns">
              <template v-for="(j, idx) in item.btns">
                <el-tooltip
                  :content="j.name || ''"
                  placement="top"
                  :open-delay="2"
                  :key="idx"
                >
                  <i
                    v-if="!j.render"
                    @click="handleClick(j, scope)"
                    class="normal-icon-btn"
                    :class="j.icon ? j.icon : ''"
                  ></i>
                  <div style="display: inline-block" v-else>
                    <custorm :item="j" :scope="scope"></custorm>
                  </div>
                </el-tooltip>
              </template>
            </div>
            <custorm v-else :item="item" :scope="scope"></custorm>
          </template>
          <template slot-scope="scope" slot="header">
            <custorm :item="item" :scope="scope"></custorm>
          </template>
        </el-table-column>

        <!-- 多级表头 -->
        <template v-else-if="item.mult && Array.isArray(item.mult)">
          <nestingCusorm :item="item" :key="index"></nestingCusorm>
        </template>

        <!-- 普通 -->
        <el-table-column
          v-else
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable || false"
          :key="index"
          :show-overflow-tooltip="item.showTooltip == false ? false : true"
          align="center"
        >
          <template slot-scope="scope" slot="default">
            <!-- 图片 -->
            <template v-if="item.type == 'img'">
              <el-tooltip effect="light" placement="right">
                <div
                  slot="content"
                  class="__img_wrapper mar-auto"
                  :style="{
                    width: (item.bulkyHeight || '300') + 'px',
                    height: (item.bulkyHeight || '300') + 'px'
                  }"
                >
                  <img
                    class="loadingImg"
                    :key="scope.row[item.value]"
                    v-lazy="scope.row[item.value]"
                  />
                </div>
                <el-badge
                  v-if="item.badge"
                  :value="item.badge(scope)"
                  style="z-index:999;margin:10px;"
                >
                  <div>
                    <div
                      class="__img_wrapper mar-auto"
                      :style="{
                        width: (item.style.width || '80') + 'px',
                        height: (item.style.width || '80') + 'px'
                      }"
                    >
                      <img
                        class="loadingImg"
                        :key="scope.row[item.value]"
                        v-lazy="scope.row[item.value]"
                      />
                    </div>
                  </div>
                </el-badge>
                <template v-else>
                  <div
                    class="__img_wrapper mar-auto"
                    :style="{
                      width: (item.style.width || '80') + 'px',
                      height: (item.style.width || '80') + 'px'
                    }"
                  >
                    <img
                      class="loadingImg"
                      :key="scope.row[item.value]"
                      v-lazy="scope.row[item.value]"
                    />
                  </div>
                </template>
              </el-tooltip>
              <template
                v-if="
                  item.toggleMethod &&
                    scope.row.products &&
                    scope.row.products.length > 1
                "
              >
                <el-button
                  class="custom-btn"
                  @click="handleToggleMethod(item, scope)"
                  type="text"
                  :icon="
                    !scope.row._open
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></el-button>
              </template>
            </template>

            <!-- 激活状态 -->
            <el-button
              v-else-if="item.changeFlag"
              @click="item.changeFlag(scope.$index, scope.row)"
              type="text"
            >
              <i
                :style="item.style"
                :class="
                  scope.row[item.value] ? 'el-icon-check' : 'el-icon-close'
                "
                class="icon"
              />
            </el-button>
            <!-- 其他 -->
            <div v-else style="display: inline-block">
              <!-- link -->
              <el-link
                v-if="item.href"
                :type="item.color || 'primary'"
                :href="item.href"
                :target="item.target || '_blank'"
                >{{ scope.row[item.value] || "-" }}</el-link
              >
              <div v-else style="display: inline-block">
                {{ defaultValue(scope.row[item.value]) }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="pagination"
      v-bind="$attrs"
      v-on="$listeners"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 30, 60, 80]"
      layout="total, sizes, prev, pager, next, jumper"
      :style="{ 'margin-top': paginationTop, 'text-align': paginationAlign }"
    >
      <slot name="pagination"></slot>
    </el-pagination>
  </div>
</template>

<script>
const custorm = {
  props: ["item", "scope"],
  render(h) {
    if (this.item.render && typeof this.item.render === "function") {
      return this.item.render(h, this.scope, this);
    } else if (
      this.item.renderHeader &&
      typeof this.item.renderHeader === "function"
    ) {
      return this.item.renderHeader(h, this.scope, this);
    } else {
      let style = this.item.style;
      return (
        <span style={style}>
          {this.scope.row[this.item.prop] === null ||
          this.scope.row[this.item.prop] === "" ||
          this.scope.row[this.item.prop] === undefined
            ? "-"
            : this.scope.row[this.item.prop]}
        </span>
      );
    }
  }
};

import nestingCusorm from "./nestingCusorm";
export default {
  components: {
    custorm,
    nestingCusorm
  },
  name: "TTable",
  props: {
    tablePage: {
      type: Boolean,
      default: false
    },
    pageNo: {
      type: [Number, String],
      default: 0
    },
    pageSize: {
      type: [Number, String],
      default: 10
    },
    total: {
      type: [Number, String],
      default: 0
    },
    paginationTop: {
      // 分页离表单位置
      type: String,
      default: "15px"
    },
    paginationAlign: {
      // 分页位置
      type: String,
      default: "right"
    },
    pagination: {
      // 是否分页
      type: Boolean,
      default: true
    },
    rowKey: {
      //表单唯一标识
      type: String,
      default: "id"
    },
    lazyUrl: {
      //懒加载url
      type: String,
      default: ""
    },
    columns: {
      type: Array,
      default: () => {
        return [
          // {
          //   label: '日期',
          //   value: 'date',
          //   type: 'warning', // 链接颜色
          //   href: 'https://www.baidu.com' // 链接
          // },
          // {
          //   label: '地址',
          //   mult: [
          //     // 多表头
          //     {
          //       label: '省',
          //       value: 'bbb'
          //     },
          //     {
          //       label: '国家',
          //       value: 'ccc'
          //     }
          //   ]
          // },
          // {
          //   label: '姓名',
          //   value: 'name',
          //   width: '180',
          //   sortable: true // 排序
          // },
          // {
          //   label: '地址1',
          //   value: 'address',
          //   width: '180'
          // },
          // {
          //   label: '主图',
          //   value: 'img',
          //   type: 'img' // 图片
          // },
          // {
          //   label: '操作',
          //   btns: [
          //     // 自定义表单
          //     {
          //       name: '添加',
          //       icon: 'el-icon-delete ',
          //       fn: () => {
          //         console.log(2324)
          //       }
          //     },
          //     {
          //       render(h, scope) {
          //         return (
          //           <el-button size="mini" type="primary">
          //             添加
          //           </el-button>
          //         )
          //       }
          //     }
          //   ],
          //   renderHeader(h, scope) {
          //     // 自定义表头
          //     return <el-input size="mini" placeholder="输入关键字搜索" />
          //   }
          // },
          // {
          //   label: '是否激活',
          //   value: 'activeFlag',
          //   changeFlag(index, row) {
          //     // 是否激活
          //     console.log(index)
          //     console.log(row)
          //   }
          // }
        ];
      }
    },
    data: {
      type: Array,
      default: () => {
        return [
          // {
          //   id: 1,
          //   date: '2016-05-02',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1518 弄',
          //   aaa: 'aaa',
          //   bbb: 'bbb',
          //   ccc: 'ccc',
          //   activeFlag: 1
          // },
          // {
          //   id: 2,
          //   date: '2016-05-04',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1517 弄',
          //   hasChildren: []
          // },
          // {
          //   id: 3,
          //   date: '2016-05-01',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1519 弄',
          //   children: [
          //     {
          //       id: 5,
          //       date: '2016-05-04',
          //       name: '王小虎',
          //       address: '上海市普陀区金沙江路 1517 弄'
          //     },
          //     {
          //       id: 6,
          //       date: '2016-05-04',
          //       name: '王小虎',
          //       address: '上海市普陀区金沙江路 1517 弄'
          //     }
          //   ]
          // },
          // {
          //   id: 4,
          //   date: '2016-05-03',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1516 弄',
          //   img: 'http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg'
          // }
        ];
      }
    },
    selection: {
      type: Boolean,
      default: true
    },
    serialNumber: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    defaultValue(val) {
      let vm = this;
      if (vm.utils.isEmpty(val)) {
        return "-";
      }
      return val;
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    selectChange(val) {
      this.$emit("selectChange", val);
    },
    load(tree, treeNode, resolve) {
      let vm = this;
      vm.$api[vm.lazyUrl]({}).then(({ rows = [] }) => {
        resolve(rows);
      });
    },
    handleClick(i, scope) {
      let vm = this;
      let options = null;
      if (!vm.utils.isFunction(i.fn)) {
        console.error(`${i.name}的fn不是一个函数`);
        return;
      }
      options = i.fn(scope.$index, scope.row);
      if (vm.utils.isObject(options)) {
        if (!options.selectOptions) {
          options.selectOptions = {};
        }
        options.selectOptions.ids = ["table"];
        this.$emit("btnClick", options, i.name, () => {});
      }
    },
    handleToggleMethod(item, scope) {
      item.toggleMethod(scope);
    },
    toggleSelection(rows) {
      // 传值为选中，不传，则清除选项
      if (rows) {
        rows.forEach(row => {
          this.$refs.baseTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.baseTable.clearSelection();
      }
    }
  }
};
</script>

<style lang="scss">
.t-table {
  .mar-auto {
    margin: 4px auto;
  }
  background: #fff;
  .normal-icon-btn {
    cursor: pointer;
    font-size: 20px;
  }
  .el-table--enable-row-transition .el-table__body td {
    height: 65px;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 18px;
  }
}
</style>
