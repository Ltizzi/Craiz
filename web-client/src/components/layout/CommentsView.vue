<template lang="">
  <div class="-mt-2 flex flex-col items-center justify-center">
    <template v-for="comment in comments" :key="comment.memeId">
      <div class="fit flex flex-row justify-center">
        <div class="flex h-full flex-col justify-center">
          <div class="h-full w-10 border-l-2 border-b-2 border-gray-300"></div>
          <div class="h-full w-10 border-l-2 border-gray-300"></div>
        </div>

        <MemeCard :data="comment" class="w-3/4"></MemeCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { onMounted, ref } from "vue";
  import MemeCard from "./MemeCard.vue";
  import { useMemesStore } from "@/store/memes";
  import { API_URL } from "@/main";

  const memesStore = useMemesStore();

  let id = memesStore.id;

  let comments = ref([]);

  onMounted(async () => {
    const response = await axios.get(
      `${API_URL}meme/getCommentsById?id=${id}`
      // `http://localhost:4246/v1/meme/getCommentsById?id=${id}`
    );
    comments.value = response.data;
  });
</script>
