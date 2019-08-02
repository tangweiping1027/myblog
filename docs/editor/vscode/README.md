# vscode安装与使用

## 安装

[下载地址](https://code.visualstudio.com/Download)

**安装插件**

+ Auto Close Tag

+ Auto Rename Tag

+ Beautify

+ Bracket Pair Colorizer

+ change-case

+ Chinese (Simplified) Language Pack for Visual Studio Code

+ CSS Peek

+ Document This

+ ESLint

+ File Peek

+ Formatting Toggle

+ HTML CSS Support

+ HTML Snippets

+ language-stylus

+ markdownlint

+ npm

+ Partial Diff

+ Path Autocomplete

+ Path Intellisense

+ Prettier-Code formatter

+ Project Manager

+ Sass Formatter

+ SVN

+ Vetur

+ vscode-element-helper

+ Quokka.js

**项目中安装 eslint-vue 插件**

<font color=#c7254e>npm install --save-dev eslint eslint-plugin-vue</font>

[参考链接文档](https://github.com/vuejs/eslint-plugin-vue)

## 编辑器配置

其中关于字体大小、行高等配置可以自定义，关于vue、eslint的格式规则需要按着相应的规则写，点击左下角设置按钮后，在自定义设置中添加如下：

```js
// 将设置放入此文件中以覆盖默认设置
// 解决MAC环境中CPU高占用的问题
{
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/tmp": true,
        "**/node_modules": true,
        "**/bower_components": true,
        // "**/dist": true
    },
    "files.watcherExclude": {
        "**/.git/objects/**": true,
        "**/.git/subtree-cache/**": true,
        "**/node_modules/**": true,
        "**/tmp/**": true,
        "**/bower_components/**": true,
        // "**/dist/**": true
    },
    // 皮肤
    // 窗口失去焦点自动保存
    "files.autoSave": "onFocusChange",
    // 编辑粘贴自动格式化
    "editor.formatOnPaste": false,
    // 控制字体系列。
    "editor.fontFamily": "Fira Code,monospace,'Courier New', Consolas",
    // 字体大小
    "editor.fontSize": 14,
    // 行高
    "editor.lineHeight": 17,
    // 通过使用鼠标滚轮同时按住 Ctrl 可缩放编辑器的字体
    // 窗口失去焦点自动保存
    // 通过使用鼠标滚轮同时按住 Ctrl 可缩放编辑器的字体
    "editor.mouseWheelZoom": true,
    // 行太长自动换行
    "editor.wordWrap": "on",
    // eslint设置
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
            "language": "html",
            "autoFix": true
        },
        {
            "language": "vue",
            "autoFix": true
        }
    ],
    // 保存自动修复
    "eslint.autoFixOnSave": true,
    // tab锁紧
    "editor.tabSize": 2,
    // 空格变成......
    "editor.renderWhitespace": "all",
    // formatter for <script> region
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    // 启用或禁用 JavaScript 文件的语义检查。
    "javascript.implicitProjectConfig.experimentalDecorators": true,
    // 控制在差异编辑器中是否把前导空格或尾随空格的改动显示为差异
    "diffEditor.ignoreTrimWhitespace": false,
    // 启用或禁用在 VS Code 中重命名或移动文件时自动更新 import 语句的路径。
    "typescript.updateImportsOnFileMove.enabled": "always",
    // 控制是否在搜索中跟踪符号链接。解决VSCode启动后CPU高占用问题
    "search.followSymlinks": false,
    "element-helper.language": "zh-CN",
    "element-helper.version": "2.5",
    "element-helper.indent-size": 2,
    "element-helper.quotes": "double",    // html vue qoutes
    "element-helper.pug-quotes": "single",
    "editor.quickSuggestions": {
        "strings": true
    },
    "svn.enableProposedApi": "none" // jade/pug quotes
}
```


