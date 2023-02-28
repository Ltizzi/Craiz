import { defineStore } from "pinia";
import { User } from "../src/utils/models";
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
        this.user = user as User;
        this.isSignedIn = true;
      }
    },
    getUser() {
      return this.user;
    },
    logout() {
      this.user = {};
      this.isSignedIn = false;
    },
  },
});
