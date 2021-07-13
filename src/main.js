/*
 * @Author       : daiwei
 * @Date         : 2021-07-13 10:39:52
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-13 11:31:18
 * @FilePath     : \vue-bpmn-flow\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import './style/html.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';


Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
