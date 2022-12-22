import { createRouter, createWebHistory } from "vue-router";
import MultiplyTrainer from "../views/MultiplyTrainer.vue";
import FractionTrainer from "../views/FractionTrainer.vue";
import EquationTrainer from "../views/EquationTrainer.vue";

const routes = [
  {
    path: "/",
    name: "",
    component: MultiplyTrainer
  },
  {
    path: "/fraction-trainer",
    name: "fraction-trainer",
    component: FractionTrainer
  },
  {
    path: "/equation-trainer",
    name: "equation-trainer",
    component: EquationTrainer
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
