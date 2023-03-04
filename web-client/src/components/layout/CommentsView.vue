<template lang="">
  <MemeCard
    v-for="comment in comments"
    :key="meme.memeId"
    :data="meme"
  ></MemeCard>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { onMounted, ref } from "vue";
  import MemeCard from "./MemeCard.vue";
  import { useMemesStore } from "@/store/memes";

  const memesStore = useMemesStore();

  let id = memesStore.id;

  let comments = ref([]);

  onMounted(async () => {
    const response = await axios.get(
      `http://localhost:4246/v1/meme/getCommentsById?id=${id}`
    );
    comments.value = response.data;
    console.log(comments.value);
  });
</script>
