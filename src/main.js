import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/css/style.css";
import "./assets/css/topButtons_style.css";

createApp(App).use(router).mount("#app");
