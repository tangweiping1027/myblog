<template>
  <div class="dialog-com">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      @open="open"
      @close="$emit('close')"
      append-to-body
      :fullscreen="fullscreen"
      left
    >
      <el-scrollbar
        wrap-class="default-scrollbar__wrap"
        :style="{ height: height }"
        view-class="p20-scrollbar__view"
        ref="scroll"
      >
        <div>
          <component
            :is="comp"
            :reserveSelection="reserveSelection"
            v-bind="$attrs"
            v-on="$listeners"
            :key="indexKey"
            ref="com"
          ></component>
          <template v-if="display">
            <span slot="footer" class="dialog-footer">
              <template v-for="(item, index) in footBtns">
                <el-button
                  :loading="loading"
                  size="small"
                  type="primary"
                  :key="index"
                  @click="handleSubmit(`${item.value}`)"
                  >{{ item.name || "保存" }}</el-button
                >
              </template>
            </span>
          </template>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
	name: 't-dialog',
	inheritAttrs: false,
	props: {
	},
	data() {
		return {
			list: false,
			title: '添加',
			visible: false,
			width: '500px',
			height: '100%',
			fullscreen: false,
			component: () => { },
			reserveSelection: 'id',
			display: true,
			comp: () => { },
			indexKey: null,
			loading: false,
			footBtns: [
				{
					name: '取消',
					value: 'cancel'
				},
				{
					name: '保存',
					value: 'submit'
				}
			]
		}
	},
	watch: {
		$listeners: {
			deep: true,
			handler(val) {
				console.log(val)
			}
		}
	},
	async created() {
		let vm = this
		if (typeof vm.component == 'function') {
			await vm.component().then(data => {
				vm.comp = data.default
			})
		}
	},
	mounted() { },
	methods: {
		handleSubmit(submitName) {
			let vm = this
			if (submitName == 'cancel') {
				vm.visible = false
				return
			}
			if (!vm.$refs.com.form) {
				console.warn('表单form不存在')
				return
			}
			if (!vm.$refs.com.$refs.form) {
				console.warn('表单form的ref不存在')
				return
			}
			let data = vm.utils.clone(vm.$refs.com.form) // form表单的值
			let form = vm.$refs.com.$refs.form // form 表单
			form.validate(async valid => {
				if (valid) {
					let result = null
					vm.utils.isFunction(vm.$refs.com[submitName]) && (result = vm.$refs.com[submitName]())
					switch (vm.utils.dataType(result)) {
						case 'Undefined':
							vm.loading = false
							break;
						case 'Function':
							if (result.then) {
								result.then(() => {
									vm.loading = false
									vm.visible = false
								}).catch(err => {
									console.log(err)
									vm.loading = false
								})
							}
							break
						case 'Object':
							if (vm.list) {
								if (!result.selectOptions) {
									result.selectOptions = {}
								}
								result.selectOptions.ids = ['弹窗']
								vm.$emit('btnClick', result, '弹窗', data => {
									if (data) {
										vm.loading = false
										vm.visible = false
									} else {
										vm.loading = false
									}
								})
							} else {
								vm.$api[result.url](result.params).then(data => {
									vm.loading = false
									vm.visible = false
									return Promise.resolve(data)
								}).catch(() => {
									vm.loading = false
									return Promise.reject()
								})
							}
							break
						default:
							break;
					}
				}
			})
			return Promise.resolve()
		},
		open() {
			let vm = this
			let childFn = this.childFn
			childFn = childFn ? childFn : []
			vm.$nextTick(() => {
				vm.$refs.com['resetForm'] && vm.$refs.com['resetForm']()
				if (childFn && childFn.length) {
					childFn.map(async item => {
						try {
							vm.$refs.com[item.name] &&
								(await vm.$refs.com[item.name](item.params))
						} catch (error) {
							console.log(error)
						}
					})
				}
			})
		},
	}
}
</script>

<style lang="scss">
.dialog-com {
	background: #fff;
	.p20-scrollbar__view {
		padding: 17px;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		-o-box-sizing: border-box;
		-ms-box-sizing: border-box;
	}
	.default-scrollbar__wrap {
		overflow-x: auto;
		max-height: 560px;
		margin-right: 0 !important;
	}
}
.dialog-footer {
	margin-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
