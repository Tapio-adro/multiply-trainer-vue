import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MultiplyTrainer from "../views/MultiplyTrainer.vue";
import FractionTrainer from "../views/FractionTrainer.vue";

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
  },
  {
    path: "/fraction-trainer",
    name: "fraction-trainer",
    component: FractionTrainer
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
