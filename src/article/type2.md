###### ARRON 2019 年 2 月 14 日

语言和宿主的基础设施由对象来提供，并且 JavaScript 程序即是一系列互相通讯的对象集合。

Object（对象）在英文中，是一切事物的总称，这和面向对象编程的抽象思维有互通之处。

对象并不是计算机领域凭空造出来的概念，它是顺着人类思维模式产生的一种抽象（于是面向对象编程也被认为是：更接近人类思维模式的一种编程范式）。

### JavaScript 对象的特征

不论我们使用什么样的编程语言，参考 Grandy Booch《面向对象分析与设计》总结来看，对象有如下几个特点。
- 对象具有唯一标识性：即使完全相同的两个对象，也并非同一个对象。
- 对象有状态：对象具有状态，同一对象可能处于不同状态之下。
- 对象具有行为：即对象的状态，可能因为它的行为产生变迁。

javascript的对象唯一标识性
```
    var o1 = { a: 1 };
    var o2 = { a: 1 };
    console.log(o1 == o2); // false
```
关于对象的第二个和第三个特征“状态和行为”，不同语言会使用不同的术语来抽象描述它们。

在 JavaScript 中，将状态和行为统一抽象为“属性”。

```
    var o = { 
        d: 1,
        f() {
            console.log(this.d);
        }    
    };
```
对象o有d和f两个属性。

<strong>在实现了对象基本特征的基础上, 我认为，JavaScript 中对象独有的特色是：对象具有高度的动态性，这是因为 JavaScript 赋予了使用者在运行时为对象添改状态和行为的能力。</strong>

为了提高抽象能力，JavaScript 的属性被设计成比别的语言更加复杂的形式，它提供了数据属性和访问器属性（getter/setter）两类。

### JavaScript 对象的两类属性

对 JavaScript 来说，属性并非只是简单的名称和值，JavaScript 用一组特征（attribute）来描述属性（property）。

先来说第一类属性，数据属性。数据属性具有四个特征。

- value：就是属性的值。
- writeable：决定属性能否被赋值。
- enumerble：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值。

第二类属性是访问器属性（getter/setter）属性,它也有四个属性。
- getter：函数或 undefined，在取属性值时被调用。
- getter：函数或 undefined，在设置属性值时被调用。
- enumerble：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值。

访问器属性使得属性在读和写时执行代码，它允许使用者在写和读属性时，得到完全不同的值。

```
var o = {
  a: 7,
  get b() { 
    return this.a + 1;
  },
  set c(x) {
    this.a = x / 2
  }
};

console.log(o.a); // 7
console.log(o.b); // 8
o.c = 50;
console.log(o.a); // 25
```

我们通常用于定义属性的代码会产生数据属性，其中的 writable、enumerable、configurable 都默认为 true。我们可以使用内置函数 Object.getOwnPropertyDescripter 来查看，如以下代码所示：
```
    var o = { a: 1 };
    o.b = 2;
    //a 和 b 皆为数据属性
    Object.getOwnPropertyDescriptor(o,"a") // {value: 1, writable: true, enumerable: true, configurable: true}
    Object.getOwnPropertyDescriptor(o,"b") // {value: 2, writable: true, enumerable: true, configurable: true}
```
如果我们要想改变属性的特征，或者定义访问器属性，我们可以使用 Object.defineProperty，示例如下：
```
    var o = { a: 1 };
    Object.defineProperty(o, "b", {value: 2, writable: false, enumerable: false, configurable: true});
    //a 和 b 都是数据属性，但特征值变化了
    Object.getOwnPropertyDescriptor(o,"a"); // {value: 1, writable: true, enumerable: true, configurable: true}
    Object.getOwnPropertyDescriptor(o,"b"); // {value: 2, writable: false, enumerable: false, configurable: true}
    o.b = 3;
    console.log(o.b); // 2
```

实际上 JavaScript 对象的运行时是一个“属性的集合”，属性以字符串或者 Symbol 为 key，以数据属性特征值或者访问器属性特征值为 value。



