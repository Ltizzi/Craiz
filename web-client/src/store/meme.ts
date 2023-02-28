import { Meme } from "./../utils/models";
import { defineStore } from "pinia";
import axios from "axios";
//import { createPersistPlugin } from "pinia-persist";

export const useMemeStore = defineStore({
  id: "meme",
  state: () => ({
    meme: {},
  }),
  // plugins: [createPersistPlugin()],
  actions: {
    async setMemeById(id: number) {
      const response = await axios.get(
        `http://localhost:4246/v1/meme/byId?id=${id}`
      );
      this.meme = response.data as Meme;
    },
  },
});
