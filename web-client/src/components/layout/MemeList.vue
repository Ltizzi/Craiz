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
  import { onMounted, ref } from "vue";
  import MemeCard from "./MemeCard.vue";

  let memes: any = ref([]);
  const isLoaded = ref(false);

  onMounted(async () => {
    const response = await axios.get("http://localhost:4246/v1/meme/allWoC");
    if (response.data) {
      isLoaded.value = true;
      memes.value = response.data;
    } else console.log(response);
  });
</script>
<style lang=""></style>
