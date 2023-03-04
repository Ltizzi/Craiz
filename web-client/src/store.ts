import axios from "axios";
import { defineStore } from "pinia";
import { User } from "../src/utils/models";
import { API_URL } from "./main";

// const API_URL = "http://localhost:4246/v1/";

export const useUserStore = defineStore("user", {
  state: () => ({
    isSignedIn: false,
    user: {},
    userId: 5,
  }),
  // plugins: [createPersistPlugin()],
  actions: {
    setUser(user: User) {
      if (user) {
        this.user = user as User;
        this.isSignedIn = true;
        this.userId = user.userId;
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
