import { createApp } from "vue";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from "./App.vue";
import router from "./router";

import "./assets/css/style.css";
import "./assets/css/reset.css";
import "./assets/css/topButtons_style.css";
import './assets/css/font-awesome-4.7.0/css/font-awesome.min.css'

createApp(App).use(router).use(autoAnimatePlugin).mount("#app");
