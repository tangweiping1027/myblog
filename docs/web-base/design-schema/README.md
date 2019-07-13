# 设计模式

## 创建型

### 工厂模式

::: tip
工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象,用工厂方法代替 new 操作的一种模式。
:::

```js
class Creator {
  create(name) {
    return new Animal(name)
  }
}

class Animal {
  constructor(name) {
    this.name = name
  }
}

var creator = new Creator()

var duck = creator.create('Duck')
console.log(duck.name) // Duck

var chicken = creator.create('Chicken')
console.log(chicken.name) // Chicken
```

**小结**:

构造函数和创建者分离，对 new 操作进行封装符合开放封闭原则

### 单例模式

::: tip
单例模式的定义是：保证一个类只有一个实力，并提供一个访问它的全局访问点。
单利模式是一种常见的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏览器中的 window 对象。在 JavaScript 开发中，单例模式的用途同样非常广泛。试想一下，当我们
单机登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。
:::

举一个书中登录框的例子，代码如下:

```js
<!DOCTYPE html>
<html lang="en">

<body>
    <button id="btn">登录</button>
</body>
<script>
    class Login {
        createLayout() {
            var oDiv = document.createElement('div')
            oDiv.innerHTML = '我是登录框'
            document.body.appendChild(oDiv)
            oDiv.style.display = 'none'
            return oDiv
        }
    }

    class Single {
        getSingle(fn) {
            var result;
            return function() {
                return result || (result = fn.apply(this, arguments))
            }
        }
    }

    var oBtn = document.getElementById('btn')
    var single = new Single()
    var login = new Login()

    // 由于闭包，createLoginLayer对result的引用，所以当single.getSingle函数执行完之后，
    // 内存中并不会销毁result。

    // 当第二次以后点击按钮，根据createLoginLayer函数的作用域链中已经包含了result，所以
    // 直接返回result

    // 讲获取单例和创建登录框的方法解耦，符合开放封闭原则
    var createLoginLayer = single.getSingle(login.createLayout)
    oBtn.onclick = function() {
        var layout = createLoginLayer()
        layout.style.display = 'block'
    }
</script>

</html>

```

**小结**:

1.单例模式的主要思想就是，实例如果已经创建，则直接返回

```js
function creatSingleton() {
  var obj = null
  // 实例如已经创建过，直接返回
  if (!obj) {
    obj = xxx
  }
  return obj
}
```

2.符合开放封闭原则

### 原型模式

::: tip
用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。
:::

在 JavaScript 中，实现原型模式是在 ECMAScript5 中，提出的 [Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 方法，使用现有的对象来提供新创建的对象的。[百度百科](https://baike.baidu.com/item/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F/4941014?fr=aladdin)

```js
var prototype = {
  name: 'Jack',
  getName: function() {
    return this.name
  }
}

var obj = Object.create(prototype, {
  job: {
    value: 'IT'
  }
})

console.log(obj.getName()) // Jack
console.log(obj.job) // IT
console.log(obj.__proto__ === prototype) //true
```

::: tip
更多关于 prototype 的知识可以看我之前的[JavaScript 中的面向对象、原型、原型链、继承](https://segmentfault.com/a/1190000011363171)，下面列一下关于 prototype 的一些使用方法
:::

1. 方法继承

```js
var Parent = function() {}
Parent.prototype.show = function() {}
var Child = function() {}

// Child继承Parent的所有原型方法
Child.prototype = new Parent()
```

2. 所有函数默认继承 Object

```js
var Foo = function() {}
console.log(Foo.prototype.__proto__ === Object.prototype) // true
```

3. Object.create

```js
var proto = { a: 1 }
var propertiesObject = {
  b: {
    value: 2
  }
}
var obj = Object.create(proto, propertiesObject)
console.log(obj.__proto__ === proto) // true
```

4. isPrototypeOf

prototypeObj 是否在 obj 的原型链上

```js
prototypeObj.isPrototypeOf(obj)
```

5. instanceof

contructor.prototype 是否出现在 obj 的原型链上

```js
obj instanceof contructor
```

6. getPrototypeOf

Object.getPrototypeOf(obj) 方法返回指定对象 obj 的原型（内部[[Prototype]]属性的值）

```js
Object.getPrototypeOf(obj)
```

7. setPrototypeOf

设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或 null

```js
var obj = {}
var prototypeObj = {}
Object.setPrototypeOf(obj, prototypeObj)
console.log(obj.__proto__ === prototypeObj) // true
```

## 结构型

### 适配器模式

::: tip
适配器模式的作用是解决两个软件实体间的接口不兼容问题，使用适配器模式后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。
适配器的别名是包装器(wrapper)，这个一个相对简单的模式。在程序开发中有许多这样的场景：当我们试图调用模块或者对象的某个接口时，却突然发现这个接口的格式并不符合目前的需求。
这个时候就有两种解决办法，第一种是修改原来接口实现，但如果原来的模块很复杂，或者我们拿到的模块是一段别人编写的经过压缩的代码，修改原来接口显得不太现实，第二种办法是创建
一个适配器，将原来接口转换为客户希望的另一个接口，客户只需要和适配器打交道。
:::

举一个书中渲染地图的例子

```js
class GooleMap {
  show() {
    console.log('渲染谷歌地图')
  }
}

class BaiduMap {
  show() {
    console.log('渲染百度地图')
  }
}

function render(map) {
  if (map.show instanceof Function) {
    map.show()
  }
}

render(new GooleMap()) // 渲染谷歌地图
render(new BaiduMap()) // 渲染百度地图
```

但是假如 BaiduMap 类的原型方法不叫 show，而是叫 display，这时候就可以使用适配器模式了，因为我们不能轻易的改变第三方的内容。在 BaiduMap 的基础上封装一层，对外暴露 show 方法。

```js
class GooleMap {
  show() {
    console.log('渲染谷歌地图')
  }
}

class BaiduMap {
  display() {
    console.log('渲染百度地图')
  }
}

// 定义适配器类, 对BaiduMap类进行封装
class BaiduMapAdapter {
  show() {
    var baiduMap = new BaiduMap()
    return baiduMap.display()
  }
}

function render(map) {
  if (map.show instanceof Function) {
    map.show()
  }
}

render(new GooleMap()) // 渲染谷歌地图
render(new BaiduMapAdapter()) // 渲染百度地图
```

**小结:**

1. 适配器模式主要解决两个接口之间不匹配的问题，不会改变原有的接口，而是由一个对象对另一个对象的包装。

2. 适配器模式符合开放封闭原则

### 代理模式

::: tip
代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。
代理模式是一种非常有意义的模式，在生活当中可以找到很多代理模式的场景。比如，明星都有经纪人作为代理。如果想请明星来办一场商业演出，只能联系他的经纪人。经纪人
会把商业演出的细节和报酬都谈好之后，再把合同给明星签。
:::

本文举一个使用代理对象加载图片的例子来理解代理模式,当网络不好的时候，图片的加载需要一段时间，这就会产生空白，影响用户体验，这时候我们可在图片真正加载完之前，使用一张 loading 占位图片，等图片真正加载完再给图片设置 src 属性。

```js
class MyImage {
  constructor() {
    this.img = new Image()
    document.body.appendChild(this.img)
  }
  setSrc(src) {
    this.img.src = src
  }
}

class ProxyImage {
  constructor() {
    this.proxyImage = new Image()
  }

  setSrc(src) {
    let myImageObj = new MyImage()
    myImageObj.img.src = 'file://xxx.png' //为本地图片url
    this.proxyImage.src = src
    this.proxyImage.onload = function() {
      myImageObj.img.src = src
    }
  }
}

var proxyImage = new ProxyImage()
proxyImage.setSrc('http://xxx.png') //服务器资源url
```

本例中，本体类中有自己的 setSrc 方法，如果有一天网络速度已经不需要预加载了，我们可以直接使用本体对象的 setSrc 方法,，并且不需要改动本体类的代码，而且可以删除代理类。

```js
// 依旧可以满足需求
var myImage = new MyImage()
myImage.setSrc('http://qiniu.sunzhaoye.com/CORS.png')
```

**小结:**

1. 代理模式符合开放封闭原则

2. 本体对象和代理对象拥有相同的方法，在用户看来并不知道请求的本体对象还是代理对象。

## 行为型

### 策略模式

::: tip
定义一系列的算法，把它们一个个封装起来，并使它们可以替换
:::

```js
var fnA = function(val) {
  return val * 1
}

var fnB = function(val) {
  return val * 2
}

var fnC = function(val) {
  return val * 3
}

var calculate = function(fn, val) {
  return fn(val)
}

console.log(calculate(fnA, 100)) // 100
console.log(calculate(fnB, 100)) // 200
console.log(calculate(fnC, 100)) // 300
```

### 迭代器模式

::: tip
迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而不需要暴露该对象的内部对象表示。迭代器模式可以吧迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，
即使不关心对象的内部构造，也可以按顺序访问其中的每一个元素。
:::

直接上代码, 实现一个简单的迭代器

```js
class Creater {
  constructor(list) {
    this.list = list
  }

  // 创建一个迭代器，也叫遍历器
  createIterator() {
    return new Iterator(this)
  }
}

class Iterator {
  constructor(creater) {
    this.list = creater.list
    this.index = 0
  }

  // 判断是否遍历完数据
  isDone() {
    if (this.index >= this.list.length) {
      return true
    }
    return false
  }

  next() {
    return this.list[this.index++]
  }
}

var arr = [1, 2, 3, 4]

var creater = new Creater(arr)
var iterator = creater.createIterator()
console.log(iterator.list) // [1, 2, 3, 4]
while (!iterator.isDone()) {
  console.log(iterator.next())
  // 1
  // 2
  // 3
  // 4
}
```

**ES6 中的迭代器:**

**JavaScript 中的有序数据集合包括：**

- **Array**

- **Map**

- **Set**

- **String**

- **typeArray**

- **arguments**

- **NodeList**

**注意:** Object 不是有序数据集合

以上有序数据集合都部署了 Symbol.iterator 属性，属性值为一个函数，执行这个函数，返回一个迭代器，迭代器部署了 next 方法，调用迭代器的 next 方法可以按顺序访问子元素

以数组为例测试一下，在浏览器控制台中打印测试如下：

![如图](/log.png)

```js
var arr = [1, 2, 3, 4]

var iterator = arr[Symbol.iterator]()

console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next()) // {value: 2, done: false}
console.log(iterator.next()) // {value: 3, done: false}
console.log(iterator.next()) // {value: 4, done: false}
console.log(iterator.next()) // {value: undefined, done: true}
```

**小结：**

1. JavaScript 中的有序数据集合有 Array，Map，Set，String，typeArray，arguments，NodeList，不包括 Object

2. 任何部署了[Symbol.iterator]接口的数据都可以使用 for...of 循环遍历

3. 迭代器模式使目标对象和迭代器对象分离，符合开放封闭原则

### 观察者模式(发布-订阅模式)

::: tip
发布-订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变是，所依赖于它的对象都将得到通知。在 JavaScript 开发中，我们一般用事件模型来替代传统的发布-订阅模式
:::

先实现一个简单的发布-订阅模式，代码如下:

```js
class Event {
  constructor() {
    this.eventTypeObj = {}
  }
  on(eventType, fn) {
    if (!this.eventTypeObj[eventType]) {
      // 按照不同的订阅事件类型，存储不同的订阅回调
      this.eventTypeObj[eventType] = []
    }
    this.eventTypeObj[eventType].push(fn)
  }
  emit() {
    // 可以理解为arguments借用shift方法
    var eventType = Array.prototype.shift.call(arguments)
    var eventList = this.eventTypeObj[eventType]
    for (var i = 0; i < eventList.length; i++) {
      eventList[i].apply(eventList[i], arguments)
    }
  }
  remove(eventType, fn) {
    // 如果使用remove方法，fn为函数名称，不能是匿名函数
    var eventTypeList = this.eventTypeObj[eventType]
    if (!eventTypeList) {
      // 如果没有被人订阅改事件，直接返回
      return false
    }
    if (!fn) {
      // 如果没有传入取消订阅的回调函数，则改订阅类型的事件全部取消
      eventTypeList && (eventTypeList.length = 0)
    } else {
      for (var i = 0; i < eventTypeList.length; i++) {
        if (eventTypeList[i] === fn) {
          eventTypeList.splice(i, 1)
          // 删除之后，i--保证下轮循环不会漏掉没有被遍历到的函数名
          i--
        }
      }
    }
  }
}
var handleFn = function(data) {
  console.log(data)
}
var event = new Event()
event.on('click', handleFn)
event.emit('click', '1') // 1
event.remove('click', handleFn)
event.emit('click', '2') // 不打印
```

以上代码可以满足先订阅后发布，但是如果先发布消息，后订阅就不满足了。这时候我们可以稍微修改一下即可满足先发布后订阅，在发布消息时，把事件缓存起来，等有订阅者时再执行。代码如下：

```js
class Event {
  constructor() {
    this.eventTypeObj = {}
    this.cacheObj = {}
  }
  on(eventType, fn) {
    if (!this.eventTypeObj[eventType]) {
      // 按照不同的订阅事件类型，存储不同的订阅回调
      this.eventTypeObj[eventType] = []
    }
    this.eventTypeObj[eventType].push(fn)

    // 如果是先发布，则在订阅者订阅后，则根据发布后缓存的事件类型和参数，执行订阅者的回调
    if (this.cacheObj[eventType]) {
      var cacheList = this.cacheObj[eventType]
      for (var i = 0; i < cacheList.length; i++) {
        cacheList[i]()
      }
    }
  }
  emit() {
    // 可以理解为arguments借用shift方法
    var eventType = Array.prototype.shift.call(arguments)
    var args = arguments
    var that = this

    function cache() {
      if (that.eventTypeObj[eventType]) {
        var eventList = that.eventTypeObj[eventType]
        for (var i = 0; i < eventList.length; i++) {
          eventList[i].apply(eventList[i], args)
        }
      }
    }
    if (!this.cacheObj[eventType]) {
      this.cacheObj[eventType] = []
    }

    // 如果先订阅，则直接订阅后发布
    cache(args)

    // 如果先发布后订阅，则把发布的事件类型与参数保存起来，等到有订阅后执行订阅
    this.cacheObj[eventType].push(cache)
  }
}
```

**小结:**

1. 发布订阅模式可以使代码解耦，满足开放封闭原则

2. 当过多的使用发布订阅模式，如果订阅消息始终都没有触发，则订阅者一直保存在内存中。

### 命令模式

::: tip
在软件系统中，“**行为请求者**”与“**行动实现者**”通常呈现一种“**紧耦合**”。在某些场合，比如要对行为进行“记录、撤销/重做、事物”等处理，这种无法抵御变化的紧耦合是不合适的。
在这种情况下，如何将“**行为请求者**”与“**行动实现者**”解耦，将是一组行为抽象对象，实现二者之间的松耦合。这就是命令模式(Command Pattern)。
:::

在命令的发布者和接收者之间，定义一个命令对象，命令对象暴露出一个统一的接口给命令的发布者，而命令的发布者不用去管接收者是如何执行命令的，做到命令发布者和接收者的解耦。

举一个如果页面中有 3 个按钮，给不同按钮添加不同功能的例子，代码如下：

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>cmd-demo</title>
</head>
<body>
    <div>
        <button id="btn1">按钮1</button>
        <button id="btn2">按钮2</button>
        <button id="btn3">按钮3</button>
    </div>
    <script>
        var btn1 = document.getElementById('btn1')
        var btn2 = document.getElementById('btn2')
        var btn3 = document.getElementById('btn3')

        // 定义一个命令发布者(执行者)的类
        class Executor {
            setCommand(btn, command) {
                btn.onclick = function() {
                    command.execute()
                }
            }
        }

        // 定义一个命令接收者
        class Menu {
            refresh() {
                console.log('刷新菜单')
            }

            addSubMenu() {
                console.log('增加子菜单')
            }
        }

        // 定义一个刷新菜单的命令对象的类
        class RefreshMenu {
            constructor(receiver) {
                // 命令对象与接收者关联
                this.receiver = receiver
            }

            // 暴露出统一的接口给命令发布者Executor
            execute() {
                this.receiver.refresh()
            }
        }

        // 定义一个增加子菜单的命令对象的类
        class AddSubMenu {
            constructor(receiver) {
                // 命令对象与接收者关联
                this.receiver = receiver
            }
            // 暴露出统一的接口给命令发布者Executor
            execute() {
                this.receiver.addSubMenu()
            }
        }

        var menu = new Menu()
        var executor = new Executor()

        var refreshMenu = new RefreshMenu(menu)
        // 给按钮1添加刷新功能
        executor.setCommand(btn1, refreshMenu)

        var addSubMenu = new AddSubMenu(menu)
        // 给按钮2添加增加子菜单功能
        executor.setCommand(btn2, addSubMenu)

        // 如果想给按钮3增加删除菜单的功能，就继续增加删除菜单的命令对象和接收者的具体删除方法，而不必修改命令对象
    </script>
</body>
</html>
```

### 状态模式

::: tip
状态模式：状态模式允许一个对象在其内部状态改变的时候改变行为。这个对象看上去像是改变了它的类一样。状态模式把所研究的对象的行为包装在不同的状态对象里，每一个状态对象都属于一个抽象状态累
的一个子类。状态模式的意图是让一个对象在其内部状态改变的时候，其行为也随之改变。状态模式需要对每一个系统可能取得的状态创立一个状态类的子类。当系统的状态改变时，系统变改变所选的子类。
:::

举一个关于开关控制电灯的例子，电灯只有一个开关，第一次按下打开弱光，第二次按下打开强光，第三次按下关闭。

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>state-demo</title>
</head>

<body>
    <button id="btn">开关</button>
    <script>
        // 定义一个关闭状态的类
        class OffLightState {
            constructor(light) {
                this.light = light
            }
            // 每个类都需要这个方法，在不同状态下按都需要触发这个方法
            pressBtn() {
                this.light.setState(this.light.weekLightState)
                console.log('开启弱光')
            }
        }

        // 定义一个弱光状态的类
        class WeekLightState {
            constructor(light) {
                this.light = light
            }
            pressBtn() {
                this.light.setState(this.light.strongLightState)
                console.log('开启强光')
            }
        }

        // 定义一个强光状态的类
        class StrongLightState {
            constructor(light) {
                this.light = light
            }
            pressBtn() {
                this.light.setState(this.light.offLightState)
                console.log('关闭电灯')
            }
        }

        class Light {
            constructor() {
                this.offLightState = new OffLightState(this)
                this.weekLightState = new WeekLightState(this)
                this.strongLightState = new StrongLightState(this)
                this.currentState = null
            }
            setState(newState) {
                this.currentState = newState
            }
            init() {
                this.currentState = this.offLightState
            }
        }

        let light = new Light()
        light.init()
        var btn = document.getElementById('btn')
        btn.onclick = function() {
            light.currentState.pressBtn()
        }
    </script>
</body>

</html>
```

如果这时候需要增加一个超强光，则只需增加一个超强光的类，并添加 pressBtn 方法，改变强光状态下，点击开关需要把状态更改为超强光，超强光状态下，点击开关把状态改为关闭即可，其他代码都不需要改动。

```js
class StrongLightState {
  constructor(light) {
    this.light = light
  }
  pressBtn() {
    this.light.setState(this.light.superLightState)
    console.log('开启超强光')
  }
}

class SuperLightState {
  constructor(light) {
    this.light = light
  }
  pressBtn() {
    this.light.setState(this.light.offLightState)
    console.log('关闭电灯')
  }
}

class Light {
  constructor() {
    this.offLightState = new OffLightState(this)
    this.weekLightState = new WeekLightState(this)
    this.strongLightState = new StrongLightState(this)
    this.superLightState = new SuperLightState(this)
    this.currentState = null
  }
  setState(newState) {
    this.currentState = newState
  }
  init() {
    this.currentState = this.offLightState
  }
}
```

**小结：**

1. 通过定义不同的状态类，根据状态的改变而改变对象的行为，二不必把大量的逻辑都写在被操作对象的类中，而且容易增加新的状态

2. 符合开放封闭原则

参考文章：

- [JavaScript 中常用的设计模式](https://segmentfault.com/a/1190000017787537?utm_source=tag-newest)
- [JavaScript 设计模式与开发实践](https://book.douban.com/subject/26382780/)
- [深入理解 JavaScript 系列/设计模式--汤姆大叔的博客](http://www.cnblogs.com/TomXu/tag/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)
- [设计模式--菜鸟教程](http://www.runoob.com/design-pattern/design-pattern-tutorial.html)
- [JavaScript 中常见设计模式整理](https://segmentfault.com/a/1190000014919700)
- [ES6 入门--阮一峰](http://es6.ruanyifeng.com/)

感兴趣：

- [JavaScript 中常见设计模式整理](http://segmentfault.com/a/1190000014919700)
- [javascript 中的设计模式（一）](http://segmentfault.com/a/1190000007713139)
- [JavaScript 常用设计模式](http://segmentfault.com/a/1190000015437592)
- [【JS】常用设计模式](http://segmentfault.com/a/1190000013297339)
- [java 的常用设计模式](http://segmentfault.com/a/1190000008074146)
- [spring 中常用的设计模式及应用](http://segmentfault.com/a/1190000011758601)
- [设计模式---状态模式在 web 前端中的应用](http://segmentfault.com/a/1190000006074763)
- [javascript 中的设计模式（二）](http://segmentfault.com/a/1190000007998142)
