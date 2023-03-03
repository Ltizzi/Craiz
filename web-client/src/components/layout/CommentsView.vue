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

  let meme = ref(memesStore.meme);

  let comments = ref([]);

  const response = await axios.get(
    `http://localhost:4246/v1/meme/getCommentsById?id=${meme.memeId}`
  );
  comments.value = response.data;
</script>
<style lang=""></style>
