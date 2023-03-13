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
  import { useRoute } from "vue-router";
  import { useUserStore } from "@/store";
  import { User } from "@/utils/models";

  let memes: any = ref([]);
  const isLoaded = ref(false);

  const route = useRoute();
  const memeStore = useMemesStore();
  const userStore = useUserStore();

  EventBus.on("reloadMemes", () => {
    memes.value = memeStore.memesWoC;
  });

  EventBus.on("loadUserMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    const response = await axios.get(`${API_URL}meme/byUserWoC?id=${id}`);
    memes.value = response.data;
    isLoaded.value = true;
  });

  EventBus.on("loadUserComments", async (id) => {
    isLoaded.value = false;
    console.log(id);
    const response = await axios.get(`${API_URL}meme/byUserComments?id=${id}`);
    memes.value = response.data;
    isLoaded.value = true;
  });

  EventBus.on("loadUserLikedMemes", async (id) => {
    isLoaded.value = false;
    console.log(id);
    const response = await axios.get(
      `${API_URL}meme/byUserLikedMemes?id=${id}`
    );
    memes.value = response.data;
    isLoaded.value = true;
  });

  EventBus.on("loadTL", async () => {
    memes.value = [];
    isLoaded.value = false;
    await memeStore.fetchMemesWoC();
    memes.value = memeStore.memesWoC;
    isLoaded.value = true;
  });

  // onBeforeMount(async () => {
  //   if (Object.keys(route.params).length === 0) {
  //     await memeStore.fetchMemesWoC();
  //     memes.value = memeStore.memesWoC;
  //     isLoaded.value = true;
  //   } else {
  //     const id = userStore.userId;
  //     const response = await axios.get(`${API_URL}meme/byUserWoC?id=${id}`);
  //     memes.value = response.data;
  //     isLoaded.value = true;
  //   }
  // });
  onMounted(async () => {
    if (Object.keys(route.params).length === 0) {
      await memeStore.fetchMemesWoC();
      memes.value = memeStore.memesWoC;
      isLoaded.value = true;
    } else {
      const user = userStore.profileUser as User;
      const response = await axios.get(
        `${API_URL}meme/byUserWoC?id=${user.userId}`
      );
      memes.value = response.data;
      isLoaded.value = true;
    }
  });
</script>
<style lang=""></style>
