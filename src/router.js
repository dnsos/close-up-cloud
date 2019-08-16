import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Viz from './views/Viz.vue'
import VizOverview from './components/VizOverview.vue'
import VizTag from './components/VizTag.vue'

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
      component: Viz,
      children: [
        {
          path: '',
          component: VizOverview
        },
        {
          path: 'tag',
          redirect: '/viz'
        },
        {
          path: 'tag/:id',
          component: VizTag
        }
      ]
    },
    {
      path: '/viz/tag/:id',
      component: Viz
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    }
  ]
})
