import { defineStore } from "pinia";
//import { createPersistPlugin } from "pinia-persist";

export const useUserStore = defineStore("user", {
  state: () => ({
    isSignedIn: false,
    user: {},
  }),
  // plugins: [createPersistPlugin()],
  actions: {
    setUser(user: any) {
      if (user) {
        this.user = user;
        this.isSignedIn = true;
      }
    },
    logout() {
      this.user = {};
      this.isSignedIn = false;
    },
  },
});
