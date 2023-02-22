import { defineStore } from "pinia";
//import { createPersistPlugin } from "pinia-persist";

export const useUserStore = defineStore("user", {
  state: () => ({
    accessToken: "",
    isSignedIn: false,
  }),
  // plugins: [createPersistPlugin()],
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      this.isSignedIn = true;
    },
    clearAccessToken() {
      this.accessToken = "";
      this.isSignedIn = false;
    },
  },
});
