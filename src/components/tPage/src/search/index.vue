<template>
  <div class="yt-search">
    <slot>
      <div class="searchWarp">
        <el-form
          :inline="inline"
          :model="searchForm"
          class="searchForm"
          ref="form"
        >
          <template v-for="(item, index) in searchLists">
            <el-form-item
              :label="item.label || null"
              :key="index"
              v-if="
                item.show
                  ? typeof item.show === 'function'
                    ? item.show(searchForm)
                    : item.show
                  : true
              "
            >
              <!-- 输入框 -->
              <el-input
                v-if="item.type === 'input'"
                :maxlength="item.max"
                v-model.trim="searchForm[item.value]"
                :placeholder="item.placeholder || null"
                :clearable="item.clearable || true"
                :style="item.style || ''"
                :size="item.size || 'small'"
                @clear="$emit('search', searchForm)"
                :prefix-icon="item.prefixIcon"
                :suffix-icon="item.suffixIcon"
              ></el-input>
              <!-- 单选款 -->
              <el-select
                v-if="item.type === 'select' && item.children"
                v-model="searchForm[item.value]"
                :placeholder="item.placeholder || null"
                :clearable="item.clearable || true"
                :style="item.style || ''"
                :filterable="item.filterable"
                @clear="$emit('search', searchForm)"
                @change="handleChange(item, $event)"
                :size="item.size || 'small'"
              >
                <el-option
                  :disabled="j.disabled || false"
                  :label="j.label ? j.label : j[item.props.label]"
                  :value="j.value != null ? j.value : j[item.props.value]"
                  :key="jindex"
                  v-for="(j, jindex) in item.children"
                ></el-option>
              </el-select>
              <!-- 远程搜索 -->
              <el-select
                v-if="item.type == 'remote' && item.url"
                v-model="searchForm[item.value]"
                :placeholder="item.placeholder || null"
                :clearable="item.clearable || true"
                :style="item.style || ''"
                @clear="$emit('search', searchForm)"
                @change="handleChange(item, $event)"
                :size="item.size || 'small'"
                :multiple="item.multiple"
                remote
                filterable
                reserve-keyword
                :remote-method="remoteMethod.bind(null, item.url)"
                :loading="loading"
              >
                <el-option
                  v-for="item in remoteData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

              <!-- 区间搜索 extent-->
              <template
                v-if="
                  item.type == 'extent' &&
                    (searchForm[item.value]
                      ? true
                      : (searchForm[item.value] = []))
                "
              >
                <el-input
                  :maxlength="item.max"
                  v-model.trim="searchForm[item.value][0]"
                  :placeholder="item.placeholder || null"
                  :clearable="item.clearable || true"
                  :style="
                    item.style || {
                      width: '90px'
                    }
                  "
                  :size="item.size || 'small'"
                  :prefix-icon="item.prefixIcon"
                  :suffix-icon="item.suffixIcon"
                ></el-input>
                <span style="padding: 0 4px">~</span>
                <el-input
                  :maxlength="item.max"
                  v-model.trim="searchForm[item.value][1]"
                  :placeholder="item.placeholder || null"
                  :clearable="item.clearable || true"
                  :style="
                    item.style || {
                      width: '90px'
                    }
                  "
                  :size="item.size || 'small'"
                  :prefix-icon="item.prefixIcon"
                  :suffix-icon="item.suffixIcon"
                ></el-input>
              </template>
              <!-- 时间 -->
              <el-date-picker
                v-if="item.type === 'time'"
                value-format="yyyy-MM-dd HH:mm:ss"
                :size="item.size || 'small'"
                v-model="searchForm[item.value]"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                @clear="$emit('search', searchForm)"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :style="item.style || null"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <!-- 多选款 -->
              <el-select
                v-if="item.type === 'multiple'"
                multiple
                collapse-tags
                @clear="$emit('search', searchForm)"
                v-model="searchForm[item.value]"
                :placeholder="item.placeholder || null"
                :clearable="item.clearable || true"
                :style="item.style || ''"
                :size="item.size || 'small'"
                @change="handleChange(item, $event)"
              >
                <el-option
                  :disabled="j.disabled || false"
                  :label="j.label"
                  :value="j.value"
                  :key="jindex"
                  v-for="(j, jindex) in item.children"
                ></el-option>
              </el-select>
              <!-- 文本域 -->
              <el-input
                v-if="item.type === 'textarea'"
                type="textarea"
                @clear="$emit('search', searchForm)"
                :autosize="item.autosize"
                :placeholder="item.placeholder || null"
                v-model="searchForm[item.value]"
              ></el-input>
              <!-- 级联选择 -->
              <el-cascader
                v-if="item.type === 'cascader'"
                :size="item.size || 'small'"
                :placeholder="item.placeholder"
                :options="item.children"
                :show-all-levels="item.showAllLevels || false"
                :change-on-select="item.changeOnSelect || false"
                :props="item.props && item.props"
                v-model="searchForm[item.value]"
                collapse-tags
                clearable
                @change="item.change && item.change"
              ></el-cascader>
              <!-- 输入匹配 -->
              <el-autocomplete
                size="small"
                v-if="item.type === 'auto'"
                class="inline-input"
                v-model="searchForm[item.value]"
                :fetch-suggestions="querySearch.bind(null, item)"
                :placeholder="item.placeholder"
                :trigger-on-focus="false"
              ></el-autocomplete>

              <!--  -->
              <coutry
                v-if="item.type === 'country' || item.type === 'province'"
                :placeholder="item.placeholder || null"
                :clearable="item.clearable || true"
                :styles="item.style || ''"
                :size="item.size || 'small'"
                @change="countryChange($event, item.value)"
                :countryId="countryId || null"
                :title="item.type == 'country' ? '国家' : '省'"
                :url="item.type == 'country' ? 'nationList' : 'provinceList'"
                @clear="
                  () => {
                    searchForm[item.value] = null;
                    countryId = null;
                  }
                "
              ></coutry>
            </el-form-item>
          </template>
          <!--  -->
          <el-form-item>
            <template v-if="searchBtnList.length">
              <el-button
                v-for="(citem, cindex) in searchBtnList"
                :key="cindex"
                type="primary"
                @click="onSubmit(citem)"
                size="small"
                >{{ citem }}</el-button
              >
            </template>
            <template v-else>
              <el-button
                type="primary"
                @click="onSubmit"
                icon="el-icon-search"
                size="small"
                >搜 索</el-button
              >
              <!-- 自定义搜索 -->
              <costomTag
                style="display:inline-block;padding: 0 10px;"
                v-if="rightCostom"
                v-bind="$attrs"
                v-on="$listeners"
                :list="costomList"
                :checkList.sync="checkLists"
                >自定义搜索</costomTag
              >
              <el-button @click="resetSearch" size="small">重置条件</el-button>
            </template>
          </el-form-item>
        </el-form>
        <div class="right">
          <slot name="right"></slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import coutry from "./country";
import costomTag from "../costomTag";
import storage from "Utils/storage.js";
export default {
  name: "search",
  props: {
    rightCostom: {
      type: [Boolean, String],
      default: false
    },
    dynamicSearch: {
      type: Array,
      default: () => []
    },
    searchList: {
      type: Array,
      default: () => [
        // {
        //     label:'SKU',               //输入款名称    ==>可不传
        //     value:'skuname',           //需要绑定的值  ==>必传
        //     type:'input',              //输入款类型   input、select，multiple，time，textarea  ==>必传
        //     prefixIcon:"el-icon-search",  //type为input 出现的右边icon
        //     suffixIcon:'el-icon-date',    //type为input 出现的左边icon
        //     placeholder:'',            //输入款提示文字 默认为null
        //     size:'small',              //输入款大小，默认small
        //     clearable:true,            //默认可清除
        //     style:{                    //输入款样式
        //         width:"120px",
        //     },
        //     autosize:{                  //type为textarea 控制高度
        //         minRows: 2,
        //         maxRows: 4
        //     },
        //     children:[                  //当type类型为:select(单选) 或者 multiple(多选) 时候传,
        //         {
        //             label:'是',  //下拉款显示的内容
        //             value:'1',         //下拉款绑定的内容
        //         },
        //     ]
        // }
      ]
    },
    searchBtnList: {
      //不适应搜索时可传其他值代替 如['中国'，'美国']
      type: Array,
      default: () => []
    },
    inline: {
      //控制表单方向  默认横向
      type: Boolean,
      default: true
    },
    // 默认值
    defaultValue: {
      default: () => ({})
    },
    updatedModel: Function //当绑定的值变化时候触发
  },
  data() {
    return {
      loading: false,
      routeKey: null,
      remoteData: [],
      costomList: [],
      checkLists: [],
      dynamic: [],
      countryId: null,
      searchForm: { ...this.defaultValue },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  watch: {
    searchForm: {
      handler(val) {
        this.updatedModel && this.updatedModel(val);
      },
      deep: true
    },
    dynamicSearch: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.rightCostom) {
          this.costomList = val;
          this.dynamic = this.utils.clone(val);
          this.getCostom(val);
        }
      }
    },
    checkLists: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.rightCostom) {
          let arr = this.costomList.filter(item => {
            if (val.indexOf(item.label) >= 0) {
              if (!this.searchForm[item.value]) {
                this.$set(this.searchForm, item.value, []);
              }
              return true;
            } else {
              if (this.searchForm[item.value]) {
                delete this.searchForm[item.value];
              }
              return false;
            }
          });
          storage.set("local", this.routeKey, val);
          this.dynamic = arr;
        }
      }
    }
  },

  computed: {
    searchLists: {
      get() {
        return [...this.searchList, ...this.dynamic];
      },
      set() {}
    }
  },
  created() {
    this.routeKey = "finance" + this.$route.name + "search+finance";
  },
  methods: {
    getCostom(val) {
      let vm = this;
      if (!vm.rightCostom) {
        return;
      }
      if (!storage.get("local", this.routeKey)) {
        vm.checkLists = val.map(item => item.label);
        storage.set("local", this.routeKey, vm.checkLists);
      } else {
        vm.checkLists = storage.get("local", this.routeKey);
      }
    },
    querySearch(item, queryString, cb) {
      if (item.querySearch) {
        item.querySearch(queryString).then(data => {
          // console.log(data);
          cb(data);
        });
      } else {
        cb([]);
      }
    },
    remoteMethod(url, query) {
      console.log(url);
      console.log(query);
      let vm = this;
      vm.$api[url]({
        skuCus: query
      }).then(({ rows = [] }) => {
        vm.remoteData = rows.map(item => {
          return {
            label: item.skuCus,
            value: item.variantId
          };
        });
      });
    },
    reset() {
      this.searchForm = { ...this.defaultValue };
    },
    handleChange(item, val) {
      if (item.change) {
        return item.change(val, this.searchForm);
      }
    },
    countryChange(val, key) {
      this.countryId = val;
      this.searchForm[key] = val;
    },
    resetSearch() {
      this.searchForm = this.$resetForm(this.searchForm, this.defaultValue);
      this.$emit("search", this.utils.filterObj(this.searchForm));
    },

    onSubmit(citem) {
      // console.log(this.searchForm,citem)
      if (citem) {
        this.$emit("search", this.searchForm, citem);
      } else {
        this.$emit("search", this.searchForm);
      }
    }
  },
  components: {
    coutry,
    costomTag
  }
};
</script>

<style lang="scss">
.yt-search {
  position: relative;
  .costomTag {
    position: absolute;
    right: 0;
    top: 4px;
  }
}
.searchWarp {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  .right {
    line-height: 41px;
  }
}
.searchForm {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
