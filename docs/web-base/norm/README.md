# 前端代码规范

## 驼峰式命名法

::: tip
驼峰式命名法大家应该都比较熟悉了：驼峰式命名法又被称为骆驼命名法，它是由小(大)写字母开始，后续每个单词首字母都大写。其中首字母大写的命名称为大驼峰命名法（Pascal命名法），首字母小写的命名称为小驼峰命名法（Camel Case）。
:::

## 变量（小驼峰式命名）

+ 变量禁止滥用。当你的数据只使用一次或不使用时，没有将其放到变量的必要。

```js
// 定义好了之后再也没使用过
let siteName = "zhangpeiyue.com";
// 变量太啰嗦
function fn() {
    let w = 1;
    let h = 2;
    let num = 2;
    let z = w + h;
    var e = z * num;
    return e;
}
```

建议调整为：

```js
function fn() {
    let w = 1;
    let h = 2;
    return (w + h) * 2;
}
```

+ 变量尽量体现语意及所属类型

```js
// 好的命名方式
var minLength = 10;
var userName = 'zhangpeiyue';

// 不好的命名方式
var length = 10;
var user = 'zhangpeiyue';
```

**注：**变量的前缀一般为名词。length、count等一般表示数字类型，name、title等一般表示为字符串类型，arr表示数组。

+ 指定特定变量

指定特定的变量往往会很大程度的提升你代码的可读性：

```js
// 无特定变量
if (userName.length > 7) {// 7是个什么鬼？
    //您的代码
}

// 拥有特定变量
const Max_Name_Length = 8;
// 十分清晰，表示名字最大的长度
if (userName.length > Max_Name_Length) {
    //您的代码
}
```

+ 尽可能少使用全局变量

指定特定的变量往往会很大程度的提升你代码的可读性：

```js
// 无特定变量
if (userName.length > 7) {// 7是个什么鬼？
    //您的代码
}

// 拥有特定变量
const Max_Name_Length = 8;
// 十分清晰，表示名字最大的长度
if (userName.length > Max_Name_Length) {
    //您的代码
}
```

+ 尽可能少使用全局变量

一般在多个函数使用相同数据时，我们一般会将该数据设为全局变量。但全局变量过多，极有可能会造成命名冲突：

```js
// home.js
let userName = "zhangSan";

// hello.js
let userName = "liSi";

// my.js
let userName = "wangWu";
```

以上代码会根据加载顺序让其具有不同含义。所以尽量将你的代码模块化，或使用局部变量（通过(){}的方法）。如果你的全局变量需要共享，你可以根据所处环境使用vuex或redux等。

+ 变量赋值

```js
const Max_Name_Length = 8;
let userName = nameArr[0];
if (userName.length > Max_Name_Length) {
    //您的代码
}
```

以上代码明显不够严谨，倘若nameArr是一个空数组，nameArr[0]得到的值就是undefined，而undefined是没有length属性的，此时程序定会报错！无疑以上代码成功埋下了一个定时炸弹。所以我们需要将代码进行优化：

```js
const Max_Name_Length = 8;
let userName = fullName[0] || "";
if (userName.length > Max_Name_Length) {
    //您的代码
}
```

+ 变量比较

变量比较请养成使用===运算符的习惯，因为它不需要对类型进行转换，比较严谨！

```js
// 不建议：
let userAge = 8;
if(userAge == 8){
    // 你的代码
}

// 建议:
let userAge = 8;
if(userAge === 8){
    // 你的代码
}
```

## 函数（小驼峰式命名）

+ 函数的前缀一般为动词

动词|解释|返回值类型
--|:--:|--:
can|是否可执行某个动作（权限|布尔值
has|是否含有某个值|布尔值
is|是否为某个值|布尔值
get|获取某个值|返回获得的值
set|设置某个值|无返回值或返回是否设置成功或返回链式对象
load|加载某些数据|无返回值或返回是否加载完成的结果

例如：

```js
// 是否可写入
function canWrite() {
    return true;
}

// 获取用户名称
function getUserName() {
    return this.userName;
}
```

+ 优先使用函数式编程

```js
for(let i =0;i<ageArr.length;i++){
    ageArr[i]+=1;
}
```

以上代码实现了将数组ageArr的所有元素分别加1，但一看到for循环是不是很头疼？以上代码可以优化为：

```js
ageArr.map(item => ++item);
```

+ 函数中不要过多的采用if else ..

```js
if (userAge === 1) {
    // 你的代码
} else if (userAge === 2) {
    // 你的代码
} else if (userAge === 3) {
    // 你的代码
} else {
    // 你的代码 
}
```

以上代码if else过多，建议采用：

```js
switch (userAge){
    case 1:
        // 你的代码
    case 2:
        // 你的代码
    case 3:
        // 你的代码
    default:
        // 你的代码
}
```

或者：

```js
let handler={
    1:()=>{
        //你的代码
    },
    2:()=>{
        //你的代码
    },
    3:()=>{
        //你的代码
    },
    default:()=>{
        //你的代码
    }
}
handler[ageArr]() || handler["default"]()
```

+ 尽量使用箭头函数（不解释）

## 构造函数（大驼峰式命名）

```js
function Student(name) {
    var _name = name; // 私有成员
    
    // 公共方法
    this.getName = function () {
        return _name;
    }

    // 公共方式
    this.setName = function (value) {
        _name = value;
    }
}
var st = new Student('tom');
st.setName('jerry');
console.log(st.getName()); // => jerry：输出_name私有变量的值
```

需要注意：1、构造函数首字母大写。2、私有成员属性或方法需要加上前缀_(下划线)

## 常量（名称全部大写）

全部使用大写字母和下划线来组合命名，下划线用以分割单词：

```js
var MAX_COUNT = 10;
var SITE_URL = 'http://www.zhangpeiyue.com';
```

## 注释

+ 单行注释

单独一行：//(双斜线)与注释文字之间保留一个空格。

```js
// 设置站点地址
var SITE_URL = 'http://www.zhangpeiyue.com';
```

在代码后面添加注释：//(双斜线)与代码之间保留一个空格，并且//(双斜线)与注释文字之间保留一个空格。

```js
var SITE_URL = 'http://www.zhangpeiyue.com'; // 设置站点地址
```

+ 多行注释

若开始(/*)和结束(*/)都在一行，建议采用单行注释。
若至少三行注释时，第一行为/*，最后行为*/，其他行以*开始，并且注释文字与*保留一个空格。

```js
/*
* 代码执行到这里后会调用setTitle()函数
* setTitle()：设置title的值
*/
setTitle();
```