import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

import { createPinia } from "pinia";
import "./style.css";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as faHeartS } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";

export const API_URL = "http://localhost:4246/v1/";

library.add(faHeart, faHeartS, faComment);

const app = createApp(App);

app.use(router);
const pinia = createPinia();

app.use(pinia);

//app.provide("authStore", useAuthStore());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
