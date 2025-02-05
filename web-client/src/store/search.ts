import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "@/main";

export const useSearchStore = defineStore("search", {
  state: () => ({
    searchedMemes: [],
    searchedUsers: [],
  }),
  actions: {
    setSearch(memes: any, users: any) {
      this.searchedMemes = memes;
      this.searchedUsers = users;
    },
  },
});
