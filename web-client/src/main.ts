import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHeart as faHeartS,
  faEllipsis,
  faArrowsRotate,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";

export const API_URL = "http://localhost:4246/v1/";

library.add(
  faHeart,
  faHeartS,
  faComment,
  faEllipsis,
  faArrowsRotate,
  faShareNodes
);

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

//app.provide("authStore", useAuthStore());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
