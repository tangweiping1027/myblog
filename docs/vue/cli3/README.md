# vue-cli3 安装使用

## 环境安装

```js
npm install -g @vue/cli
vue create <project-name>
```

## 模式

**模式**是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：

- development 模式用于 vue-cli-service serve

- production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e

- test 模式用于 vue-cli-service test:unit

模式不同于 NODE_ENV，一个模式可以包含多个环境变量。每个模式都会将 NODE_ENV 的值设置为模式的名称，比如：development 模式下 NODE_ENV 的值会被设置为 development

当然，我们也可以通过为.env 文件增加后缀来设置某个模式下特有的环境变量。

### 示例：test 模式

我们在项目根目录下创建一个名为.env.test 和.env 的文件

```js
// .env文件：
VUE_APP_TITLE = VUE - CLI3 - DEMO
```

```js
// .env.test文件
NODE_ENV = production
VUE_APP_TITLE = VUE - CLI3 - DEMO(test)
```

- **vue-cli-service build**会加载可能存在的 .env、.env.production 和 .env.production.local 文件然后构建出生产环境应用；

- **vue-cli-service build --mode test**会在 staging 模式下加载可能存在的 .env、.env.test 和 .env.test.local 文件然后构建出生产环境应用。

这两种情况下，根据 NODE_ENV，构建出的应用都是生产环境应用，但是在 test 版本中，process.env.VUE_APP_TITLE 被覆写成了另一个值。

我们在 vue.config.js 文件中添加 console.log(process.env.VUE_APP_TITLE)

在 package.json 文件中添加"build-test": "vue-cli-service build --mode test"

执行 npm run build 和 npm run build-test

通过查看控制台打印出的分别是 VUE-CLI3-DEMO 和 VUE-CLI3-DEMO(test)，由此可见不同模式下的环境变量不同。

## 环境变量

只有以**VUE*APP***开头的变量才会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中，我们可以在代码中以下面的方式访问：**process.env.VUE_APP_TITLE**

除了 VUE*APP*\*变量外，还有两个始终可用的特殊变量

- **NODE_ENV**值为 development、productin、test 中的一个。

- **BASE_URL**与 vue.config.js 中的 publicPath 相符，即应用部署的基础路径

回到我们最开始的关于静态资源在不同环境下的路径问题，我们可以分别创建.env.test 和.env.production 两个文件，在文件中添加变量 VUE_APP_STATIC_BASE_URL，根据不同环境赋予不同的值，在代码中用到静态资源的时候通过 process.env.VUE_APP_STATIC_BASE_URL + 静态资源后续具体路径，再 package.json 中添加相应的模式打包命令。

## 环境变量的使用

只有以**VUE*APP***开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中(即在项目代码中使用)。你可以在应用的代码中这样访问它们：

```js
console.log(process.env.VUE_APP_SECRET)
```

## 理解指令 , 模式 , 环境变量之间的关系

我们在项目中的 package.json 经常能看见以下这样的指令

![图片](/vue.config.js/1.png)

在一个 Vue CLI 项目中，**@vue/cli-service** 安装了一个名为 **vue-cli-service** 的命令。你可以在 npm scripts 中以 vue-cli-service、或者从终端中以 ./node_modules/.bin/vue-cli-service 访问这个命令。

**vue-cli-service serve**[官网](https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-build)

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
用法：vue-cli-service build [options] [entry|pattern]

选项：
  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口
                文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```
