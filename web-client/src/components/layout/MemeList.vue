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
  import { onMounted, ref, inject, InjectionKey, onBeforeMount } from "vue";
  import MemeCard from "../ui/MemeCard.vue";
  import { API_URL } from "@/main";
  import { useMemesStore } from "@/store/memes";

  let memes: any = ref([]);
  const isLoaded = ref(false);

  const memeStore = useMemesStore();

  // const app = inject(appContext as InjectionKey<any>);

  // const onUpload = (data: Boolean) => {
  //   memes.value = memeStore.memesWoC;
  // };

  // app?.component?.proxy?.$on("reloadList", onUpload);

  onBeforeMount(async () => {
    await memeStore.fetchMemesWoC();
    memes.value = memeStore.memesWoC;
  });
  onMounted(async () => {
    const response = await axios.get(`${API_URL}meme/allWoC`);

    if (response.data) {
      isLoaded.value = true;
      memes.value = response.data;
    } else console.log(response);
  });
</script>
<style lang=""></style>
