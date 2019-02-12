###### ARRON 2019 年 2 月 12 日

JS里的类型转换有四种情况,原始类型转Object的一般不用手动处理,默认的装箱转换会自动处理.

- 转换为布尔值
- 转换为数字
- 转换为字符串
- 转换为对象


原始值 | Boolean | Number | String | Object
---|---|---|---|---
Null | false | 0 | "null"| TypeError
Undefined | false | NaN | "undefined"| TypeError
Boolean(true) | - | 1 | "true" | 装箱转换
Boolean(false) | - | 0 | "false" | 装箱转换
Number | 除了0/\-0/NaN都为true| - | #NumberToString | 装箱转换
String | ""为flase | #StringToNumber | -| 装箱转换
Symbol | true | TypeError | TypeError | 装箱转换
Object | true | 拆箱转换 | 拆箱转换 | -

> 开箱转换,拆箱转换看上一篇< 基本类型 >
> 关于null、undefined转换为Object，在权威指南中写的是TypeError，但这里其实用Object()来转换时，会返回一个空对象{}。但这个空对象是没有原始值 [[PrimitiveValue]] 的，只是一个空对象。

Object拆箱转换补充

原始值 | Boolean | Number | String 
---|---|---|---
{}任意对象 | true | NaN | toString()
[] | true | 0 | ""
[8]单数字数组 | true | 9 | "9"
["a",4,true] | true | NaN | "a,4,true"
function(){} | true | NaN | "function(){}"

### NumberToString

一般来说,Number都会转成相同表示方法的字符串。但是，当Number绝对值较大或者较小时，字符串表示则是使用科学计数法表示。实际上这个时候的Number也是用科学计数法表示的。


```
let a = 1111111111111111111111111
console.log(a);
// 1.1111111111111111e+24
console.log(a.toString());
// '1.1111111111111111e+24'
```

### StringToNumber

字符串到数字的类型转换，存在一个语法结构，类型转换支持十进制、二进制、八进制和十六进制，比如：

```
Number("123")     // 123
Number("")        // 0
Number("0x11")    // 17
Number("0b11")    // 3
Number("0o11")    // 9
Number("foo")     // NaN
Number("100a")    // NaN
```
此外，JavaScript 支持的字符串语法还包括正负号科学计数法，可以使用大写或者小写的 e 来表示：

- 1e22
- 1e-3

需要注意的是，parseInt 和 parseFloat 并不使用这个转换，所以支持的语法跟这里不尽相同。

### parseInt、parseFloat
```
parseFloat("3.14");  // 3.14
parseFloat("314e-2");  // 3.14
parseFloat("0.0314E+2");  // 3.14
parseFloat("3.14more non-digit characters");  // 3.14
parseFloat("FF2");  // NaN
```

在任何环境下，都建议传入 parseInt 的第二个参数。

```
parseInt(4.7 * 1e22, 10); // 非常大的数值变成 4
parseInt(0.00000000000434, 10); // 非常小的数值变成 4

parseInt("Hello", 8); // NaN 根本就不是数值
parseInt("546", 2);   //  NaN  除了“0、1”外，其它数字都不是有效二进制数字
```

一些数中可能包含e字符（例如6.022e23），使用parseInt去截取包含e字符数值部分会造成难以预料的结果。例如：
```
parseInt("6.022e23", 10);        // 返回 6
parseInt(6.022e2, 10);          // 返回 602
```

### 运算符

#### 加法运算符
- 运算中其中一方为字符串，那么就会把另一方也转换为字符串
- 如果一方不是字符串或者数字，那么会将它转换为数字或者字符串

```
1 + '1' // '11'
true + true // 2
4 + [1,2,3] // "41,2,3"

```
加法运算符是在运行时决定，到底是执行相加，还是执行连接。也就是说，运算子的不同，导致了不同的语法行为，这种现象称为“重载”（overload）。由于加法运算符存在重载，可能执行两种运算，使用的时候必须很小心。
```
'3' + 4 + 5 // "345"
3 + 4 + '5' // "75"
console.log('a' + - 'b')  // aNaN
```

对于除了加法的运算符（比如减法、除法和乘法）来说，都不会发生重载，只要其中一方是数字，那么另一方就会被转为数字
```
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```

#### 比较运算符

JavaScript 一共提供了8个比较运算符。

- \> 大于运算符
- < 小于运算符
- <= 小于或等于运算符
- \>= 大于或等于运算符
- == 相等运算符
- === 严格相等运算符
- != 不相等运算符
- !== 严格不相等运算符

这八个比较运算符分成两类：相等比较和非相等比较。两者的规则是不一样的，对于非相等的比较，算法是先看两个运算子是否都是字符串，如果是的，就按照字典顺序比较（实际上是比较 Unicode 码点）；否则，将两个运算子都转成数值，再比较数值的大小。

##### 非相等运算符
如果两个运算子都是原始类型的值，则是先转成数值再比较。
```
5 > '4' // true
// 等同于 5 > Number('4')
// 即 5 > 4

true > false // true
// 等同于 Number(true) > Number(false)
// 即 1 > 0

2 > true // true
// 等同于 2 > Number(true)
// 即 2 > 1
```
任何值（包括NaN本身）与NaN比较，返回的都是false。
```
1 > NaN // false
1 <= NaN // false
'1' > NaN // false
'1' <= NaN // false
NaN > NaN // false
NaN <= NaN // false
```
如果运算子是对象，会转为原始类型的值，再进行比较。
```
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  }
}
a > -1 // true
```
上面代码，重写valueOf和toString，拆箱转换，大于运算符hint为Number，先执行valueOf。如果没重写valueOf和toString，valueOf会拿到对象本身。

对象转换成原始类型的值，算法是先调用valueOf方法；如果返回的还是对象，再接着调用toString方法，toString会拿到[Object Object]。

如果toString方法返回的不是原始类型的值，结果就会报错。

```
let a = {
  valueOf() {
    return {}
  },
  toString() {
    return {}
  }
}
a > -1  // TypeError
```
'[Object Object]'转Number是NaN，NaN和任何比较都是false
```
let a = {}
a > 1 // false
```

所以
```
let a = {}
a + 1  // [object Object]1
```
##### 严格相等(\=\=\=) 和 相等(==)

严格相等

原始类型，值和类型全部相同，返回true，否则返回false
```
1 === 0x1 // true
true === "true" // false
NaN === NaN  // false
+0 === -0 // true
```

复合类型，两个复合类型（对象、数组、函数）的数据比较时，不是比较它们的值是否相等，而是比较它们是否指向同一个地址。
```
{} === {} // false
[] === [] // false
(function () {} === function () {}) // false
```
如果两个变量引用同一个对象
```
var v1 = {};
var v2 = v1;
v1 === v2 // true
```
对于两个对象的比较，严格相等运算符比较的是地址，而大于或小于运算符比较的是值。
```
var obj1 = {};
var obj2 = {};

obj1 > obj2  // false
obj1 < obj2  // false
obj1 === obj2  // false
```
undefined和null与自身严格相等，所以
```
var v1;
var v2;
v1 === v2  // true
```
相等

原始类型的值会转换成数值再进行比较。

```
1 == true // true
// 等同于 1 === Number(true)

0 == false // true
// 等同于 0 === Number(false)

2 == true // false
// 等同于 2 === Number(true)

2 == false // false
// 等同于 2 === Number(false)

'true' == true // false
// 等同于 Number('true') === Number(true)
// 等同于 NaN === 1

'' == 0 // true
// 等同于 Number('') === 0
// 等同于 0 === 0

'' == false  // true
// 等同于 Number('') === Number(false)
// 等同于 0 === 0

'1' == true  // true
// 等同于 Number('1') === Number(true)
// 等同于 1 === 1

'\n  123  \t' == 123 // true
// 因为字符串转为数字时，省略前置和后置的空格
```

对象（这里指广义的对象，包括数组和函数）与原始类型的值比较时，对象转换成原始类型的值，再进行比较。

```
// 对象与数值比较时，对象转为数值
[1] == 1 // true
// 等同于 Number([1]) == 1

// 对象与字符串比较时，对象转为字符串
[1] == '1' // true
// 等同于 String([1]) == '1'
[1, 2] == '1,2' // true
// 等同于 String([1, 2]) == '1,2'

// 对象与布尔值比较时，两边都转为数值
[1] == true // true
// 等同于 Number([1]) == Number(true)
[2] == true // false
// 等同于 Number([2]) == Number(true)
```

undefined和null与其他类型的值比较时，结果都为false，它们互相比较时结果为true。

```
false == null // false
false == undefined // false

0 == null // false
0 == undefined // false

undefined == null // true
```

相等运算符隐藏的类型转换，会带来一些违反直觉的结果。
```
2 == true           // false
2 == false          // false

false == 'false'    // false
false == '0'        // true

false == undefined  // false
false == null       // false
null == undefined   // true

' \t\r\n ' == 0     // true
```
因此建议不要使用相等运算符（\=\=），最好显式转换数据类型，使用严格相等运算符（\=\=\=）。