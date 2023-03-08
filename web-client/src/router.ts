import { createRouter, createWebHistory } from "vue-router";
import CallbackVue from "./components/ui/Callback.vue";
import MemeList from "./components/layout/MemeList.vue";
import Home from "./views/Home.vue";
import TheMeme from "./views/TheMeme.vue";
import AppVue from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        { path: "", component: MemeList },
        { path: "meme", component: TheMeme },
        { path: "/callback", component: CallbackVue },
      ],
    },
  ],
});

export default router;
