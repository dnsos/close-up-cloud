import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Viz from "./views/Viz.vue";
import Sammlung from "./views/Sammlung.vue";
import VizOverview from "./views/VizOverview.vue";
import VizTag from "./views/VizTag.vue";
import VizDetail from "./views/VizDetail.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/sammlung/:id",
      name: "sammlung",
      component: Sammlung
    },
    {
      path: "/viz",
      alias: "/mkg",
      component: Viz,
      children: [
        {
          name: "viz-overview",
          path: "",
          component: VizOverview
        },
        {
          name: "viz-tag",
          path: "tag/:id",
          component: VizTag
        },
        {
          name: "viz-detail",
          path: "detail/:id",
          component: VizDetail
        }
      ]
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
