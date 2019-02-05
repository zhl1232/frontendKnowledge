<template>
  <div class="hello">
    <div id="main" style="width: 1200px;height:800px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        name: '前端知识构架',
        children: [
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
                name: 'FlareVis'
                // value: 4116
              }
            ]
          },
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
                        name: '对象'
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
          }
        ]
      }
    };
  },
  mounted() {
    this.Chart();
  },
  methods: {
    Chart() {
      let myChart = this.$echarts.init(document.getElementById('main'));
      let option = {
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

            symbolSize: 7,

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

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };
      myChart.hideLoading();
      myChart.setOption(option);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
