<template>
  <div v-if="isLoaded" class="flex w-full flex-col items-center justify-center">
    <MemeCard v-for="meme in memes" :key="meme.memeId" :data="meme"></MemeCard>
  </div>
  <div v-else>
    <p>Cargando memes...</p>
  </div>
</template>
<script setup lang="ts">
  import axios from "axios";
  import { onMounted, ref, onBeforeMount } from "vue";
  import MemeCard from "../ui/MemeCard.vue";
  import { API_URL } from "@/main";
  import { useMemesStore } from "@/store/memes";
  import EventBus from "@/utils/EventBus";

  let memes: any = ref([]);
  const isLoaded = ref(false);

  const memeStore = useMemesStore();

  EventBus.on("reloadMemes", () => {
    memes.value = memeStore.memesWoC;
  });

  EventBus.on("loadUserMemes", async (id) => {
    console.log(id);
    const response = await axios.get(`${API_URL}meme/byUserWoC?id=${id}`);
    memes.value = response.data;
  });

  EventBus.on("loadUserComments", async (id) => {
    console.log(id);
    const response = await axios.get(`${API_URL}meme/byUserComments?id=${id}`);
    memes.value = response.data;
  });

  EventBus.on("loadUserLikedMemes", async (id) => {
    console.log(id);
    const response = await axios.get(
      `${API_URL}meme/byUserLikedMemes?id=${id}`
    );
    memes.value = response.data;
  });

  EventBus.on("loadTL", async () => {
    await memeStore.fetchMemesWoC();
    memes.value = memeStore.memesWoC;
  });

  onBeforeMount(async () => {
    await memeStore.fetchMemesWoC();
    memes.value = memeStore.memesWoC;
  });
  onMounted(async () => {
    // const response = await axios.get(`${API_URL}meme/allWoC`);

    // if (response.data) {
    //   isLoaded.value = true;
    //   memes.value = response.data;
    // } else console.log(response);

    await memeStore.fetchMemesWoC();
    memes.value = memeStore.memesWoC;
    isLoaded.value = true;
    localStorage.clear();
  });
</script>
<style lang=""></style>
