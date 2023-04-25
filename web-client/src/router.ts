import { createRouter, createWebHistory } from "vue-router";
import CallbackVue from "./components/ui/Callback.vue";
import MemeList from "./components/layout/MemeList.vue";
import Home from "./views/Home.vue";
import TheMeme from "./views/TheMeme.vue";
import AppVue from "./App.vue";
import TheProfile from "./views/TheProfile.vue";
import LandingPageVue from "./components/layout/LandingPage.vue";
import TheSearchVue from "./views/TheSearch.vue";
import TheTrendsVue from "./views/TheTrends.vue";
import TheNotificationVue from "./views/TheNotification.vue";
import AdminDashboardVue from "./components/layout/AdminDashboard.vue";

import { User } from "./utils/models";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        { path: "", component: MemeList },
        { path: ":username", name: "TheProfile", component: TheProfile },
        { path: "meme", component: TheMeme },
        { path: "/callback", component: CallbackVue },
        {
          path: "/search",
          name: "TheSearch",
          component: TheSearchVue,
          props: (route) => ({
            tagname: route.query.tag,
            username: route.query.user,
          }),
        },

        {
          path: "/trends",
          name: "TheTrends",
          component: TheTrendsVue,
          props: (route) => ({
            topusers: route.query.topusers,
          }),
        },
        {
          path: "/notifications",
          name: "TheNotifications",
          component: TheNotificationVue,
        },
        {
          path: "/admin",
          name: "AdminDashboard",
          component: AdminDashboardVue,
        },
      ],
    },
    { path: "/landing", component: LandingPageVue },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem("user") as string);
  if (to.path == "/admin" && !currentUser.isAdmin) {
    next("/");
  } else {
    next();
  }
});

export default router;
