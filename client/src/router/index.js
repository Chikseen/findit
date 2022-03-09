import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Landing from "../views/Landing.vue";
import ProjectView from "../views/ProjectView.vue";
import Varifyer from "../views/Varifyer.vue";

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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
