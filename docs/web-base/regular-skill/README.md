# 常用技巧

## 常用方法

**手机类型判断**

```js
var BrowserInfo = {
    userAgent: navigator.userAgent.toLowerCase()
    isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
    isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
    isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
    isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),
}
```

## 字符串长度

```js
/* 返回字符串长度，汉子计数为2  */
function strLength(str) {
  var a = 0
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) a += 2
    //按照预期计数增加2
    else a++
  }
  return a
}
```

## 获取 url 中的参数

```js
function GetQueryStringRegExp(name, url) {
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i")
  if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " "))
  return ""
}
```

## js 绑定事件

```js
/*适用于任何浏览器的元素绑定  */
function eventBind(obj, eventType, callBack) {
  if (obj.addEventListener) {
    obj.addEventListener(eventType, callBack, false)
  } else if (window.attachEvent) {
    obj.attachEvent("on" + eventType, callBack)
  } else {
    obj["on" + eventType] = callBack
  }
}
eventBind(document, "click", bodyClick)
```

## 获得当前浏览器 JS 的版本

```js
function getjsversion() {
  var n = navigator
  var u = n.userAgent
  var apn = n.appName
  var v = n.appVersion
  var ie = v.indexOf("MSIE ")
  if (ie > 0) {
    apv = parseInt((i = v.substring(ie + 5)))
    if (apv > 3) {
      apv = parseFloat(i)
    }
  } else {
    apv = parseFloat(v)
  }
  var isie = apn == "Microsoft Internet Explorer"
  var ismac = u.indexOf("Mac") >= 0
  var javascriptVersion = "1.0"
  if (String && String.prototype) {
    javascriptVersion = "1.1"
    if (javascriptVersion.match) {
      javascriptVersion = "1.2"
      var tm = new Date()
      if (tm.setUTCDate) {
        javascriptVersion = "1.3"
        if (isie && ismac && apv >= 5) javascriptVersion = "1.4"
        var pn = 0
        if (pn.toPrecision) {
          javascriptVersion = "1.5"
          a = new Array()
          if (a.forEach) {
            javascriptVersion = "1.6"
            i = 0
            o = new Object()
            tcf = new Function(
              "o",
              "var e,i=0;try{i=new Iterator(o)}catch(e){}return i"
            )
            i = tcf(o)
            if (i && i.next) {
              javascriptVersion = "1.7"
            }
          }
        }
      }
    }
  }
  return javascriptVersion
}
```

## 获取当前点击事件的 Object 对象

```js
function getEvent() {
  if (document.all) {
    return window.event //如果是ie
  }
  func = getEvent.caller
  while (func != null) {
    var arg0 = func.arguments[0]
    if (arg0) {
      if (
        arg0.constructor == Event ||
        arg0.constructor == MouseEvent ||
        (typeof arg0 == "object" && arg0.preventDefault && arg0.stopPropagation)
      ) {
        return arg0
      }
    }
    func = func.caller
  }
  return null
}
```

## 字符串截取方法

```js
getCharactersLen: function (charStr, cutCount) {
    if (charStr == null || charStr == '') return '';
    var totalCount = 0;
    var newStr = '';
    for (var i = 0; i < charStr.length; i++) {
        var c = charStr.charCodeAt(i);
        if (c < 255 && c > 0) {
            totalCount++;
        } else {
            totalCount += 2;
        }
        if (totalCount >= cutCount) {
            newStr += charStr.charAt(i);
            break;
        }
        else {
            newStr += charStr.charAt(i);
        }
    }
    return newStr;
}
```

## JS 弹出新窗口全屏

```js
var tmp = window.open("about:blank", "", "fullscreen=1")
tmp.moveTo(0, 0)
tmp.resizeTo(screen.width + 20, screen.height)
tmp.focus()
tmp.location.href =
  "http://www.che168.com/pinggu/eva_" + msgResult.message[0] + ".html"

var config_ =
  "left=0,top=0,width=" +
  window.screen.Width +
  ",height=" +
  window.screen.Height
window.open(
  "http://www.che168.com/pinggu/eva_" + msgResult.message[0] + ".html",
  "winHanle",
  config_
)
//模拟form提交打开新页面
var f = document.createElement("form")
f.setAttribute(
  "action",
  "http://www.che168.com/pinggu/eva_" + msgResult.message[0] + ".html"
)
f.target = "_blank"
document.body.appendChild(f)
f.submit()
```

## js 判断浏览器

```js
// 判断是否是 IE 浏览器
if (document.all){
    alert(”IE浏览器”);
}else{
    alert(”非IE浏览器”);
}
if (!!window.ActiveXObject){
    alert(”IE浏览器”);
}else{
    alert(”非IE浏览器”);
}
// 判断是IE几
var isIE=!!window.ActiveXObject;
var isIE6=isIE&&!window.XMLHttpRequest;
var isIE8=isIE&&!!document.documentMode;
var isIE7=isIE&&!isIE6&&!isIE8;
if (isIE){
  if (isIE6){
      alert(”ie6″);
  }else if (isIE8){
      alert(”ie8″);
  }else if (isIE7){
      alert(”ie7″);
  }
}
```

## 判断浏览器

```js
function getOs() {
  if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
    return "MSIE8"
  } else if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
    return "MSIE6"
  } else if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
    return "MSIE7"
  } else if ((isFirefox = navigator.userAgent.indexOf("Firefox") > 0)) {
    return "Firefox"
  }
  if (navigator.userAgent.indexOf("Chrome") > 0) {
    return "Chrome"
  } else {
    return "Other"
  }
}
```

## 移除事件

```js
this.moveBind = function(objId, eventType, callBack) {
  var obj = document.getElementById(objId)
  if (obj.removeEventListener) {
    obj.removeEventListener(eventType, callBack, false)
  } else if (window.detachEvent) {
    obj.detachEvent("on" + eventType, callBack)
  } else {
    obj["on" + eventType] = null
  }
}
```

## 回车提交

```js
$("id").onkeypress = function(event) {
  event = event ? event : window.event ? window.event : ""
  keyCode = event.keyCode
    ? event.keyCode
    : event.which
    ? event.which
    : event.charCode
  if (keyCode == 13) {
    $("SubmitLogin").onclick()
  }
}
```

## JS 执行计时器

```js
timeStart = new Date().getTime()
timesEnd = new Date().getTime()
document.getElementById("time").innerHTML = timesEnd - timeStart
```

## 获取当前时间

```js
function GetCurrentDate() {
  var d = new Date()
  var y = d.getYear() + 1900
  ;(month = add_zero(d.getMonth() + 1)),
    (days = add_zero(d.getDate())),
    (hours = add_zero(d.getHours()))
  ;(minutes = add_zero(d.getMinutes())), (seconds = add_zero(d.getSeconds()))
  var str =
    y + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds
  return str
}
function add_zero(temp) {
  if (temp < 10) return "0" + temp
  else return temp
}
```

## Js 去掉空格方法

```js
String.prototype.Trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "")
}
String.prototype.LTrim = function() {
  return this.replace(/(^\s*)/g, "")
}
String.prototype.RTrim = function() {
  return this.replace(/(\s*$)/g, "")
}
```

## js 获取 URL 中的参数及值

```js
function query(sHref = window.location.href) {
  var obj = {}
  var args = sHref.split("?")
  if (args[0] == sHref) return obj
  var arr = args[1].split("&")
  for (var i = 0; i < arr.length; i++) {
    var arg = arr[i].split("=")
    obj[arg[0]] = arg[1]
  }
  return obj
}
```

**或者**

```js
function parseQueryString() {
  let url = window.location.href
  let reg = /([^=?&]+)=([^&]*)/g,
    rest,
    obj = {}
  while ((rest = reg.exec(url))) {
    obj[rest[1]] = rest[2]
  }
  return obj
}
```

倘若你当前的地址是：http://zhangpeiyue.com/s?a=1&b=2

```js
var result = query()
console.log(result) // { a: '1', b: '2' }
```

当然你也可以指定地址：

```js
var result = query("http://zhangpeiyue.com/s?c=3&d=4")
console.log(result) // { c: '3', d: '4' }
```
