###### ARRON  2019年2月6日

### 语义类标签是什么，使用它有什么好处？

语义类标签在视觉表现上互相都差不多，主要的区别在于它们表示了不同的语义。

语义是我们说话表达的意思，多数的语义实际上都是由文字来承载的。语义类标签则是纯文字的补充，比如标题、自然段、章节、列表，这些内容都是纯文字无法表达的，我们需要依靠语义标签代为表达。

#### 正确使用语义标签可以带来很多好处
- 语义类标签对开发者更为友好，使用语义类标签增强了可读性，即便是在没有 CSS 的时候，开发者也能够清晰地看出网页的结构，也更为便于团队的开发和维护。
- 除了对人类友好之外，语义类标签也十分适宜机器阅读。它的文字表现力丰富，更适合搜索引擎检索（SEO），也可以让搜索引擎爬虫更好地获取到更多有效信息，有效提升网页的搜索量，并且语义类还可以支持读屏软件，根据文章可以自动生成目录等等。

### 作为自然语言延伸的语义类标签

我们说话并没有唯一的标准措辞，语义标签的使用也是一样。

一个好玩的ruby语义标签,如果没有这个标签的话,想实现ruby展示还比较麻烦。

```
<ruby>
  你 <rt>sha</rt>
  好 <rt>bi</rt>
</ruby>
```
<ruby>
  你 <rt>sha</rt>
  好 <rt>bi</rt>
</ruby>

语义化标签对开发者的友好更多的表现为消除歧义，比如em标签表示重音，强调内容
```
// 这是一句不带任何强调的句子
<p>Cats are cute animals.</p>

// em 包围 Cats，强调猫是种可爱的动物，而不是狗或者其他动物
<p><em>Cats</em> are cute animals.</p>

// em 包围 are，代表句子所说是事实，来反驳那些说猫不可爱的人
<p>Cats <em>are</em> cute animals.</p>

// em 包围 cute，强调猫是一种可爱的动物，而不是有人说的刻薄、讨厌的动物
<p>Cats are <em>cute</em> animals.</p>

// 这里强调猫是动物，而不是植物
<p>Cats are cute <em>animals</em>.</p>

```

而strong表示着重内容，代表内容的强烈的重要性、严重性或者紧急性。
```
// 章节序号不重要，章节的名字才重要
<h1>Chapter 1: <strong>The Praxis</strong></h1>
```

><h1>Chapter 1: <strong>The Praxis</strong></h1>

### 作为标题摘要的语义类标签

h1-h6 是最基本的标题，它们表示了文章中不同层级的标题。有些时候，我们会有副标题，为了避免副标题产生额外的一个层级，我们使用 hgroup 标签。
```
<h1>JavaScript 对象</h1>
<h2> 我们需要模拟类吗？</h2>
<p>balah balah</p>
```
```
<hgroup>
<h1>JavaScript 对象 </h1>
<h2> 我们需要模拟类吗？</h2>
</hgroup>
<p>balah balah</p>
```

### 作为整体结构的语义类标签

最后一个场景是，随着越来越多的浏览器推出“阅读模式”，以及各种非浏览器终端的出现，语义化的 HTML 适合机器阅读的特性变得越来越重要。

应用了语义化结构的页面，可以明确地提示出页面信息的主次关系，它能让浏览器很好地支持“阅读视图功能”，还可以让搜索引擎的命中率提升，同时，它也对视障用户的读屏软件更友好。

```
<body>
    <header>
        <nav>
            ……
        </nav>
    </header>
    <aside>
        <nav>
            ……
        </nav>
    </aside>
    <section>……</section>
    <section>……</section>
    <section>……</section>
    <footer>
        <address>……</address>
    </footer>
</body>
```
一个典型的场景是多篇新闻展示在同一个新闻专题页面中，这种类似报纸的多文章结构适合用 article 来组织。
```
<body>
    <header>……</header>
    <article>
        <header>……</header>
        <section>……</section>
        <section>……</section>
        <section>……</section>
        <footer>……</footer>
    </article>
    <article>
        ……
    </article>
    <article>
        ……
    </article>
    <footer>
        <address></address>
    </footer>
</body>
```
body 里面有自己的 header 和 footer，然后里面是竖篇的 article，每一个 article 里面都有自己的 header、section、footer。这是一个典型的多文章结构。

最后 footer 中包含 address，这是个非常容易被误用的标签。address 并非像 date 一样，表示一个给机器阅读的地址，而是表示“文章（作者）的联系方式”，address 明确地只关联到 article 和 body。

### 总结

至此，我们可以回答是否要语义化的问题：我们应该分开一些场景来看语义，把它用在合适的场景下，可以获得额外的效果。本篇文中，我们至少涉及了三个明确的场景：

- 自然语言表达能力的补充；
- 文章标题摘要；
- 适合机器阅读的整体结构。