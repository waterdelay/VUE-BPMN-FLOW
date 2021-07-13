/*
 * @Author       : daiwei
 * @Date         : 2021-07-13 10:39:52
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-13 11:10:43
 * @FilePath     : \vue-bpmn-flow\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/bpmn',
    name: 'bpmn',
    component: () => import('../views/bpmn')
  }
]

const router = new VueRouter({
  routes
})

export default router
