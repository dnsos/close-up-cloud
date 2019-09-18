import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Viz from './views/Viz.vue'
import VizOverview from './views/VizOverview.vue'
import VizTag from './views/VizTag.vue'
import VizDetail from './views/VizDetail.vue'

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
          name: 'viz-overview',
          path: '',
          component: VizOverview
        },
        {
          name: 'viz-tag',
          path: 'tag/:id',
          component: VizTag
        },
        {
          name: 'viz-detail',
          path: 'detail/:id',
          component: VizDetail
        }
      ]
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
