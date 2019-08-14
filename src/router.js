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
      component: () => import('./views/Viz.vue')
    },
    {
      path: '/viz2',
      component: () => import('./views/Viz2.vue')
    },
    {
      path: '/viz2/tag/:id',
      component: () => import('./views/Viz2.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    }
  ]
})
