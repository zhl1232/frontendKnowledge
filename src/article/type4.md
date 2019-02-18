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


