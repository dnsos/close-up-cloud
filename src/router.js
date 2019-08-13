import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/viz',
      name: 'viz',
      component: () => import('./views/Viz.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    }
  ]
})
