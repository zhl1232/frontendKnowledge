###### ARRON 2019 年 2 月 7 日

JS 中分为七种内置类型，七种内置类型又分为两大类型：基本类型和对象（Object）。

## 基本类型

基本类型有六种： null，undefined，boolean，number，string，symbol

首先我们必须认识到 3 与 new Number(3) 是完全不同的值，它们一个是 Number 类型， 一个是对象类型。

Number、String 和 Boolean，三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。

Symbol 函数比较特殊，直接用 new 调用它会抛出错误，但它仍然是 Symbol 对象的构造器。

原始类型存储的都是值，是没有函数可以调用的，比如 undefined.toString() 会抛出错误

但为什么 '1'.toString() 是可以使用的。

其实是 . 运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。在该临时对象调用函数返回函数操作结果后，将该对象丢弃。

### 装箱转换

每一种基本类型 Number、String、Boolean、Symbol 在对象中都有对应的类，所谓装箱转换，正是把基本类型转换为对应的对象，它是类型转换中一种相当重要的种类。

前文提到，全局的 Symbol 函数无法使用 new 来调用，但我们仍可以利用装箱机制来得到一个 Symbol 对象，我们可以利用一个函数的 call 方法来强迫产生装箱。

```
    var symbolObject = (function(){ return this; }).call(Symbol("a"));

    console.log(typeof symbolObject); // object
    console.log(symbolObject instanceof Symbol); // true
    console.log(symbolObject.constructor   Symbol); // true
```

使用内置的 Object 函数，我们可以在 JavaScript 代码中显式调用装箱能力。

```
    var symbolObject = Object((Symbol("a"));

    console.log(typeof symbolObject); // object
    console.log(symbolObject instanceof Symbol); // true
    console.log(symbolObject.constructor   Symbol); // true

```

每一个装箱对象 console.dir 的时候，会发现有个 [[PrimitiveValue]] 标记，他会显示该对象内部指向的原始值。

每一类对象（包括装箱对象）皆有私有的 Class 属性，这些属性可以用 Object.prototype.toString 获取：

```
    var symbolObject = Object((Symbol("a"));

    console.log(Object.prototype.toString.call(symbolObject)); //[object Symbol]
```

在 JavaScript 中，没有任何方法可以更改私有的 Class 属性，因此 Object.prototype.toString 是可以准确识别对象对应的基本类型的方法，它比 instanceof 更加准确。

instanceof 的判定如果在两个环境下可能会出错。比如网页内嵌 iframe。

但需要注意的是，call 本身会产生装箱操作，所以判断类型的时候需要配合 typeof 来区分基本类型还是对象类型。

### 拆箱转换

在 JavaScript 标准中，规定了 ToPrimitive 函数，它是对象类型到基本类型的转换（即，拆箱转换）。

```
[Symbol.toPrimitive](hint)
```

如果 hint 是 "string" 或 "default"，[@@toPrimitive]() 将会调用 toString。如果 toString 属性不存在，则调用 valueOf。如果 valueOf 也不存在，则抛出一个 TypeError。

如果 hint 是 "number"，[@@toPrimitive]() 会首先尝试 valueOf，若失败再尝试 toString。

number

```
    var o = {
        valueOf : () => {console.log("valueOf"); return {}},
        toString : () => {console.log("toString"); return {}}
    }

    o * 2
    // valueOf
    // toString
    // TypeError
```

string

```
    var o = {
        valueOf : () => {console.log("valueOf"); return {}},
        toString : () => {console.log("toString"); return {}}
    }

    o + ""
    // toString
    // valueOf
    // TypeError
```

当在希望是字符串操作，也即发生对象到字符串的转换时，传入内部函数 ToPrimitive 的参数值即为 string，当在希望是数值操作，传入内部函数 ToPrimitive 的参数值即为 number，当在一些不确定需要将对象转换成什么基础类型的场景下，传入内部函数 ToPrimitive 的参数值即为 default：

```
	const b = {
			[Symbol.toPrimitive] (hint) {
					console.log(`hint: ${hint}`);
					return {};
			},
			toString () {
					console.log('toString');
					return 1;
			},
			valueOf () {
					console.log('valueOf');
					return 2;
			}
	};

	alert(b); // hint: string
	b + ''; // hint: default
	b + 500; // hint: default
	+b; // hint: number
	b * 1; // hint: number
```

在 ES6 之后，还允许对象通过显式指定 @@toPrimitive Symbol 来覆盖原有的行为。

```
    var o = {
        valueOf : () => {console.log("valueOf"); return {}},
        toString : () => {console.log("toString"); return {}}
    }

    o[Symbol.toPrimitive] = () => {console.log("toPrimitive"); return "hello"}


    console.log(o + "")
    // toPrimitive
    // hello
```

### null 和 undefined

null 代表赋值了，但内容为空，undefined 表示未定义。

另外对于 null 来说。虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

一般建议用 void 0 代替 undefined ，因为在 ES5 之前 undefined 是一个变量，而并非是一个关键字，为了避免无意中被修改，建议用 void 0 代替 undefined

```
    let a
    // 我们也可以这样判断 undefined
    a  = undefined
    // 但是 undefined 不是保留字，能够在低版本浏览器被赋值
    let undefined = 1
    // 这样判断就会出错
    // 所以可以用下面的方式来判断，并且代码量更少
    // 因为 void 后面随便跟上一个组成表达式
    // 返回就是 undefined
    a  = void 0
```

### Boolean

```
    console.log(true  = new Boolean(true));  // false

```

因为 true 是基本类型，new Boolean(true)是一个对象

### String

JavaScript 中的字符串是永远无法变更的，一旦字符串构造出来，无论你在 string 类型上调用何种方法，都不会对值有改变。

String 有最大长度是 2^53 - 1，但是这个最大长度并不是你理解的字符数，而是字符串的 UTF16 编码，我们字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF16 编码。所以，字符串的最大长度，实际上是受字符串的编码长度影响的。

### Number

JavaScript 中的 Number 类型有 (2^64 - 2^53+3) 个值。JavaScript 采用 IEEE 754 双精度版本(64 位)。

> 指数为 2^e - 1 且尾数的小数部分全 0，这个数字是 ±∞。（符号位决定正负）

> 指数为 2^e - 1 且尾数的小数部分非 0，这个数字是 NaN。

其中 NaN，占用了 9007199254740990 位，即（2^53-2）；±∞ 占用两位。但是表示了三个直观的量。

JavaScript 中的数字是 64-bits 的双精度，所以加减一下，一共有(2^64 - 2^53 + 3)个值。

64 位双精度在计算机中存储占用 8 字节，64 位，有效位数为 16 位。其中符号位，指数位和尾数部分分别为 1, 11, 52。取值范围取决于指数位，计算精度取决于尾数位（小数）。

小数位是 52 位（二进制），换算为十进制则只能百分百能保证 15 位。超过该精度（二进制 52 位，十进制 15 位）的小数运算将会被截取，造成精度损失和计算结果的不准确。

```
	console.log( 0.000000000000001 <= Number.EPSILON ); // false
	console.log( 0.0000000000000001 <= Number.EPSILON ); // true

```

所以 JavaScript 提供的最小精度值 Number.EPSILON 为 2.220446049250313e-16 也就是
小于 16 位小数(10 进制)。

```
	console.log( 2.220446049250313e-16.toString(2) );
	// 0.0000000000000000000000000000000000000000000000000001
	// 52位小数(2进制)
```

##### 为什么 0.1 + 0.2 != 0.3

计算机计算都是用二进制的。

问：要把小数装入计算机，总共分几步？你猜对了，3 步。

- 第一步：转换成二进制。
- 第二步：用二进制科学计算法表示。
- 第三步：表示成 IEEE 754 形式。

  0.1 二进制计算过程

```
	0.1*2=0.2========取出整数部分0
	0.2*2=0.4========取出整数部分0
	0.4*2=0.8========取出整数部分0
	0.8*2=1.6========取出整数部分1
	0.6*2=1.2========取出整数部分1　
	0.2*2=0.4========取出整数部分0
	0.4*2=0.8========取出整数部分0
	0.8*2=1.6========取出整数部分1
	0.6*2=1.2========取出整数部分1
	……
```

得到一个无限循环的二进制小数 0.000110011…

用科学计数法表示

0.000110011(0011) == 1.100110011(0011)\*2^-4 // (0011) 表示循环

> 任何一个 r 进制数 N 都可以写成（N）r=(+/-)S\*r(+/-e)这种科学计数法

> 其中 N 表示需要表示的数，r 表示进制，S 表示尾数，N 的有效位数字，e 表示阶码，代表小数点的位置

表示成 IEEE 754 形式

1. 正数 固符号位为 0
2. 尾数 由于由于第一位使用是 1，固取(首位 1 干掉了) .100110011(0011)
3. 指数 -4 + 1023(偏移量), 1019 转换为二进制就是 01111111011

组合在一起就是 0-01111111011-100110011(0011)

因为 IEEE 754 64 位只能存储 52 位尾数，剩下的需要舍入。

因此 0.1 实际存储时的位模式是 0-01111111011-1001100110011001100110011001100110011001100110011010；

0.2 同理得到 0-01111111100-1001100110011001100110011001100110011001100110011010；

相加得到 0-01111111101-0011001100110011001100110011001100110011001100110100;转换为十进制即为 0.30000000000000004。

> 单精度 32 位的 偏移量是 Math.pow(2,8)/2 -1 == 127 ，双精度 64 位的偏移量是 Math.pow(2,11)/2 -1 == 1023

> 因为所有数的二进制科学计数都可以写成 1.xxxx，所以是固定的，取消默认 1，这样可以多出一位存储空间。

##### 其它

- 指数域不全为 0 或不全为 1。这时，浮点数就采用上面的规则表示，即指数的计算值减去 127（或 1023），得到真实值，再将尾数前加上第一位的 1。
- 指数域全为 0。这时，浮点数的指数等于 1-127（或者 1-1023），尾数不再加上第一位的 1，而是还原为 0.xxxxxx 的小数。这样做是为了表示 ±0，以及接近于 0 的很小的数字。
- 指数域全为 1。这时，如果尾数全为 0，表示 ± 无穷大（正负取决于符号位 s）；如果尾数不全为 0，表示这个数不是一个数（NaN）。

### symbol

```
	var o = new Object

	o[Symbol.iterator] = function() {
		var v = 0
		return {
			next: function() {
				return { value: v++, done: v > 10 }
			}
		}
	};

	for(var v of o)
		console.log(v); // 0 1 2 3 ... 9
```

代码中我们定义了 iterator 之后，用 for(var v of o) 就可以调用这个函数，然后我们可以根据函数的行为，产生一个 for…of 的行为。

这里我们给对象 o 添加了 Symbol.iterator 属性，并且按照迭代器的要求定义了一个 0 到 10 的迭代器，之后我们就可以在 for of 中愉快地使用这个 o 对象啦。

这些标准中被称为“众所周知”的 Symbol，也构成了语言的一类接口形式。它们允许编写与语言结合更紧密的 API。
