import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import AppVue from "./App.vue";
import Callback from "./components/common/Callback.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: AppVue },
    { path: "/home", component: Callback },
  ],
});

export default router;
