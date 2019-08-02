# js 基础

## 函数表达式和函数声明

在 ECMAScript 中，创建函数的最常用的两个方法是函数表达式和函数声明，两者期间的区别是有点晕，因为 ECMA 规范只明确了一点：函数声明必须带有标示符（Identifier）（就是大家常说的函数名称），而函数表达式则可以省略这个标示符：

**函数声明:**

function 函数名称 (参数：可选){ 函数体 }

**函数表达式：**

function 函数名称（可选）(参数：可选){ 函数体 }

所以，可以看出，如果不声明函数名称，它肯定是表达式，可如果声明了函数名称的话，如何判断是函数声明还是函数表达式呢？ECMAScript 是通过上下文来区分的，如果 function foo(){}是作为赋值表达式的一部分的话，那它就是一个函数表达式，如果 function foo(){}被包含在一个函数体内，或者位于程序的最顶部的话，那它就是一个函数声明。

```js
function foo() {} // 声明，因为它是程序的一部分
var bar = function foo() {} // 表达式，因为它是赋值表达式的一部分

new (function bar() {})() // 表达式，因为它是new表达式
;(function() {
  function bar() {} // 声明，因为它是函数体的一部分
})()
```

还有一种函数表达式不太常见，就是被括号括住的(function foo(){})，他是表达式的原因是因为括号 ()是一个分组操作符，它的内部只能包含表达式，我们来看几个例子：

```js
 function foo(){} // 函数声明
  (function foo(){}); // 函数表达式：包含在分组操作符内

  try {
    (var x = 5); // 分组操作符，只能包含表达式而不能包含语句：这里的var就是语句
  } catch(err) {
    // SyntaxError
  }
```

你可以会想到，在使用 eval 对 JSON 进行执行的时候，JSON 字符串通常被包含在一个圆括号里：eval('(' + json + ')')，这样做的原因就是因为分组操作符，也就是这对括号，会让解析器强制将 JSON 的花括号解析成表达式而不是代码块。

```js
  try {
    { "x": 5 }; // "{" 和 "}" 做解析成代码块
  } catch(err) {
    // SyntaxError
  }

  ({ "x": 5 }); // 分组操作符强制将"{" 和 "}"作为对象字面量来解析
```

表达式和声明存在着十分微妙的差别，首先，函数声明会在任何表达式被解析和求值之前先被解析和求值，即使你的声明在代码的最后一行，它也会在同作用域内第一个表达式之前被解析/求值，参考如下例子，函数 fn 是在 alert 之后声明的，但是在 alert 执行的时候，fn 已经有定义了：

```js
alert(fn())

function fn() {
  return "Hello world!"
}
```

另外，还有一点需要提醒一下，函数声明在条件语句内虽然可以用，但是没有被标准化，也就是说不同的环境可能有不同的执行结果，所以这样情况下，最好使用函数表达式：

```js
// 千万别这样做！
// 因为有的浏览器会返回first的这个function，而有的浏览器返回的却是第二个

if (true) {
  function foo() {
    return "first"
  }
} else {
  function foo() {
    return "second"
  }
}
foo()

// 相反，这样情况，我们要用函数表达式
var foo
if (true) {
  foo = function() {
    return "first"
  }
} else {
  foo = function() {
    return "second"
  }
}
foo()
```

函数声明的实际规则如下：

**函数声明只能出现在程序或函数体内。从句法上讲，它们 不能出现在 Block（块）（{ ... }）中，例如不能出现在 if、while 或 for 语句中。因为 Block（块） 中只能包含 Statement 语句， 而不能包含函数声明这样的源元素。另一方面，仔细看一看规则也会发现，唯一可能让表达式出现在 Block（块）中情形，就是让它作为表达式语句的一部分。但是，规范明确规定了表达式语句不能以关键字 function 开头。而这实际上就是说，函数表达式同样也不能出现在 Statement 语句或 Block（块）中（因为 Block（块）就是由 Statement 语句构成的）。**

### 函数语句

在 ECMAScript 的语法扩展中，有一个是函数语句，目前只有基于 Gecko 的浏览器实现了该扩展，所以对于下面的例子，我们仅是抱着学习的目的来看，一般来说不推荐使用（除非你针对 Gecko 浏览器进行开发）。

1. 一般语句能用的地方，函数语句也能用，当然也包括 Block 块中：

```js
if (true) {
  function f() {}
} else {
  function f() {}
}
```

2. 函数语句可以像其他语句一样被解析，包含基于条件执行的情形

```js
if (true) {
  function foo() {
    return 1
  }
} else {
  function foo() {
    return 2
  }
}
foo() // 1
// 注：其它客户端会将foo解析成函数声明
// 因此，第二个foo会覆盖第一个，结果返回2，而不是1
```

3. 函数语句不是在变量初始化期间声明的，而是在运行时声明的——与函数表达式一样。不过，函数语句的标识符一旦声明能在函数的整个作用域生效了。标识符有效性正是导致函数语句与函数表达式不同的关键所在（下一小节我们将会展示命名函数表达式的具体行为）。

```js
// 此刻，foo还没用声明
typeof foo // "undefined"
if (true) {
  // 进入这里以后，foo就被声明在整个作用域内了
  function foo() {
    return 1
  }
} else {
  // 从来不会走到这里，所以这里的foo也不会被声明
  function foo() {
    return 2
  }
}
typeof foo // "function"
```

不过，我们可以使用下面这样的符合标准的代码来模式上面例子中的函数语句：

```js
var foo
if (true) {
  foo = function foo() {
    return 1
  }
} else {
  foo = function foo() {
    return 2
  }
}
```

4. 函数语句和函数声明（或命名函数表达式）的字符串表示类似，也包括标识符：

```js
if (true) {
  function foo() {
    return 1
  }
}
String(foo) // function foo() { return 1; }
```

5. 另外一个，早期基于 Gecko 的实现（Firefox 3 及以前版本）中存在一个 bug，即函数语句覆盖函数声明的方式不正确。在这些早期的实现中，函数语句不知何故不能覆盖函数声明：

```js
// 函数声明
function foo() {
  return 1
}
if (true) {
  // 用函数语句重写
  function foo() {
    return 2
  }
}
foo() // FF3以下返回1，FF3.5以上返回2

// 不过，如果前面是函数表达式，则没用问题
var foo = function() {
  return 1
}
if (true) {
  function foo() {
    return 2
  }
}
foo() // 所有版本都返回2
```

再次强调一点，上面这些例子只是在某些浏览器支持，所以推荐大家不要使用这些，除非你就在特性的浏览器上做开发。

### 命名函数表达式

函数表达式在实际应用中还是很常见的，在 web 开发中友个常用的模式是基于对某种特性的测试来伪装函数定义，从而达到性能优化的目的，但由于这种方式都是在同一作用域内，所以基本上一定要用函数表达式：

```js
// 该代码来自Garrett Smith的APE Javascript library库(http://dhtmlkitchen.com/ape/)
var contains = (function() {
  var docEl = document.documentElement

  if (typeof docEl.compareDocumentPosition != "undefined") {
    return function(el, b) {
      return (el.compareDocumentPosition(b) & 16) !== 0
    }
  } else if (typeof docEl.contains != "undefined") {
    return function(el, b) {
      return el !== b && el.contains(b)
    }
  }
  return function(el, b) {
    if (el === b) return false
    while (el != b && (b = b.parentNode) != null);
    return el === b
  }
})()
```

提到命名函数表达式，理所当然，就是它得有名字，前面的例子 var bar = function foo(){};就是一个有效的命名函数表达式，但有一点需要记住：这个名字只在新定义的函数作用域内有效，因为规范规定了标示符不能在外围的作用域内有效：

```js
var f = function foo() {
  return typeof foo // foo是在内部作用域内有效
}
// foo在外部用于是不可见的
typeof foo // "undefined"
f() // "function"
```

既然，这么要求，那命名函数表达式到底有啥用啊？为啥要取名？

正如我们开头所说：给它一个名字就是可以让调试过程更方便，因为在调试的时候，如果在调用栈中的每个项都有自己的名字来描述，那么调试过程就太爽了，感受不一样嘛。

### 调试器中的函数名

如果一个函数有名字，那调试器在调试的时候会将它的名字显示在调用的栈上。有些调试器（Firebug）有时候还会为你们函数取名并显示，让他们和那些应用该函数的便利具有相同的角色，可是通常情况下，这些调试器只安装简单的规则来取名，所以说没有太大价格，我们来看一个例子：

```js
function foo() {
  return bar()
}
function bar() {
  return baz()
}
function baz() {
  debugger
}
foo()

// 这里我们使用了3个带名字的函数声明
// 所以当调试器走到debugger语句的时候，Firebug的调用栈上看起来非常清晰明了
// 因为很明白地显示了名称
baz
bar
foo
expr_test.html()
```

通过查看调用栈的信息，我们可以很明了地知道 foo 调用了 bar, bar 又调用了 baz（而 foo 本身有在 expr_test.html 文档的全局作用域内被调用），不过，还有一个比较爽地方，就是刚才说的 Firebug 为匿名表达式取名的功能：

```js
function foo() {
  return bar()
}
var bar = function() {
  return baz()
}
function baz() {
  debugger
}
foo()

// Call stack
baz
bar() //看到了么？
foo
expr_test.html()
```

然后，当函数表达式稍微复杂一些的时候，调试器就不那么聪明了，我们只能在调用栈中看到问号：

```js
function foo(){
    return bar();
  }
  var bar = (function(){
    if (window.addEventListener) {
      return function(){
        return baz();
      };
    }
    else if (window.attachEvent) {
      return function() {
        return baz();
      };
    }
  })();
  function baz(){
    debugger;
  }
  foo();

  // Call stack
  baz
  (?)() // 这里可是问号哦
  foo
  expr_test.html()
```

另外，当把函数赋值给多个变量的时候，也会出现令人郁闷的问题：

```js
function foo() {
  return baz()
}
var bar = function() {
  debugger
}
var baz = bar
bar = function() {
  alert("spoofed")
}
foo()

// Call stack:
bar()
foo
expr_test.html()
```

这时候，调用栈显示的是 foo 调用了 bar，但实际上并非如此，之所以有这种问题，是因为 baz 和另外一个包含 alert('spoofed')的函数做了引用交换所导致的。

归根结底，只有给函数表达式取个名字，才是最委托的办法，也就是使用命名函数表达式。我们来使用带名字的表达式来重写上面的例子（注意立即调用的表达式块里返回的 2 个函数的名字都是 bar）：

```js
function foo() {
  return bar()
}
var bar = (function() {
  if (window.addEventListener) {
    return function bar() {
      return baz()
    }
  } else if (window.attachEvent) {
    return function bar() {
      return baz()
    }
  }
})()
function baz() {
  debugger
}
foo()

// 又再次看到了清晰的调用栈信息了耶!
baz
bar
foo
expr_test.html()
```

### JScript 的 Bug

比较恶的是，IE 的 ECMAScript 实现 JScript 严重混淆了命名函数表达式，搞得现很多人都出来反对命名函数表达式，而且即便是最新的一版（IE8 中使用的 5.8 版）仍然存在下列问题。

下面我们就来看看 IE 在实现中究竟犯了那些错误，俗话说知已知彼，才能百战不殆。我们来看看如下几个例子：

1. 函数表达式的标示符泄露到外部作用域

```js
var f = function g() {}
typeof g // "function"
```

上面我们说过，命名函数表达式的标示符在外部作用域是无效的，但 JScript 明显是违反了这一规范，上面例子中的标示符 g 被解析成函数对象，这就乱了套了，很多难以发现的 bug 都是因为这个原因导致的。

<font color="red">注：IE9 貌似已经修复了这个问题</font>

2. 将命名函数表达式同时当作函数声明和函数表达式

```js
typeof g // "function"
var f = function g() {}
```

特性环境下，函数声明会优先于任何表达式被解析，上面的例子展示的是 JScript 实际上是把命名函数表达式当成函数声明了，因为它在实际声明之前就解析了 g。

3. 命名函数表达式会创建两个截然不同的函数对象！

```js
var f = function g() {}
f === g // false

f.expando = "foo"
g.expando // undefined
```

看到这里，大家会觉得问题严重了，因为修改任何一个对象，另外一个没有什么改变，这太恶了。通过这个例子可以发现，创建 2 个不同的对象，也就是说如果你想修改 f 的属性中保存某个信息，然后想当然地通过引用相同对象的 g 的同名属性来使用，那问题就大了，因为根本就不可能。

4. 仅仅顺序解析函数声明而忽略条件语句块

```js
var f = function g() {
  return 1
}
if (false) {
  f = function g() {
    return 2
  }
}
g() // 2
```

这个 bug 查找就难多了，但导致 bug 的原因却非常简单。首先，g 被当作函数声明解析，由于 JScript 中的函数声明不受条件代码块约束，所以在这个很恶的 if 分支中，g 被当作另一个函数 function g(){ return 2 }，也就是又被声明了一次。然后，所有“常规的”表达式被求值，而此时 f 被赋予了另一个新创建的对象的引用。由于在对表达式求值的时候，永远不会进入“这个可恶 if 分支，因此 f 就会继续引用第一个函数 function g(){ return 1 }。分析到这里，问题就很清楚了：假如你不够细心，在 f 中调用了 g，那么将会调用一个毫不相干的 g 函数对象。

你可能会文，将不同的对象和 arguments.callee 相比较时，有什么样的区别呢？我们来看看：

```js
var f = function g() {
  return [arguments.callee == f, arguments.callee == g]
}
f() // [true, false]
g() // [false, true]
```

可以看到，arguments.callee 的引用一直是被调用的函数，实际上这也是好事，稍后会解释。

还有一个有趣的例子，那就是在不包含声明的赋值语句中使用命名函数表达式：

```js
;(function() {
  f = function f() {}
})()
```

按照代码的分析，我们原本是想创建一个全局属性 f（注意不要和一般的匿名函数混淆了，里面用的是带名字的生命），JScript 在这里捣乱了一把，首先他把表达式当成函数声明解析了，所以左边的 f 被声明为局部变量了（和一般的匿名函数里的声明一样），然后在函数执行的时候，f 已经是定义过的了，右边的 function f(){}则直接就赋值给局部变量 f 了，所以 f 根本就不是全局属性。

了解了 JScript 这么变态以后，我们就要及时预防这些问题了，首先防范标识符泄漏带外部作用域，其次，应该永远不引用被用作函数名称的标识符；还记得前面例子中那个讨人厌的标识符 g 吗？——如果我们能够当 g 不存在，可以避免多少不必要的麻烦哪。因此，关键就在于始终要通过 f 或者 arguments.callee 来引用函数。如果你使用了命名函数表达式，那么应该只在调试的时候利用那个名字。最后，还要记住一点，一定要把命名函数表达式声明期间错误创建的函数清理干净。

对于，上面最后一点，我们还得再解释一下。

### JScript 的内存管理

知道了这些不符合规范的代码解析 bug 以后，我们如果用它的话，就会发现内存方面其实是有问题的，来看一个例子：

```js
var f = (function() {
  if (true) {
    return function g() {}
  }
  return function g() {}
})()
```

我们知道，这个匿名函数调用返回的函数（带有标识符 g 的函数），然后赋值给了外部的 f。我们也知道，命名函数表达式会导致产生多余的函数对象，而该对象与返回的函数对象不是一回事。所以这个多余的 g 函数就死在了返回函数的闭包中了，因此内存问题就出现了。这是因为 if 语句内部的函数与 g 是在同一个作用域中被声明的。这种情况下 ，除非我们显式断开对 g 函数的引用，否则它一直占着内存不放。

```js
var f = (function() {
  var f, g
  if (true) {
    f = function g() {}
  } else {
    f = function g() {}
  }
  // 设置g为null以后它就不会再占内存了
  g = null
  return f
})()
```

通过设置 g 为 null，垃圾回收器就把 g 引用的那个隐式函数给回收掉了，为了验证我们的代码，我们来做一些测试，以确保我们的内存被回收了。

测试很简单，就是命名函数表达式创建 10000 个函数，然后把它们保存在一个数组中。等一会儿以后再看这些函数到底占用了多少内存。然后，再断开这些引用并重复这一过程。下面是测试代码：

```js
function createFn() {
  return (function() {
    var f
    if (true) {
      f = function F() {
        return "standard"
      }
    } else if (false) {
      f = function F() {
        return "alternative"
      }
    } else {
      f = function F() {
        return "fallback"
      }
    }
    // var F = null;
    return f
  })()
}

var arr = []
for (var i = 0; i < 10000; i++) {
  arr[i] = createFn()
}
```

通过运行在 Windows XP SP2 中的任务管理器可以看到如下结果：

```js
 IE6:

    without `null`:   7.6K -> 20.3K
    with `null`:      7.6K -> 18K

  IE7:

    without `null`:   14K -> 29.7K
    with `null`:      14K -> 27K
```

如我们所料，显示断开引用可以释放内存，但是释放的内存不是很多，10000 个函数对象才释放大约 3M 的内存，这对一些小型脚本不算什么，但对于大型程序，或者长时间运行在低内存的设备里的时候，这是非常有必要的。

## 全面解析 Module 模式

我们来看看 Module 模式的基本特征：

1. 模块化，可重用

2. 封装了变量和 function，和全局的 namaspace 不接触，松耦合

3. 只暴露可用 public 的方法，其它私有方法全部隐藏

关于 Module 模式，最早是由 YUI 的成员 Eric Miraglia 在 4 年前提出了这个概念，我们将从一个简单的例子来解释一下基本的用法（如果你已经非常熟悉了，请忽略这一节）。

### 基本用法

先看一下最简单的一个实现，代码如下：

```js
var Calculator = function(eq) {
  //这里可以声明私有成员

  var eqCtl = document.getElementById(eq)

  return {
    // 暴露公开的成员
    add: function(x, y) {
      var val = x + y
      eqCtl.innerHTML = val
    }
  }
}
```

我们可以通过如下的方式来调用：

```js
var calculator = new Calculator("eq")
calculator.add(2, 2)
```

大家可能看到了，每次用的时候都要 new 一下，也就是说每个实例在内存里都是一份 copy，如果你不需要传参数或者没有一些特殊苛刻的要求的话，我们可以在最后一个}后面加上一个括号，来达到自执行的目的，这样该实例在内存中只会存在一份 copy，不过在展示他的优点之前，我们还是先来看看这个模式的基本使用方法吧。

### 匿名闭包

匿名闭包是让一切成为可能的基础，而这也是 JavaScript 最好的特性，我们来创建一个最简单的闭包函数，函数内部的代码一直存在于闭包内，在整个运行周期内，该闭包都保证了内部的代码处于私有状态。

```js
;(function() {
  // ... 所有的变量和function都在这里声明，并且作用域也只能在这个匿名闭包里
  // ...但是这里的代码依然可以访问外部全局的对象
})()
```

注意，匿名函数后面的括号，这是 JavaScript 语言所要求的，因为如果你不声明的话，JavaScript 解释器默认是声明一个 function 函数，有括号，就是创建一个函数表达式，也就是自执行，用的时候不用和上面那样在 new 了，当然你也可以这样来声明：

```js
;(function() {
  /* 内部代码 */
})()
```

不过我们推荐使用第一种方式，关于函数自执行，我后面会有专门一篇文章进行详解，这里就不多说了。

### 引用全局变量

JavaScript 有一个特性叫做隐式全局变量，不管一个变量有没有用过，JavaScript 解释器反向遍历作用域链来查找整个变量的 var 声明，如果没有找到 var，解释器则假定该变量是全局变量，如果该变量用于了赋值操作的话，之前如果不存在的话，解释器则会自动创建它，这就是说在匿名闭包里使用或创建全局变量非常容易，不过比较困难的是，代码比较难管理，尤其是阅读代码的人看着很多区分哪些变量是全局的，哪些是局部的。

不过，好在在匿名函数里我们可以提供一个比较简单的替代方案，我们可以将全局变量当成一个参数传入到匿名函数然后使用，相比隐式全局变量，它又清晰又快，我们来看一个例子：

```js
;(function($, YAHOO) {
  // 这里，我们的代码就可以使用全局的jQuery对象了，YAHOO也是一样
})(jQuery, YAHOO)
```

现在很多类库里都有这种使用方式，比如 jQuery 源码。

不过，有时候可能不仅仅要使用全局变量，而是也想声明全局变量，如何做呢？我们可以通过匿名函数的返回值来返回这个全局变量，这也就是一个基本的 Module 模式，来看一个完整的代码：

```js
var blogModule = (function() {
  var my = {},
    privateName = "博客园"

  function privateAddTopic(data) {
    // 这里是内部处理代码
  }

  my.Name = privateName
  my.AddTopic = function(data) {
    privateAddTopic(data)
  }

  return my
})()
```

上面的代码声明了一个全局变量 blogModule，并且带有 2 个可访问的属性：blogModule.AddTopic 和 blogModule.Name，除此之外，其它代码都在匿名函数的闭包里保持着私有状态。同时根据上面传入全局变量的例子，我们也可以很方便地传入其它的全局变量。

### 高级用法

上面的内容对大多数用户已经很足够了，但我们还可以基于此模式延伸出更强大，易于扩展的结构，让我们一个一个来看。

### 扩展

Module 模式的一个限制就是所有的代码都要写在一个文件，但是在一些大型项目里，将一个功能分离成多个文件是非常重要的，因为可以多人合作易于开发。再回头看看上面的全局参数导入例子，我们能否把 blogModule 自身传进去呢？答案是肯定的，我们先将 blogModule 传进去，添加一个函数属性，然后再返回就达到了我们所说的目的，上代码：

```js
var blogModule = (function(my) {
  my.AddPhoto = function() {
    //添加内部代码
  }
  return my
})(blogModule)
```

这段代码，看起来是不是有 C#里扩展方法的感觉？有点类似，但本质不一样哦。同时尽管 var 不是必须的，但为了确保一致，我们再次使用了它，代码执行以后，blogModule 下的 AddPhoto 就可以使用了，同时匿名函数内部的代码也依然保证了私密性和内部状态。

### 松耦合扩展

上面的代码尽管可以执行，但是必须先声明 blogModule，然后再执行上面的扩展代码，也就是说步骤不能乱，怎么解决这个问题呢？我们来回想一下，我们平时声明变量的都是都是这样的：

```js
var cnblogs = cnblogs || {}
```

这是确保 cnblogs 对象，在存在的时候直接用，不存在的时候直接赋值为{}，我们来看看如何利用这个特性来实现 Module 模式的任意加载顺序：

```js
var blogModule = (function(my) {
  // 添加一些功能

  return my
})(blogModule || {})
```

通过这样的代码，每个单独分离的文件都保证这个结构，那么我们就可以实现任意顺序的加载，所以，这个时候的 var 就是必须要声明的，因为不声明，其它文件读取不到哦。

### 紧耦合扩展

虽然松耦合扩展很牛叉了，但是可能也会存在一些限制，比如你没办法重写你的一些属性或者函数，也不能在初始化的时候就是用 Module 的属性。紧耦合扩展限制了加载顺序，但是提供了我们重载的机会，看如下例子：

```js
var blogModule = (function(my) {
  var oldAddPhotoMethod = my.AddPhoto

  my.AddPhoto = function() {
    // 重载方法，依然可通过oldAddPhotoMethod调用旧的方法
  }

  return my
})(blogModule)
```

通过这种方式，我们达到了重载的目的，当然如果你想在继续在内部使用原有的属性，你可以调用 oldAddPhotoMethod 来用。

### 克隆与继承

```js
var blogModule = (function(old) {
  var my = {},
    key

  for (key in old) {
    if (old.hasOwnProperty(key)) {
      my[key] = old[key]
    }
  }

  var oldAddPhotoMethod = old.AddPhoto
  my.AddPhoto = function() {
    // 克隆以后，进行了重写，当然也可以继续调用oldAddPhotoMethod
  }

  return my
})(blogModule)
```

这种方式灵活是灵活，但是也需要花费灵活的代价，其实该对象的属性对象或 function 根本没有被复制，只是对同一个对象多了一种引用而已，所以如果老对象去改变它，那克隆以后的对象所拥有的属性或 function 函数也会被改变，解决这个问题，我们就得是用递归，但递归对 function 函数的赋值也不好用，所以我们在递归的时候 eval 相应的 function。不管怎么样，我还是把这一个方式放在这个帖子里了，大家使用的时候注意一下就行了。

### 跨文件共享私有对象

通过上面的例子，我们知道，如果一个 module 分割到多个文件的话，每个文件需要保证一样的结构，也就是说每个文件匿名函数里的私有对象都不能交叉访问，那如果我们非要使用，那怎么办呢？ 我们先看一段代码：

```js
var blogModule = (function(my) {
  var _private = (my._private = my._private || {}),
    _seal = (my._seal =
      my._seal ||
      function() {
        delete my._private
        delete my._seal
        delete my._unseal
      }),
    _unseal = (my._unseal =
      my._unseal ||
      function() {
        my._private = _private
        my._seal = _seal
        my._unseal = _unseal
      })

  return my
})(blogModule || {})
```

任何文件都可以对他们的局部变量\_private 设属性，并且设置对其他的文件也立即生效。一旦这个模块加载结束，应用会调用 blogModule.\_seal()"上锁"，这会阻止外部接入内部的\_private。如果这个模块需要再次增生，应用的生命周期内，任何文件都可以调用\_unseal() ”开锁”，然后再加载新文件。加载后再次调用 \_seal()”上锁”。

### 子模块

最后一个也是最简单的使用方式，那就是创建子模块

```js
blogModule.CommentSubModule = (function() {
  var my = {}
  // ...

  return my
})()
```

尽管非常简单，我还是把它放进来了，因为我想说明的是子模块也具有一般模块所有的高级使用方式，也就是说你可以对任意子模块再次使用上面的一些应用方法。
