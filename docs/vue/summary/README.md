# 个人的vue使用感悟

## 对vue中nextTick()的理解及使用场景说明

**异步更新队列：**

请记住：**vue是依靠数据驱动视图更新的，该更新的过程是异步的**。即：当侦听到你的数据发生变化时， Vue将开启一个队列（该队列被Vue官方称为异步更新队列）。视图需要等队列中所有数据变化完成之后，再统一进行更新。示例：

```js
<div id="myApp">
    <input type="button" value="点我呀" @click="changeStr">
    <p ref="myP">{{str}}</p>
</div>
<script>
    new Vue({
        el:"#myApp",
        data:{
            str:"公众号，关注它的人很少！"
        },
        methods:{
            changeStr(){
                this.str = "收看更多精彩内容！";
                // 输出结果：公众号，关注它的人很少！
                console.log(this.$refs.myP.innerText)
            }
        }
    })
</script>
```

通过以上示例的输出结果可以有力证明：**Vue 实现的响应式并不是数据发生变化之后视图立即变化。**

**获取更新之后的DOM**

Vue官方为了避免开发者直接接触视图，鼓励大家以"数据驱动"的方式进行思考。但，现在的我们想基于更新后的视图来搞点事情，该如何下手？

我们可以使用<font color=#c7254e >$nextTick(callback)</font>。这里的回调函数（callback）将在数据更新完成，视图更新完毕之后被调用。

更改上个示例中的changeStr方法如下：

```js
changeStr(){
    this.str = "收看更多精彩内容！";
    this.$nextTick(()=>{
        // 输出结果：我爱你中国，我亲爱的母亲！
        console.log(this.$refs.myP.innerText);
    });
    this.str = "我爱你中国，我亲爱的母亲！"
}
```

从输出的结果可以看出：我们可以通过<font color=#c7254e >$nextTick()</font> 获取到更新之后的DOM。

因为 <font color=#c7254e >$nextTick()</font> 返回一个 Promise 对象，所以我们也可以使用<font color=#c7254e >async/await</font>语法完成相同的事情：

```js
changeStr:async function(){
    this.str = "欢迎关注公众号，收看更多精彩内容！";
    this.str = "我爱你中国，我亲爱的母亲！"
    await this.$nextTick();
    console.log(this.$refs.myP.innerText);
}
```

或者

```js
changeStr(){
    this.str = "欢迎关注公众号，收看更多精彩内容！";
    this.$nextTick().then(()=>{
        // 输出结果:我爱你中国，我亲爱的母亲！
        console.log(this.$refs.myP.innerText);
    });
    this.str = "我爱你中国，我亲爱的母亲！"
}
```

**应用场景**

+ 如果要在<font color=#c7254e >created()</font>钩子函数中进行的DOM操作，由于<font color=#c7254e >created()</font>钩子函数中还未对DOM进行任何渲染，所以无法直接操作，需要通过<font color=#c7254e >$nextTick()</font>来完成。

```js
created(){
    this.$nextTick(()=>{
        this.$refs.myP.innerText = "我是一只小小小小鸟，想要飞，却怎么样也飞不高！";
    });
}
```

注：在<font color=#c7254e >created()</font>钩子函数中进行的DOM操作，不使用<font color=#c7254e >$nextTick()</font>会报错：

```js
//  Error in created hook: "TypeError: Cannot set property 'innerText' of undefined"
created(){
    this.$refs.myP.innerText = "我是一只小小小小鸟，想要飞，却怎么样也飞不高！";
}
```

+ 更新数据后，想要使用js对新的视图进行操作时。示例（略）

+ 在使用某些第三方插件时 ，这些插件需要dom动态变化后重新应用该插件，这时候就需要使用<font color=#c7254e >$nextTick()</font>来重新应用插件的方法。示例（略）

## JS方法Object.defineProperty详解及VUE.JS双向绑定原理

::: tip
Object.defineProperty是一个很了不起的方法。vue.js之所以能够实现双向绑定便是拜它所赐！defineProperty直接翻译过来即是“定义属性”，不过该方法可不仅仅是定义属性这么简单，咱们还可以通过它来对属性进行拦截设置！
:::

我们知道对象是由多个键/值对组成的无序集合。对象当中的属性可以是任意类型的值。我们可以通过构造函数以及字面量的形式来定义对象。

```js
var obj={};//或obj=new Object;
// 添加属性（描述）
obj.userName="laotie";//或 obj["userName"]="laotie"
// 添加方法（行为）
obj.run=function(){};//或 obj["run"]=function(){};
```

为对象增加属性的方法除了上面的方式外，咱们还可以通过Object.defineProperty来定义新属性，或者对原属性进行修改。

**Object.defineProperty()**

**语法：**

+ Object.defineProperty(obj, prop, descriptor)

**参数说明：**

+ obj：必需。目标对象
+ prop：必需。需定义或修改的属性的名字
+ escriptor：必需。目标属性所拥有的特性
前两个参数不多说了，看代码就明白了，我们主要看第三个参数descriptor，看看它是个什么鬼！

1. **value**

通过value可以为对象设置属性，对应的值可以是任意类型，默认为undefined

```JS
var obj={};
console.log(obj.userName);// undefined
Object.defineProperty(obj,"userName",{
    value:"laozhang"
});
console.log(obj.userName);// laozhang
```

**可以对原有值进行修改：**

```js
var obj={};
obj.userName="laoli"
console.log(obj.userName);// laoli
Object.defineProperty(obj,"userName",{
    value:"laozhang"
});
console.log(obj.userName);// laozhang
```

**返回的值为传入函数的对象，即第一个参数obj：**

```js
var obj={};
var obj2=Object.defineProperty(obj,"userName",{
    value:"laozhang"
});
console.log(obj==obj2);// true
```

2. **writable**

用于设置属性的值是否允许被重写。true为允许，false不允许被重写，默认为false

**设置为false不允许被重写，并没有错误抛出**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    writable:false
});
obj.userName="laoliu";
console.log(obj.userName);// laozhang
```

**如果在严格描述下会报错：**

```js
"use strict";
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    writable:false
});
obj.userName="laoliu";
//报错：TypeError: Cannot assign to read only property 'userName' of object
```

**默认为false，值不允许被修改**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang"
});
obj.userName="laoliu";
console.log(obj.userName);// laozhang
```

**设置为true,允许被修改**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    writable:true
});
obj.userName="laoliu";
console.log(obj.userName);// laoliu
```

3. **enumerable**

该描述决定着指定的属性是否允许被枚举（使用for...in或Object.keys()）。设置为true可以被枚举；设置为false，不能被枚举。默认为false。

**设置为false不允许被枚举**

```js
var obj={
    age:18
};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    writable:false,
    enumerable:false
});
for(var key in obj){
    console.log(key,obj[key])// age 18
}
console.log(Object.keys(obj));//[ 'age' ]
```

**默认值为false, 不允许被枚举**

```js
var obj={
    age:18
};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    writable:false
});
for(var key in obj){
    console.log(key,obj[key])// age 18
}
console.log(Object.keys(obj));//[ 'age' ]
```

**设置为true,允许被枚举**

```js
var obj={
    age:18
};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    writable:false,
    enumerable:true
});
for(var key in obj){
    /*  age 18 
        userName laozhang*/ 
    console.log(key,obj[key]);
}
console.log(Object.keys(obj));//[ 'age', 'userName' ]
```

4. **configurable**

configurable是一个总开关，一旦你将它设置为false，就不能删除指定的属性也不能再设置他的（value，writable，configurable），设置为true，允许被删除，也允许被设置。

**为false不允许被删除，不会报错**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    configurable:false
});
delete obj.userName;
console.log(obj.userName);//laozhang
```

**为false不允许被重新设置，会报错**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    configurable:false
});
Object.defineProperty(obj,"userName",{
    value:"laoli"
});
//报错：TypeError: Cannot redefine property: userName
```

**为true时，允许被删除**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    configurable:true
});
delete obj.userName;
console.log(obj.userName);//undefined
```

**为true时，允许被重新设置**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"laozhang",
    configurable:true
});
Object.defineProperty(obj,"userName",{
    value:"laoli"
});
console.log(obj.userName);//laoli
```

5. **get/set存取器描述**

当你需要设置或获取对象的某个属性值的时候，可以使用该方法

```js
var obj={};
var initValue="xixi";
Object.defineProperty(obj,"userName",{
    get(){
        // 当读取userName时会有输出
        console.log("执行了get");
        return initValue;
    },
    set(newValue){
        // newValue为写入的值
        console.log("执行了set");
        initValue= newValue+"吧！"
    }
});

/*  执行了get
    xixi */
console.log(obj.userName);

obj.userName="爱我";// 执行了set

/*  执行了get
    爱我吧！ */
console.log(obj.userName);
```

**get或set不是必须成对出现，任写其一就可以。**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    get(){
        return "lala"
    }
});
console.log(obj.userName);//lala
```

**当使用了get或set方法，不允许使用writable和value这两个属性**

```js
var obj={};
Object.defineProperty(obj,"userName",{
    value:"xixi",
    get(){
        return "lala"
    }
});
console.log(obj.userName);
/*报错：Invalid property descriptor. Cannot both specify accessors and a value or writable
attribute*/
```

接下来看个实例：

```js
var obj={};
var userName="";
var userArr=[];
Object.defineProperty(obj,"userName",{
    get(){
        return userName;
    },
    set(value){
        userArr.push(value);
        userName=value;
    }
});
obj.userName="张三";
obj.userName="李四";
obj.userName="王五";
console.log(userArr);// [ '张三', '李四', '王五' ]
```

以上实例通过存取器成功将userName曾经拥有过的值进行了存储。是不是很神奇，很简单?

**接下来，咱们可以通过defineProperty模拟下VUE.JS的双向绑定：**

```js
<body>
<input type="text" id="myInp"/>
<div id="myDiv"></div>
</body>
<script>
       var myInp=document.querySelector("#myInp");
       var myDiv=document.querySelector("#myDiv");
       var obj={
           v:"haha"
       }
       myInp.value=obj.v;
       myDiv.innerHTML=obj.v;

       Object.defineProperty(obj,"v",{
           set:function(v){
               myDiv.innerHTML=myInp.value=v;
           }
       })
       myInp.onkeyup=function(e){
           console.log(e.target.value);
           obj.v=e.target.value;
       }
</script>
```

好了，马上就结束了。可能有的小伙伴会想，既然这个Object.defineProperty如此强大，每次只能设置一个属性吗？那么这玩意儿用起来也挺费劲的！那么现在大咖上场：Object.defineProperties()。你可以通过该大咖同时设置多个对象描述。

```js
var obj = new Object();
Object.defineProperties(obj, {
    name: {
        value: '张三',
        configurable: false,
        writable: true,
        enumerable: true
    },
    age: {
        value: 18,
        configurable: true
    }
})
console.log(obj.name, obj.age) // 张三, 18
```