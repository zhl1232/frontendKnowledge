
<template>
	<div>
  <div id="main" style="height:800px;" >
  </div>
	<el-dialog
		:title="title"
		:visible.sync="dialogVisible"
		width="70%"
		center>
		<div v-html="compiledMarkdown"></div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		</span>
	</el-dialog>

	</div>
	
</template>

<script>
import marked from 'marked'
export default {
  data() {
    return {
      title: '', // 标题
      dialogVisible: false, // dialog弹出判定
      input: '', // 引入md文件名字
      // 树数据
      data: {
        name: '前端知识构架',
        children: [
          {
            name: 'javascript',
            children: [
              {
                name: '运行时',
                children: [
                  {
                    name: '数据结构',
                    children: [
                      {
                        name: '类型',
                        children: [
                          {
                            name: '基本类型',
                            file: 'type1'
													},
													{
                            name: '对象',
                            file: 'type2'
                          },
                          {
                            name: '类型转换',
                            file: 'type3'
													},
													{
														name: '原型',
                            file: 'type4'
													}
                        ]
                      },
                      {
                        name: '实例',
                        children: [
                          {
                            name: '应用和机制'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    name: '执行过程（）',
                    children: [
                      { name: '事件循环' },
                      { name: '做任务的执行' },
                      { name: '函数的执行' },
                      { name: '语句级的执行' }
                    ]
                  }
                ]
              },
              {
                name: '文法',
                children: [
                  {
                    name: '词法'
                    // value: 4116
                  },
                  {
                    name: '语法'
                  }
                ]
              },
              {
                name: '语义',
                children: [
                  {
                    name: '语义化标签',
                    file: 'semantic1'
                  }
                ]
              }
            ]
          },
          {
            name: 'HTML&CSS',
            children: [
              {
                name: 'HTML',
                children: [
                  {
                    name: '元素',
                    children: [
                      { name: '文档元信息' },
                      { name: '语义相关内容' },
                      { name: '链接' },
                      { name: '替换型元素' },
                      { name: '表单' },
                      { name: '表格' },
                      { name: '总集' }
                    ]
                  },
                  {
                    name: '语言',
                    children: [{ name: '实体' }, { name: '命名空间' }]
                  },
                  {
                    name: '补充标准'
                  }
                ]
              },
              {
                name: 'CSS',
                children: [
                  {
                    name: '语言',
                    children: [{ name: '@rule' }, { name: '选择器' }, { name: '单位' }]
                  },
                  {
                    name: '功能',
                    children: [
                      {
                        name: '布局',
                        children: [{ name: '正常流' }, { name: '弹性布局' }]
                      },
                      {
                        name: '绘制',
                        children: [{ name: '颜色和形状' }, { name: '文字相关' }]
                      },
                      {
                        name: '交互',
                        children: [{ name: '动画' }, { name: '其他交互' }]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: '浏览器的实现原理和API',
            children: [
              {
                name: '实现原理',
                children: [
                  { name: '解析' },
                  { name: '构建DOM树' },
                  { name: '计算CSS' },
                  { name: '渲染、合成和绘制' }
                ]
              },
              {
                name: 'API',
                children: [
                  { name: 'DOM' },
                  { name: 'CSSOM' },
                  { name: '事件' },
                  { name: 'API总集合' }
                ]
              }
            ]
          },
          {
            name: '前端工程实践',
            children: [
              { name: '性能' },
              { name: '工具链' },
              { name: '持续集成' },
              { name: '搭建系统' },
              { name: '架构与基础库' }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.Chart() //
    this.mark()
  },
  computed: {
    compiledMarkdown: function() {
      // markdown渲染计算
      return marked(this.input, { sanitize: false })
    }
  },
  methods: {
    mark() {
      // markdown插件配置
      let renderMD = new marked.Renderer()
      marked.setOptions({
        renderer: renderMD,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false, // 忽略任何已经输入的html代码（标签）
        smartLists: true,
        smartypants: false,
        highlight: function(code, lang) {
          // console.log('code', code)
          // return   hljs.highlight(lang, code, false,true).value;
          return hljs.highlightAuto(code).value
        }
      })
    },
    Chart() {
      let myChart = this.$echarts.init(document.getElementById('main'))
      let that = this
      myChart.on('click', function(params) {
        if (params.data.children) {
          // 如果不是最终子节点
          return
        } else if (!params.data.file) {
					// 如果没有文章			
          that.$message({
            message: '暂时没有相关文章',
            type: 'warning'
          })
        } else {
          // 树分支末端点击事件
          that.title = params.name
          // 根据点击file名字,动态拿markdown文件内容
          that.input = require(`../article/${params.data.file}.md`)
          that.dialogVisible = true
          // console.log(that.compiledMarkdown)
        }
      })
      let option = {
        // 树配置
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',

            data: [this.data],

            top: '1%',
            left: '10%',
            bottom: '1%',
            right: '20%',

            symbolSize: 10,

            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 16
              }
            },

            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            initialTreeDepth: 10, // 默认展开深度
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
      myChart.hideLoading()
      myChart.setOption(option)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

h1,h2,h3 {
	color: #000;
}
ul {
  padding: 10px;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
pre {
	background: #252525;
	padding: 10px 15px;
	border-radius: 8px;
}
blockquote {
	border-left: 3px solid #ffa986;
	padding-left: 5px;
	margin-left: 1em;
}
table, tr, th, td {
	border:1px solid;
	padding: 5px 10px;
	border-collapse:collapse; 
}
</style>
