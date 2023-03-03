import { Meme } from "../utils/models";
import { defineStore } from "pinia";
import axios from "axios";
//import { createPersistPlugin } from "pinia-persist";

const API_URL = "http://localhost:4246/v1/";

export const useMemesStore = defineStore("memes", {
  state: () => ({
    memes: [],
    memeById: {},
    meme: {},
  }),

  actions: {
    async fetchMemeById(id: number) {
      const response = await axios.get(`${API_URL}meme/byId?id=${id}`);
      this.memeById = response.data as Meme;
      console.log(this.memeById);
    },
    async fetchAllMemes() {
      const response = await axios.get(`${API_URL}meme/`);
      this.memes = response.data;
    },
    setMeme(meme: Meme) {
      this.meme = meme;
    },
  },
});
