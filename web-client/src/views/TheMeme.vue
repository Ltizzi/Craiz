<template lang="">
  <div class="flex w-full flex-col items-center justify-center">
    <div class="mx-auto flex flex-col justify-center">
      <MemeCard :data="meme" class="mx-auto"></MemeCard>
      <CommentsView class="mx-auto"></CommentsView>
    </div>
  </div>
</template>
<script setup lang="ts">
  import MemeCard from "@/components/ui/MemeCard.vue";
  import CommentsView from "@/components/layout/CommentsView.vue";
  import { onBeforeMount, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useMemesStore } from "@/store/memes";
  import axios from "axios";
  import { API_URL } from "@/main";

  const memesStore = useMemesStore();
  let meme = ref();
  let memeId: any;

  console.log(meme.value);
  meme.value = memesStore.meme;

  onBeforeMount(async () => {
    if (!meme.value) {
      const route = useRoute();
      memeId = route.query.id;
      console.log("********* meme id : ", memeId);
      const response = await axios.get(
        `${API_URL}meme/byId?id=${memeId}`
        //`http://localhost:4246/v1/meme/byId?id=${memeId}`
      );
      console.log("response:");
      console.log(response.data);
      meme.value = response.data;
      memesStore.setMeme(meme.value);
    }
  });
</script>
<style lang=""></style>
