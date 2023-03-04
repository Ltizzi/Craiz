<template lang="">
  <div class="flex flex-col justify-center">
    <MemeCard :data="meme"></MemeCard>
    <CommentsView></CommentsView>
  </div>
</template>
<script setup lang="ts">
  import MemeCard from "@/components/layout/MemeCard.vue";
  import CommentsView from "@/components/layout/CommentsView.vue";
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useMemesStore } from "@/store/memes";
  import axios from "axios";

  const memesStore = useMemesStore();
  let meme = ref();
  let memeId: any;

  console.log(meme.value);
  meme.value = memesStore.meme;

  onMounted(async () => {
    if (!meme.value) {
      const route = useRoute();
      memeId = route.query.id;
      const response = await axios.get(
        `http://localhost:4246/v1/meme/byId?id=${memeId}`
      );
      console.log("response:");
      console.log(response.data);
      meme.value = response.data;
      memesStore.setMeme(meme.value);
    }
  });
</script>
<style lang=""></style>
