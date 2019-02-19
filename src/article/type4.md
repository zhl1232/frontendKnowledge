###### ARRON 2019 年 2 月 12 日   861字


在 对象 章节说过，对象一般有以下几个特点：
- 唯一标识性
- 有状态
- 有行为

基于类的的对象和基于原型的对象，都是顺应人类自然思维的产物。

“基于类”的编程提倡使用一个关注分类和类之间关系开发模型。在这类语言中，总是先有类，再从类去实例化一个对象。类与类之间又可能会形成继承、组合等关系。类又往往与语言的类型系统整合，形成一定编译时的能力。

与此相对，“基于原型”的编程看起来更为提倡程序员去关注一系列对象实例的行为，而后才去关心如何将这些对象，划分到最近的使用方式相似的原型对象，而不是将它们分成类。

### javascript的原型

不考虑复杂语法（如 new、Function Object、函数的 prototype 属性等），原型系统可以简单的用两条来概括：

- 所有对象都有私有字段 [[prototype]]，就是对象的原型；
- 读一个属性，如果对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止。

ES6之后，JS又提供了一系列操作原型的内置函数。

- Object.create 根据指定原型创建对象，原型可以为null
- Object.getPrototypeOf 获取一个对象的原型
- Object.setPrototypeOf 设置一个对象的原型

现在es6的class其实还是模拟基于类的面向对象，其实底层还是基于原型的。

下面的代码展示了用原型来抽象对象的例子。
```js
var cat = {
    say(){
        console.log("meow~");
    },
    jump(){
        console.log("jump");
    }
}

var tiger = Object.create(cat,  {
    say:{
        writable:true,
        configurable:true,
        enumerable:true,
        value:function(){
            console.log("roar!");
        }
    }
})


var anotherCat = Object.create(cat);

anotherCat.say();

var anotherTiger = Object.create(tiger);

anotherTiger.say();
```
### 早期版本中的类与原型

在早期JS版本中，“类”的定义是一个私有属性 [[class]]。内置类型可以使用Object.prototype.toString来访问[[class]]属性。

```js
var o = new Object;
var n = new Number;
var s = new String;
var b = new Boolean;
var d = new Date;
var arg = function(){ return arguments }();
var r = new RegExp;
var f = new Function;
var arr = new Array;
var e = new Error;
console.log([o, n, s, b, d, arg, r, f, arr, e].map(v => Object.prototype.toString.call(v))); 
```

在ES5之后，一些对象的[[class]]属性可以用Symbol.toStringTag来自定义。
```js
var o = { [Symbol.toStringTag]: "MyObject" }
console.log(o + "");  
// 加法字符串,对象拆箱会先调用Object.prototype.toString
// 结果返回 [object MyObject]
console.dir(o)   // Symbol(Symbol.toStringTag): "MyObject"

class ValidatorClass {
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}
// 也可以这样自定义类型标签
```

Symbol.toStringTag 只能更改自已创建的类，如果自己的类没有定义Symbol.toStringTag，toString会返回[object Object]
```js
class ValidatorClass {}

Object.prototype.toString.call(new ValidatorClass()); // "[object Object]"
```
大多数内置对象即使没有toStringTag 属性，也能被 toString() 方法识别并返回特定的类型标签
```js
Object.prototype.toString.call('foo');     // "[object String]"
Object.prototype.toString.call([1, 2]);    // "[object Array]"
Object.prototype.toString.call(3);         // "[object Number]"
Object.prototype.toString.call(true);      // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(null);      // "[object Null]"
```
另外一些对象类型则不然，toString() 方法能识别它们是因为引擎为它们设置好了 toStringTag 标签：
```js
Object.prototype.toString.call(new Map());       // "[object Map]"
Object.prototype.toString.call(function* () {}); // "[object GeneratorFunction]"
Object.prototype.toString.call(Promise.resolve()); // "[object Promise]"
```

### new

### 原型链

### ES6的类