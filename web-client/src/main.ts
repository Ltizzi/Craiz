import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

import { createPinia } from "pinia";
import "./style.css";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as faHeartS } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

library.add(faHeart, faHeartS);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
//app.provide("authStore", useAuthStore());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
