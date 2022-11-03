import { createRouter, createWebHistory } from "vue-router";
import MultiplyTrainer from "../views/MultiplyTrainer.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/multiply-trainer",
    name: "multiply-trainer",
    component: MultiplyTrainer
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
