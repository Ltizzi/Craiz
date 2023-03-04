import { createRouter, createWebHistory } from "vue-router";
import CallbackVue from "./components/common/Callback.vue";
import MemeList from "./components/layout/MemeList.vue";
import Home from "./views/Home.vue";
import TheMeme from "./views/TheMeme.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        { path: "", component: MemeList },
        { path: "meme", component: TheMeme },
      ],
    },
    { path: "/callback", component: CallbackVue },
    { path: "/meme", component: TheMeme },
  ],
});

export default router;
