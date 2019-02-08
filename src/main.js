// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts';
import { Button, Dialog, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$echarts = echarts; 
Vue.use(Button)
Vue.use(Dialog)
Vue.prototype.$message = Message

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
