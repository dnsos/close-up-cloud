import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Viz from './views/Viz.vue'
import VizOverview from './components/VizOverview.vue'
import VizTag from './components/VizTag.vue'
import VizDetail from './components/VizDetail.vue'

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
          name: 'overview',
          path: '',
          component: VizOverview
        },
        {
          name: 'tag',
          path: 'tag/:id',
          component: VizTag
        },
        {
          name: 'detail',
          path: 'detail/:id',
          component: VizDetail
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
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
