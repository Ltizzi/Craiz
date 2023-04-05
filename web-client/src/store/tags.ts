import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "@/main";

export const useTagStore = defineStore("tags", {
  state: () => ({
    tags: [],
    tagById: {},
    customTags: [{}],
  }),
  actions: {
    async fetchTags() {
      const response = await axios.get(`${API_URL}tag/all`);
      this.tags = response.data;
      console.log(this.tags);
    },
    pushTag(tag: Object) {
      this.customTags.push(tag);
    },
  },
});
