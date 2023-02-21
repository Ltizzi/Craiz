import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import AppVue from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: AppVue }],
});

export default router;
