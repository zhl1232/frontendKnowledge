采纳 JSC 引擎的术语，我们把宿主发起的任务称为宏观任务，把 JavaScript 引擎发起的任务称为微观任务。

## 宏观和微观任务
JavaScript 引擎等待宿主环境分配宏观任务，在操作系统中，通常等待的行为都是一个事件循环，所以在 Node 术语中，也会把这个部分称为事件循环。

```js
var r = new Promise(function(resolve, reject){
	console.log("a");
	resolve()
});
setTimeout(()=>console.log("d"), 0)
r.then(() => console.log("c"));
console.log("b")

// a,b,c
```
我们发现，不论代码顺序如何，d 必定发生在 c 之后，因为 Promise 产生的是 JavaScript 引擎内部的微任务，而 setTimeout 是浏览器 API，它产生宏任务。

```js
setTimeout(() => console.log('d'), 0)
var r1 = new Promise(function(resolve, reject) {
	resolve()
})
r1.then(() => {
	var begin = Date.now()
	console.log(begin)
	while (Date.now() - begin < 1000) {
		console.log(Date.now())
	}
	console.log('c1')
	new Promise(function(resolve, reject) {
		resolve()
	}).then(() => console.log('c2'))
})
// c1,c2,d
```

### Promise,async和await

async 函数是一种特殊语法，特征是在 function 关键字之前加上 async 关键字，这样，就定义了一个 async 函数，我们可以在其中使用 await 来等待一个 Promise。

```js
function sleep(duration) {
	return new Promise((resolve, reject) => {
		console.log("c");
		setTimeout(resolve, duration);
	});
}
async function foo() {
	console.log("a");
	await sleep(2000)
	console.log("b");
}
foo()  // a,c, 2000s后 b

```
async 函数强大之处在于，它是可以嵌套的。我们在定义了一批原子操作的情况下，可以利用 async 函数组合出新的 async 函数。

```js
function sleep(duration) {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, duration)
	})
}
async function foo(name) {
	await sleep(2000)
	console.log(name)
}
async function foo2() {
	await foo('a')
	await foo('b')
}
foo2()
```
把一个圆形 div 按照绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色
```js
function sleep(duration) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, duration)
	});
}

async function changeColor(duration, color) {
	document.getElementById('div').style.background = color
	await sleep(duration)
}

async function main() {
	while (true) {
		await changeColor(3000, "lawngreen")
		await changeColor(1000, "yellow")
		await changeColor(2000, "red")
	}
}
main()
```
