import axios from "axios";
import { defineStore } from "pinia";
import { User } from "../src/utils/models";
//import { createPersistPlugin } from "pinia-persist";

const API_URL = "http://localhost:4246/v1/";

export const useUserStore = defineStore("user", {
  state: () => ({
    isSignedIn: false,
    user: {},
  }),
  // plugins: [createPersistPlugin()],
  actions: {
    setUser(user: User) {
      if (user) {
        this.user = user as User;
        this.isSignedIn = true;
      }
    },
    async fetchUser(id: number) {
      const response = await axios.get(`${API_URL}user/byId?id=${id}`);
      this.user = response.data as User;
    },
    logout() {
      this.user = {};
      this.isSignedIn = false;
    },
  },
});
