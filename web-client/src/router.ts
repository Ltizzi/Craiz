import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import AppVue from "./App.vue";
import CallbackVue from "./components/common/Callback.vue";
import EditUserProfileFormVue from "./components/common/EditUserProfileForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: AppVue },
    { path: "/home", component: CallbackVue, meta: { requiresAuth: true } },
  ],
});

export default router;
