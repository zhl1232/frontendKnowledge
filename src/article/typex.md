刚刚无意之中在网上看到 `web worker` 这个词，瞬间跌入了回忆的深渊，什么 `serviceWorker`、`walking dead`、亲爱的长者 乱七八糟一齐涌了出来，就是没有 `web worker`，最后颓废的发现，原来关于 `worker` 相关的东西自己已经忘干净了。

不过隐约记得这东西用起来不很复杂，于是果断上 MDN 看看文档，但是又无意中看到 `MessageChannel` 这个词，很明显幼小的心灵又被一个陌生的词汇狠狠的鞭笞了一下。忍不住点进去看了一下关于 `MessageChannel` 的资料，发现这行代码 ([来源](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel/MessageChannel)):

```js
otherWindow.postMessage('Hello from the main page!', '*', [channel.port2]);
```

蛤？原来 `postMessage` 方法可以接收第 `3` 个参数？那请问第三个参数是什么意思？文章里说的 `MessgaePort` 对象又是什么？想到这么多问题自己还完全摸不着边，而且问题之间环环相扣，于是仔细深究了一番，下面是一些笔记。

#### 什么是 MessageChannel ?
首先，`MessageChannel` 是一个构造函数，创建一对相互连接的 `MessagePort` 对象。

```js
var mc=new MessageChannel;
mc.port1.onmessage=function(e){console.log("port1："+e.data);};
mc.port2.onmessage=function(e){console.log("port2："+e.data);};
mc.port1.postMessage("1"); //会在port2的message事件收到
mc.port2.postMessage("2"); //会在port1的message事件收到
```

(这段代码的[来源](https://www.web-tinker.com/article/20320.html))

上面说的一对相互连接的 `MessagePort` 对象分别是 `mc.port1` 和 `mc.port2`，他们可以相互给对方发送消息，并且处理接收到的消息。这就是 `MessageChannel` 最基本的用法，很简单，但是看起来很无用。

#### postMessage 很好用
我们知道 `postMessage` 可以用于 `worker` 和跨文档消息传递机制，用起来也很简单，只要记住 `postMessage` 是”自己给自己发消息“，我们以后者为例：

```js
// index.html
var iframe = document.querySelector('iframe')
iframe.onload = () => {
  let w = iframe.contentWindow

  w.onmessage = (e) => {
    console.log(e.data)
  }
  w.postMessage('initialize', '*')
}

// iframe.html
onmessage = (e) => {
  console.log(e.data)
  window.postMessage(`Received message: ${e.data}`)
}
```

上面这段代码逻辑非常简单，`iframe` 自己给自己发消息并处理接收到的消息，但是可能不好理解的就是所谓的 “自己给自己发消息”。在我们正常的认知中，发消息通常都是一方发给另外一方，哪有自己给自己发消息的 (自言自语除外)。而且因为自发消息的特性，在不同的上下文中 (不同的页面或者 worker 与 main thread 间)，`postMessage` 和 `onmessage` 在写法上看起来又不像是 ”自己给自己发“：在 `index.html` 中写法是 `iframe.contentWindow.postMessage`，在 `iframe.html` 中写法又是 `window.postMessage`。总之，如果不习惯的话从文字上看起来会觉得这种写法有些别扭，不过好在我们还有另一种写法。

#### MessageChannel 让通信变得更简单
上面说到 `MessageChannel` 构造函数会创建一对相互关联的 `MessagePort` 对象，怎么理解 `MessagePort` 对象呢？可以把一个 `MessagePort` 对象当成消息传递的管道，我们可以通过这两个对象来进行消息的传递，想象一下现实生活中的两个人通过手机打电话，一个 `MessagePort` 对象就是一个手机。

`MessageChannel` 其实就更好理解了，不再是自己给自己发消息，而是一方发给另一方，也即是 `mc.port1` 和 `mc.port2` 相互传递处理消息。

但是怎么利用 `MessageChannel` 来让我们现有的消息传递机制更加简单清晰呢？答案正是我们上面说的 `window.postMessage` 方法的第三个参数 (`MessagePort.postMessage` 里是第二个参数)。

这个参数是可选的，而且如果有的话必须是 `Array/ArrayLike`，表示 “跟随信息一起传送的可转让对象的序列”，意思就是把这些可转让对象的所有权转让给目的上下文 **(注意只有 `MessagePort` 和 `ArrayBuffer` 对象可以被转移)**。

什么意思呢？看文章里的第一行代码：

```js
otherWindow.postMessage('Hello from the main page!', '*', [channel.port2]);
```

这里 `channel.port2` 就被转移到 `otherWindow` 上下文中去了，也就是现在 `channel.port2` 能够被 `otherWindow` 上下文访问到了。不过这样有什么用呢？我们不还是用了 `postMessage` 方法吗？

其实很好理解，想像一下，现在你跟你的一个小伙伴分隔两地，通信是通过邮政寄信的方式，很不方便，但是某天你突然得到两个电话，然后通过邮政发给你的小伙伴一个，这样等小伙伴收到电话你们就能愉快的打电话了。翻译过来就是：通过 `postMessage` 把其中一个 `MessagePort` 对象传递给需要通信的一方，然后双方就可以通过 `MessagePort` 对象相互通信。

好了就说这么多，下面直接上完整的代码，很好理解：

```
// index.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
</head>
<body>
    <iframe src="iframe.html" frameborder="0"></iframe>
    <script>
        var channel = new MessageChannel
        var port = channel.port1

        var iframe = document.querySelector('iframe')
        iframe.onload = () => {
          iframe.contentWindow.postMessage('initialize', '*', [channel.port2])
        }

        port.addEventListener('message', (e) => {
          console.log(e.data, e)
        }, false)

        // 因为我们用的是 addEventListener 而不是 onmessage,
        // 所以需要调用 port.start 方法
        // 见: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
        port.start()        
    </script>
</body>
</html>

// iframe.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
</head>
<body>
    <script>
      onmessage = (e) => {
        // index.html 传递过来的 MessagePort 对象
        // 通过 e.ports[0] 获取
        var port = e.ports[0]

        // 现在可以愉快的通过 port
        // 进行消息传递
        port.onmessage = (e) => {
          console.log('from iframe: ' + e.data)
        }
        port.postMessage('sad')       
      }
    </script>   
</body>
</html>
```

#### 总结
`MessageChannel` 是基本的双向信息传输管道，可以把它想象成 `window.postMessage`/`window.onmessage` 的另一种更加清晰的替代方案。最后要说的一点就是，sharedWorker 默认使用了 `MessagePort` 进行消息传递，有兴趣的同学可以自行探索。