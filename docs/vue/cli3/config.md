# vue-cli3配置

## vue.config.js 配置

```js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  runtimeCompiler: true, //是否使用包含运行时编译器的 Vue 构建版本
  baseUrl: '',
  productionSourceMap: false, //不在production环境使用SourceMap
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  configureWebpack: config => {
    //入口文件
    config.entry.app = ['babel-polyfill', './src/main.js']
    //删除console插件
    let plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true
          },
          output: {
            // 去掉注释内容
            comments: false
          }
        },
        sourceMap: false,
        parallel: true
      })
    ]
    //只有打包生产环境才需要将console删除
    if (process.env.VUE_APP_build_type == 'production') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  //允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    //命名
    config.resolve.alias
      .set('SRC', resolve('src'))
      .set('ASSET', resolve('src/assets'))
      .set('VIEW', resolve('src/components/page'))
      .set('COMPONENT', resolve('src/components/common'))
      .set('UTIL', resolve('src/utils'))
      .set('SERVICE', resolve('src/services'))
    //打包文件带hash
    config.output.filename('[name].[hash].js').end()

    //为了补删除换行而加的配置
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // modify the options...
        options.compilerOptions.preserveWhitespace = true
        return options
      })
  },
  devServer: {
    //跨域
    port: 8081, // 端口号
    open: true, //配置自动启动浏览器
    proxy: {
      // 配置跨域处理 可以设置多个
      '/api': {
        target: 'xxxx',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
```

**vue-cli-service serve**

```js
用法：vue-cli-service serve [options] [entry]
选项：
  --open    在服务器启动时打开浏览器
  --copy    在服务器启动时将 URL 复制到剪切版
  --mode    指定环境模式 (默认值：development)
  --host    指定 host (默认值：0.0.0.0)
  --port    指定 port (默认值：8080)
  --https   使用 https (默认值：false)
```

**vue-cli-service build**

```js
 --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```

## 环境变量和模式

[官网](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)
