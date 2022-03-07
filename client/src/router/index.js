import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Landing from "../views/Landing.vue";
import ProjectView from "../views/ProjectView.vue";
import Varifyer from "../views/Varifyer.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/project",
      name: "ProjectView",
      component: ProjectView,
    },
    {
      path: "/varifyer",
      name: "Varifyer",
      component: Varifyer,
    },
  ],
});

export default router;

/* import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Landing from "../views/Landing.vue";
import ProjectView from "../views/ProjectView.vue";
import Varifyer from "../views/Varifyer.vue";

//import store from "./store"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/project",
    name: "ProjectView",
    component: ProjectView,
  },
  {
    path: "/varifyer",
    name: "Varifyer",
    component: Varifyer,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
 */
